// backend/src/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import {initCronJobs} from './config/cronJobs.js';

const app = express();

connectDB();
initCronJobs();

app.use(cors());
app.use(express.json());

// API Entry Endpoints 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/batches', batchRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: "active", message: "Server routes are operational." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
