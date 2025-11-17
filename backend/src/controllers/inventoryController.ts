import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import Product from '../models/Product';

export const getInventoryByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.find({ productId })
      .sort({ size: 1 })
      .lean();

    const product = await Product.findById(productId)
      .select('_id name sku')
      .lean();

    const inventoryWithProduct = inventory.map((inv) => ({
      ...inv,
      product,
    }));

    res.json(inventoryWithProduct);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Помилка при отриманні наявності' });
  }
};

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find()
      .sort({ productId: 1, size: 1 })
      .lean();

    const inventoryWithProducts = await Promise.all(
      inventory.map(async (inv: any) => {
        const product = await Product.findById(inv.productId)
          .select('_id name sku')
          .lean();
        return {
          ...inv,
          product,
        };
      })
    );

    res.json(inventoryWithProducts);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Помилка при отриманні наявності' });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    const { quantity } = req.body;

    const sizeNum = parseFloat(size);

    let inventory = await Inventory.findOne({ productId, size: sizeNum });

    if (!inventory) {
      inventory = await Inventory.create({
        productId,
        size: sizeNum,
        quantity,
        reservedQuantity: 0,
      });
    } else {
      inventory.quantity = quantity;
      await inventory.save();
    }

    res.json(inventory);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Помилка при оновленні наявності' });
  }
};

export const bulkUpdateInventory = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { productId, size, quantity }

    const updatePromises = items.map(async (item: any) => {
      let inventory = await Inventory.findOne({
        productId: item.productId,
        size: item.size,
      });

      if (!inventory) {
        inventory = await Inventory.create({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          reservedQuantity: 0,
        });
      } else {
        inventory.quantity = item.quantity;
        await inventory.save();
      }

      return inventory;
    });

    const updatedInventory = await Promise.all(updatePromises);
    res.json(updatedInventory);
  } catch (error) {
    console.error('Error bulk updating inventory:', error);
    res.status(500).json({ error: 'Помилка при масовому оновленні наявності' });
  }
};

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    const sizeNum = parseFloat(size);
    const inventory = await Inventory.findOne({ productId, size: sizeNum });

    if (!inventory) {
      return res.json({ available: false, quantity: 0 });
    }

    const availableQuantity = inventory.quantity - inventory.reservedQuantity;
    res.json({
      available: availableQuantity > 0,
      quantity: availableQuantity,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Помилка при перевірці наявності' });
  }
};
