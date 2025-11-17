import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).lean();

    // Count products for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ categoryId: category._id });
        return {
          ...category,
          productCount,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Помилка при отриманні категорій' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Помилка при отриманні категорії' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Помилка при створенні категорії' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Категорію не знайдено' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Помилка при оновленні категорії' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, { isActive: false });
    res.json({ message: 'Категорію видалено' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Помилка при видаленні категорії' });
  }
};
