import axios from 'axios';

const API_URL = 'http://localhost:8000';  // Update this with your backend URL

export const api = axios.create({
  baseURL: API_URL,
});

export const getPortfolio = () => api.get('/portfolio');
// Add more API calls as needed
