import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm rounded-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <h3 className="card-title text-center text-success fw-bold mb-4">Login POS</h3>
          
          {errorMsg && (
            <div className="alert alert-danger py-2" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-medium" htmlFor="username">Username</label>
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-medium" htmlFor="password">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success fw-semibold py-2" disabled={loading}>
                {loading ? 'Memproses...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
