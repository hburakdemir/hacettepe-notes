import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/posts/getpost'),
  getMyPosts:() => api.get('/posts/my-posts'),
  addPost: (formData) => {
    return api.post('/posts/addpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Saved Posts API
export const savedPostsAPI = {
  getSavedPosts: () => api.get('/saved-posts/getPost'),
  savePost: (postId) => api.post(`/saved-posts/savePost/${postId}`),
  unsavePost: (postId) => api.delete(`/saved-posts/unsavePost/${postId}`),
};

// Profile API
export const profileAPI = {
  updateProfile: (profileData) => api.put('/update-profile/profile', profileData),
};

export default api;