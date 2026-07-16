import express from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

const loginValidation = [
    body('username').notEmpty().withMessage('Username tidak boleh kosong'),
    body('password').notEmpty().withMessage('Password tidak boleh kosong')
];

const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username tidak boleh kosong')
        .isLength({ min: 3, max: 100 }).withMessage('Username minimal 3 karakter'),
    body('password')
        .notEmpty().withMessage('Password tidak boleh kosong')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
];

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

export default router;
