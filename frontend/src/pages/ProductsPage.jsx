import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatRupiah } from '../utils/format';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form state
  const [currentProduct, setCurrentProduct] = useState({ 
    id: null, 
    name: '', 
    category_id: '', 
    price: '', 
    stock: '', 
    image: null 
  });
  
  // Base URL for images
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const IMAGE_URL = `${API_BASE.replace(/\/api$/, '')}/uploads/products/`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data || prodRes.data);
      setCategories(catRes.data.data || catRes.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProduct({ id: null, name: '', category_id: '', price: '', stock: '', image: null });
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setIsEditing(true);
    setCurrentProduct({ 
      id: prod.id, 
      name: prod.name, 
      category_id: prod.category_id, 
      price: prod.price, 
      stock: prod.stock, 
      image: null // Jangan set file statis ke state file input
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Gunakan FormData karena ada file upload
    const formData = new FormData();
    formData.append('name', currentProduct.name);
    formData.append('category_id', currentProduct.category_id);
    formData.append('price', currentProduct.price);
    formData.append('stock', currentProduct.stock);
    if (currentProduct.image) {
      formData.append('image', currentProduct.image);
    }

    try {
      if (isEditing) {
        await api.put(`/products/${currentProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      closeModal();
      fetchData();
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan produk.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus produk.');
      }
    }
  };

  // Helper untuk mencari nama kategori berdasarkan id
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : '-';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-semibold text-dark mb-0">Manajemen Produk</h2>
        <button className="btn btn-success fw-medium" onClick={openAddModal}>
          + Tambah Produk
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0 overflow-auto">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="py-3 px-4">Gambar</th>
                <th className="py-3 px-4">Nama Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4 text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Memuat data...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Belum ada data produk.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id}>
                    <td className="py-2 px-4">
                      {prod.image ? (
                        <img 
                          src={`${IMAGE_URL}${prod.image}`} 
                          alt={prod.name} 
                          className="rounded object-fit-cover border" 
                          style={{ width: '50px', height: '50px' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Img'; }}
                        />
                      ) : (
                        <div className="bg-light text-muted d-flex align-items-center justify-content-center rounded border" style={{ width: '50px', height: '50px', fontSize: '10px' }}>No Img</div>
                      )}
                    </td>
                    <td className="py-2 px-4 fw-medium">{prod.name}</td>
                    <td className="py-2 px-4 text-secondary">{getCategoryName(prod.category_id)}</td>
                    <td className="py-2 px-4">{formatRupiah(prod.price)}</td>
                    <td className="py-2 px-4">
                      <span className={`badge ${prod.stock > 10 ? 'bg-success' : prod.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(prod)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(prod.id)}>Hapus</button>
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
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{isEditing ? 'Edit Produk' : 'Tambah Produk'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">Nama Produk</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Contoh: Cappuccino"
                      value={currentProduct.name}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Kategori</label>
                    <select 
                      className="form-select"
                      value={currentProduct.category_id}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: e.target.value })}
                      required
                    >
                      <option value="" disabled>-- Pilih Kategori --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-medium">Harga (Rp)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0"
                        min="0"
                        value={currentProduct.price}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium">Stok Awal</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0"
                        min="0"
                        value={currentProduct.stock}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Foto Produk {isEditing && <span className="text-muted fw-normal">(opsional)</span>}</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept="image/*"
                      onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.files[0] })}
                      required={!isEditing} // Wajib isi kalau tambah baru, opsional kalau edit
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

export default ProductsPage;
