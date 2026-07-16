import express from 'express';
import { body } from 'express-validator';
import categoryController from '../controllers/categoryController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

const categoryValidation = [
    body('name')
        .notEmpty().withMessage('Nama kategori wajib diisi')
        .isLength({ min: 3, max: 100 }).withMessage('Nama kategori harus antara 3 hingga 100 karakter')
];

// Protect all category endpoints with JWT
router.use(verifyToken);

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin only routes
router.post('/', checkRole(['admin']), categoryValidation, categoryController.create);
router.put('/:id', checkRole(['admin']), categoryValidation, categoryController.update);
router.delete('/:id', checkRole(['admin']), categoryController.remove);

export default router;
