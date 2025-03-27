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
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  
  // Projects endpoints
  getProjects: (filters) => apiClient.get('/api/projects', { params: filters }),
  getProjectById: (projectId) => apiClient.get(`/api/projects/${projectId}`),
  
  // User endpoints
  getUserProfile: (userId) => apiClient.get(`/api/users/${userId}`),
  updateUserProfile: (userId, userData) => apiClient.put(`/api/users/${userId}`, userData),
  
  // Investments endpoints
  getUserInvestments: (userId) => apiClient.get(`/api/users/${userId}/investments`),
  createInvestment: (investmentData) => apiClient.post('/api/investments', investmentData),
  getInvestmentById: (investmentId) => apiClient.get(`/api/investments/${investmentId}`),
  
  // AI features
  getRecommendations: (userId) => apiClient.post(`/api/recommendations/${userId}`),
  simulateInvestment: (userId, projectId, amount) => 
    apiClient.post(`/api/simulation/${userId}/${projectId}`, { amount }),
  analyzeSentiment: (data) => apiClient.post('/api/analysis/sentiment', data),
  
  // Hedera-specific endpoints (via backend that may use Eliza)
  getHbarBalance: (accountId) => apiClient.get(`/api/hedera/balance/${accountId}`),
  getTokenBalance: (accountId, tokenId) => 
    apiClient.get(`/api/hedera/tokens/${tokenId}/balance/${accountId}`),
  getAllTokenBalances: (accountId) => apiClient.get(`/api/hedera/tokens/${accountId || 'me'}`),
  getTokenHolders: (tokenId, threshold = 0) => 
    apiClient.get(`/api/hedera/tokens/${tokenId}/holders`, { params: { threshold } }),
};

// Project endpoints
const projectService = {
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/api/projects', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },
  
  getById: async (projectId) => {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting project ${projectId}:`, error);
      throw error;
    }
  },
  
  getSentiment: async (projectId) => {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}/sentiment`);
      return response.data;
    } catch (error) {
      console.error(`Error getting sentiment for project ${projectId}:`, error);
      throw error;
    }
  },
  
  getUpdates: async (projectId, limit = 10) => {
    try {
      const response = await apiClient.get(`/api/projects/${projectId}/updates`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error(`Error getting updates for project ${projectId}:`, error);
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
      const response = await apiClient.get('/api/direct-hedera/status');
      return response.data;
    } catch (error) {
      console.error('Error getting Hedera status:', error);
      throw error;
    }
  },
  
  getAccount: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/direct-hedera/account/${accountId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account ${accountId}:`, error);
      throw error;
    }
  },
  
  getAccountBalance: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/direct-hedera/account/${accountId}/balance`);
      return response.data;
    } catch (error) {
      console.error('Error getting account balance:', error);
      throw error;
    }
  },
  
  getAccountInfo: async (accountId) => {
    try {
      const response = await apiClient.get(`/api/direct-hedera/account/${accountId}/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  },
  
  getTokenInfo: async (tokenId) => {
    try {
      const response = await apiClient.get(`/api/direct-hedera/token/${tokenId}/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  },
  
  getTokenBalance: async (accountId, tokenId) => {
    try {
      const response = await apiClient.get(`/api/direct-hedera/account/${accountId}/token/${tokenId}/balance`);
      return response.data;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  },
  
  associateToken: async (data) => {
    try {
      const response = await apiClient.post(`/api/direct-hedera/token/associate`, data);
      return response.data;
    } catch (error) {
      console.error('Error associating token:', error);
      throw error;
    }
  },
  
  transferHbar: async (data) => {
    try {
      const response = await apiClient.post(`/api/direct-hedera/hbar/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring HBAR:', error);
      throw error;
    }
  },
  
  transferToken: async (data) => {
    try {
      const response = await apiClient.post(`/api/direct-hedera/token/transfer`, data);
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
      const response = await apiClient.get(`/api/users/${userId}/portfolio`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching portfolio for user ${userId}:`, error);
      throw error;
    }
  },
  
  getUserInvestments: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/investments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching investments for user ${userId}:`, error);
      throw error;
    }
  },

  simulateInvestment: async (userId, projectId, amount) => {
    try {
      const response = await apiClient.post(`/api/simulation/${userId}/${projectId}`, { amount });
      return response.data;
    } catch (error) {
      console.error('Error simulating investment:', error);
      throw error;
    }
  }
};

export { projectService, hederaService, portfolioService };
export default apiService; 