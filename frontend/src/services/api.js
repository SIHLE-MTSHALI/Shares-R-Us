import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
        console.warn('Resource not found:', response.config.url);
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

export const login = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  try {
    const response = await api.post('/token', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'An error occurred during login');
    } else if (error.request) {
      throw new Error('No response received from the server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

export const getRandomAssets = async (count) => {
  try {
    const response = await api.get(`/random-assets?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random assets:', error);
    throw error;
  }
};

export const register = (userData) => api.post('/register', userData);

export const getPortfolios = async () => {
  try {
    const response = await api.get('/portfolios');
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};

export const getPortfolio = async (id) => {
  if (!id) {
    throw new Error('Portfolio ID is required');
  }
  try {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const createPortfolio = (portfolioData) => api.post('/portfolios', portfolioData);

export const updatePortfolio = (id, portfolioData) => api.put(`/portfolios/${id}`, portfolioData);

export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);

export const addAssetToPortfolio = async (portfolioId, assetData) => {
  try {
    const response = await api.post(`/portfolios/${portfolioId}/assets`, assetData);
    return response.data;
  } catch (error) {
    console.error('Error adding asset to portfolio:', error);
    throw error;
  }
};

export const removeAssetFromPortfolio = async (portfolioId, assetId) => {
  try {
    const response = await api.delete(`/portfolios/${portfolioId}/assets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing asset from portfolio:', error);
    throw error;
  }
};

export const getPortfolioHistory = async (portfolioId, range) => {
  try {
    const response = await api.get(`/portfolios/${portfolioId}/history`, { params: { range } });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn('Portfolio history not available:', error);
      return [];
    }
    console.error('Error fetching portfolio history:', error);
    return []; // Return an empty array instead of throwing an error
  }
};

export const searchAssets = async (query, filters = {}) => {
  try {
    const response = await api.get('/search-assets', {
      params: {
        query,
        ...filters
      }
    });
    return response.data;
  } catch (error) {
    toast.error('Error searching assets:', error);
    console.error('Error searching assets:', error);
    throw error;
  }
};

export const getAssetDetails = async (symbol) => {
  try {
    const response = await api.get(`/assets/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset details:', error);
    toast.error('Failed to fetch asset details');
    return null; // Return null instead of throwing an error
  }
};

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

export const getNewsFeed = async (page = 1, pageSize = 20) => {
  try {
    const response = await api.get(`/news-feed?page=${page}&page_size=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news feed:', error);
    throw error;
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

export const getWatchlist = async () => {
  try {
    const response = await api.get('/watchlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    if (error.response && error.response.status === 404) {
      console.warn('Watchlist endpoint not found. Make sure it is implemented on the backend.');
      return []; // Return an empty array if the endpoint doesn't exist
    }
    toast.error('Failed to fetch watchlist. Please try again later.');
    return []; // Return an empty array instead of throwing an error
  }
};

export const addToWatchlist = async (symbol) => {
  try {
    const response = await api.post('/watchlist', { symbol });
    return response.data;
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (symbol) => {
  try {
    const response = await api.delete(`/watchlist/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const getEarningsEvents = async () => {
  try {
    const response = await api.get('/earnings-events');
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings events:', error);
    toast.error('Failed to fetch earnings events. Please try again later.');
    return []; // Return an empty array instead of throwing an error
  }
};

export default api;