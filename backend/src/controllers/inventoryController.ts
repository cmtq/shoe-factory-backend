import { Request, Response } from 'express';
import Inventory from '../models/Inventory';
import Product from '../models/Product';

export const getInventoryByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findAll({
      where: { productId },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku'],
      }],
      order: [['size', 'ASC']],
    });
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Помилка при отриманні наявності' });
  }
};

export const getAllInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.findAll({
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku'],
      }],
      order: [['productId', 'ASC'], ['size', 'ASC']],
    });
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Помилка при отриманні наявності' });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { productId, size } = req.params;
    const { quantity } = req.body;

    const [inventory, created] = await Inventory.findOrCreate({
      where: { productId, size },
      defaults: { productId, size, quantity },
    });

    if (!created) {
      await inventory.update({ quantity });
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
      const [inventory] = await Inventory.findOrCreate({
        where: { productId: item.productId, size: item.size },
        defaults: { productId: item.productId, size: item.size, quantity: item.quantity },
      });
      await inventory.update({ quantity: item.quantity });
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
    const inventory = await Inventory.findOne({
      where: { productId, size },
    });

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
