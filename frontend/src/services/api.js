import axios from 'axios';
import { toast } from 'react-toastify';

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
  const { response } = error;
  if (response) {
    switch (response.status) {
      case 401:
        toast.error('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        window.location = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 500:
        toast.error('An internal server error occurred. Please try again later.');
        break;
      default:
        toast.error('An error occurred. Please try again.');
    }
  } else {
    toast.error('Network error. Please check your internet connection.');
  }
  return Promise.reject(error);
});

export const login = (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  return api.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const removeAssetFromPortfolio = (portfolioId, assetId) => api.delete(`/portfolios/${portfolioId}/stocks/${assetId}`);
export const register = (userData) => api.post('/register', userData);
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);
export const createPortfolio = (portfolioData) => api.post('/portfolios', portfolioData);
export const updatePortfolio = (id, portfolioData) => api.put(`/portfolios/${id}`, portfolioData);
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);
export const addAssetToPortfolio = (portfolioId, assetData) => api.post(`/portfolios/${portfolioId}/stocks`, assetData);
export const getPortfolioHistory = (portfolioId, timeRange) => api.get(`/portfolios/${portfolioId}/history?range=${timeRange}`);
export const searchAssets = (query, filters) => api.get('/search', { params: { q: query, ...filters } });
export const getAssetDetails = (symbol) => api.get(`/assets/${symbol}`);
export const getUserSettings = () => api.get('/user/settings');
export const updateUserSettings = (settings) => api.put('/user/settings', settings);

export const getMarketOverview = async () => {
  try {
    const response = await api.get('/market-overview');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching market overview:', error);
    return [];
  }
};

export const getNewsFeed = async () => {
  try {
    const response = await api.get('/news-feed');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching news feed:', error);
    return [];
  }
};

export const getTrendingAnalysis = async () => {
  try {
    const response = await api.get('/trending-analysis');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching trending analysis:', error);
    return [];
  }
};

export const getEarningsEvents = async () => {
  try {
    const response = await api.get('/earnings-events');
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings events:', error);
    throw error;
  }
};

export default api;