require('dotenv').config();
const {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenType,
  TokenInfoQuery,
  AccountBalanceQuery,
  TokenAssociateTransaction,
  TransferTransaction,
  TokenMintTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicInfoQuery,
  TokenRelationship,
} = require('@hashgraph/sdk');

/**
 * HederaAgentKit - A wrapper for Hedera functionality used by the Stakemate agent
 * Implements HTS for tokens, HCS for consensus, and immutable logging
 */
class HederaAgentKit {
  constructor() {
    // Initialize Hedera client based on environment variables
    const operatorId = process.env.HEDERA_ACCOUNT_ID;
    const operatorKey = process.env.HEDERA_PRIVATE_KEY;
    const network = process.env.HEDERA_NETWORK || 'testnet';

    if (!operatorId || !operatorKey) {
      throw new Error(
        'Environment variables HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY must be present'
      );
    }

    // Create Hedera client
    this.client = network === 'mainnet' 
      ? Client.forMainnet() 
      : Client.forTestnet();
    
    // Set operator account and private key
    this.client.setOperator(operatorId, operatorKey);
  }

  /**
   * Create a new token for an infrastructure project
   * @param {Object} projectData Project data to tokenize
   * @returns {Object} Token information including token ID
   */
  async createInfrastructureToken(projectData) {
    try {
      // Validate required project data
      if (!projectData.name || !projectData.symbol) {
        throw new Error('Project token requires name and symbol');
      }

      // Create a token memo with limited length (max 100 chars to be safe)
      let tokenMemo = `Infrastructure token for ${projectData.name}`;
      if (projectData.location) {
        const potentialMemo = `${tokenMemo} in ${projectData.location}`;
        // Only add location if the total length is still under limit
        if (potentialMemo.length <= 100) {
          tokenMemo = potentialMemo;
        }
      }
      
      // Ensure memo doesn't exceed max length
      if (tokenMemo.length > 100) {
        tokenMemo = tokenMemo.substring(0, 97) + '...';
      }

      // Create a token with project metadata
      const transaction = await new TokenCreateTransaction()
        .setTokenName(projectData.name)
        .setTokenSymbol(projectData.symbol)
        .setDecimals(projectData.decimals || 8)
        .setInitialSupply(projectData.initialSupply || 1000000)
        .setTreasuryAccountId(this.client.operatorAccountId)
        .setAdminKey(this.client.operatorPublicKey)
        .setSupplyKey(this.client.operatorPublicKey)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTokenMemo(tokenMemo);

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const tokenId = receipt.tokenId.toString();

      console.log(`Created token with ID: ${tokenId}`);
      return { 
        tokenId, 
        name: projectData.name, 
        symbol: projectData.symbol 
      };
    } catch (error) {
      console.error('Error creating infrastructure token:', error);
      throw error;
    }
  }

