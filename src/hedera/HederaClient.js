const { 
  Client, 
  PrivateKey,
  AccountBalanceQuery,
  TokenInfoQuery,
  TokenBalanceQuery,
  AccountId,
  TokenId,
  AccountInfoQuery,
  TokenAssociateTransaction,
  TransferTransaction,
  Hbar
} = require('@hashgraph/sdk');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Client for direct Hedera network operations
 */
class HederaClient {
  constructor() {
    this.initialize();
  }

  /**
   * Initialize Hedera client with credentials from environment variables
   */
  initialize() {
    try {
      // Get Hedera credentials from environment
      const accountId = process.env.HEDERA_ACCOUNT_ID;
      const privateKey = process.env.HEDERA_PRIVATE_KEY;
      const network = process.env.HEDERA_NETWORK || 'testnet';
      
      if (!accountId || !privateKey) {
        console.warn('Hedera credentials not provided. HederaClient will be in limited mode.');
        this.isConfigured = false;
        return;
      }
      
      // Create and configure Hedera client
      let client;
      switch (network.toLowerCase()) {
        case 'mainnet':
          client = Client.forMainnet();
          break;
        case 'testnet':
          client = Client.forTestnet();
          break;
        case 'previewnet':
          client = Client.forPreviewnet();
          break;
        default:
          throw new Error(`Invalid network: ${network}. Must be 'mainnet', 'testnet', or 'previewnet'`);
      }
      
      // Set the operator account ID and private key
      client.setOperator(accountId, privateKey);
      
      this.client = client;
      this.accountId = accountId;
      this.privateKey = privateKey;
      this.isConfigured = true;
      
      console.log(`HederaClient initialized for ${network} with account ${accountId}`);
    } catch (error) {
      console.error('Error initializing HederaClient:', error);
      this.isConfigured = false;
      throw error;
    }
  }
  
  /**
   * Validates if the client is properly configured
   */
  validateConfiguration() {
    if (!this.isConfigured) {
      throw new Error('HederaClient is not properly configured. Please check your environment variables.');
    }
  }

  /**
   * Get HBAR balance for a specific account
   * 
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account balance information
   */
  async getAccountBalance(accountId) {
    this.validateConfiguration();
    
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(accountId);
      
      const balance = await query.execute(this.client);
      
      return {
        hbars: balance.hbars.toString(),
        tokens: balance.tokens.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting balance for account ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Get token info for a specific token
   * 
   * @param {string} tokenId - Hedera token ID
   * @returns {Promise<object>} Token information
   */
  async getTokenInfo(tokenId) {
    this.validateConfiguration();
    
    try {
      const query = new TokenInfoQuery()
        .setTokenId(tokenId);
      
      const tokenInfo = await query.execute(this.client);
      
      return {
        tokenId: tokenInfo.tokenId.toString(),
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        totalSupply: tokenInfo.totalSupply.toString(),
        treasuryAccountId: tokenInfo.treasuryAccountId.toString(),
        adminKey: tokenInfo.adminKey ? tokenInfo.adminKey.toString() : null,
        supplyType: tokenInfo.supplyType.toString(),
        maxSupply: tokenInfo.maxSupply.toString(),
        isDeleted: tokenInfo.isDeleted
      };
    } catch (error) {
      console.error(`Error getting info for token ${tokenId}:`, error);
      throw error;
    }
  }

  /**
   * Get account info
   * 
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account information
   */
  async getAccountInfo(accountId) {
    this.validateConfiguration();
    
    try {
      const query = new AccountInfoQuery()
        .setAccountId(accountId);
      
      const accountInfo = await query.execute(this.client);
      
      return {
        accountId: accountInfo.accountId.toString(),
        balance: accountInfo.balance.toString(),
        receiveRecordThreshold: accountInfo.receiveRecordThreshold.toString(),
        sendRecordThreshold: accountInfo.sendRecordThreshold.toString(),
        proxyAccountId: accountInfo.proxyAccountId ? accountInfo.proxyAccountId.toString() : null,
        proxyReceived: accountInfo.proxyReceived.toString(),
        key: accountInfo.key.toString(),
        tokenRelationships: accountInfo.tokenRelationships
      };
    } catch (error) {
      console.error(`Error getting info for account ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Get specific token balance for a particular account
   * 
   * @param {string} accountId - Hedera account ID
   * @param {string} tokenId - Hedera token ID
   * @returns {Promise<object>} Token balance information
   */
  async getTokenBalance(accountId, tokenId) {
    this.validateConfiguration();
    
    try {
      const query = new TokenBalanceQuery()
        .setAccountId(accountId)
        .setTokenId(tokenId);
      
      const tokenBalance = await query.execute(this.client);
      
      return {
        tokenId: tokenId,
        accountId: accountId,
        balance: tokenBalance.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting token ${tokenId} balance for account ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Associate a token with an account (required before transfers)
   * 
   * @param {string} accountId - Hedera account ID to associate token with
   * @param {string} tokenId - Hedera token ID to associate
   * @returns {Promise<object>} Transaction receipt
   */
  async associateToken(accountId, tokenId) {
    this.validateConfiguration();
    
    try {
      // Convert string IDs to object IDs
      const account = AccountId.fromString(accountId);
      const token = TokenId.fromString(tokenId);
      
      // Create the token associate transaction
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(account)
        .setTokenIds([token])
        .freezeWith(this.client)
        .sign(this.privateKey);
      
      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        status: receipt.status.toString(),
        accountId: accountId,
        tokenId: tokenId,
        transactionId: txResponse.transactionId.toString()
      };
    } catch (error) {
      console.error(`Error associating token ${tokenId} with account ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Transfer HBAR from the client's account to another account
   * 
   * @param {string} recipientId - Recipient's Hedera account ID
   * @param {number} amount - Amount of HBAR to transfer
   * @returns {Promise<object>} Transaction receipt
   */
  async transferHbar(recipientId, amount) {
    this.validateConfiguration();
    
    try {
      // Create the transfer transaction
      const transaction = await new TransferTransaction()
        .addHbarTransfer(this.accountId, new Hbar(-amount))
        .addHbarTransfer(recipientId, new Hbar(amount))
        .freezeWith(this.client)
        .sign(this.privateKey);
      
      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        status: receipt.status.toString(),
        senderAccountId: this.accountId,
        recipientAccountId: recipientId,
        amount: amount.toString(),
        transactionId: txResponse.transactionId.toString()
      };
    } catch (error) {
      console.error(`Error transferring ${amount} HBAR to account ${recipientId}:`, error);
      throw error;
    }
  }

  /**
   * Transfer tokens from the client's account to another account
   * 
   * @param {string} tokenId - Hedera token ID
   * @param {string} recipientId - Recipient's Hedera account ID
   * @param {number} amount - Amount of tokens to transfer
   * @returns {Promise<object>} Transaction receipt
   */
  async transferTokens(tokenId, recipientId, amount) {
    this.validateConfiguration();
    
    try {
      // Create the transfer transaction
      const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, this.accountId, -amount)
        .addTokenTransfer(tokenId, recipientId, amount)
        .freezeWith(this.client)
        .sign(this.privateKey);
      
      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      return {
        status: receipt.status.toString(),
        tokenId: tokenId,
        senderAccountId: this.accountId,
        recipientAccountId: recipientId,
        amount: amount.toString(),
        transactionId: txResponse.transactionId.toString()
      };
    } catch (error) {
      console.error(`Error transferring ${amount} of token ${tokenId} to account ${recipientId}:`, error);
      throw error;
    }
  }
}

module.exports = new HederaClient(); 