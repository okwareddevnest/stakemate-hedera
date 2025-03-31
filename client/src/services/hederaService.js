import { AccountId, Client, PrivateKey, TransferTransaction, TokenCreateTransaction, TokenInfoQuery, TokenAssociateTransaction, TokenBurnTransaction, TokenGrantKycTransaction, TokenMintTransaction, Hbar, TokenWipeTransaction, TokenFreezeTransaction, TokenUnfreezeTransaction } from '@hashgraph/sdk';

/**
 * Service for interacting with the Hedera network
 */
const hederaService = {
  /**
   * Initialize a Hedera client using environment variables
   * @returns {Client} Hedera client instance
   */
  initClient: () => {
    try {
      const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';
      
      // Create client based on network type
      let client;
      if (network === 'mainnet') {
        client = Client.forMainnet();
      } else if (network === 'testnet') {
        client = Client.forTestnet();
      } else if (network === 'previewnet') {
        client = Client.forPreviewnet();
      }
      
      // Set the operator account (if available in env)
      const accountId = import.meta.env.VITE_HEDERA_ACCOUNT_ID;
      const privateKey = import.meta.env.VITE_HEDERA_PRIVATE_KEY;
      
      if (accountId && privateKey) {
        client.setOperator(
          AccountId.fromString(accountId),
          PrivateKey.fromString(privateKey)
        );
      }
      
      return client;
    } catch (error) {
      console.error('Failed to initialize Hedera client:', error);
      throw error;
    }
  },
  
  /**
   * Get account balance
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account balance info
   */
  getAccountBalance: async (accountId) => {
    try {
      const client = hederaService.initClient();
      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
        
      return {
        hbars: balance.hbars.toString(),
        tokens: balance.tokens._map
      };
    } catch (error) {
      console.error('Failed to get account balance:', error);
      throw error;
    }
  },
  
  /**
   * Transfer HBAR between accounts
   * @param {string} fromAccountId - Sender account ID
   * @param {string} toAccountId - Recipient account ID
   * @param {number} amount - Amount to transfer in HBAR
   * @param {string} memo - Transaction memo
   * @returns {Promise<object>} Transaction receipt
   */
  transferHbar: async (fromAccountId, toAccountId, amount, memo = '') => {
    try {
      const client = hederaService.initClient();
      
      // Create the transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(fromAccountId, Hbar.fromTinybars(-amount * 100000000)) // Convert to tinybar
        .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount * 100000000))
        .setTransactionMemo(memo);
      
      // Sign and submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      return {
        status: receipt.status.toString(),
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to transfer HBAR:', error);
      throw error;
    }
  },
  
  /**
   * Create a new token on Hedera
   * @param {object} tokenParams - Token creation parameters
   * @returns {Promise<object>} Token creation receipt
   */
  createToken: async (tokenParams) => {
    try {
      const client = hederaService.initClient();
      const adminKey = PrivateKey.fromString(import.meta.env.VITE_HEDERA_PRIVATE_KEY);
      const treasuryId = AccountId.fromString(import.meta.env.VITE_HEDERA_ACCOUNT_ID);
      
      // Create the token creation transaction
      const transaction = new TokenCreateTransaction()
        .setTokenName(tokenParams.name)
        .setTokenSymbol(tokenParams.symbol)
        .setDecimals(tokenParams.decimals || 8)
        .setInitialSupply(tokenParams.initialSupply || 0)
        .setTreasuryAccountId(treasuryId)
        .setAdminKey(adminKey.publicKey)
        .setSupplyKey(adminKey.publicKey)
        .setMaxTransactionFee(new Hbar(30));
      
      // Submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      // Get the token ID
      const tokenId = receipt.tokenId.toString();
      
      return {
        status: receipt.status.toString(),
        tokenId: tokenId,
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to create token:', error);
      throw error;
    }
  },
  
  /**
   * Get token information
   * @param {string} tokenId - Token ID
   * @returns {Promise<object>} Token information
   */
  getTokenInfo: async (tokenId) => {
    try {
      const client = hederaService.initClient();
      
      // Create the token info query
      const query = new TokenInfoQuery()
        .setTokenId(tokenId);
      
      // Submit the query
      const tokenInfo = await query.execute(client);
      
      return {
        tokenId: tokenInfo.tokenId.toString(),
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        totalSupply: tokenInfo.totalSupply.toString(),
        treasury: tokenInfo.treasuryAccountId.toString(),
        adminKey: tokenInfo.adminKey ? tokenInfo.adminKey.toString() : null,
        supplyKey: tokenInfo.supplyKey ? tokenInfo.supplyKey.toString() : null,
        defaultFreeze: tokenInfo.defaultFreezeStatus,
        defaultKyc: tokenInfo.defaultKycStatus,
        isDeleted: tokenInfo.isDeleted
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      throw error;
    }
  },
  
  /**
   * Associate a token with an account
   * @param {string} accountId - Account ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<object>} Transaction receipt
   */
  associateToken: async (accountId, tokenId) => {
    try {
      const client = hederaService.initClient();
      
      // Create the token associate transaction
      const transaction = new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId]);
      
      // Submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      return {
        status: receipt.status.toString(),
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to associate token:', error);
      throw error;
    }
  },
  
  /**
   * Mint additional tokens
   * @param {string} tokenId - Token ID
   * @param {number} amount - Amount to mint
   * @returns {Promise<object>} Transaction receipt
   */
  mintToken: async (tokenId, amount) => {
    try {
      const client = hederaService.initClient();
      
      // Create the token mint transaction
      const transaction = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount);
      
      // Submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      return {
        status: receipt.status.toString(),
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      throw error;
    }
  },
  
  /**
   * Burn tokens
   * @param {string} tokenId - Token ID
   * @param {number} amount - Amount to burn
   * @returns {Promise<object>} Transaction receipt
   */
  burnToken: async (tokenId, amount) => {
    try {
      const client = hederaService.initClient();
      
      // Create the token burn transaction
      const transaction = new TokenBurnTransaction()
        .setTokenId(tokenId)
        .setAmount(amount);
      
      // Submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      return {
        status: receipt.status.toString(),
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to burn tokens:', error);
      throw error;
    }
  },
  
  /**
   * Transfer tokens between accounts
   * @param {string} tokenId - Token ID
   * @param {string} fromAccountId - Sender account ID
   * @param {string} toAccountId - Recipient account ID
   * @param {number} amount - Amount to transfer
   * @param {string} memo - Transaction memo
   * @returns {Promise<object>} Transaction receipt
   */
  transferToken: async (tokenId, fromAccountId, toAccountId, amount, memo = '') => {
    try {
      const client = hederaService.initClient();
      
      // Create the transfer transaction
      const transaction = new TransferTransaction()
        .addTokenTransfer(tokenId, fromAccountId, -amount)
        .addTokenTransfer(tokenId, toAccountId, amount)
        .setTransactionMemo(memo);
      
      // Submit the transaction
      const txResponse = await transaction.execute(client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(client);
      
      return {
        status: receipt.status.toString(),
        transactionId: txResponse.transactionId.toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      throw error;
    }
  },
  
  /**
   * Verify a transaction on the Hedera network
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<object>} Transaction info
   */
  verifyTransaction: async (transactionId) => {
    try {
      // Get transaction details from Hedera Mirror Node API
      // This would typically be implemented with a fetch to the mirror node
      // For this implementation, we're creating a placeholder for the API call
      
      const mirrorNodeUrl = `https://testnet.mirrornode.hedera.com/api/v1/transactions/${transactionId}`;
      
      const response = await fetch(mirrorNodeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve transaction: ${response.statusText}`);
      }
      
      const transactionData = await response.json();
      
      return transactionData;
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      throw error;
    }
  }
};

export default hederaService; 