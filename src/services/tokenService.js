const HederaClient = require('../hedera/HederaClient');
const elizaService = require('./elizaService');
const TokenAnalytics = require('../utils/TokenAnalytics');

/**
 * Service for handling tokenized infrastructure projects
 */
class TokenService {
  constructor() {
    this.cache = {
      tokenInfo: new Map(),
      holders: new Map()
    };
    
    // Cache expiration time (10 minutes)
    this.cacheExpiration = 10 * 60 * 1000;
  }
  
  /**
   * Create a new token for an infrastructure project
   * 
   * @param {Object} project - Project data
   * @returns {Promise<Object>} - Token creation result
   */
  async createProjectToken(project) {
    try {
      // Validate project data
      if (!project || !project.name || !project.symbol) {
        throw new Error('Invalid project data. Name and symbol are required.');
      }
      
      // Prepare token creation parameters
      const tokenParams = {
        name: project.name,
        symbol: project.symbol,
        decimals: project.tokenDecimals || 8,
        initialSupply: project.initialSupply || Math.floor(project.totalBudget / 10),
        memo: `Infrastructure token for ${project.name} project in ${project.location || 'Kenya'}`
      };
      
      let result;
      if (HederaClient.isConfigured) {
        try {
          const client = new HederaClient();
          result = await client.createToken(tokenParams);
          
          if (!result || !result.tokenId) {
            throw new Error('Token creation failed');
          }
          
          return {
            tokenId: result.tokenId,
            symbol: tokenParams.symbol,
            name: tokenParams.name,
            initialSupply: tokenParams.initialSupply,
            decimals: tokenParams.decimals,
            projectId: project.id,
            created: new Date().toISOString(),
            transactionId: result.transactionId,
            status: result.status
          };
        } catch (err) {
          console.error('Error in direct token creation:', err);
          throw err;
        }
      } else {
        throw new Error('Hedera client not configured');
      }
    } catch (error) {
      console.error('Error creating project token:', error);
      throw error;
    }
  }
  
