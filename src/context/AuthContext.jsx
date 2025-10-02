import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 saat ms olarak

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const expiryCheckInterval = useRef(null);

  // token süresini kontrol et
  const checkTokenExpiry = () => {
// burayı loglayıp tokeni kontrol edebiliriz
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    
    if (tokenTimestamp) {
      const elapsed = Date.now() - parseInt(tokenTimestamp);
      
      if (elapsed >= TOKEN_EXPIRY) {
       
        logout();
        alert('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
      }
    }
  };


  useEffect(() => {
    const handleStorageChange = (e) => {
      // logout işlemi başka sekmede yapıldıysa
      if (e.key === 'token' && e.newValue === null) {
        setUser(null);
      }
      
      // login işlemi başka sekmede yapıldıysa
      if (e.key === 'user' && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');

    if (token && savedUser && tokenTimestamp) {
      const elapsed = Date.now() - parseInt(tokenTimestamp);
      
      if (elapsed < TOKEN_EXPIRY) {
        setUser(JSON.parse(savedUser));
      } else {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenTimestamp');
      }
    }
    
    setLoading(false);
  }, []);


  useEffect(() => {
    if (user) {
      //  30 saniyede bir kontrol et
      expiryCheckInterval.current = setInterval(checkTokenExpiry, 30000);
      console.log('Token expiry check started',checkTokenExpiry);
      
      return () => {
        if (expiryCheckInterval.current) {
          clearInterval(expiryCheckInterval.current);
        }
      };
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Giriş yapılırken bir hata oluştu'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('tokenTimestamp', Date.now().toString());
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Kayıt olunurken bir hata oluştu'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenTimestamp');
    setUser(null);
    
    if (expiryCheckInterval.current) {
      clearInterval(expiryCheckInterval.current);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};