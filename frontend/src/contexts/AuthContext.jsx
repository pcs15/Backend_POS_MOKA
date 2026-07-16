import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek token saat aplikasi pertama kali dimuat
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('user');

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (error) {
        console.error("Gagal parsing data user:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user: userData } = response.data.data || response.data;
      
      // Simpan ke local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      // Redirect berdasarkan role
      if (userData.role === 'admin') {
         navigate('/dashboard', { replace: true });
      } else {
         navigate('/pos', { replace: true });
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal, periksa username dan password Anda.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
