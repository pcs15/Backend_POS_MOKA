import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect dashboard route with JWT
router.use(verifyToken);
router.get('/', dashboardController.getDashboard);

export default router;
