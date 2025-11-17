import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Inventory from '../models/Inventory';
import Product from '../models/Product';
import sequelize from '../config/database';

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, notes } = req.body;

    // Calculate total amount and check availability
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ error: `Товар з ID ${item.productId} не знайдено` });
      }

      const inventory = await Inventory.findOne({
        where: { productId: item.productId, size: item.size },
      });

      if (!inventory || (inventory.quantity - inventory.reservedQuantity) < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Недостатня кількість товару "${product.name}" розміру ${item.size}`,
        });
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      totalAmount,
      notes,
      status: 'pending',
    }, { transaction });

    // Create order items and reserve inventory
    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        productName: product!.name,
        size: item.size,
        quantity: item.quantity,
        price: product!.price,
        customization: item.customization || null,
      }, { transaction });

      // Reserve inventory
      await Inventory.increment(
        'reservedQuantity',
        {
          by: item.quantity,
          where: { productId: item.productId, size: item.size },
          transaction,
        }
      );
    }

    await transaction.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
      }],
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Помилка при створенні замовлення' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'slug'],
        }],
      }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      orders,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Помилка при отриманні замовлень' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
        }],
      }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Помилка при отриманні замовлення' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    await order.update({ status });

    // If order is cancelled, release reserved inventory
    if (status === 'cancelled') {
      const orderItems = await OrderItem.findAll({ where: { orderId: id } });

      for (const item of orderItems) {
        await Inventory.decrement(
          'reservedQuantity',
          {
            by: item.quantity,
            where: { productId: item.productId, size: item.size },
          }
        );
      }
    }

    // If order is delivered, deduct from inventory
    if (status === 'delivered') {
      const orderItems = await OrderItem.findAll({ where: { orderId: id } });

      for (const item of orderItems) {
        const inventory = await Inventory.findOne({
          where: { productId: item.productId, size: item.size },
        });

        if (inventory) {
          await inventory.update({
            quantity: inventory.quantity - item.quantity,
            reservedQuantity: inventory.reservedQuantity - item.quantity,
          });
        }
      }
    }

    const updatedOrder = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Помилка при оновленні статусу замовлення' });
  }
};
