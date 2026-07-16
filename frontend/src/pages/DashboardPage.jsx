import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatRupiah } from '../utils/format';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total_sales: 0,
    total_transactions: 0,
    active_products: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/dashboard');
        // Asumsi data yang dikembalikan backend: response.data.data = { total_sales, total_transactions, active_products }
        setStats(response.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-muted">Memuat data dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="h4 fw-semibold text-dark mb-4">Dashboard Overview</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h6 className="text-muted fw-medium mb-2">Total Penjualan</h6>
              <h3 className="text-success fw-bold mb-0">{formatRupiah(stats.total_sales)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h6 className="text-muted fw-medium mb-2">Total Transaksi</h6>
              <h3 className="text-dark fw-bold mb-0">{stats.total_transactions}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <h6 className="text-muted fw-medium mb-2">Produk Aktif</h6>
              <h3 className="text-dark fw-bold mb-0">{stats.active_products}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
