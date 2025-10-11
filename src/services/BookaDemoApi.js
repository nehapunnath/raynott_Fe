import axios from 'axios';
import base_url from './base_urls';

// Create axios instance with default config
const api = axios.create({
  baseURL: base_url,
  timeout: 10000,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const bookaDemoApi = {
  // Book a demo
  bookDemo: async (bookingData) => {
    try {
      const response = await api.post('/book-demo', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to book demo');
    }
  },

  // Get all demo bookings (admin only)
  getBookings: async (params = {}) => {
    try {
      const response = await api.get('/book-demo', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },
};

export default bookaDemoApi;