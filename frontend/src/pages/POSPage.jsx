import { useState, useEffect } from 'react';
import api from '../services/api';
import { formatRupiah } from '../utils/format';

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cart & UI State
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      console.error("Gagal mengambil data POS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    setSuccessMessage('');
    setErrorMessage('');
    
    if (product.stock <= 0) {
      setErrorMessage(`${product.name} sedang habis.`);
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // Cek stok maksimum
        if (existingItem.quantity >= product.stock) {
           setErrorMessage(`Stok ${product.name} tidak mencukupi.`);
           return prev;
        }
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { 
          product_id: product.id, 
          name: product.name, 
          price: parseFloat(product.price), 
          quantity: 1,
          max_stock: product.stock
        }];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= item.max_stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Payload format sesuai backend (items: [{product_id, quantity}])
      const payload = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/orders', payload);
      setSuccessMessage(response.data?.message || 'Transaksi berhasil!');
      setCart([]); // Kosongkan keranjang
      fetchData(); // Refresh stok produk
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Gagal memproses transaksi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter produk berdasarkan tab kategori yang aktif
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === parseInt(activeCategory));

  return (
    <div className="h-100 d-flex flex-column flex-md-row gap-4">
      {/* Kolom Kiri: Daftar Produk */}
      <div className="flex-grow-1 d-flex flex-column h-100">
        <h2 className="h4 fw-semibold text-dark mb-3">Pilih Produk</h2>
        
        {/* Kategori Tabs */}
        <div className="d-flex gap-2 overflow-auto pb-2 mb-3" style={{ whiteSpace: 'nowrap' }}>
           <button 
             className={`btn rounded-pill ${activeCategory === 'all' ? 'btn-success fw-medium' : 'btn-outline-secondary'}`}
             onClick={() => setActiveCategory('all')}
           >
             Semua
           </button>
           {categories.map(cat => (
             <button 
               key={cat.id}
               className={`btn rounded-pill ${activeCategory === cat.id.toString() ? 'btn-success fw-medium' : 'btn-outline-secondary'}`}
               onClick={() => setActiveCategory(cat.id.toString())}
             >
               {cat.name}
             </button>
           ))}
        </div>

        {/* Grid Produk */}
        <div className="row g-3 overflow-auto align-content-start flex-grow-1 pb-4">
          {loading ? (
            <div className="col-12 text-center text-muted py-5">Memuat produk...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">Belum ada produk di kategori ini.</div>
          ) : (
            filteredProducts.map(prod => (
              <div className="col-6 col-md-4 col-lg-3" key={prod.id}>
                <div 
                  className={`card h-100 border-0 shadow-sm rounded-4 overflow-hidden ${prod.stock <= 0 ? 'opacity-50' : ''}`}
                  style={{ cursor: prod.stock > 0 ? 'pointer' : 'not-allowed', transition: 'transform 0.1s' }}
                  onClick={() => handleAddToCart(prod)}
                  onMouseOver={(e) => { if(prod.stock > 0) e.currentTarget.style.transform = 'scale(1.02)' }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <div className="ratio ratio-1x1 bg-light">
                    {prod.image ? (
                      <img 
                        src={`${IMAGE_URL}${prod.image}`} 
                        alt={prod.name} 
                        className="object-fit-cover" 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Img'; }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center text-muted small">No Image</div>
                    )}
                  </div>
                  <div className="card-body p-3">
                    <h6 className="card-title fw-semibold text-truncate mb-1">{prod.name}</h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                       <span className="text-success fw-bold small">{formatRupiah(prod.price)}</span>
                       <span className="badge bg-light text-secondary border small">Stok: {prod.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Kolom Kanan: Keranjang (Cart) */}
      <div className="card border-0 shadow-sm rounded-4 d-flex flex-column" style={{ width: '100%', maxWidth: '350px', maxHeight: '100%' }}>
        <div className="card-header bg-white border-bottom p-4">
          <h5 className="mb-0 fw-bold">Keranjang Pesanan</h5>
        </div>
        
        <div className="card-body p-0 overflow-auto flex-grow-1">
          {successMessage && <div className="alert alert-success m-3 py-2 small">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger m-3 py-2 small">{errorMessage}</div>}

          {cart.length === 0 ? (
            <div className="d-flex h-100 align-items-center justify-content-center flex-column text-muted p-4 text-center">
               <div className="fs-1 mb-2">🛒</div>
               <p className="small">Keranjang masih kosong. Pilih produk di sebelah kiri.</p>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {cart.map(item => (
                <li className="list-group-item p-3 border-bottom" key={item.product_id}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="fw-semibold text-dark">{item.name}</div>
                    <button className="btn btn-sm text-danger p-0 border-0" onClick={() => removeFromCart(item.product_id)}>✕</button>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{formatRupiah(item.price)}</span>
                    <div className="input-group input-group-sm" style={{ width: '90px' }}>
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.product_id, -1)}>-</button>
                      <input type="text" className="form-control text-center px-0 fw-medium" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Total & Checkout */}
        <div className="card-footer bg-white border-top p-4">
           <div className="d-flex justify-content-between align-items-center mb-3">
             <span className="text-muted fw-medium">Total Harga</span>
             <h4 className="text-dark fw-bold mb-0">{formatRupiah(calculateTotal())}</h4>
           </div>
           <button 
             className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm"
             disabled={cart.length === 0 || isProcessing}
             onClick={handleCheckout}
           >
             {isProcessing ? 'Memproses...' : 'Proses Bayar'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
