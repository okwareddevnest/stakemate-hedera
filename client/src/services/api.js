import axios from 'axios';
import hederaService from './hederaService';

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
  getProjects: async (filters) => {
    try {
      const response = await apiClient.get('/projects', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },
  getProjectById: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },
  
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

  // Investment endpoints
  processInvestment: async (userId, projectId, amount) => {
    try {
      // Get project and user details
      const project = await projectService.getById(projectId);
      const user = await apiService.getUserById(userId);

      if (!project.tokenId) {
        throw new Error('Project token not created');
      }
      
      // Use the configuration accounts for simulation
      // If the user has a Hedera account ID, we'll use that for the simulated transfers
      const operatorId = import.meta.env.VITE_HEDERA_OPERATOR_ID;
      const treasuryId = project.treasuryAccountId || import.meta.env.VITE_HEDERA_TREASURY_ID || operatorId;
      
      // Use the user's Hedera account ID if available, otherwise fall back to the operator
      const investorAccountId = user.hederaAccountId || operatorId;
      
      if (!operatorId) {
        throw new Error('Operator account not configured');
      }
      
      if (!treasuryId) {
        throw new Error('Treasury account not configured');
      }

      console.log(`Using investor account: ${investorAccountId} and treasury account: ${treasuryId}`);

      // Calculate token amount (1 HBAR = 100 tokens for simulation)
      const tokenAmount = Math.floor(amount * 100);
      
      // Simulate the transfers
      console.log(`Simulating transfer of ${amount} HBAR from ${investorAccountId} to ${treasuryId}`);
      console.log(`Simulating transfer of ${tokenAmount} tokens of ${project.tokenId} from ${treasuryId} to ${investorAccountId}`);
      
      // Simulate the HBAR transfer
      const hbarTransfer = {
        success: true,
        transactionId: `simulated-hbar-transfer-${Date.now()}`,
        status: 'SUCCESS',
        fromAccount: investorAccountId,
        toAccount: treasuryId
      };

      // Simulate the token transfer
      const tokenTransfer = {
        success: true,
        transactionId: `simulated-token-transfer-${Date.now()}`,
        status: 'SUCCESS',
        fromAccount: treasuryId,
        toAccount: investorAccountId
      };

      // Create and return the simulated investment data
      const timestamp = new Date().toISOString();
      const investmentId = `sim-investment-${Date.now()}`;
      
      return {
        success: true,
        id: investmentId,
        userId: userId,
        projectId: projectId,
        amount: parseFloat(amount),
        tokenAmount: tokenAmount,
        investorAccountId: investorAccountId,
        treasuryAccountId: treasuryId,
        tokenId: project.tokenId,
        status: 'COMPLETED',
        createdAt: timestamp,
        updatedAt: timestamp,
        transactionIds: {
          hbar: hbarTransfer.transactionId,
          token: tokenTransfer.transactionId
        }
      };
    } catch (error) {
      console.error('Error processing investment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Token endpoints
  getTokenInfo: async (tokenId) => {
    try {
      return await hederaService.getTokenInfo(tokenId);
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  },

  // User endpoints
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Portfolio endpoints
  getUserPortfolio: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/portfolio`);
      return response.data;
    } catch (error) {
      console.error('Error getting user portfolio:', error);
      throw error;
    }
  }
};

// Project endpoints
const projectService = {
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/projects', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  },
  
  getById: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting project ${projectId}:`, error);
      throw error;
    }
  },
  
  getSentiment: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/sentiment`);
      return response.data;
    } catch (error) {
      console.error(`Error getting sentiment for project ${projectId}:`, error);
      throw error;
    }
  },
  
  getUpdates: async (projectId, limit = 10) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}/updates`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error(`Error getting updates for project ${projectId}:`, error);
      throw error;
    }
  },
  
  createProject: async (projectData) => {
    try {
      // Create project in database
      const response = await apiClient.post('/projects', projectData);
      const project = response.data;

      // Get treasury account ID from environment
      const treasuryAccountId = import.meta.env.VITE_HEDERA_TREASURY_ID || import.meta.env.VITE_HEDERA_OPERATOR_ID;

      // Create token on Hedera
      const tokenData = {
        name: project.name,
        symbol: project.symbol || project.name.substring(0, 5).toUpperCase(),
        decimals: 8,
        initialSupply: Math.floor(project.totalBudget / 10),
        memo: `Infrastructure token for ${project.name} project in ${project.location || 'Kenya'}`
      };

      const tokenResult = await hederaService.createToken(tokenData);
      
      if (!tokenResult.success) {
        throw new Error('Failed to create token on Hedera');
      }

      // Create discussion topic
      const topicResult = await hederaService.createTopic(
        `Discussion topic for ${project.name} project`,
        true // Require submit key for messages
      );

      if (!topicResult.success) {
        throw new Error('Failed to create discussion topic');
      }

      // Update project with token ID, topic ID and treasury account ID
      const updatedProject = await apiClient.put(`/projects/${project.id}`, {
        ...project,
        tokenId: tokenResult.tokenId,
        discussionTopicId: topicResult.topicId,
        treasuryAccountId: treasuryAccountId
      });

      // Add simulation flags if they were present in the token or topic results
      return {
        ...updatedProject.data,
        simulated: tokenResult.simulated || topicResult.simulated,
        tokenSimulated: tokenResult.simulated,
        topicSimulated: topicResult.simulated
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
};

// Token and Hedera endpoints
const hederaApiService = {
  getStatus: async () => {
    try {
      const response = await apiClient.get('/direct-hedera/status');
      return response.data;
    } catch (error) {
      console.error('Error checking Hedera status:', error);
      return { success: false, error: error.message };
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
      console.error(`Error getting account balance for ${accountId}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  getAccountInfo: async (accountId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/account/${accountId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error getting account info for ${accountId}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  getTokenInfo: async (tokenId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/token/${tokenId}/info`);
      return response.data;
    } catch (error) {
      console.error(`Error getting token info for ${tokenId}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  getTokenBalance: async (accountId, tokenId) => {
    try {
      const response = await apiClient.get(`/direct-hedera/account/${accountId}/token/${tokenId}/balance`);
      return response.data;
    } catch (error) {
      console.error(`Error getting token balance for account ${accountId}, token ${tokenId}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  associateToken: async (data) => {
    try {
      const response = await apiClient.post(`/direct-hedera/token/associate`, data);
      return response.data;
    } catch (error) {
      console.error('Error associating token:', error);
      return { success: false, error: error.message };
    }
  },
  
  transferHbar: async (data) => {
    try {
      const response = await apiClient.post(`/direct-hedera/hbar/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring HBAR:', error);
      return { success: false, error: error.message };
    }
  },
  
  transferToken: async (data) => {
    try {
      const response = await apiClient.post(`/direct-hedera/token/transfer`, data);
      return response.data;
    } catch (error) {
      console.error('Error transferring token:', error);
      return { success: false, error: error.message };
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

export { projectService, hederaApiService as hederaService, portfolioService };
export default apiService; 