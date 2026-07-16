import express from 'express';
import reportController from '../controllers/reportController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect report endpoints with JWT and Admin role
router.use(verifyToken);
router.use(checkRole(['admin']));

router.get('/', reportController.getSalesReport);

export default router;
