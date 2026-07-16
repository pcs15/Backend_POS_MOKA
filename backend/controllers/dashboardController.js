import dashboardService from '../services/dashboardService.js';

export const getDashboard = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        return res.status(200).json({
            success: true,
            message: "Berhasil mengambil data dashboard",
            data: stats
        });
    } catch (error) {
        console.error("Get Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server"
        });
    }
};

export default {
    getDashboard
};
