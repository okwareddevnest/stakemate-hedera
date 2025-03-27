import axios from 'axios';

// Base API URL - gets from environment variables or uses default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API service with methods for different endpoints
const apiService = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Projects endpoints
  getProjects: (filters) => apiClient.get('/projects', { params: filters }),
  getProjectById: (projectId) => apiClient.get(`/projects/${projectId}`),
  
  // User endpoints
  getUserProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateUserProfile: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
  
  // Investments endpoints
  getUserInvestments: (userId) => apiClient.get(`/users/${userId}/investments`),
  createInvestment: (investmentData) => apiClient.post('/investments', investmentData),
  getInvestmentById: (investmentId) => apiClient.get(`/investments/${investmentId}`),
  
  // AI features
  getRecommendations: (userId) => apiClient.post(`/recommendations/${userId}`),
  simulateInvestment: (userId, projectId, amount) => 
    apiClient.post(`/simulation/${userId}/${projectId}`, { amount }),
  analyzeSentiment: (data) => apiClient.post('/analysis/sentiment', data),
  
  // Hedera-specific endpoints (via backend that may use Eliza)
  getHbarBalance: (accountId) => apiClient.get(`/hedera/balance/${accountId}`),
  getTokenBalance: (accountId, tokenId) => 
    apiClient.get(`/hedera/tokens/${tokenId}/balance/${accountId}`),
  getAllTokenBalances: (accountId) => apiClient.get(`/hedera/tokens/${accountId || 'me'}`),
  getTokenHolders: (tokenId, threshold = 0) => 
    apiClient.get(`/hedera/tokens/${tokenId}/holders`, { params: { threshold } }),
};

export default apiService; 