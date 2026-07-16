import { useState, useEffect } from 'react';
import api from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: '' });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentCategory(cat);
    setErrorMsg('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isEditing) {
        await api.put(`/categories/${currentCategory.id}`, { name: currentCategory.name });
      } else {
        await api.post('/categories', { name: currentCategory.name });
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan kategori.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus kategori.');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-semibold text-dark mb-0">Manajemen Kategori</h2>
        <button className="btn btn-success fw-medium" onClick={openAddModal}>
          + Tambah Kategori
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4 text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">Memuat data...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">Belum ada data kategori.</td>
                </tr>
              ) : (
                categories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 fw-medium">{cat.name}</td>
                    <td className="py-3 px-4 text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(cat)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat.id)}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Kategori' : 'Tambah Kategori'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                  <div className="mb-3">
                    <label className="form-label fw-medium">Nama Kategori</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Masukkan nama kategori"
                      value={currentCategory.name}
                      onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Batal</button>
                  <button type="submit" className="btn btn-success fw-medium">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
