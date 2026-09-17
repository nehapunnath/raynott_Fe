import axios from 'axios';
import base_url from './base_urls';

const api = axios.create({
  baseURL: base_url,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('parentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/parent-dashboard') && !currentPath.includes('/parent/dashboard')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('parentToken');
        localStorage.removeItem('userRole');
        window.location.href = '/';
      }
      console.warn('⚠️ 401 Unauthorized on parent dashboard - continuing without redirect');
    }
    return Promise.reject(error);
  }
);

// ============ LOCAL STORAGE FALLBACKS ============
function getLocalEnquiries() {
  try {
    const stored = localStorage.getItem('parentEnquiries');
    if (stored) {
      const parsed = JSON.parse(stored);
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

// ============ LOCAL LIMIT FALLBACK ============
function getLocalLimit(institutionId) {
  const DEFAULT_FREE_LIMIT = 5;
  try {
    const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
    const instLimit = savedLimits[institutionId];
    const customLimit = instLimit?.customLimit || 0;
    
    return {
      institutionId,
      freeLimit: DEFAULT_FREE_LIMIT,
      customLimit,
      totalLimit: DEFAULT_FREE_LIMIT + customLimit,
      lastUpdatedAt: instLimit?.updatedAt || null,
      source: 'localStorage'
    };
  } catch (error) {
    return {
      institutionId,
      freeLimit: DEFAULT_FREE_LIMIT,
      customLimit: 0,
      totalLimit: DEFAULT_FREE_LIMIT,
      lastUpdatedAt: null,
      source: 'localStorage'
    };
  }
}

// Save limit to localStorage as cache
function saveLocalLimit(institutionId, limitData) {
  try {
    const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
    savedLimits[institutionId] = {
      customLimit: limitData.customLimit || 0,
      totalLimit: limitData.totalLimit || 5,
      updatedAt: limitData.updatedAt || new Date().toISOString()
    };
    localStorage.setItem('institutionLimits', JSON.stringify(savedLimits));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

const enquiryApi = {
  // ============ PUBLIC / PARENT ============
  
  submitEnquiry: async (enquiryData) => {
    try {
      const response = await api.post('/enquiry/submit', enquiryData);
      return response.data;
    } catch (error) {
      console.error('Submit enquiry error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        enquiryId: `enq_${Date.now()}`,
        data: enquiryData
      };
    }
  },

  getParentEnquiries: async () => {
    try {
      const token = localStorage.getItem('parentToken');
      if (!token) {
        console.warn('⚠️ No parent token found, using localStorage fallback');
        return getLocalEnquiries();
      }
      
      try {
        const response = await api.get('/parent/enquiries');
        if (response.data && response.data.success) return response.data;
        if (response.data && Array.isArray(response.data)) {
          return { success: true, data: response.data, count: response.data.length };
        }
        if (response.data && response.data.enquiries) {
          return { success: true, data: response.data.enquiries, count: response.data.enquiries.length };
        }
        return { success: false, data: [], count: 0 };
      } catch (apiError) {
        console.warn('⚠️ API call failed, using localStorage');
        localStorage.removeItem('parentToken');
        return getLocalEnquiries();
      }
    } catch (error) {
      console.error('❌ Get parent enquiries error:', error);
      return getLocalEnquiries();
    }
  },

  getParentEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/parent/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      try {
        const stored = localStorage.getItem('parentEnquiries');
        if (stored) {
          const enquiries = JSON.parse(stored);
          const enquiry = enquiries.find(e => e.id === enquiryId);
          if (enquiry) return { success: true, data: enquiry };
        }
      } catch (localError) {}
      return { enquiry: null, success: false };
    }
  },

  // ============ ADMIN - ENQUIRIES ============

  getAllEnquiries: async (params = {}) => {
    try {
      const response = await api.get('/admin/enquiries', { params });
      return response.data;
    } catch (error) {
      console.error('Get all enquiries error:', error);
      return { enquiries: [], success: false };
    }
  },

  getEnquiryStats: async () => {
    try {
      const response = await api.get('/admin/enquiries/stats');
      return response.data;
    } catch (error) {
      console.error('Get enquiry stats error:', error);
      return { stats: {}, success: false };
    }
  },

  getInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/admin/enquiries/institution/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('Get institution enquiries error:', error);
      return { enquiries: [], success: false };
    }
  },

  getAdminEnquiryById: async (enquiryId) => {
    try {
      const response = await api.get(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Get admin enquiry by ID error:', error);
      return { enquiry: null, success: false };
    }
  },

  updateEnquiryStatus: async (enquiryId, status) => {
    try {
      const response = await api.put(`/admin/enquiries/${enquiryId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update enquiry status error:', error);
      return { success: false, message: 'Failed to update status' };
    }
  },

  addEnquiryResponse: async (enquiryId, responseData) => {
    try {
      const response = await api.post(`/admin/enquiries/${enquiryId}/response`, responseData);
      return response.data;
    } catch (error) {
      console.error('Add enquiry response error:', error);
      return { success: false, message: 'Failed to add response' };
    }
  },

  deleteEnquiry: async (enquiryId) => {
    try {
      const response = await api.delete(`/admin/enquiries/${enquiryId}`);
      return response.data;
    } catch (error) {
      console.error('Delete enquiry error:', error);
      return { success: false, message: 'Failed to delete enquiry' };
    }
  },

  // ============ PUBLIC - INSTITUTION ENQUIRIES (WITH LIMIT) ============

  getPublicInstitutionEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/institution/enquiries/${institutionId}`);
      
      // Backend returns new format with visibleEnquiries/lockedCount/limit
      if (response.data && response.data.success) {
        // Cache limit locally
        if (response.data.limit) {
          saveLocalLimit(institutionId, {
            customLimit: response.data.limit.customLimit,
            totalLimit: response.data.limit.totalLimit,
            updatedAt: new Date().toISOString()
          });
        }
        return response.data;
      }
      
      // Fallback: apply limit locally
      const limitData = getLocalLimit(institutionId);
      const allEnquiries = response.data?.data || response.data?.enquiries || [];
      
      const visible = allEnquiries.slice(0, limitData.totalLimit);
      const locked = allEnquiries.slice(limitData.totalLimit);
      
      return {
        success: true,
        data: allEnquiries,
        visibleEnquiries: visible,
        lockedCount: locked.length,
        limit: limitData,
        count: allEnquiries.length
      };
    } catch (error) {
      console.error('Get public institution enquiries error:', error);
      
      // Full fallback to localStorage
      const limitData = getLocalLimit(institutionId);
      return { 
        success: false, 
        data: [], 
        visibleEnquiries: [], 
        lockedCount: 0,
        limit: limitData,
        enquiries: [] 
      };
    }
  },

  // ============ INSTITUTION LIMITS ============

  // Get limit for a specific institution (public - institution dashboard uses this)
  getInstitutionLimit: async (institutionId) => {
    try {
      const response = await api.get(`/institution/limits/${institutionId}`);
      
      if (response.data && response.data.success) {
        // Cache locally
        saveLocalLimit(institutionId, {
          customLimit: response.data.data.customLimit,
          totalLimit: response.data.data.totalLimit,
          updatedAt: new Date().toISOString()
        });
        return response.data;
      }
      
      return { success: false, data: getLocalLimit(institutionId) };
    } catch (error) {
      console.warn('⚠️ Using localStorage fallback for limit');
      return { 
        success: true, 
        data: getLocalLimit(institutionId),
        source: 'localStorage' 
      };
    }
  },

  // Get locked enquiries (public)
  getLockedEnquiries: async (institutionId) => {
    try {
      const response = await api.get(`/institution/enquiries/${institutionId}/locked`);
      return response.data;
    } catch (error) {
      console.error('Get locked enquiries error:', error);
      return { success: false, data: { lockedCount: 0, lockedEnquiries: [] } };
    }
  },

  // Set/Update institution limit (admin only)
  setInstitutionLimit: async (institutionId, limitData) => {
    try {
      const response = await api.put(`/admin/institution-limits/${institutionId}`, limitData);
      
      // Cache to localStorage
      if (response.data && response.data.success) {
        saveLocalLimit(institutionId, {
          customLimit: response.data.data.customLimit,
          totalLimit: response.data.data.totalLimit,
          updatedAt: response.data.data.updatedAt
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Set institution limit error:', error);
      
      // Fallback: save to localStorage
      try {
        saveLocalLimit(institutionId, {
          customLimit: limitData.customLimit,
          totalLimit: 5 + limitData.customLimit,
          updatedAt: new Date().toISOString()
        });
        
        return {
          success: true,
          message: 'Saved locally (backend unavailable)',
          data: {
            institutionId,
            customLimit: limitData.customLimit,
            totalLimit: 5 + limitData.customLimit
          },
          source: 'localStorage'
        };
      } catch (e) {
        return { success: false, message: 'Failed to save limit' };
      }
    }
  },

  // Get all institution limits (admin)
  getAllInstitutionLimits: async () => {
    try {
      const response = await api.get('/admin/institution-limits');
      return response.data;
    } catch (error) {
      console.error('Get all limits error:', error);
      
      // Fallback to localStorage
      const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
      const limitsArray = Object.keys(savedLimits).map(id => ({
        institutionId: id,
        ...savedLimits[id]
      }));
      
      return { success: true, data: limitsArray, source: 'localStorage' };
    }
  },

  // Reset institution limit (admin)
  resetInstitutionLimit: async (institutionId) => {
    try {
      const response = await api.delete(`/admin/institution-limits/${institutionId}`);
      
      // Clear from localStorage too
      const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
      delete savedLimits[institutionId];
      localStorage.setItem('institutionLimits', JSON.stringify(savedLimits));
      
      return response.data;
    } catch (error) {
      console.error('Reset limit error:', error);
      
      const savedLimits = JSON.parse(localStorage.getItem('institutionLimits') || '{}');
      delete savedLimits[institutionId];
      localStorage.setItem('institutionLimits', JSON.stringify(savedLimits));
      
      return { success: true, message: 'Reset locally' };
    }
  },
  // ============ PLANS ============

// Public - get all active plans
getActivePlans: async () => {
  try {
    const response = await api.get('/plans', { params: { activeOnly: 'true' } });
    return response.data;
  } catch (error) {
    console.error('Get active plans error:', error);
    return { success: false, data: [] };
  }
},

// Get all plans (admin)
getAllPlans: async () => {
  try {
    const response = await api.get('/plans');
    return response.data;
  } catch (error) {
    console.error('Get all plans error:', error);
    return { success: false, data: [] };
  }
},

// Create plan (admin)
createPlan: async (planData) => {
  try {
    const response = await api.post('/admin/plans', planData);
    return response.data;
  } catch (error) {
    console.error('Create plan error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create plan',
      errors: error.response?.data?.errors || []
    };
  }
},

// Update plan (admin)
updatePlan: async (planId, planData) => {
  try {
    const response = await api.put(`/admin/plans/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error('Update plan error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update plan',
      errors: error.response?.data?.errors || []
    };
  }
},

// Delete plan (admin)
deletePlan: async (planId) => {
  try {
    const response = await api.delete(`/admin/plans/${planId}`);
    return response.data;
  } catch (error) {
    console.error('Delete plan error:', error);
    return { success: false, message: 'Failed to delete plan' };
  }
},

// Toggle active (admin)
togglePlanActive: async (planId, isActive) => {
  try {
    const response = await api.patch(`/admin/plans/${planId}/toggle-active`, { isActive });
    return response.data;
  } catch (error) {
    console.error('Toggle plan error:', error);
    return { success: false, message: 'Failed to toggle plan' };
  }
},

// Seed default plans (admin, one-time)
seedDefaultPlans: async () => {
  try {
    const response = await api.post('/admin/plans/seed-defaults');
    return response.data;
  } catch (error) {
    console.error('Seed plans error:', error);
    return { success: false, message: 'Failed to seed plans' };
  }
}
  
};

export default enquiryApi;