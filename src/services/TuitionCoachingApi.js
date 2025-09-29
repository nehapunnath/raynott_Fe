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

// Tuition/Coaching API functions
export const TuitionCoachingApi = {
  // Add a new tuition/coaching center
  addTuitionCoaching: async (formData) => {
    try {
      const response = await api.post('/admin/addtuitioncoaching', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all tuition/coaching centers
  getTuitionCoachings: async () => {
    try {
      const response = await api.get('/admin/gettuitioncoaching');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single tuition/coaching center by ID
  getTuitionCoaching: async (id) => {
    try {
      const response = await api.get(`/admin/gettuitioncoaching/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a tuition/coaching center
  updateTuitionCoaching: async (id, formData) => {
    try {
      const response = await api.put(`/admin/updatetuitioncoaching/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a tuition/coaching center
  deleteTuitionCoaching: async (id) => {
    try {
      const response = await api.delete(`/admin/del-tuitioncoaching/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search tuition/coaching centers
  searchTuitionCoachings: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/admin/search/tuitioncoaching?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getSimilarTuitionCoachings: async (city = '', subjects = '') => {
  //   try {
  //     const response = await api.get(`/admin/search/tuitioncoaching`, {
  //       params: { city, subjects },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },
  addReview: async (tuitionCoachingId, reviewData) => {
    try {
      const response = await api.post(`/admin/tuitioncoaching/${tuitionCoachingId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get reviews for a tuition/coaching center
  getReviews: async (tuitionCoachingId) => {
    try {
      const response = await api.get(`/tuitioncoaching/${tuitionCoachingId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like a review
  likeReview: async (tuitionCoachingId, reviewId) => {
    try {
      const response = await api.put(`/tuitioncoaching/${tuitionCoachingId}/reviews/${reviewId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Dislike a review
  dislikeReview: async (tuitionCoachingId, reviewId) => {
    try {
      const response = await api.put(`/tuitioncoaching/${tuitionCoachingId}/reviews/${reviewId}/dislike`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Coaching Type management functions
export const coachingTypeApi = {
  // Get all coaching types
  getCoachingTypes: async () => {
    try {
      const response = await api.get('/admin/coaching-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a new coaching type
  addCoachingType: async (typeName) => {
    try {
      const response = await api.post('/admin/coaching-types', { name: typeName });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a coaching type
  deleteCoachingType: async (id) => {
    try {
      const response = await api.delete(`/admin/coaching-types/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default TuitionCoachingApi;