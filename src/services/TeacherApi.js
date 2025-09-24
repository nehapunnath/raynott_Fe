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

export const teacherApi = {
  // Add a new teacher
  addTeacher: async (formData) => {
    try {
      const response = await api.post('/admin/addteachers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add teacher');
    }
  },

  // Get all teachers
  getTeachers: async () => {
    try {
      const response = await api.get('/admin/teachers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teachers');
    }
  },

  // Get a single teacher by ID
  getTeacher: async (id) => {
    try {
      const response = await api.get(`/admin/get-teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch teacher');
    }
  },

  // Update a teacher
  updateTeacher: async (id, formData) => {
    try {
      const response = await api.put(`/admin/edit-teachers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update teacher');
    }
  },

  // Delete a teacher
  deleteTeacher: async (id) => {
    try {
      const response = await api.delete(`/admin/del-teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete teacher');
    }
  },

  // Get teachers with filters
  getTeachersWithFilters: async (params) => {
    try {
      const response = await api.get('/admin/teachers/filter', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered teachers');
    }
  },
};

export default teacherApi;