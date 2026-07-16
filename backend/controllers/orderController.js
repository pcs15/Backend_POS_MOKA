import { validationResult } from 'express-validator';
import orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        const userId = req.user.id;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Keranjang belanja kosong"
            });
        }

        const newOrder = await orderService.processTransaction(userId, items);

        return res.status(201).json({
            success: true,
            message: "Transaksi berhasil diproses",
            data: newOrder
        });

    } catch (error) {
        console.error("Create Order Error:", error);
        
        if (error.message.includes("Stok tidak cukup") || error.message.includes("tidak ditemukan")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat memproses transaksi"
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data transaksi",
            data: orders
        });
    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Data transaksi tidak ditemukan"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil detail transaksi",
            data: order
        });
    } catch (error) {
        console.error("Get Order Detail Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await orderService.cancelOrder(id);

        return res.status(200).json({
            success: true,
            message: "Transaksi berhasil dibatalkan dan stok telah dikembalikan",
            data: { id }
        });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        
        if (error.message.includes("tidak ditemukan") || error.message.includes("sudah dibatalkan")) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat membatalkan transaksi"
        });
    }
};

export default {
    createOrder,
    getAll,
    getById,
    cancelOrder
};
