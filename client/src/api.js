import axios from 'axios';

const API_URL = '/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('farmlink_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getMyProducts = () => api.get('/products/farmer/my');

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getFarmerOrders = () => api.get('/orders/farmer');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const getFarmerAnalytics = () => api.get('/orders/farmer/analytics');

// Reviews
export const addReview = (data) => api.post('/reviews', data);
export const getReviews = (productId) => api.get(`/reviews/product/${productId}`);

// Admin
export const getAdminUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminProducts = () => api.get('/admin/products');
export const approveProduct = (id, approved) => api.put(`/admin/products/${id}/approve`, { is_approved: approved });
export const getAdminOrders = () => api.get('/admin/orders');
export const getAdminAnalytics = () => api.get('/admin/analytics');
export const verifyFarmer = (id) => api.put(`/admin/farmers/${id}/verify`);

export default api;
