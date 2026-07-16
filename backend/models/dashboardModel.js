import db from '../config/db.js';

export const getStatistics = async () => {
    const p1 = db.execute('SELECT COUNT(*) AS total_category FROM categories');
    const p2 = db.execute('SELECT COUNT(*) AS total_product FROM products');
    const p3 = db.execute('SELECT COUNT(*) AS total_orders FROM orders');
    const p4 = db.execute('SELECT SUM(total_amount) AS total_revenue FROM orders');

    const [catRes, prodRes, ordRes, revRes] = await Promise.all([p1, p2, p3, p4]);

    return {
        total_category: parseInt(catRes[0][0].total_category) || 0,
        total_product: parseInt(prodRes[0][0].total_product) || 0,
        total_orders: parseInt(ordRes[0][0].total_orders) || 0,
        total_revenue: parseFloat(revRes[0][0].total_revenue) || 0
    };
};

export default {
    getStatistics
};
