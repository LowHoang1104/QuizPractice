import axios from 'axios';

// Dev: dùng '' để request qua Vite proxy (tránh CORS/SSL). Build: dùng URL backend thật.
const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'https://localhost:7212');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  googleLogin: (data) => api.post('/api/auth/google', data),
  me: () => api.get('/api/auth/me'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
};

export const subjectsApi = {
  getAll: () => api.get('/api/subjects'),
  getListAdmin: (params) => api.get('/api/subjects/admin', { params }),
  getByIdAdmin: (id) => api.get(`/api/subjects/admin/${id}`),
  create: (data) => api.post('/api/subjects/admin', data),
  update: (id, data) => api.put(`/api/subjects/admin/${id}`, data),
  getDimensions: (id) => api.get(`/api/subjects/admin/${id}/dimensions`),
  createDimension: (id, data) => api.post(`/api/subjects/admin/${id}/dimensions`, data),
  updateDimension: (id, data) => api.put(`/api/subjects/admin/dimensions/${id}`, data),
  getPricePackages: (id) => api.get(`/api/subjects/admin/${id}/price-packages`),
  createPricePackage: (id, data) => api.post(`/api/subjects/admin/${id}/price-packages`, data),
  updatePricePackage: (id, data) => api.put(`/api/subjects/admin/price-packages/${id}`, data),
};

export const usersApi = {
  getList: (params) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
};

export const settingsApi = {
  getList: () => api.get('/api/settings'),
  getById: (id) => api.get(`/api/settings/${id}`),
  create: (data) => api.post('/api/settings', data),
  update: (id, data) => api.put(`/api/settings/${id}`, data),
  delete: (id) => api.delete(`/api/settings/${id}`),
};

export const postsApi = {
  getList: (params) => api.get('/api/posts', { params }),
  getById: (id) => api.get(`/api/posts/${id}`),
  create: (data) => api.post('/api/posts', data),
  update: (id, data) => api.put(`/api/posts/${id}`, data),
  delete: (id) => api.delete(`/api/posts/${id}`),
};

export const slidersApi = {
  getList: (params) => api.get('/api/sliders', { params }),
  getById: (id) => api.get(`/api/sliders/${id}`),
  create: (data) => api.post('/api/sliders', data),
  update: (id, data) => api.put(`/api/sliders/${id}`, data),
  delete: (id) => api.delete(`/api/sliders/${id}`),
};

export const registrationsApi = {
  getMy: () => api.get('/api/registrations/my'),
  getList: (params) => api.get('/api/registrations', { params }),
  getById: (id) => api.get(`/api/registrations/${id}`),
  create: (data) => api.post('/api/registrations', data),
  updateStatus: (id, data) => api.put(`/api/registrations/${id}/status`, data),
};

export const questionsApi = {
  getList: (params) => api.get('/api/questions', { params }),
  getById: (id) => api.get(`/api/questions/${id}`),
  create: (data) => api.post('/api/questions', data),
  update: (id, data) => api.put(`/api/questions/${id}`, data),
};

export const quizTemplatesApi = {
  getList: (params) => api.get('/api/quiztemplates', { params }),
  getById: (id) => api.get(`/api/quiztemplates/${id}`),
  create: (data) => api.post('/api/quiztemplates', data),
  update: (id, data) => api.put(`/api/quiztemplates/${id}`, data),
};

export const lessonsApi = {
  getList: (params) => api.get('/api/lessons', { params }),
  getById: (id) => api.get(`/api/lessons/${id}`),
  create: (data) => api.post('/api/lessons', data),
  update: (id, data) => api.put(`/api/lessons/${id}`, data),
};

export const quizApi = {
  start: (data) => api.post('/api/quiz/start', data),
  submit: (data) => api.post('/api/quiz/submit', data),
  getResult: (quizResultId) => api.get(`/api/quiz/result/${quizResultId}`),
};
