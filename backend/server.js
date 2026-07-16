import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import apiRoutes from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "POS Backend Server is running successfully",
    data: {}
  });
});

// Routes
app.use('/api', apiRoutes);

// Test Database Connection
db.getConnection()
  .then((connection) => {
    console.log("Database connected successfully.");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
