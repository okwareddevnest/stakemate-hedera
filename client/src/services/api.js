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

// Project endpoints
const projectService = {
  getProjects: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  getProject: async (id) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  createProject: async (projectData) => {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
};

// Token and Hedera endpoints
const hederaService = {
  getStatus: async () => {
    try {
      const response = await apiClient.get('/direct-hedera/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching Hedera status:', error);
      throw error;
    }
  },
  
  getAccount: async (accountId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/account/${accountId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account ${accountId}:`, error);
      throw error;
    }
  },
  
  getAccountBalance: async (accountId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/account/${accountId}/balance`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account balance ${accountId}:`, error);
      throw error;
    }
  },
  
  getTokenInfo: async (tokenId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/token/${tokenId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching token ${tokenId}:`, error);
      throw error;
    }
  },
  
  transferHbar: async (data) => {
    try {
      const response = await apiClient.post(`/direct-hedera/hbar/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring HBAR:', error);
      throw error;
    }
  },
  
  transferToken: async (data) => {
    try {
      const response = await apiClient.post(`/direct-hedera/token/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring token:', error);
      throw error;
    }
  }
};

// Portfolio endpoints
const portfolioService = {
  getUserPortfolio: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching portfolio for user ${userId}:`, error);
      throw error;
    }
  },
  
  getUserInvestments: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/investments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching investments for user ${userId}:`, error);
      throw error;
    }
  },

  simulateInvestment: async (userId, projectId, amount) => {
    try {
      const response = await apiClient.post(`/simulation/${userId}/${projectId}`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error simulating investment:', error);
      throw error;
    }
  }
};

export default apiService; 