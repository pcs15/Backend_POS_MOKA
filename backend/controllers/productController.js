import { validationResult } from 'express-validator';
import productService from '../services/productService.js';

export const getAll = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data produk",
            data: products
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail produk",
            data: product
        });
    } catch (error) {
        console.error("Get Product By Id Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { category_id, name, price, stock } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduct = await productService.createProduct(category_id, name, price, stock, image);

        return res.status(201).json({
            success: true,
            message: "Produk berhasil ditambahkan",
            data: newProduct
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const { id } = req.params;
        const { category_id, name, price, stock } = req.body;
        
        // req.file undefined means no new image was uploaded
        const image = req.file ? req.file.filename : undefined;

        const updatedProduct = await productService.updateProduct(id, category_id, name, price, stock, image);
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Produk berhasil diperbarui",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        try {
            const affectedRows = await productService.deleteProduct(id);
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan"
                });
            }
        } catch (dbError) {
            if (dbError.code === 'ER_ROW_IS_REFERENCED_2' || dbError.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(400).json({
                    success: false,
                    message: "Produk tidak bisa dihapus karena terkait dengan data pesanan (order)"
                });
            }
            throw dbError;
        }

        return res.status(200).json({
            success: true,
            message: "Produk berhasil dihapus",
            data: {}
        });
    } catch (error) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