  /**
   * Get token information with caching
   * 
   * @param {string} tokenId - Hedera token ID
   * @returns {Promise<Object>} - Token information
   */
  async getTokenInfo(tokenId) {
    try {
      // Check cache first
      const cacheKey = `token_${tokenId}`;
      const cachedInfo = this.cache.tokenInfo.get(cacheKey);
      
      if (cachedInfo && Date.now() - cachedInfo.timestamp < this.cacheExpiration) {
        return cachedInfo.data;
      }
      
      // Not in cache or expired, fetch new data
      let tokenInfo;
      
      // Try direct client first
      if (HederaClient.isConfigured) {
        try {
          tokenInfo = await HederaClient.getTokenInfo(tokenId);
        } catch (err) {
          console.log('Falling back to Eliza service for token info');
        }
      }
      
      // Fall back to Eliza if direct client failed or is not configured
      if (!tokenInfo) {
        tokenInfo = await elizaService.getTokenInfo(tokenId);
      }
      
      // Cache the result
      this.cache.tokenInfo.set(cacheKey, {
        timestamp: Date.now(),
        data: tokenInfo
      });
      
      return tokenInfo;
    } catch (error) {
      console.error(`Error getting info for token ${tokenId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all holders of a specific token with caching
   * 
   * @param {string} tokenId - Hedera token ID
   * @returns {Promise<Array>} - List of token holders
   */
  async getTokenHolders(tokenId) {
    try {
      // Check cache first
      const cacheKey = `holders_${tokenId}`;
      const cachedHolders = this.cache.holders.get(cacheKey);
      
      if (cachedHolders && Date.now() - cachedHolders.timestamp < this.cacheExpiration) {
        return cachedHolders.data;
      }
      
      // Not in cache or expired, fetch new data
      const holders = await elizaService.getTokenHolders(tokenId);
      
      // Cache the result
      this.cache.holders.set(cacheKey, {
        timestamp: Date.now(),
        data: holders
      });
      
      return holders;
    } catch (error) {
      console.error(`Error getting holders for token ${tokenId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a token distribution plan for an infrastructure project
   * 
   * @param {Object} project - Infrastructure project data
   * @returns {Object} - Token distribution plan
   */
  createDistributionPlan(project) {
    try {
      if (!project || !project.totalBudget) {
        throw new Error('Invalid project data. Total budget is required.');
      }
      
      // Calculate total token supply based on project budget
      const totalSupply = Math.floor(project.totalBudget / 10);
      
      // Create a standard distribution plan
      return {
        projectId: project.id,
        tokenSymbol: project.symbol,
        totalSupply,
        distribution: {
          investors: {
            percentage: 70,
            amount: Math.floor(totalSupply * 0.7),
            description: 'Allocation for public investors'
          },
          government: {
            percentage: 15,
            amount: Math.floor(totalSupply * 0.15),
            description: 'Allocation for government backing and regulatory compliance'
          },
          projectReserve: {
            percentage: 10,
            amount: Math.floor(totalSupply * 0.1),
            description: 'Reserved for project contingencies and future expansions'
          },
          community: {
            percentage: 5,
            amount: Math.floor(totalSupply * 0.05),
            description: 'Allocation for community development and engagement'
          }
        },
        vestingSchedule: {
          investors: 'No lock-up period, tradeable immediately',
          government: '12 month lock-up, released quarterly thereafter',
          projectReserve: '24 month lock-up, released based on milestone completion',
          community: '6 month cliff, released monthly over 18 months'
        },
        initialPrice: 10, // Standard initial price in local currency
        targetMarketCap: project.totalBudget,
        created: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating token distribution plan:', error);
      throw error;
    }
  }
  
  /**
   * Simulate token valuation over time
   * 
   * @param {Object} project - Infrastructure project data
   * @param {number} months - Number of months to simulate
   * @returns {Object} - Token valuation projection
   */
  simulateTokenValuation(project, months = 36) {
    return TokenAnalytics.predictTokenPrice(project, months);
  }
  
  /**
   * Calculate token metrics for a project
   * 
   * @param {Object} project - Infrastructure project data
   * @returns {Object} - Token metrics
   */
  calculateTokenMetrics(project) {
    return TokenAnalytics.calculateTokenMetrics(project);
  }
  
  /**
   * Associate a token with a user's account
   * 
   * @param {string} accountId - User's Hedera account ID
   * @param {string} tokenId - Hedera token ID to associate
   * @returns {Promise<Object>} - Association result
   */
  async associateToken(accountId, tokenId) {
    try {
      // Try direct client first
      let result;
      if (HederaClient.isConfigured) {
        try {
          result = await HederaClient.associateToken(accountId, tokenId);
        } catch (err) {
          console.log('Falling back to Eliza service for token association');
        }
      }
      
      // Fall back to Eliza if direct client failed or is not configured
      if (!result) {
        result = await elizaService.associateToken(accountId, tokenId);
      }
      
      return result;
    } catch (error) {
      console.error(`Error associating token ${tokenId} with account ${accountId}:`, error);
      throw error;
    }
  }
  
  /**
   * Transfer tokens to an investor
   * 
   * @param {string} recipientId - Recipient's Hedera account ID
   * @param {string} tokenId - Hedera token ID
   * @param {number} amount - Amount of tokens to transfer
   * @returns {Promise<Object>} - Transfer result
   */
  async transferTokens(recipientId, tokenId, amount) {
    try {
      // Try direct client first
      let result;
      if (HederaClient.isConfigured) {
        try {
          result = await HederaClient.transferTokens(tokenId, recipientId, amount);
        } catch (err) {
          console.log('Falling back to Eliza service for token transfer');
        }
      }
      
      // Fall back to Eliza if direct client failed or is not configured
      if (!result) {
        result = await elizaService.transferTokens(tokenId, recipientId, amount);
      }
      
      return result;
    } catch (error) {
      console.error(`Error transferring tokens ${tokenId} to account ${recipientId}:`, error);
      throw error;
    }
  }
  
  /**
   * Process a simulated investment
   * 
   * @param {Object} user - User data
   * @param {Object} project - Project data
   * @param {number} amount - Investment amount
   * @returns {Object} - Investment simulation result
   */
  async processInvestment(user, project, amount) {
    try {
      if (!user || !project || !amount) {
        throw new Error('Invalid investment parameters');
      }

      if (!project.tokenId) {
        throw new Error('Project token not created yet');
      }

      const hbarCost = amount * 0.9; // 90% of investment in HBAR
      const tokenAmount = Math.floor(amount * 100); // Calculate token amount

      if (HederaClient.isConfigured) {
        const client = new HederaClient();
        
        // First transfer HBAR from investor to project treasury
        const hbarTransfer = await client.transferHBAR(
          user.hederaAccountId,
          project.treasuryAccountId,
          hbarCost
        );

        if (!hbarTransfer.success) {
          throw new Error('HBAR transfer failed');
        }

        // Then transfer tokens from treasury to investor
        const tokenTransfer = await client.transferToken(
          project.tokenId,
          project.treasuryAccountId,
          user.hederaAccountId,
          tokenAmount
        );

        if (!tokenTransfer.success) {
          throw new Error('Token transfer failed');
        }

        // Record the investment
        const investment = {
          userId: user.id,
          projectId: project.id,
          tokenSymbol: project.symbol,
          investmentAmount: amount,
          hbarCost,
          tokenAmount,
          projectedAnnualReturn: project.expectedReturn,
          maturityPeriod: project.maturityPeriod,
          projectedTotalReturn: amount * (1 + (project.expectedReturn / 100) * project.maturityPeriod),
          timestamp: new Date().toISOString(),
          status: 'completed',
          transactionIds: {
            hbar: hbarTransfer.transactionId,
            token: tokenTransfer.transactionId
          }
        };

        return investment;
      } else {
        throw new Error('Hedera client not configured');
      }
    } catch (error) {
      console.error('Error processing investment:', error);
      throw error;
    }
  }
}

module.exports = new TokenService(); 