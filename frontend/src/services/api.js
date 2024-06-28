import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login)
    localStorage.removeItem('token');
    window.location = '/login';
  }
  return Promise.reject(error);
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);
export const createPortfolio = (portfolioData) => api.post('/portfolios', portfolioData);
export const updatePortfolio = (id, portfolioData) => api.put(`/portfolios/${id}`, portfolioData);
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);
export const getAssets = () => api.get('/assets');
export const addAssetToPortfolio = (portfolioId, assetData) => api.post(`/portfolios/${portfolioId}/assets`, assetData);
export const removeAssetFromPortfolio = (portfolioId, assetId) => api.delete(`/portfolios/${portfolioId}/assets/${assetId}`);
export const getWatchlist = () => api.get('/watchlist');
export const addToWatchlist = (symbol) => api.post('/watchlist', { symbol });
export const removeFromWatchlist = (symbol) => api.delete(`/watchlist/${symbol}`);

export default api;