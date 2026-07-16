import db from '../config/db.js';

export const getAll = async () => {
    const query = `
        SELECT p.id, p.category_id, p.name, p.price, p.stock, p.image, p.created_at, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
};

export const getById = async (id) => {
    const query = `
        SELECT p.id, p.category_id, p.name, p.price, p.stock, p.image, p.created_at, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

export const create = async (categoryId, name, price, stock, image) => {
    const query = 'INSERT INTO products (category_id, name, price, stock, image) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [categoryId, name, price, stock, image]);
    return result.insertId;
};

export const update = async (id, categoryId, name, price, stock, image) => {
    let query = 'UPDATE products SET category_id = ?, name = ?, price = ?, stock = ?';
    const params = [categoryId, name, price, stock];
    
    if (image !== undefined) {
        query += ', image = ?';
        params.push(image);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    const [result] = await db.execute(query, params);
    return result.affectedRows;
};

export const remove = async (id) => {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove
};
