import { Request, Response } from 'express';
import Product from '../models/Product';
import ProductImage from '../models/ProductImage';
import Category from '../models/Category';
import Inventory from '../models/Inventory';
import { Op } from 'sequelize';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { categoryId, season, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const where: any = { isActive: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          where: season ? { season } : undefined,
        },
        {
          model: ProductImage,
          as: 'images',
          where: { isMain: true },
          required: false,
        },
        {
          model: Inventory,
          as: 'inventory',
          attributes: ['size', 'quantity'],
        },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Помилка при отриманні товарів' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
        },
        {
          model: ProductImage,
          as: 'images',
          order: [['sortOrder', 'ASC']],
        },
        {
          model: Inventory,
          as: 'inventory',
          attributes: ['size', 'quantity', 'reservedQuantity'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Помилка при отриманні товару' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Помилка при створенні товару' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductImage, as: 'images' },
        { model: Inventory, as: 'inventory' },
      ],
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Помилка при оновленні товару' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Product.update({ isActive: false }, { where: { id } });
    res.json({ message: 'Товар видалено' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Помилка при видаленні товару' });
  }
};

export const addProductImage = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const imageData = { ...req.body, productId };
    const image = await ProductImage.create(imageData);
    res.status(201).json(image);
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({ error: 'Помилка при додаванні фото' });
  }
};
