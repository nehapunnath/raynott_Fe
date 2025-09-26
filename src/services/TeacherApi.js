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
 getProfessionalTeachers: async (params = {}) => {
    try {
      const response = await api.get('/admin/professional-teachers', { 
        params: {
          city: params.city,
          subjects: params.subjects,
          institutionType: params.institutionType,
          teachingMode: params.teachingMode,
          minHourlyRate: params.minHourlyRate,
          maxHourlyRate: params.maxHourlyRate,
          experience: params.experience ? params.experience.join(',') : undefined,
          qualification: params.qualification,
          minRating: params.minRating,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch professional teachers');
    }
  },

  getPersonalMentors: async (params = {}) => {
    try {
      const response = await api.get('/admin/personal-mentors', { 
        params: {
          city: params.city,
          subjects: params.subjects,
          institutionType: params.institutionType,
          teachingMode: params.teachingMode,
          minHourlyRate: params.minHourlyRate,
          maxHourlyRate: params.maxHourlyRate,
          experience: params.experience ? params.experience.join(',') : undefined,
          qualification: params.qualification,
          minRating: params.minRating,
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch personal mentors');
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
  getProfessionalTeacherDetails: async (id) => {
    try {
      const response = await api.get(`/admin/professional-teachers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch professional teacher details');
    }
  },
  getPersonalMentorDetails: async (id) => {
    try {
      const response = await api.get(`/admin/personal-mentors/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch personal mentor details');
    }
  },
  searchProfessionalTeachersByName: async (name, additionalFilters = {}) => {
    try {
      const response = await api.get('/teachers/search/professional', {
        params: {
          name,
          city: additionalFilters.city,
          subjects: additionalFilters.subjects,
          teachingMode: additionalFilters.teachingMode,
          minHourlyRate: additionalFilters.minHourlyRate,
          maxHourlyRate: additionalFilters.maxHourlyRate,
          experience: additionalFilters.experience ? additionalFilters.experience.join(',') : undefined,
          qualification: additionalFilters.qualification,
          minRating: additionalFilters.minRating,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search professional teachers');
    }
  },

  searchPersonalMentorsByName: async (name, additionalFilters = {}) => {
    try {
      const response = await api.get('/teachers/search/personal', {
        params: {
          name,
          city: additionalFilters.city,
          subjects: additionalFilters.subjects,
          teachingMode: additionalFilters.teachingMode,
          minHourlyRate: additionalFilters.minHourlyRate,
          maxHourlyRate: additionalFilters.maxHourlyRate,
          experience: additionalFilters.experience ? additionalFilters.experience.join(',') : undefined,
          qualification: additionalFilters.qualification,
          minRating: additionalFilters.minRating,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search personal mentors');
    }
  },
};

export default teacherApi;