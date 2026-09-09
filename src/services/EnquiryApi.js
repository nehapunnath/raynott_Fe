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

// Response interceptor 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Only redirect if NOT on parent dashboard
      if (!currentPath.includes('/parent-dashboard') && !currentPath.includes('/parent/dashboard')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('parentToken');
        localStorage.removeItem('userRole');
        window.location.href = '/';
      }
      // If on parent dashboard, just reject the promise without redirect
      console.warn('⚠️ 401 Unauthorized on parent dashboard - continuing without redirect');
    }
    return Promise.reject(error);
  }
);

// Helper function to get enquiries from localStorage
function getLocalEnquiries() {
  try {
    const stored = localStorage.getItem('parentEnquiries');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`📋 Loaded ${parsed.length} enquiries from localStorage`);
      return { 
        success: true, 
        data: Array.isArray(parsed) ? parsed : [],
        count: Array.isArray(parsed) ? parsed.length : 0,
        source: 'localStorage'
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return { success: true, data: [], count: 0, source: 'localStorage' };
}

const enquiryApi = {
  // Submit a new enquiry (public)
  submitEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/enquiry/submit', enquiryData);
      return response.data;
    } catch (error) {
      console.error('Submit enquiry error:', error);
      // Return a fallback response
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        enquiryId: `enq_${Date.now()}`,
        data: enquiryData
      };
    }
  },

  // Get parent's enquiries (requires parent authentication)
  getParentEnquiries: async () => {
    try {
      const token = localStorage.getItem('parentToken');
      
      // If no token, skip API call entirely
      if (!token) {
        console.warn('⚠️ No parent token found, using localStorage fallback');
        return getLocalEnquiries();
      }
      
      // Check if token is valid by testing it
      console.log('📡 Checking token validity...');
      
      try {
        const response = await api.get('/parent/enquiries');
        console.log('✅ API Response:', response.data);
        
        // Handle different response formats
        if (response.data && response.data.success) {
          return response.data;
        } else if (response.data && Array.isArray(response.data)) {
          return { success: true, data: response.data, count: response.data.length };
        } else if (response.data && response.data.enquiries) {
          return { success: true, data: response.data.enquiries, count: response.data.enquiries.length };
        } else {
          return { success: false, data: [], count: 0, message: 'Invalid response format' };
        }
      } catch (apiError) {
        // If API call fails, clear token and use localStorage
        console.warn('⚠️ API call failed, clearing token and using localStorage');
        localStorage.removeItem('parentToken');
        return getLocalEnquiries();
      }
    } catch (error) {
      console.error('❌ Get parent enquiries error:', error);
      // Always fallback to localStorage
      return getLocalEnquiries();
    }
  },

  // Get a single enquiry by ID (parent)
  getParentEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/parent/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Get parent enquiry by ID error:', error);
      // Try to get from localStorage
      try {
        const stored = localStorage.getItem('parentEnquiries');
        if (stored) {
          const enquiries = JSON.parse(stored);
          const enquiry = enquiries.find(e => e.id === enquiryId);
          if (enquiry) {
            return { success: true, data: enquiry };
          }
        }
      } catch (localError) {
        console.error('Error finding enquiry in localStorage:', localError);
      }
      return { enquiry: null, success: false };
    }
  },

  // ============ ADMIN ROUTES ============

  // Get all enquiries (admin only)
  getAllEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/enquiries', { params });
      return response.data;
    } catch (error) {
      console.error('Get all enquiries error:', error);
      return { enquiries: [], success: false };
    }
  },

  // Get enquiry statistics (admin only)
  getEnquiryStats: async () => {
    try {
      const response = await api.get('/admin/enquiries/stats');
      return response.data;
    } catch (error) {
      console.error('Get enquiry stats error:', error);
      return { stats: {}, success: false };
    }
  },

  // Get enquiries for a specific institution (admin only)
  getInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/admin/enquiries/institution/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('Get institution enquiries error:', error);
      return { enquiries: [], success: false };
    }
  },

  // Get a single enquiry by ID (admin)
  getAdminEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Get admin enquiry by ID error:', error);
      return { enquiry: null, success: false };
    }
  },

  // Update enquiry status (admin only)
  updateEnquiryStatus: async (enquiryId, status) => {
    try {
      const response = await api.put(`/admin/enquiries/${enquiryId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update enquiry status error:', error);
      return { success: false, message: 'Failed to update status' };
    }
  },

  // Add a response to an enquiry (admin only)
  addEnquiryResponse: async (enquiryId, responseData) => {
    try {
      const response = await api.post(`/admin/enquiries/${enquiryId}/response`, responseData);
      return response.data;
    } catch (error) {
      console.error('Add enquiry response error:', error);
      return { success: false, message: 'Failed to add response' };
    }
  },

  // Delete an enquiry (admin only)
  deleteEnquiry: async (enquiryId) => {
    try {
      const response = await api.delete(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Delete enquiry error:', error);
      return { success: false, message: 'Failed to delete enquiry' };
    }
  },

  // Get enquiries for a specific institution (public)
  getPublicInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/institution/enquiries/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('Get public institution enquiries error:', error);
      return { enquiries: [], success: false };
    }
  }
};

export default enquiryApi;