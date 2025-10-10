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
      window.location.href = '/admin/login';
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
      throw new Error(error.response?.data?.message || 'Failed to submit registration');
    }
  },

  // Check registration status (public endpoint)
  getRegistrationStatus: async (id) => {
    try {
      const response = await api.get(`/status/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch registration status');
    }
  },

  // Get all pending registrations (admin only)
  getPendingRegistrations: async () => {
    try {
      const response = await api.get('/admin/pending');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending registrations');
    }
  },

  // Get all registrations (admin only)
  getAllRegistrations: async () => {
    try {
      const response = await api.get('/admin/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all registrations');
    }
  },

  // Get a single registration by ID (admin only)
  getRegistrationById: async (id) => {
    try {
      const response = await api.get(`/admin/registrations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch registration');
    }
  },

  // Approve a registration (admin only)
  approveRegistration: async (id, adminNotes) => {
    try {
      const response = await api.put(`/admin/approve/${id}`, { adminNotes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve registration');
    }
  },

  // Reject a registration (admin only)
  rejectRegistration: async (id, rejectionReason, adminNotes) => {
    try {
      const response = await api.put(`/admin/reject/${id}`, { rejectionReason, adminNotes });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject registration');
    }
  },
  // Add to registerApi
getPendingRegistrations: async () => {
  try {
    const response = await api.get('/admin/pending');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending registrations');
  }
},
getAllRegistrations: async () => {
  try {
    const response = await api.get('/admin/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch all registrations');
  }
},
getRegistrationById: async (id) => {
  try {
    const response = await api.get(`/admin/registrations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch registration');
  }
},
approveRegistration: async (id, adminNotes) => {
  try {
    const response = await api.put(`/admin/approve/${id}`, { adminNotes });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to approve registration');
  }
},
rejectRegistration: async (id, rejectionReason, adminNotes) => {
  try {
    const response = await api.put(`/admin/reject/${id}`, { rejectionReason, adminNotes });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject registration');
  }
},
};

export default registerApi;