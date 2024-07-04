import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Set the token in the headers for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/user/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, token }));
      setUser({ ...user, token });

      // Set the token in the headers for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { user: { ...user, token } };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
