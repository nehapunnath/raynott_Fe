import axios from 'axios';
import base_url from './base_urls';

// Create axios instance with default config
const api = axios.create({
  baseURL: base_url,
  timeout: 15000,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('parentToken');
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
      localStorage.removeItem('parentToken');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const enquiryApi = {
  // Submit a new enquiry (public)
  submitEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/enquiry/submit', enquiryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit enquiry');
    }
  },

  // Get parent's enquiries (requires parent authentication)
  getParentEnquiries: async () => {
    try {
      const response = await api.get('/parent/enquiries');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch your enquiries');
    }
  },

  // Get a single enquiry by ID (parent)
  getParentEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/parent/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enquiry');
    }
  },

  // ============ ADMIN ROUTES ============

  // Get all enquiries (admin only)
  getAllEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/enquiries', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enquiries');
    }
  },

  // Get enquiry statistics (admin only)
  getEnquiryStats: async () => {
    try {
      const response = await api.get('/admin/enquiries/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enquiry statistics');
    }
  },

  // Get enquiries for a specific institution (admin only)
  getInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/admin/enquiries/institution/${institutionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch institution enquiries');
    }
  },

  // Get a single enquiry by ID (admin)
  getAdminEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch enquiry');
    }
  },

  // Update enquiry status (admin only)
  updateEnquiryStatus: async (enquiryId, status) => {
    try {
      const response = await api.put(`/admin/enquiries/${enquiryId}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update enquiry status');
    }
  },

  // Add a response to an enquiry (admin only)
  addEnquiryResponse: async (enquiryId, responseData) => {
    try {
      const response = await api.post(`/admin/enquiries/${enquiryId}/response`, responseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add response');
    }
  },

  // Delete an enquiry (admin only)
  deleteEnquiry: async (enquiryId) => {
    try {
      const response = await api.delete(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete enquiry');
    }
  },

  // Get enquiries for a specific institution (public)
  getPublicInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/institution/enquiries/${institutionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch institution enquiries');
    }
  }
};

export default enquiryApi;