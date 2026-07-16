import productModel from '../models/productModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllProducts = async () => {
    return await productModel.getAll();
};

export const getProductById = async (id) => {
    return await productModel.getById(id);
};

export const createProduct = async (categoryId, name, price, stock, image) => {
    const insertId = await productModel.create(categoryId, name, price, stock, image);
    return await productModel.getById(insertId);
};

export const updateProduct = async (id, categoryId, name, price, stock, image) => {
    // Jika ada gambar baru yang diupload, hapus gambar lama
    if (image !== undefined) {
        const oldProduct = await productModel.getById(id);
        if (oldProduct && oldProduct.image) {
            const oldImagePath = path.join(__dirname, '../uploads/products', oldProduct.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
    }

    const affectedRows = await productModel.update(id, categoryId, name, price, stock, image);
    if (affectedRows === 0) return null;
    return await productModel.getById(id);
};

export const deleteProduct = async (id) => {
    // Hapus gambar terkait jika ada sebelum menghapus data dari DB
    const oldProduct = await productModel.getById(id);
    if (oldProduct && oldProduct.image) {
        const oldImagePath = path.join(__dirname, '../uploads/products', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }
    return await productModel.remove(id);
};

export default {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
