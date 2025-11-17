import { Request, Response } from 'express';
import Product from '../models/Product';
import ProductImage from '../models/ProductImage';
import Category from '../models/Category';
import Inventory from '../models/Inventory';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { categoryId, season, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const filter: any = { isActive: true };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const offset = (Number(page) - 1) * Number(limit);

    let query = Product.find(filter)
      .limit(Number(limit))
      .skip(offset)
      .sort({ createdAt: -1 });

    const products = await query.lean();

    // Get category, images, and inventory for each product
    const productsWithDetails = await Promise.all(
      products.map(async (product: any) => {
        const category = await Category.findById(product.categoryId).lean();

        // Filter by season if needed
        if (season && category && category.season !== season && category.season !== 'all-season') {
          return null;
        }

        const images = await ProductImage.find({ productId: product._id, isMain: true }).lean();
        const inventory = await Inventory.find({ productId: product._id })
          .select('size quantity')
          .lean();

        return {
          ...product,
          category,
          images,
          inventory,
        };
      })
    );

    const filteredProducts = productsWithDetails.filter((p) => p !== null);
    const total = await Product.countDocuments(filter);

    res.json({
      products: filteredProducts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
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
    const product = await Product.findOne({ slug, isActive: true }).lean();

    if (!product) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    const category = await Category.findById(product.categoryId).lean();
    const images = await ProductImage.find({ productId: product._id })
      .sort({ sortOrder: 1 })
      .lean();
    const inventory = await Inventory.find({ productId: product._id })
      .select('size quantity reservedQuantity')
      .lean();

    res.json({
      ...product,
      category,
      images,
      inventory,
    });
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
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Товар не знайдено' });
    }

    const category = await Category.findById(updatedProduct.categoryId).lean();
    const images = await ProductImage.find({ productId: updatedProduct._id }).lean();
    const inventory = await Inventory.find({ productId: updatedProduct._id }).lean();

    res.json({
      ...updatedProduct,
      category,
      images,
      inventory,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Помилка при оновленні товару' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { isActive: false });
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
