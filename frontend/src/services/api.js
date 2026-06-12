// frontend/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  signup: (userData) => API.post('/auth/signup', userData),
};

export const productAPI = {
  getAll: () => API.get('/products'),
  create: (data) => API.post('/products', data),
  scan: (barcode) => API.get(`/products/scan/${barcode}`),
};

export const batchAPI = {
  getDashboard: () => API.get('/batches/expiry-dashboard'),
  create: (data) => API.post('/batches', data),
  applyDiscount: (id) => API.put(`/batches/${id}/discount`),
};

export default API;
