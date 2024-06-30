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
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login)
    localStorage.removeItem('token');
    window.location = '/login';
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

export const register = (userData) => api.post('/register', userData);
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (id) => api.get(`/portfolios/${id}`);
export const createPortfolio = (portfolioData) => api.post('/portfolios', portfolioData);
export const updatePortfolio = (id, portfolioData) => api.put(`/portfolios/${id}`, portfolioData);
export const deletePortfolio = (id) => api.delete(`/portfolios/${id}`);
export const getMarketOverview = () => api.get('/market-overview');
export const getNewsFeed = () => api.get('/news-feed');
export const getTrendingAnalysis = () => api.get('/trending-analysis');

export default api;