import db from '../config/db.js';

export const getAll = async () => {
    const [rows] = await db.execute('SELECT id, name, created_at FROM categories ORDER BY id DESC');
    return rows;
};

export const getById = async (id) => {
    const [rows] = await db.execute('SELECT id, name, created_at FROM categories WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (name) => {
    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    return result.insertId;
};

export const update = async (id, name) => {
    const [result] = await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return result.affectedRows;
};

export const remove = async (id) => {
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
