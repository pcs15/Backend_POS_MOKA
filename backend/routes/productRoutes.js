import express from 'express';
import { body } from 'express-validator';
import productController from '../controllers/productController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const productValidation = [
    body('category_id')
        .notEmpty().withMessage('Category ID wajib diisi')
        .isNumeric().withMessage('Category ID harus berupa angka'),
    body('name')
        .notEmpty().withMessage('Nama produk wajib diisi'),
    body('price')
        .isFloat({ min: 0.01 }).withMessage('Harga harus berupa angka positif'),
    body('stock')
        .isInt({ min: 0 }).withMessage('Stok minimal adalah 0')
];

// Protect all product endpoints with JWT
router.use(verifyToken);

// Middleware wrapper to handle multer errors gracefully
const handleUpload = (req, res, next) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes
router.post('/', checkRole(['admin']), handleUpload, productValidation, productController.create);
router.put('/:id', checkRole(['admin']), handleUpload, productValidation, productController.update);
router.delete('/:id', checkRole(['admin']), productController.remove);

export default router;
