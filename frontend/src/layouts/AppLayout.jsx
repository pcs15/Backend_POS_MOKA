import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar Placeholder */}
      <aside className="bg-white border-end d-none d-md-block" style={{ width: '250px' }}>
        <div className="h-100 p-4 overflow-auto">
           <h2 className="fs-4 fw-bold text-success text-center mb-4">MOKA POS</h2>
           
           <div className="list-group list-group-flush">
             {/* Menu Kasir & Admin */}
             <button onClick={() => navigate('/dashboard')} className="list-group-item list-group-item-action border-0 mb-1 rounded text-secondary fw-medium">
               Dashboard
             </button>
             <button onClick={() => navigate('/pos')} className="list-group-item list-group-item-action border-0 mb-1 rounded text-secondary fw-medium">
               Point of Sale
             </button>

             {/* Menu Khusus Admin */}
             {user?.role === 'admin' && (
               <>
                 <div className="text-uppercase text-muted small fw-bold mt-4 mb-2 px-3">Manajemen</div>
                 <button onClick={() => navigate('/admin/categories')} className="list-group-item list-group-item-action border-0 mb-1 rounded text-secondary fw-medium">
                   Kategori Produk
                 </button>
                 <button onClick={() => navigate('/admin/products')} className="list-group-item list-group-item-action border-0 mb-1 rounded text-secondary fw-medium">
                   Data Produk
                 </button>
                 <button onClick={() => navigate('/admin/reports')} className="list-group-item list-group-item-action border-0 mb-1 rounded text-secondary fw-medium">
                   Laporan Penjualan
                 </button>
               </>
             )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        {/* Navbar Placeholder */}
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom">
            <h1 className="h5 fw-semibold mb-0 text-dark">Menu Utama</h1>
            <div className="d-flex align-items-center gap-3">
                <span className="small text-muted fw-medium">Halo, {user?.username || 'User'}</span>
                <button onClick={logout} className="btn btn-sm btn-outline-danger">Logout</button>
            </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
