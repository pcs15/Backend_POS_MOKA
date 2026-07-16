import db from '../config/db.js';

export const getSalesReport = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        let query = `
            SELECT o.id, o.invoice, o.total_amount, o.status, o.created_at, u.username as cashier
            FROM orders o
            JOIN users u ON o.user_id = u.id
        `;
        const params = [];

        if (start_date && end_date) {
            query += ` WHERE DATE(o.created_at) BETWEEN ? AND ?`;
            params.push(start_date, end_date);
        }

        query += ` ORDER BY o.id DESC`;

        const [orders] = await db.execute(query, params);

        // Calculate summary
        const summary = orders.reduce((acc, curr) => {
            if (curr.status === 'success') {
                acc.total_revenue += parseFloat(curr.total_amount);
                acc.total_success_orders += 1;
            } else if (curr.status === 'cancelled') {
                acc.total_cancelled_orders += 1;
            }
            return acc;
        }, { total_revenue: 0, total_success_orders: 0, total_cancelled_orders: 0 });

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil laporan transaksi",
            data: {
                summary,
                transactions: orders
            }
        });
    } catch (error) {
        console.error("Get Report Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getSalesReport
};
