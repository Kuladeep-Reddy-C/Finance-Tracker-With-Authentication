import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '@clerk/express';
import cors from 'cors'; // Add cors package

import transactionRouter from './routes/user.routes.js'; 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Add more detailed logging
console.log('Attempting to connect to MongoDB with URI:', 
  MONGO_URI ? `${MONGO_URI.substring(0, 15)}...` : 'MONGO_URI is undefined');

// Add CORS middleware to handle cross-origin requests
app.use(cors());
app.use(express.json());

// Connect to MongoDB with improved error handling and options
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of default 30
  })
  .then(() => console.log("✅ Connected to MongoDB database"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Apply routes - remove requireAuth here since it's already in the router
app.use('/api', transactionRouter);

// Add a basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});