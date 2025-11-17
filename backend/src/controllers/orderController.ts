import { Request, Response } from 'express';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Inventory from '../models/Inventory';
import Product from '../models/Product';
import { mongoose } from '../config/database';

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, notes } = req.body;

    // Calculate total amount and check availability
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: `Товар з ID ${item.productId} не знайдено` });
      }

      const inventory = await Inventory.findOne({
        productId: item.productId,
        size: item.size,
      }).session(session);

      if (!inventory || (inventory.quantity - inventory.reservedQuantity) < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          error: `Недостатня кількість товару "${product.name}" розміру ${item.size}`,
        });
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    // Create order
    const orderDoc = await Order.create(
      [
        {
          orderNumber: generateOrderNumber(),
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          totalAmount,
          notes,
          status: 'pending',
        },
      ],
      { session }
    );
    const order = orderDoc[0];

    // Create order items and reserve inventory
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      await OrderItem.create(
        [
          {
            orderId: order._id,
            productId: item.productId,
            productName: product!.name,
            size: item.size,
            quantity: item.quantity,
            price: product!.price,
            customization: item.customization || null,
          },
        ],
        { session }
      );

      // Reserve inventory
      await Inventory.findOneAndUpdate(
        { productId: item.productId, size: item.size },
        { $inc: { reservedQuantity: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Fetch complete order with items
    const completeOrder = await Order.findById(order._id).lean();
    const orderItems = await OrderItem.find({ orderId: order._id }).lean();

    res.status(201).json({
      ...completeOrder,
      items: orderItems,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Помилка при створенні замовлення' });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .limit(Number(limit))
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean();

    const ordersWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const items = await OrderItem.find({ orderId: order._id }).lean();

        const itemsWithProducts = await Promise.all(
          items.map(async (item: any) => {
            const product = await Product.findById(item.productId)
              .select('_id name slug')
              .lean();
            return {
              ...item,
              product,
            };
          })
        );

        return {
          ...order,
          items: itemsWithProducts,
        };
      })
    );

    const total = await Order.countDocuments(filter);

    res.json({
      orders: ordersWithItems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
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
    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    const items = await OrderItem.find({ orderId: id }).lean();

    const itemsWithProducts = await Promise.all(
      items.map(async (item: any) => {
        const product = await Product.findById(item.productId).lean();
        return {
          ...item,
          product,
        };
      })
    );

    res.json({
      ...order,
      items: itemsWithProducts,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Помилка при отриманні замовлення' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Замовлення не знайдено' });
    }

    order.status = status;
    await order.save();

    // If order is cancelled, release reserved inventory
    if (status === 'cancelled') {
      const orderItems = await OrderItem.find({ orderId: id });

      for (const item of orderItems) {
        await Inventory.findOneAndUpdate(
          { productId: item.productId, size: item.size },
          { $inc: { reservedQuantity: -item.quantity } }
        );
      }
    }

    // If order is delivered, deduct from inventory
    if (status === 'delivered') {
      const orderItems = await OrderItem.find({ orderId: id });

      for (const item of orderItems) {
        const inventory = await Inventory.findOne({
          productId: item.productId,
          size: item.size,
        });

        if (inventory) {
          inventory.quantity -= item.quantity;
          inventory.reservedQuantity -= item.quantity;
          await inventory.save();
        }
      }
    }

    const updatedOrder = await Order.findById(id).lean();
    const items = await OrderItem.find({ orderId: id }).lean();

    res.json({
      ...updatedOrder,
      items,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Помилка при оновленні статусу замовлення' });
  }
};
