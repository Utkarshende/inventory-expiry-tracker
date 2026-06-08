// backend/src/controllers/batchController.js
import Batch from '../models/Batch.js';

// @desc    Add a new inventory shipment batch
// @route   POST /api/batches
// @access  Private (Staff & Managers)
export const addBatch = async (req, res) => {
  try {
    const { productId, quantityReceived, costPrice, expiryDate } = req.body;

    const batch = await Batch.create({
      productId,
      quantityReceived,
      quantityRemaining: quantityReceived, // Initially, all items are remaining
      costPrice,
      expiryDate,
      status: 'active'
    });

    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comprehensive expiry analytics for the dashboard matrix
// @route   GET /api/batches/expiry-dashboard
// @access  Private (Staff & Managers)
export const getExpiryDashboardData = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Fetch batches and populate product profile details
    const activeBatches = await Batch.find({ quantityRemaining: { $gt: 0 } })
      .populate('productId', 'name barcode price category')
      .sort({ expiryDate: 1 });

    // Categorize items accurately using clean backend filter loops
    const analytics = {
      critical: [],  // Less than 7 days left
      warning: [],   // 7 to 30 days left
      safe: []       // More than 30 days left
    };

    activeBatches.forEach(batch => {
      const expDate = new Date(batch.expiryDate);
      
      if (expDate <= today) {
        batch.status = 'expired';
        analytics.critical.push(batch);
      } else if (expDate <= sevenDaysFromNow) {
        analytics.critical.push(batch);
      } else if (expDate <= thirtyDaysFromNow) {
        analytics.warning.push(batch);
      } else {
        analytics.safe.push(batch);
      }
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually apply discount code to a critical item
// @route   PUT /api/batches/:id/discount
// @access  Private (Managers Only)
export const applyBatchDiscount = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: 'Inventory batch snapshot not found' });
    }

    batch.status = 'discounted';
    await batch.save();

    res.json({ message: 'Batch marked down for rapid discount clearance successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
