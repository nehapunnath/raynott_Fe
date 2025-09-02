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

// College API functions
export const collegeApi = {
  // Add a new college
  addCollege: async (formData) => {
    try {
      const response = await api.post('/admin/addcolleges', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all colleges
  getColleges: async () => {
    try {
      const response = await api.get('/admin/getcolleges');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single college by ID
  getCollege: async (id) => {
    try {
      const response = await api.get(`/admin/getcolleges/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a college
  updateCollege: async (id, formData) => {
    try {
      const response = await api.put(`/admin/updatecolleges/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a college
  deleteCollege: async (id) => {
    try {
      const response = await api.delete(`/admin/del-colleges/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search colleges
  searchColleges: async (filters) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/admin/search/colleges?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
};

// College Type management functions
export const collegeTypeApi = {
  // Get all college types
  getCollegeTypes: async () => {
    try {
      const response = await api.get('/admin/college-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a new college type
  addCollegeType: async (typeName) => {
    try {
      const response = await api.post('/admin/college-types', { name: typeName });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a college type
  deleteCollegeType: async (id) => {
    try {
      const response = await api.delete(`/admin/college-types/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default collegeApi;