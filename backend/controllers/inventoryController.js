import { validationResult } from 'express-validator';
import productModel from '../models/productModel.js';
import db from '../config/db.js';

export const getInventory = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.name, p.stock, c.name as category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;
        const [rows] = await db.execute(query);
        
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data stok produk",
            data: rows
        });
    } catch (error) {
        console.error("Get Inventory Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const updateInventory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { id } = req.params;
        const { stock } = req.body; // Can be the new total stock, or adjustment. Based on image "Update Inventory", it usually sets the new stock directly.

        const [result] = await db.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stok produk berhasil diperbarui",
            data: { id, stock }
        });
    } catch (error) {
        console.error("Update Inventory Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getInventory,
    updateInventory
};
