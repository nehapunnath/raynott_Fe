import base_url from './base_urls';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
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

// PU College API functions
export const puCollegeApi = {
  // Add a new PU College
  addCollege: async (formData) => {
    try {
      const response = await api.post('/admin/addpucolleges', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all PU Colleges
  getPUColleges: async () => {
    try {
      const response = await api.get('/admin/getpucolleges');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single PU College by ID
  getPUCollege: async (id) => {
    try {
      const response = await api.get(`/admin/getpucolleges/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a PU College
  updatePUCollege: async (id, formData) => {
    try {
      const response = await api.put(`/admin/updatepucolleges/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a PU College
  deletePUCollege: async (id) => {
    try {
      const response = await api.delete(`/admin/del-pucolleges/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search PU Colleges
  searchPUColleges: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/admin/search/pucolleges?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
   addReview: async (puCollegeId, reviewData) => {
    try {
      const response = await api.post(`/admin/pucolleges/${puCollegeId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews for a PU College
  getReviews: async (puCollegeId) => {
    try {
      const response = await api.get(`/pucolleges/${puCollegeId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like a review
  likeReview: async (puCollegeId, reviewId) => {
    try {
      const response = await api.put(`/pucolleges/${puCollegeId}/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Dislike a review
  dislikeReview: async (puCollegeId, reviewId) => {
    try {
      const response = await api.put(`/pucolleges/${puCollegeId}/reviews/${reviewId}/dislike`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// PU College Type management functions
export const puCollegeTypeApi = {
  // Get all PU College types
  getPuCollegeTypes: async () => {
    try {
      const response = await api.get('/admin/pucollege-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a new PU College type
  addPuCollegeType: async (typeName) => {
    try {
      const response = await api.post('/admin/pucollege-types', { name: typeName });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a PU College type
  deletePuCollegeType: async (id) => {
    try {
      const response = await api.delete(`/admin/pucollege-types/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default puCollegeApi;