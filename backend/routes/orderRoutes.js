import express from 'express';
import { body } from 'express-validator';
import orderController from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const orderValidation = [
    body('items').isArray().withMessage('Items harus berupa array'),
    body('items.*.product_id')
        .notEmpty().withMessage('Product ID wajib diisi')
        .isNumeric().withMessage('Product ID harus berupa angka'),
    body('items.*.quantity')
        .notEmpty().withMessage('Quantity wajib diisi')
        .isInt({ min: 1 }).withMessage('Quantity minimal 1')
];

// All order endpoints protected
router.use(verifyToken);

router.post('/', orderValidation, orderController.createOrder);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);

import { checkRole } from '../middleware/authMiddleware.js';
router.put('/:id/cancel', checkRole(['admin']), orderController.cancelOrder);

export default router;
