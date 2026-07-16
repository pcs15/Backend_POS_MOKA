import dashboardModel from '../models/dashboardModel.js';

export const getDashboardStats = async () => {
    return await dashboardModel.getStatistics();
};

export default {
    getDashboardStats
};
