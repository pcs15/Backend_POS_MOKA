import categoryModel from '../models/categoryModel.js';

export const getAllCategories = async () => {
    return await categoryModel.getAll();
};

export const getCategoryById = async (id) => {
    return await categoryModel.getById(id);
};

export const createCategory = async (name) => {
    const insertId = await categoryModel.create(name);
    return await categoryModel.getById(insertId);
};

export const updateCategory = async (id, name) => {
    const affectedRows = await categoryModel.update(id, name);
    if (affectedRows === 0) return null;
    return await categoryModel.getById(id);
};

export const deleteCategory = async (id) => {
    return await categoryModel.remove(id);
};

export default {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
