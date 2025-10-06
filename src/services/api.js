import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

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
    console.error('API Hatası:', error.response?.status, error.response?.data?.message || error.message);
    
    // Login ve register endpoint'lerini kontrol dışında tut
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                          error.config?.url?.includes('/auth/register');
    
    // 401 VE 403 kontrolü yanlış yapılmış düzelttik
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenTimestamp');
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
  getMyPosts: () => api.get('/posts/my-posts'),
  addPost: (formData) => {
    return api.post('/posts/addpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePost: (postId) => api.delete(`/posts/deletepost/${postId}`),
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

// ADMIN API - DÜZELTİLDİ: api instance kullanılıyor
export const adminAPI = {
  // Tüm kullanıcıları getir
  getAllUsers: () => api.get('/users'),

  // Kullanıcı rolünü güncelle
  updateUserRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),

  // Onay bekleyen postları getir
  getPendingPosts: () => api.get('/posts/pending'),

  // Post onayla
  approvePost: (postId) => api.patch(`/posts/${postId}/approve`, {}),

  // Post reddet
  rejectPost: (postId) => api.patch(`/posts/${postId}/reject`, {}),

  // Post sil (admin/moderator)
  deletePostAdmin: (postId) => api.delete(`/posts/${postId}/admin-delete`),

  // Tüm postları getir (status ile birlikte)
  getAllPostsWithStatus: () => api.get('/posts/all-status'),

    // onaylanan postları getir
   getApprovedPosts: () => api.get('/posts/approved'),

};



export default api;