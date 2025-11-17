import express from 'express';
import {
  getInventoryByProduct,
  getAllInventory,
  updateInventory,
  bulkUpdateInventory,
  checkAvailability,
} from '../controllers/inventoryController';

const router = express.Router();

router.get('/', getAllInventory);
router.get('/product/:productId', getInventoryByProduct);
router.get('/check/:productId/:size', checkAvailability);
router.put('/:productId/:size', updateInventory);
router.post('/bulk', bulkUpdateInventory);

export default router;
