// api/registerApi.js
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
      localStorage.removeItem('userEmail');
      localStorage.removeItem('institutionName');
      localStorage.removeItem('institutionType');
      localStorage.removeItem('userRole');
      localStorage.removeItem('registrationId');
      
      // Redirect to login page (not admin login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerApi = {
  // Submit a new registration (public endpoint, no auth required)
  submitRegistration: async (formData) => {
    try {
      const response = await api.post('/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Submit registration error:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit registration');
    }
  },

  // Check registration status by ID (public endpoint)
  getRegistrationStatus: async (id) => {
    try {
      const response = await api.get(`/status/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get registration status error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch registration status');
    }
  },

  // Check if registration exists for an email (requires auth)
  checkRegistrationByEmail: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }
      
      const response = await api.get(`/registration/check?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Check registration by email error:', error);
      
      // If 401, the interceptor will handle it
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(error.response?.data?.message || 'Failed to check registration');
    }
  },

  // Get full registration details by ID (requires auth)
  getRegistrationById: async (id) => {
    try {
      const response = await api.get(`/admin/registrations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get registration by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch registration details');
    }
  },

  // Get all pending registrations (admin only)
  getPendingRegistrations: async () => {
    try {
      const response = await api.get('/admin/pending');
      return response.data;
    } catch (error) {
      console.error('Get pending registrations error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pending registrations');
    }
  },

  // Get all registrations (admin only)
  getAllRegistrations: async () => {
    try {
      const response = await api.get('/admin/all');
      return response.data;
    } catch (error) {
      console.error('Get all registrations error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch all registrations');
    }
  },

  // Approve a registration (admin only)
  approveRegistration: async (id, adminNotes) => {
    try {
      const response = await api.put(`/admin/approve/${id}`, { adminNotes });
      return response.data;
    } catch (error) {
      console.error('Approve registration error:', error);
      throw new Error(error.response?.data?.message || 'Failed to approve registration');
    }
  },

  // Reject a registration (admin only)
  rejectRegistration: async (id, rejectionReason, adminNotes) => {
    try {
      const response = await api.put(`/admin/reject/${id}`, { rejectionReason, adminNotes });
      return response.data;
    } catch (error) {
      console.error('Reject registration error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject registration');
    }
  },

  // Refresh token (if you have a refresh endpoint)
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new Error('Failed to refresh token');
    }
  },

  // Check if token is valid
  verifyToken: async () => {
    try {
      const response = await api.get('/verify-auth');
      return response.data;
    } catch (error) {
      console.error('Verify token error:', error);
      throw new Error('Invalid or expired token');
    }
  }
};

export default registerApi;