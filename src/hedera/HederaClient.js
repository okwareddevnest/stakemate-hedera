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
  Hbar,
  TokenCreateTransaction,
  TokenUpdateTransaction,
  TokenMintTransaction,
  TokenType,
  TokenSupplyType
} = require('@hashgraph/sdk');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Client for direct Hedera network operations
 */
class HederaClient {
  constructor() {
    this.isConfigured = false;
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
      
      // Early validation of credentials
      if (!accountId || !privateKey) {
        console.warn('Hedera credentials not provided. HederaClient will be in limited mode.');
        this.isConfigured = false;
        this.network = network;
        return;
      }
      
      // Basic format validation
      if (!accountId.match(/^\d+\.\d+\.\d+$/)) {
        console.warn(`Invalid account ID format: ${accountId}. Expected format: 0.0.0`);
        this.isConfigured = false;
        this.network = network;
        return;
      }
      
      if (!privateKey || privateKey.length < 10) {
        console.warn('Invalid private key format or length');
        this.isConfigured = false;
        this.network = network;
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
          console.warn(`Invalid network: ${network}. Must be 'mainnet', 'testnet', or 'previewnet'. Defaulting to testnet.`);
          client = Client.forTestnet();
          break;
      }
      
      try {
        // Set the operator account ID and private key
        client.setOperator(accountId, privateKey);
        
        this.client = client;
        this.accountId = accountId;
        this.privateKey = privateKey;
        this.network = network;
        this.isConfigured = true;
        
        console.log(`HederaClient initialized for ${network} with account ${accountId}`);
      } catch (error) {
        console.error('Error setting Hedera client operator:', error);
        this.isConfigured = false;
        this.network = network;
      }
    } catch (error) {
      console.error('Error initializing HederaClient:', error);
      this.isConfigured = false;
    }
  }
  
  /**
   * Validates if the client is properly configured
   */
  validateConfiguration() {
    if (!this.isConfigured) {
      // Instead of throwing an error, return a failed state
      return {
        success: false,
        error: 'HederaClient is not properly configured. Please check your environment variables.'
      };
    }
    return { success: true };
  }

  /**
   * Get HBAR balance for a specific account
   * 
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account balance information
   */
  async getAccountBalance(accountId) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const query = new AccountBalanceQuery()
        .setAccountId(accountId);
      
      const balance = await query.execute(this.client);
      
      return {
        success: true,
        hbars: balance.hbars.toString(),
        tokens: balance.tokens.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting balance for account ${accountId}:`, error);
      return {
        success: false, 
        error: `Error getting balance for account ${accountId}: ${error.message}`
      };
    }
  }

  /**
   * Get token info for a specific token
   * 
   * @param {string} tokenId - Hedera token ID
   * @returns {Promise<object>} Token information
   */
  async getTokenInfo(tokenId) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const query = new TokenInfoQuery()
        .setTokenId(tokenId);
      
      const tokenInfo = await query.execute(this.client);
      
      return {
        success: true,
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
      return {
        success: false, 
        error: `Error getting info for token ${tokenId}: ${error.message}`
      };
    }
  }

  /**
   * Get account info
   * 
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account information
   */
  async getAccountInfo(accountId) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const query = new AccountInfoQuery()
        .setAccountId(accountId);
      
      const accountInfo = await query.execute(this.client);
      
      return {
        success: true,
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
      return {
        success: false, 
        error: `Error getting info for account ${accountId}: ${error.message}`
      };
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
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const query = new TokenBalanceQuery()
        .setAccountId(accountId)
        .setTokenId(tokenId);
      
      const tokenBalance = await query.execute(this.client);
      
      return {
        success: true,
        tokenId: tokenId,
        accountId: accountId,
        balance: tokenBalance.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting token ${tokenId} balance for account ${accountId}:`, error);
      return {
        success: false, 
        error: `Error getting token ${tokenId} balance for account ${accountId}: ${error.message}`
      };
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
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      // Convert string IDs to object IDs
      const account = AccountId.fromString(accountId);
      const token = TokenId.fromString(tokenId);
      
      // Create the token associate transaction
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(account)
        .setTokenIds([token])
        .freezeWith(this.client)
        .sign(PrivateKey.fromString(this.privateKey));
      
      // Submit the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      const txId = txResponse.transactionId.toString();
      const network = this.network.toLowerCase();
      const explorerUrl = network === 'mainnet' 
        ? `https://hashscan.io/mainnet/tx/${txId}` 
        : `https://hashscan.io/${network}/tx/${txId}`;
        
      return {
        success: true,
        status: receipt.status.toString(),
        accountId: accountId,
        tokenId: tokenId,
        transactionId: txId,
        explorerUrl: explorerUrl
      };
    } catch (error) {
      console.error(`Error associating token ${tokenId} with account ${accountId}:`, error);
      return {
        success: false, 
        error: `Error associating token ${tokenId} with account ${accountId}: ${error.message}`
      };
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
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      // Create the transfer transaction
      const transferTx = new TransferTransaction()
        .addHbarTransfer(this.accountId, Hbar.fromString(`-${amount}`))
        .addHbarTransfer(recipientId, Hbar.fromString(`${amount}`))
        .freezeWith(this.client);
        
      // Sign with the client's private key
      const signedTx = await transferTx.sign(PrivateKey.fromString(this.privateKey));
      
      // Submit the transaction
      const txResponse = await signedTx.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      const txId = txResponse.transactionId.toString();
      const network = this.network.toLowerCase();
      const explorerUrl = network === 'mainnet' 
        ? `https://hashscan.io/mainnet/tx/${txId}` 
        : `https://hashscan.io/${network}/tx/${txId}`;
        
      return {
        success: true,
        status: receipt.status.toString(),
        amount: amount.toString(),
        recipientId: recipientId,
        senderId: this.accountId,
        transactionId: txId,
        explorerUrl: explorerUrl
      };
    } catch (error) {
      console.error(`Error transferring ${amount} HBAR to account ${recipientId}:`, error);
      return {
        success: false,
        error: `Error transferring ${amount} HBAR to account ${recipientId}: ${error.message}`
      };
    }
  }

  /**
   * Transfer tokens from the client's account to another account
   * 
   * @param {string} tokenId - Token ID to transfer
   * @param {string} recipientId - Recipient's Hedera account ID
   * @param {number} amount - Amount of tokens to transfer
   * @returns {Promise<object>} Transaction receipt
   */
  async transferTokens(tokenId, recipientId, amount) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      // Create the transfer transaction
      const transferTx = new TransferTransaction()
        .addTokenTransfer(tokenId, this.accountId, -amount)
        .addTokenTransfer(tokenId, recipientId, amount)
        .freezeWith(this.client);
        
      // Sign with the client's private key
      const signedTx = await transferTx.sign(PrivateKey.fromString(this.privateKey));
      
      // Submit the transaction
      const txResponse = await signedTx.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      const txId = txResponse.transactionId.toString();
      const network = this.network.toLowerCase();
      const explorerUrl = network === 'mainnet' 
        ? `https://hashscan.io/mainnet/tx/${txId}` 
        : `https://hashscan.io/${network}/tx/${txId}`;
        
      return {
        success: true,
        status: receipt.status.toString(),
        amount: amount.toString(),
        tokenId: tokenId,
        recipientId: recipientId,
        senderId: this.accountId,
        transactionId: txId,
        explorerUrl: explorerUrl
      };
    } catch (error) {
      console.error(`Error transferring ${amount} of token ${tokenId} to account ${recipientId}:`, error);
      return {
        success: false,
        error: `Error transferring ${amount} of token ${tokenId} to account ${recipientId}: ${error.message}`
      };
    }
  }
  
  /**
   * Create a fungible token
   * 
   * @param {object} tokenData - Token data
   * @returns {Promise<object>} Transaction result
   */
  async createToken(tokenData) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const {
        name,
        symbol,
        decimals = 0,
        initialSupply = 0,
        supplyKey = false,
        adminKey = false,
        metadataKey = false,
        memo = null,
        metadata = null
      } = tokenData;
      
      // Set up the transaction
      let transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(this.accountId)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Infinite);
        
      // Add keys if requested
      if (supplyKey) {
        transaction = transaction.setSupplyKey(PrivateKey.fromString(this.privateKey));
      }
      
      if (adminKey) {
        transaction = transaction.setAdminKey(PrivateKey.fromString(this.privateKey));
      }
      
      if (metadataKey) {
        transaction = transaction.setTokenMetadataKey(PrivateKey.fromString(this.privateKey));
      }
      
      // Set memo if provided
      if (memo) {
        transaction = transaction.setTokenMemo(memo);
      }
      
      // Set metadata if provided
      if (metadata) {
        transaction = transaction.setTokenMetadata(Buffer.from(metadata));
      }
      
      // Freeze and sign
      const freezeTx = await transaction.freezeWith(this.client);
      const signedTx = await freezeTx.sign(PrivateKey.fromString(this.privateKey));
      
      // Execute
      const txResponse = await signedTx.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      const tokenId = receipt.tokenId.toString();
      const txId = txResponse.transactionId.toString();
      const network = this.network.toLowerCase();
      const explorerUrl = network === 'mainnet' 
        ? `https://hashscan.io/mainnet/tx/${txId}` 
        : `https://hashscan.io/${network}/tx/${txId}`;
        
      return {
        success: true,
        tokenId: tokenId,
        name: name,
        symbol: symbol,
        decimals: decimals,
        initialSupply: initialSupply,
        supplyKey: supplyKey,
        adminKey: adminKey,
        metadataKey: metadataKey,
        memo: memo,
        metadata: metadata,
        transactionId: txId,
        explorerUrl: explorerUrl
      };
    } catch (error) {
      console.error(`Error creating token ${tokenData.name}:`, error);
      return {
        success: false,
        error: `Error creating token ${tokenData.name}: ${error.message}`
      };
    }
  }
  
  /**
   * Mint additional tokens (requires supply key)
   * 
   * @param {string} tokenId - Token ID to mint
   * @param {number} amount - Amount to mint
   * @returns {Promise<object>} Transaction result
   */
  async mintTokens(tokenId, amount) {
    const validation = this.validateConfiguration();
    if (!validation.success) {
      return validation;
    }
    
    try {
      const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .freezeWith(this.client)
        .sign(PrivateKey.fromString(this.privateKey));
        
      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      const txId = txResponse.transactionId.toString();
      const network = this.network.toLowerCase();
      const explorerUrl = network === 'mainnet' 
        ? `https://hashscan.io/mainnet/tx/${txId}` 
        : `https://hashscan.io/${network}/tx/${txId}`;
        
      return {
        success: true,
        tokenId: tokenId,
        amount: amount,
        status: receipt.status.toString(),
        transactionId: txId,
        explorerUrl: explorerUrl
      };
    } catch (error) {
      console.error(`Error minting ${amount} tokens for ${tokenId}:`, error);
      return {
        success: false,
        error: `Error minting ${amount} tokens for ${tokenId}: ${error.message}`
      };
    }
  }
}

// Create a singleton instance
const hederaClient = new HederaClient();

module.exports = hederaClient; 