  /**
   * Get token information including metadata
   * @param {string} tokenId The token ID to query
   * @returns {Object} Token information and metadata
   */
  async getTokenInfo(tokenId) {
    try {
      const query = new TokenInfoQuery().setTokenId(tokenId);
      const tokenInfo = await query.execute(this.client);
      
      // Parse metadata from memo
      let metadata = {};
      if (tokenInfo.tokenMemo) {
        try {
          metadata = JSON.parse(tokenInfo.tokenMemo);
        } catch (e) {
          metadata = { memo: tokenInfo.tokenMemo };
        }
      }
      
      return { 
        ...tokenInfo,
        metadata
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  /**
   * Create a topic for consensus messaging related to an infrastructure project
   * @param {Object} topicData Topic metadata
   * @returns {Object} Topic information including topic ID
   */
  async createProjectTopic(topicData) {
    try {
      // Validate required topic data
      if (!topicData.projectName || !topicData.tokenId) {
        throw new Error('Topic requires projectName and tokenId');
      }

      // Create a new topic for this project
      const transaction = new TopicCreateTransaction()
        .setTopicMemo(`Project updates for ${topicData.projectName} (${topicData.tokenId})`)
        .setSubmitKey(this.client.operatorPublicKey);

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const topicId = receipt.topicId.toString();

      console.log(`Created topic with ID: ${topicId}`);
      return { 
        topicId, 
        projectName: topicData.projectName, 
        tokenId: topicData.tokenId 
      };
    } catch (error) {
      console.error('Error creating project topic:', error);
      throw error;
    }
  }

  /**
   * Submit a message to a topic (for project updates, milestones, etc.)
   * @param {string} topicId Topic ID
   * @param {Object} message Message data to submit
   * @returns {Object} Transaction information
   */
  async submitProjectUpdate(topicId, message) {
    try {
      // Validate input
      if (!topicId || !message) {
        throw new Error('Topic ID and message are required');
      }

      // Create a simplified message if it's an object
      let messageStr;
      if (typeof message === 'object') {
        // Extract essential information for a more compact message
        const essentialInfo = {
          type: message.type || 'UPDATE',
          projectId: message.projectId,
          timestamp: message.timestamp || new Date().toISOString(),
          summary: message.summary || (message.updates ? `Updates to ${Object.keys(message.updates).join(', ')}` : 'Project update')
        };
        messageStr = JSON.stringify(essentialInfo);
      } else {
        messageStr = message.toString();
      }

      // Limit message length to avoid MEMO_TOO_LONG error (max 100 chars to be safe)
      if (messageStr.length > 100) {
        messageStr = messageStr.substring(0, 97) + '...';
      }

      // Submit message to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageStr);

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      console.log(`Submitted message to topic ${topicId}: ${receipt.status}`);
      return { 
        status: receipt.status.toString(),
        topicId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error submitting project update:', error);
      throw error;
    }
  }

  /**
   * Record investment recommendation on Hedera for immutability
   * @param {Object} recommendation Investment recommendation data
   * @returns {Object} Transaction information
   */
  async recordRecommendation(recommendation) {
    try {
      // Validate input
      if (!recommendation.userId || !recommendation.projectTokenId) {
        throw new Error('User ID and project token ID are required');
      }

      // Create a recommendation topic if not provided
      if (!recommendation.topicId) {
        const createTopicTx = new TopicCreateTransaction()
          .setTopicMemo('Stakemate Investment Recommendations');
        
        const txResponse = await createTopicTx.execute(this.client);
        const receipt = await txResponse.getReceipt(this.client);
        recommendation.topicId = receipt.topicId.toString();
      }

      // Add timestamp if not present
      if (!recommendation.timestamp) {
        recommendation.timestamp = new Date().toISOString();
      }

      // Create simplified recommendation message
      const simplifiedRecommendation = {
        userId: recommendation.userId,
        projectId: recommendation.projectTokenId,
        score: recommendation.score || 0,
        timestamp: recommendation.timestamp
      };

      // Convert to string and limit length
      let messageStr = JSON.stringify(simplifiedRecommendation);
      if (messageStr.length > 100) {
        messageStr = messageStr.substring(0, 97) + '...';
      }

      // Submit recommendation to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(recommendation.topicId)
        .setMessage(messageStr);

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      console.log(`Recorded recommendation: ${receipt.status}`);
      return { 
        status: receipt.status.toString(),
        topicId: recommendation.topicId,
        timestamp: recommendation.timestamp
      };
    } catch (error) {
      console.error('Error recording recommendation:', error);
      throw error;
    }
  }

  /**
   * Simulate an investment in a project token
   * @param {Object} investmentData Investment simulation data
   * @returns {Object} Transaction information
   */
  async simulateInvestment(investmentData) {
    try {
      // Validate input
      if (!investmentData.userId || !investmentData.tokenId || !investmentData.amount) {
        throw new Error('User ID, token ID, and amount are required');
      }

      // Record the investment simulation on Hedera
      const topicId = investmentData.topicId || process.env.INVESTMENT_SIMULATION_TOPIC;
      
      if (!topicId) {
        throw new Error('Investment simulation topic ID is required');
      }

      // Add timestamp if not present
      if (!investmentData.timestamp) {
        investmentData.timestamp = new Date().toISOString();
      }

      // Create simplified investment record
      const simplifiedRecord = {
        userId: investmentData.userId,
        tokenId: investmentData.tokenId,
        amount: investmentData.amount,
        timestamp: investmentData.timestamp,
        type: 'SIM'
      };

      // Convert to string and limit length
      let messageStr = JSON.stringify(simplifiedRecord);
      if (messageStr.length > 100) {
        messageStr = messageStr.substring(0, 97) + '...';
      }

      // Submit investment record to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageStr);

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      console.log(`Recorded simulated investment: ${receipt.status}`);
      return { 
        status: receipt.status.toString(),
        topicId,
        investment: simplifiedRecord
      };
    } catch (error) {
      console.error('Error simulating investment:', error);
      throw error;
    }
  }

  /**
   * Check account balance
   * @param {string} accountId The account ID to check
   * @returns {Object} Account balance information
   */
  async checkBalance(accountId) {
    try {
      const balanceQuery = new AccountBalanceQuery()
        .setAccountId(accountId || this.client.operatorAccountId);

      const balance = await balanceQuery.execute(this.client);
      return balance;
    } catch (error) {
      console.error('Error checking balance:', error);
      throw error;
    }
  }
}

module.exports = HederaAgentKit; 