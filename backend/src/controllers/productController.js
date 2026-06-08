// backend/src/controllers/productController.js
import Product from '../models/Product.js';

// @desc    Create a new product catalog item
// @route   POST /api/products
// @access  Private (Staff & Managers)
export const createProduct = async (req, res) => {
  try {
    const { barcode, name, category, minStockThreshold, price } = req.body;

    // Check if barcode already exists
    const productExists = await Product.findOne({ barcode });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this barcode already exists' });
    }

    const product = await Product.create({
      barcode,
      name,
      category,
      minStockThreshold,
      price
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product details by scanning barcode
// @route   GET /api/products/scan/:barcode
// @access  Private (Staff & Managers)
export const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found in system catalog' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all catalog products
// @route   GET /api/products
// @access  Private (Staff & Managers)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
