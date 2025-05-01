import axios from 'axios';
import { toast } from 'react-toastify';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED' || !error.response) {
      toast.info('Connecting to server. This may take a moment...');
      
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        await new Promise(resolve => setTimeout(resolve, 2000));
        return api(originalRequest);
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error('Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    signup: (userData) => api.post('/api/auth/signup', userData),
    getCurrentUser: () => api.get('/api/auth/me')
  },
  
  projects: {
    getAll: () => api.get('/api/projects'),
    getById: (id) => api.get(`/api/projects/${id}`),
    create: (projectData) => api.post('/api/projects', projectData),
    update: (id, projectData) => api.put(`/api/projects/${id}`, projectData),
    delete: (id) => api.delete(`/api/projects/${id}`)
  },
    
  tasks: {
    getAll: (projectId) => api.get(`/api/tasks?projectId=${projectId}`),
    create: (taskData) => api.post('/api/tasks', taskData),
    update: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
    delete: (id) => api.delete(`/api/tasks/${id}`)
  }
};

export default api; 