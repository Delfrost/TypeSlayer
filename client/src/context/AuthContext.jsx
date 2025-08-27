import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('Initializing auth, token:', !!token);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUserProfile();
      } else {
        setLoading(false);
      }
    };
    
    // Set a timeout in case network request hangs
    const timeout = setTimeout(() => {
      console.log('Auth initialization timeout, setting loading to false');
      setLoading(false);
    }, 3000); // Reduced timeout to 3 seconds
    
    initializeAuth().finally(() => {
      clearTimeout(timeout);
    });
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data.user);
      console.log('User profile loaded:', response.data.user?.username);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear token on any auth error to prevent getting stuck
      if (error.response?.status === 401 || error.code === 'NETWORK_ERROR') {
        logout();
      } else {
        // On network errors, clear token but don't redirect
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      console.log('Setting loading to false after profile fetch');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/auth/register', { username, email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserStats = (newStats) => {
    setUser(prev => prev ? { ...prev, stats: newStats } : null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserStats,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};