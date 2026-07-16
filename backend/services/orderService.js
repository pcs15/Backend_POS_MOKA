import db from '../config/db.js';
import orderModel from '../models/orderModel.js';

export const processTransaction = async (userId, items) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const [productRows] = await connection.execute(
                'SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            );
            
            if (productRows.length === 0) {
                throw new Error(`Produk dengan ID ${item.product_id} tidak ditemukan.`);
            }

            const product = productRows[0];

            if (product.stock < item.quantity) {
                throw new Error(`Stok tidak cukup untuk produk: ${product.name}. Stok tersisa: ${product.stock}`);
            }

            const price = parseFloat(product.price);
            const subtotal = price * parseInt(item.quantity);
            totalAmount += subtotal;

            processedItems.push({
                product_id: product.id,
                quantity: item.quantity,
                price: price,
                subtotal: subtotal
            });
        }

        const invoice = 'INV-' + Date.now();
        const orderId = await orderModel.createOrder(connection, userId, invoice, totalAmount);

        for (const pItem of processedItems) {
            await orderModel.createOrderItem(connection, orderId, pItem.product_id, pItem.quantity, pItem.price, pItem.subtotal);
            await orderModel.updateProductStock(connection, pItem.product_id, pItem.quantity);
        }

        await connection.commit();
        
        return {
            id: orderId,
            invoice: invoice,
            total: totalAmount
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getAllOrders = async () => {
    return await orderModel.getAllOrders();
};

export const getOrderById = async (id) => {
    return await orderModel.getOrderById(id);
};

export const cancelOrder = async (orderId) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [orders] = await connection.execute('SELECT id, status FROM orders WHERE id = ? FOR UPDATE', [orderId]);
        
        if (orders.length === 0) {
            throw new Error('Order tidak ditemukan');
        }

        const order = orders[0];
        
        if (order.status === 'cancelled') {
            throw new Error('Order sudah dibatalkan sebelumnya');
        }

        const [items] = await connection.execute('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);

        for (const item of items) {
            await connection.execute('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
        }

        await connection.execute("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);

        await connection.commit();
        
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export default {
    processTransaction,
    getAllOrders,
    getOrderById,
    cancelOrder
};
