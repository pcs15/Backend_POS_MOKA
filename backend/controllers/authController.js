import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import userModel from '../models/userModel.js';

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { username, password } = req.body;

        const user = await userModel.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { username, password } = req.body;

        const existingUser = await userModel.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await userModel.createUser(username, hashedPassword);

        return res.status(201).json({
            success: true,
            message: "Registrasi berhasil, silakan login",
            data: {}
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    login,
    register
};
