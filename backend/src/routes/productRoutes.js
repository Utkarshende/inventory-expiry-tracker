// backend/src/routes/productRoutes.js
import express from 'express';
import { createProduct, getProductByBarcode, getAllProducts } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All catalog systems require a verified profile login session
router.route('/')
  .post(protect, createProduct)
  .get(protect, getAllProducts);

router.get('/scan/:barcode', protect, getProductByBarcode);

export default router;
