import express from 'express';
const router = express.Router();

import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import orderRoutes from './orderRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import reportRoutes from './reportRoutes.js';

// Centralized Routing
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);

export default router;
