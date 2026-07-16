import express from 'express';
import { body } from 'express-validator';
import inventoryController from '../controllers/inventoryController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

const inventoryValidation = [
    body('stock')
        .notEmpty().withMessage('Stock wajib diisi')
        .isInt({ min: 0 }).withMessage('Stock minimal 0')
];

// Protect all inventory endpoints with JWT and Admin role
router.use(verifyToken);
router.use(checkRole(['admin']));

router.get('/', inventoryController.getInventory);
router.put('/:id', inventoryValidation, inventoryController.updateInventory);

export default router;
