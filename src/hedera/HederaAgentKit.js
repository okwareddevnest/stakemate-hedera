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
    const operatorId = process.env.OPERATOR_ID;
    const operatorKey = process.env.OPERATOR_KEY;
    const network = process.env.HEDERA_NETWORK || 'testnet';

    if (!operatorId || !operatorKey) {
      throw new Error(
        'Environment variables OPERATOR_ID and OPERATOR_KEY must be present'
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
   * Create a new infrastructure project token
   * @param {Object} projectData Project metadata to include with the token
   * @returns {Object} Token information including token ID
   */
  async createInfrastructureToken(projectData) {
    try {
      // Validate required project data
      if (!projectData.name || !projectData.symbol || !projectData.description) {
        throw new Error('Token requires name, symbol, and description');
      }

      // Create the infrastructure token with rich metadata
      const transaction = new TokenCreateTransaction()
        .setTokenName(projectData.name)
        .setTokenSymbol(projectData.symbol)
        .setDecimals(projectData.decimals || 8)
        .setInitialSupply(projectData.initialSupply || 1000000)
        .setTreasuryAccountId(this.client.operatorAccountId)
        .setAdminKey(this.client.operatorPublicKey)
        .setSupplyKey(this.client.operatorPublicKey)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTokenMemo(JSON.stringify({
          description: projectData.description,
          location: projectData.location,
          type: projectData.type,
          esg: projectData.esgMetrics,
          timeline: projectData.timeline,
          website: projectData.website,
          risk: projectData.riskScore,
          regulator: projectData.regulator || 'CMA'
        }));

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
        .setTopicMemo(JSON.stringify({
          projectName: topicData.projectName,
          tokenId: topicData.tokenId,
          description: topicData.description || '',
          type: 'infrastructure-project',
          createdAt: new Date().toISOString()
        }))
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

      // Ensure message is a string
      const messageStr = typeof message === 'object' 
        ? JSON.stringify(message) 
        : message.toString();

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

      // Submit recommendation to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(recommendation.topicId)
        .setMessage(JSON.stringify(recommendation));

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

      // Create investment record
      const investmentRecord = {
        ...investmentData,
        type: 'INVESTMENT_SIMULATION',
        timestamp: investmentData.timestamp
      };

      // Submit investment record to topic
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(JSON.stringify(investmentRecord));

      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      console.log(`Recorded simulated investment: ${receipt.status}`);
      return { 
        status: receipt.status.toString(),
        topicId,
        investment: investmentRecord
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