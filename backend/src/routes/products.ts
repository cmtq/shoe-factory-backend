import express from 'express';
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
} from '../controllers/productController';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:productId/images', addProductImage);

export default router;
