import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatRupiah } from '../utils/format';

const ReportsPage = () => {
  const [data, setData] = useState({
    summary: { total_revenue: 0, total_success_orders: 0, total_cancelled_orders: 0 },
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = '';
      if (startDate && endDate) {
        query = `?start_date=${startDate}&end_date=${endDate}`;
      }
      const response = await api.get(`/reports${query}`);
      setData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial load

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleCancelOrder = async (id, invoice) => {
    if (window.confirm(`Apakah Anda yakin ingin membatalkan transaksi ${invoice}?\nStok produk akan dikembalikan secara otomatis.`)) {
      try {
        await api.put(`/orders/${id}/cancel`);
        alert('Transaksi berhasil dibatalkan.');
        fetchReports(); // Refresh data
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal membatalkan transaksi.');
      }
    }
  };

  return (
    <div>
      <h2 className="h4 fw-semibold text-dark mb-4">Laporan Penjualan</h2>
      
      {/* Filter Tanggal */}
      <div className="card border-0 shadow-sm rounded-3 mb-4">
        <div className="card-body">
          <form onSubmit={handleFilter} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-medium text-muted small">Tanggal Mulai</label>
              <input 
                type="date" 
                className="form-control" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-muted small">Tanggal Akhir</label>
              <input 
                type="date" 
                className="form-control" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary fw-medium px-4 me-2">Terapkan Filter</button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => { setStartDate(''); setEndDate(''); setTimeout(fetchReports, 100); }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-3 bg-success bg-opacity-10">
            <div className="card-body p-4 text-success">
              <h6 className="fw-bold mb-2">Total Pendapatan (Sukses)</h6>
              <h3 className="fw-bold mb-0">{formatRupiah(data.summary.total_revenue)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0 overflow-auto">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">Memuat data...</td>
                </tr>
              ) : data.transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">Tidak ada transaksi pada periode ini.</td>
                </tr>
              ) : (
                data.transactions.map((trx) => (
                  <tr key={trx.id}>
                    <td className="py-3 px-4">
                      {new Date(trx.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 fw-medium text-primary">{trx.invoice}</td>
                    <td className="py-3 px-4">{trx.cashier}</td>
                    <td className="py-3 px-4 fw-bold">{formatRupiah(trx.total_amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
