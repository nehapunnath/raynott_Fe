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

export const schoolApi = {
  // Add a new school
  addSchool: async (formData) => {
    try {
      const response = await api.post('/admin/addschools', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add school');
    }
  },

  // Get all schools
  getSchools: async () => {
    try {
      const response = await api.get('/admin/getschools');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch schools');
    }
  },

  // Get a single school by ID
  getSchool: async (id) => {
    try {
      const response = await api.get(`/admin/getschools/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch school');
    }
  },

  // Update a school
  updateSchool: async (id, formData) => {
    try {
        
      const response = await api.put(`/admin/updateschools/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update school');
    }
  },

  // Delete a school
  deleteSchool: async (id) => {
    try {
      const response = await api.delete(`/admin/del-schools/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete school');
    }
  },
  getSchoolsWithFilters: async (params) => {
    try {
      const response = await api.get('/getschools/filtered', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered schools');
    }
  },
};

export default schoolApi;