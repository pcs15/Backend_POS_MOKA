import { validationResult } from 'express-validator';
import categoryService from '../services/categoryService.js';

export const getAll = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data kategori",
            data: categories
        });
    } catch (error) {
        console.error("Get Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail kategori",
            data: category
        });
    } catch (error) {
        console.error("Get Category By Id Error:", error);
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

        const { name } = req.body;
        const newCategory = await categoryService.createCategory(name);

        return res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan",
            data: newCategory
        });
    } catch (error) {
        console.error("Create Category Error:", error);
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
        const { name } = req.body;

        const updatedCategory = await categoryService.updateCategory(id, name);
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Kategori berhasil diperbarui",
            data: updatedCategory
        });
    } catch (error) {
        console.error("Update Category Error:", error);
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
            const affectedRows = await categoryService.deleteCategory(id);
            if (affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Kategori tidak ditemukan"
                });
            }
        } catch (dbError) {
            if (dbError.code === 'ER_ROW_IS_REFERENCED_2' || dbError.code === 'ER_ROW_IS_REFERENCED') {
                return res.status(400).json({
                    success: false,
                    message: "Kategori tidak bisa dihapus karena masih digunakan oleh produk"
                });
            }
            throw dbError;
        }

        return res.status(200).json({
            success: true,
            message: "Kategori berhasil dihapus",
            data: {}
        });
    } catch (error) {
        console.error("Delete Category Error:", error);
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
