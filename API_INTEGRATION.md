# StakeMate API Integration Guide

This guide explains how to set up and consume the StakeMate backend API, including integration with the Hedera network via Eliza.

## Backend Setup

### Prerequisites

- Node.js v16 or higher
- npm or yarn package manager
- Hedera testnet account credentials
- Access to the Hedera AI Agent Workshop resources

### Setting Up the Backend

1. Clone the repository
   ```bash
   git clone https://github.com/okwareddevnest/stakemate-hedera.git
   cd stakemate-hedera
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server configuration
   PORT=3000
   NODE_ENV=development
   
   # Hedera configuration
   HEDERA_ACCOUNT_ID=your-account-id
   HEDERA_PRIVATE_KEY=your-private-key
   HEDERA_NETWORK=testnet
   HEDERA_KEY_TYPE=ED25519  # or ECDSA
   
   # Optional: Eliza configuration (if using Eliza)
   ELIZA_API_URL=http://localhost:3001
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Integrating with Eliza

StakeMate can leverage the Eliza agent for enhanced blockchain interactions. The integration is based on the Hedera AI Agent Workshop.

### Setting Up Eliza

1. Clone or navigate to the Hedera AI Agent Workshop repository
   ```bash
   cd /path/to/hedera-ai-agent-workshop
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure the environment variables for Eliza
   ```bash
   # Navigate to the hedera-plugin-eliza directory
   cd hedera-plugin-eliza
   
   # Create .env file
   cat > .env << EOL
   HEDERA_PRIVATE_KEY=your-private-key
   HEDERA_ACCOUNT_ID=your-account-id
   HEDERA_NETWORK_TYPE=testnet
   HEDERA_KEY_TYPE=ED25519  # or ECDSA
   EOL
   ```

4. Start Eliza with the Universal Helper character
   ```bash
   pnpm run dev --characters='../characters/universalHelper.character.json'
   ```

### Connecting StakeMate to Eliza

In your StakeMate backend code, you can use the Eliza API client to interact with Hedera through Eliza:

```javascript
// src/services/elizaService.js
const axios = require('axios');

class ElizaService {
  constructor() {
    this.apiUrl = process.env.ELIZA_API_URL || 'http://localhost:3001';
  }

  async sendPrompt(prompt) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/prompt`, { prompt });
      return response.data;
    } catch (error) {
      console.error('Error communicating with Eliza:', error);
      throw error;
    }
  }

  async getHbarBalance(accountId) {
    const prompt = `Show me HBAR balance of wallet ${accountId}`;
    return this.sendPrompt(prompt);
  }

  async getTokenBalance(accountId, tokenId) {
    const prompt = `Show me balance of token ${tokenId} for wallet ${accountId}`;
    return this.sendPrompt(prompt);
  }

  async getAllTokenBalances(accountId) {
    const prompt = accountId 
      ? `Show me the balances of all HTS tokens for wallet ${accountId}`
      : `Show me your HTS token balances`;
    return this.sendPrompt(prompt);
  }

  // Add more Eliza-based interactions as needed
}

module.exports = new ElizaService();
```

## Consuming the StakeMate REST API

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

#### Projects

- `GET /api/projects` - Get all infrastructure projects
- `GET /api/projects/:projectId` - Get a specific project by ID
- `POST /api/projects` - Create a new project (admin)
- `PUT /api/projects/:projectId` - Update a project (admin)

#### User Management

- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `GET /api/users/:userId/investments` - Get user investments

#### Investments

- `POST /api/investments` - Make a new investment
- `GET /api/investments/:investmentId` - Get investment details
- `GET /api/investments/tokens/:tokenId` - Get token investment details

#### AI-Powered Features

- `POST /api/analysis/sentiment` - Analyze sentiment for a project
- `POST /api/recommendations/:userId` - Get personalized recommendations
- `POST /api/simulation/:userId/:projectId` - Simulate investment returns

### Example API Usage (Frontend)

Here's how to consume the API from your React frontend:

```javascript
// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
  // Authentication
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Projects
  getProjects: (filters) => apiClient.get('/projects', { params: filters }),
  getProjectById: (projectId) => apiClient.get(`/projects/${projectId}`),
  
  // Investments
  createInvestment: (investmentData) => apiClient.post('/investments', investmentData),
  getUserInvestments: (userId) => apiClient.get(`/users/${userId}/investments`),
  
  // AI features
  getRecommendations: (userId) => apiClient.post(`/recommendations/${userId}`),
  simulateInvestment: (userId, projectId, amount) => 
    apiClient.post(`/simulation/${userId}/${projectId}`, { amount }),
  
  // Hedera-specific (via Eliza)
  getHbarBalance: (accountId) => apiClient.get(`/hedera/balance/${accountId}`),
  getTokenBalances: (accountId) => apiClient.get(`/hedera/tokens/${accountId}`),
};

export default apiService;
```

### Using the API in React Components

Here's how to use the API service in a React component:

```jsx
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProjects();
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Infrastructure Projects</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-stats">
              <span>ROI: {project.roi}%</span>
              <span>Risk: {project.riskLevel}</span>
            </div>
            <button onClick={() => window.location.href = `/projects/${project.id}`}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
```

## Hedera Integration

StakeMate interacts with the Hedera network for:

1. **Project Tokenization** - Creating tokens for infrastructure projects
2. **Investment Transactions** - Processing investments as token transfers
3. **Milestone Tracking** - Recording project milestones on the ledger

### Direct Hedera SDK Integration

In addition to Eliza, you can directly use the Hedera SDK:

```javascript
// src/hedera/HederaClient.js
const { 
  Client, 
  AccountBalanceQuery,
  TokenInfoQuery
} = require('@hashgraph/sdk');

class HederaClient {
  constructor() {
    // Initialize client based on environment variables
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;
    const network = process.env.HEDERA_NETWORK || 'testnet';
    
    if (!accountId || !privateKey) {
      throw new Error('Hedera account ID and private key must be provided');
    }
    
    this.client = Client.forName(network);
    this.client.setOperator(accountId, privateKey);
  }

  async getAccountBalance(accountId) {
    const query = new AccountBalanceQuery()
      .setAccountId(accountId);
    
    const accountBalance = await query.execute(this.client);
    return accountBalance;
  }

  async getTokenInfo(tokenId) {
    const query = new TokenInfoQuery()
      .setTokenId(tokenId);
    
    const tokenInfo = await query.execute(this.client);
    return tokenInfo;
  }

  // Add more Hedera interaction methods as needed
}

module.exports = new HederaClient();
```

## Conclusion

By following this guide, you should be able to:

1. Set up the StakeMate backend with proper Hedera integration
2. Configure and use Eliza for enhanced blockchain interactions  
3. Consume the REST API from your frontend application
4. Implement direct Hedera SDK integration when needed

For more details on specific Hedera functionalities, refer to the Hedera AI Agent Workshop and official Hedera documentation.