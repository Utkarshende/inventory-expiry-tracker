// backend/src/routes/batchRoutes.js
import express from 'express';
import { addBatch, getExpiryDashboardData, applyBatchDiscount } from '../controllers/batchController.js';
import { protect, authorizeManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addBatch);

router.get('/expiry-dashboard', protect, getExpiryDashboardData);

// Only authorized store managers are permitted to apply clearance markdown price strategies
router.put('/:id/discount', protect, authorizeManager, applyBatchDiscount);

export default router;
