import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('asnUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    const response = await axiosInstance.post('/auth/login', credentials);
    const payload = response.data?.data ?? response.data;
    const { token, user: userData } = payload;

    if (!token) {
      setLoading(false);
      throw new Error('Login succeeded but auth token was not returned. Please verify your account or try again.');
    }

    localStorage.setItem('asnAuthToken', token);
    localStorage.setItem('asnUser', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    return payload;
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await axiosInstance.post('/auth/register', payload);
    const authPayload = response.data?.data ?? response.data;
    const { token, user: userData } = authPayload;

    if (!token) {
      setLoading(false);
      throw new Error('Registration succeeded but auth token was not returned. Please verify your account or try again.');
    }

    localStorage.setItem('asnAuthToken', token);
    localStorage.setItem('asnUser', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    return authPayload;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // ignore failed server logout on client side
    }
    localStorage.removeItem('asnAuthToken');
    localStorage.removeItem('asnUser');
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    const response = await axiosInstance.put('/auth/profile', payload);
    const authPayload = response.data?.data ?? response.data;
    const { user: userData } = authPayload;
    localStorage.setItem('asnUser', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    return authPayload;
  };

  useEffect(() => {
    const token = localStorage.getItem('asnAuthToken');
    if (!token) {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
