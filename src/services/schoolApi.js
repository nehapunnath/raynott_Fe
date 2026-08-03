// services/schoolApi.js
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
      console.log('📡 Fetching school with ID:', id);
      const response = await api.get(`/admin/getschools/${id}`);
      console.log('📡 API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching school:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch school');
    }
  },

  // Get a single school by ID (alias)
  getSchoolById: async (id) => {
    try {
      const response = await api.get(`/admin/getschools/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school by ID:', error);
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

  // Get schools with filters
  getSchoolsWithFilters: async (params) => {
    try {
      const response = await api.get('/getschools/filtered', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch filtered schools');
    }
  },

  // Add review
  addReview: async (schoolId, reviewData) => {
    try {
      const response = await api.post(`/admin/schools/${schoolId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add review');
    }
  },

  // Get reviews
  getReviews: async (schoolId) => {
    try {
      const response = await api.get(`/schools/${schoolId}/reviews`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  // Like review
  likeReview: async (schoolId, reviewId) => {
    try {
      const response = await api.put(`/schools/${schoolId}/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like review');
    }
  },

  // Dislike review
  dislikeReview: async (schoolId, reviewId) => {
    try {
      const response = await api.put(`/schools/${schoolId}/reviews/${reviewId}/dislike`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to dislike review');
    }
  }
};

export default schoolApi;