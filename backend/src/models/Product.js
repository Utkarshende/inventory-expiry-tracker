// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true, 'Product barcode is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    minStockThreshold: {
      type: Number,
      required: true,
      default: 10 // Alerts manager if combined stock drops below this number
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);