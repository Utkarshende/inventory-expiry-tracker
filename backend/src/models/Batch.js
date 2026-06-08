// backend/src/models/Batch.js
import mongoose from 'mongoose';
const batchSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Relates directly to our Product catalog model
      required: true
    },
    quantityReceived: {
      type: Number,
      required: [true, 'Quantity received is required'],
      min: [1, 'Quantity received must be at least 1']
    },
    quantityRemaining: {
      type: Number,
      required: [true, 'Quantity remaining is required'],
      min: [0, 'Quantity remaining cannot be negative']
    },
    costPrice: {
      type: Number,
      required: [true, 'Supplier cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiration date is required']
    },
    status: {
      type: String,
      enum: ['active', 'discounted', 'expired', 'sold_out'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Indexing for performance when querying expiring items quickly
batchSchema.index({ expiryDate: 1, status: 1 });

export default mongoose.model('Batch', batchSchema);