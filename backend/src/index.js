
import express from 'express';
import cors from 'cors';    
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();
// Initialize app
const app = express();

// Connect to Database
connectDB();

// Essential Middleware
app.use(cors());
app.use(express.json()); // Parses incoming requests with JSON payloads

// Fallback / Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: "active", message: "Server is running smoothly." });
});

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
