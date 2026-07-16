import db from '../config/db.js';

export const createOrder = async (connection, userId, invoice, totalAmount) => {
    const [result] = await connection.execute(
        'INSERT INTO orders (user_id, invoice, total_amount) VALUES (?, ?, ?)',
        [userId, invoice, totalAmount]
    );
    return result.insertId;
};

export const createOrderItem = async (connection, orderId, productId, quantity, price, subtotal) => {
    await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, productId, quantity, price, subtotal]
    );
};

export const updateProductStock = async (connection, productId, qtyToReduce) => {
    await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [qtyToReduce, productId, qtyToReduce]
    );
};

export const getOrderById = async (id) => {
    const [orders] = await db.execute(
        'SELECT id, invoice, user_id, total_amount AS total, created_at FROM orders WHERE id = ?',
        [id]
    );
    if (orders.length === 0) return null;
    
    const [items] = await db.execute(
        'SELECT product_id, quantity, price, subtotal FROM order_items WHERE order_id = ?',
        [id]
    );
    
    return {
        ...orders[0],
        items
    };
};

export const getAllOrders = async () => {
    const [orders] = await db.execute(
        'SELECT id, invoice, user_id, total_amount AS total, created_at FROM orders ORDER BY id DESC'
    );
    return orders;
};

export default {
    createOrder,
    createOrderItem,
    updateProductStock,
    getOrderById,
    getAllOrders
};
