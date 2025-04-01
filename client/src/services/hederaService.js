import { AccountId, Client, PrivateKey, TransferTransaction, TokenCreateTransaction, TokenInfoQuery, TokenAssociateTransaction, TokenBurnTransaction, TokenGrantKycTransaction, TokenMintTransaction, Hbar, TokenWipeTransaction, TokenFreezeTransaction, TokenUnfreezeTransaction, TokenType, TokenSupplyType, TopicCreateTransaction, TopicMessageSubmitTransaction, TopicInfoQuery, TopicMessageQuery, ContractCreateTransaction, ContractExecuteTransaction, ContractFunctionParameters, FileCreateTransaction, FileAppendTransaction, AccountBalanceQuery, AccountInfoQuery, TransactionRecordQuery, Status } from '@hashgraph/sdk';

/**
 * Enhanced service for interacting with the Hedera network
 */
class HederaService {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
    this.mirrorNodeUrl = 'https://testnet.mirrornode.hedera.com';
    this.network = 'testnet';
    this.isInitialized = false;
  }

  /**
   * Initialize Hedera client with credentials
   */
  async init() {
    if (this.isInitialized) return this.client;

    try {
      // Get client configuration from environment variables
      const myAccountId = import.meta.env.VITE_HEDERA_OPERATOR_ID;
      const myPrivateKey = import.meta.env.VITE_HEDERA_OPERATOR_KEY;
      const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';

      if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables for Hedera client are missing");
      }

      // Create client instance based on network
      switch (network.toLowerCase()) {
        case 'mainnet':
          this.client = Client.forMainnet();
          this.mirrorNodeUrl = 'https://mainnet-public.mirrornode.hedera.com';
          break;
        case 'testnet':
          this.client = Client.forTestnet();
          this.mirrorNodeUrl = 'https://testnet.mirrornode.hedera.com';
          break;
        case 'previewnet':
          this.client = Client.forPreviewnet();
          this.mirrorNodeUrl = 'https://previewnet.mirrornode.hedera.com';
          break;
        default:
          throw new Error(`Invalid network type: ${network}`);
      }

      this.operatorId = AccountId.fromString(myAccountId);
      this.operatorKey = PrivateKey.fromString(myPrivateKey);
      this.network = network;

      // Set the operator account ID and private key
      this.client.setOperator(this.operatorId, this.operatorKey);
      
      this.isInitialized = true;
      console.log(`HederaService initialized for ${network} with account ${myAccountId}`);
      return this.client;
    } catch (error) {
      console.error('Failed to initialize HederaService:', error);
      throw error;
    }
  }

  /**
   * Ensure client is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.client;
  }

  /**
   * Create a new topic
   * @param {string} memo - Topic memo
   * @param {boolean} [submitKeyRequired=false] - Whether to require submitKey for messages
   * @returns {Promise<object>} Topic creation result
   */
  async createTopic(memo, submitKeyRequired = false) {
    await this.ensureInitialized();

    try {
      // Check if we're using simulation mode
      const useSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (useSimulation) {
        console.log('SIMULATION MODE: Creating topic without actual Hedera transaction');
        
        // Generate a simulated topic ID
        const operatorId = this.operatorId ? this.operatorId.toString() : '0.0.5781013';
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const simulatedTopicId = `0.0.${randomSuffix}`;
        
        return {
          success: true,
          topicId: simulatedTopicId,
          transactionId: `simulated-topic-creation-${Date.now()}`,
          explorerUrl: `https://hashscan.io/${this.network}/topic/${simulatedTopicId}`,
          simulated: true
        };
      }

      // If not in simulation mode, proceed with actual topic creation
      let transaction = new TopicCreateTransaction()
        .setTopicMemo(memo);

      if (submitKeyRequired) {
        transaction.setSubmitKey(this.operatorKey.publicKey);
      }

      console.log('Creating topic transaction...');
      const txResponse = await transaction.execute(this.client);
      console.log('Topic transaction executed, getting receipt...');
      const receipt = await txResponse.getReceipt(this.client);
      const topicId = receipt.topicId.toString();
      console.log(`Topic created successfully with ID: ${topicId}`);

      return {
        success: true,
        topicId,
        transactionId: txResponse.transactionId.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to create topic:', error);
      
      // Check if we should fall back to simulation
      const fallbackToSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (fallbackToSimulation) {
        console.log('Falling back to simulation mode due to error');
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const simulatedTopicId = `0.0.${randomSuffix}`;
        
        return {
          success: true,
          topicId: simulatedTopicId,
          transactionId: `simulated-topic-creation-${Date.now()}`,
          explorerUrl: `https://hashscan.io/${this.network || 'testnet'}/topic/${simulatedTopicId}`,
          simulated: true,
          originalError: error.message
        };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit message to a topic
   * @param {string} topicId - Topic ID
   * @param {string} message - Message to submit
   * @returns {Promise<object>} Message submission result
   */
  async submitMessage(topicId, message) {
    await this.ensureInitialized();

    try {
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to submit message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get topic messages from mirror node
   * @param {string} topicId - Topic ID
   * @param {object} options - Query options
   * @returns {Promise<object>} Topic messages
   */
  async getTopicMessages(topicId, options = {}) {
    await this.ensureInitialized();

    try {
      const { limit = 100, order = 'desc', timestamp } = options;
      let url = `${this.mirrorNodeUrl}/api/v1/topics/${topicId}/messages`;

      // Add query parameters
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (order) params.append('order', order);
      if (timestamp) params.append('timestamp', timestamp);

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Mirror node request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        messages: data.messages.map(msg => ({
          consensusTimestamp: msg.consensus_timestamp,
          contents: msg.message,
          sequenceNumber: msg.sequence_number,
          runningHash: msg.running_hash,
          payer: msg.payer_account_id
        }))
      };
    } catch (error) {
      console.error('Failed to get topic messages:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get token information from mirror node
   * @param {string} tokenId - Token ID
   * @returns {Promise<object>} Token information
   */
  async getTokenInfo(tokenId) {
    await this.ensureInitialized();

    try {
      // First try the mirror node
      const mirrorResponse = await fetch(`${this.mirrorNodeUrl}/api/v1/tokens/${tokenId}`);
      
      if (mirrorResponse.ok) {
        const mirrorData = await mirrorResponse.json();
        return {
          success: true,
          data: {
            name: mirrorData.name,
            symbol: mirrorData.symbol,
            totalSupply: mirrorData.total_supply,
            decimals: mirrorData.decimals,
            treasury: mirrorData.treasury_account_id,
            adminKey: mirrorData.admin_key,
            supplyType: mirrorData.supply_type,
            tokenType: mirrorData.token_type,
            memo: mirrorData.memo,
            circulatingSupply: mirrorData.circulating_supply,
            customFees: mirrorData.custom_fees,
            pauseStatus: mirrorData.pause_status,
            ledgerTimestamp: mirrorData.modified_timestamp
          }
        };
      }

      // Fallback to direct query if mirror node fails
      const query = new TokenInfoQuery()
        .setTokenId(tokenId);

      const tokenInfo = await query.execute(this.client);
      return {
        success: true,
        data: {
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          totalSupply: tokenInfo.totalSupply.toString(),
          decimals: tokenInfo.decimals,
          treasury: tokenInfo.treasuryAccountId.toString(),
          adminKey: tokenInfo.adminKey ? tokenInfo.adminKey.toString() : null,
          supplyType: tokenInfo.supplyType.toString(),
          tokenType: tokenInfo.tokenType.toString(),
          memo: tokenInfo.tokenMemo
        }
      };
    } catch (error) {
      console.error('Failed to get token info:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get transaction details from mirror node
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<object>} Transaction details
   */
  async getTransactionDetails(transactionId) {
    await this.ensureInitialized();

    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/transactions/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Mirror node request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          consensusTimestamp: data.consensus_timestamp,
          validStartTimestamp: data.valid_start_timestamp,
          charged: data.charged_tx_fee,
          memoBase64: data.memo_base64,
          result: data.result,
          scheduled: data.scheduled,
          transactionHash: data.transaction_hash,
          transfers: data.transfers,
          tokenTransfers: data.token_transfers
        }
      };
    } catch (error) {
      console.error('Failed to get transaction details:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get explorer URL for transaction
   * @param {string} transactionId - Transaction ID
   * @returns {string} Explorer URL
   */
  getExplorerUrl(transactionId) {
    return `https://hashscan.io/${this.network}/tx/${transactionId}`;
  }

  /**
   * Get account balance
   * @param {string} accountId - Hedera account ID
   * @returns {Promise<object>} Account balance info
   */
  async getAccountBalance(accountId) {
    try {
      const client = await this.ensureInitialized();
      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(client);
        
      return {
        success: true,
        hbars: balance.hbars.toString(),
        tokens: balance.tokens._map
      };
    } catch (error) {
      console.error('Failed to get account balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Transfer HBAR between accounts
   * @param {string} fromAccountId - Sender account ID
   * @param {string} toAccountId - Recipient account ID
   * @param {number} amount - Amount to transfer
   * @param {string} memo - Transaction memo
   * @returns {Promise<object>} Transaction receipt
   */
  async transferHBAR(fromAccountId, toAccountId, amount, memo = '') {
    try {
      // Validate input parameters
      if (!fromAccountId || typeof fromAccountId !== 'string') {
        throw new Error('Invalid sender account ID');
      }
      
      if (!toAccountId || typeof toAccountId !== 'string') {
        throw new Error('Invalid recipient account ID');
      }
      
      if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      // Check if we're using simulation mode
      const useSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (useSimulation) {
        console.log(`SIMULATION MODE: Transferring ${amount} HBAR from ${fromAccountId} to ${toAccountId}`);
        
        return {
          success: true,
          transactionId: `simulated-hbar-transfer-${Date.now()}`,
          status: 'SUCCESS',
          fromAccount: fromAccountId,
          toAccount: toAccountId,
          amount: amount,
          simulated: true,
          explorerUrl: `https://hashscan.io/${this.network}/transaction/simulated-${Date.now()}`
        };
      }

      // If not in simulation mode, proceed with actual transfer
      const client = await this.ensureInitialized();

      // Parse account IDs safely
      console.log(`Transferring ${amount} HBAR from ${fromAccountId} to ${toAccountId}`);
      const senderAccount = AccountId.fromString(fromAccountId);
      const recipientAccount = AccountId.fromString(toAccountId);
      
      console.log('Creating HBAR transfer transaction...');
      const transaction = await new TransferTransaction()
        .addHbarTransfer(senderAccount, new Hbar(-amount))
        .addHbarTransfer(recipientAccount, new Hbar(amount))
        .setTransactionMemo(memo)
        .freezeWith(client);

      console.log('Signing HBAR transfer transaction...');
      const signedTx = await transaction.sign(this.operatorKey);
      console.log('Executing HBAR transfer transaction...');
      const txResponse = await signedTx.execute(client);
      console.log('Getting HBAR transfer receipt...');
      const receipt = await txResponse.getReceipt(client);
      console.log(`HBAR transfer completed with status: ${receipt.status}`);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to transfer HBAR:', error);
      
      // Check if we should fall back to simulation
      const fallbackToSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (fallbackToSimulation) {
        console.log('Falling back to simulation mode due to error');
        
        return {
          success: true,
          transactionId: `simulated-hbar-transfer-fallback-${Date.now()}`,
          status: 'SUCCESS',
          fromAccount: fromAccountId,
          toAccount: toAccountId,
          amount: amount,
          simulated: true,
          originalError: error.message,
          explorerUrl: `https://hashscan.io/${this.network || 'testnet'}/transaction/simulated-${Date.now()}`
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Create a new token on Hedera
   * @param {object} tokenParams - Token creation parameters
   * @returns {Promise<object>} Token creation receipt
   */
  async createToken(tokenParams) {
    try {
      // Check if we're using simulation mode
      const useSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (useSimulation) {
        console.log('SIMULATION MODE: Creating token without actual Hedera transaction');
        
        // Generate a simulated token ID using the treasury account ID
        const treasuryId = this.operatorId.toString();
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const simulatedTokenId = `${treasuryId.split('.')[0]}.${treasuryId.split('.')[1]}.${randomSuffix}`;
        
        return {
          success: true,
          tokenId: simulatedTokenId,
          transactionId: `simulated-token-creation-${Date.now()}`,
          status: 'SUCCESS',
          explorerUrl: `https://hashscan.io/${this.network}/token/${simulatedTokenId}`,
          simulated: true
        };
      }

      // If not in simulation mode, proceed with actual token creation
      const client = await this.ensureInitialized();

      // Log key information for debugging
      console.log('Creating token with the following parameters:');
      console.log('- Name:', tokenParams.name);
      console.log('- Symbol:', tokenParams.symbol);
      console.log('- Treasury Account:', this.operatorId.toString());
      console.log('- Network:', this.network);

      const transaction = new TokenCreateTransaction()
        .setTokenName(tokenParams.name)
        .setTokenSymbol(tokenParams.symbol)
        .setDecimals(tokenParams.decimals || 8)
        .setInitialSupply(tokenParams.initialSupply || 0)
        .setTreasuryAccountId(this.operatorId)
        .setAdminKey(this.operatorKey.publicKey)
        .setSupplyKey(this.operatorKey.publicKey)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTokenMemo(tokenParams.memo || '')
        .freezeWith(client);

      console.log('Transaction created, now signing...');
      const signedTx = await transaction.sign(this.operatorKey);
      console.log('Transaction signed, now executing...');
      const txResponse = await signedTx.execute(client);
      console.log('Transaction executed, getting receipt...');
      const receipt = await txResponse.getReceipt(client);
      const tokenId = receipt.tokenId.toString();
      console.log(`Token created successfully with ID: ${tokenId}`);

      return {
        success: true,
        tokenId,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to create token:', error);
      
      // Check if we should fall back to simulation
      const fallbackToSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (fallbackToSimulation) {
        console.log('Falling back to simulation mode due to error');
        const treasuryId = this.operatorId ? this.operatorId.toString() : '0.0.5781013';
        const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const simulatedTokenId = `${treasuryId.split('.')[0]}.${treasuryId.split('.')[1]}.${randomSuffix}`;
        
        return {
          success: true,
          tokenId: simulatedTokenId,
          transactionId: `simulated-token-creation-${Date.now()}`,
          status: 'SUCCESS',
          explorerUrl: `https://hashscan.io/${this.network || 'testnet'}/token/${simulatedTokenId}`,
          simulated: true,
          originalError: error.message
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Associate a token with an account
   * @param {string} accountId - Account ID
   * @param {string} tokenId - Token ID
   * @returns {Promise<object>} Transaction receipt
   */
  async associateToken(accountId, tokenId) {
    try {
      const client = await this.ensureInitialized();

      const transaction = new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(accountId))
        .setTokenIds([tokenId])
        .freezeWith(client);

      const signedTx = await transaction.sign(this.operatorKey);
      const txResponse = await signedTx.execute(client);
      const receipt = await txResponse.getReceipt(client);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to associate token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Mint additional tokens
   * @param {string} tokenId - Token ID
   * @param {number} amount - Amount to mint
   * @returns {Promise<object>} Transaction receipt
   */
  async mintToken(tokenId, amount) {
    try {
      const client = await this.ensureInitialized();

      const transaction = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .freezeWith(client);

      const signedTx = await transaction.sign(this.operatorKey);
      const txResponse = await signedTx.execute(client);
      const receipt = await txResponse.getReceipt(client);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Burn tokens
   * @param {string} tokenId - Token ID
   * @param {number} amount - Amount to burn
   * @returns {Promise<object>} Transaction receipt
   */
  async burnToken(tokenId, amount) {
    try {
      const client = await this.ensureInitialized();

      const transaction = new TokenBurnTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .freezeWith(client);

      const signedTx = await transaction.sign(this.operatorKey);
      const txResponse = await signedTx.execute(client);
      const receipt = await txResponse.getReceipt(client);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to burn tokens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Transfer tokens between accounts
   * @param {string} tokenId - Token ID
   * @param {string} fromAccountId - Sender account ID
   * @param {string} toAccountId - Recipient account ID
   * @param {number} amount - Amount to transfer
   * @param {string} memo - Transaction memo
   * @returns {Promise<object>} Transaction receipt
   */
  async transferToken(tokenId, fromAccountId, toAccountId, amount, memo = '') {
    try {
      console.log(`Transferring ${amount} tokens of ${tokenId} from ${fromAccountId} to ${toAccountId}`);
      
      if (!tokenId || !fromAccountId || !toAccountId) {
        throw new Error('Missing required parameters for token transfer');
      }
      
      // Check if we're using simulation mode
      const useSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (useSimulation) {
        console.log(`SIMULATION MODE: Transferring ${amount} tokens of ${tokenId} from ${fromAccountId} to ${toAccountId}`);
        
        return {
          success: true,
          transactionId: `simulated-token-transfer-${Date.now()}`,
          status: 'SUCCESS',
          fromAccount: fromAccountId,
          toAccount: toAccountId,
          tokenId: tokenId,
          amount: amount,
          simulated: true,
          explorerUrl: `https://hashscan.io/${this.network}/transaction/simulated-${Date.now()}`
        };
      }
      
      const client = await this.ensureInitialized();

      // Only proceed if we're transferring from the operator account or have an explicit privateKey
      if (fromAccountId !== this.operatorId.toString()) {
        console.warn('Warning: Attempting to transfer tokens from an account that may not be the operator account');
        console.warn('This will likely fail unless the account exactly matches the configured operator ID');
      }

      // First, ensure the receiving account is associated with the token
      try {
        console.log(`Checking if account ${toAccountId} is associated with token ${tokenId}...`);
        
        const associateTransaction = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(toAccountId))
          .setTokenIds([tokenId])
          .freezeWith(client);

        console.log('Signing token association transaction...');
        const signedAssociateTx = await associateTransaction.sign(this.operatorKey);
        console.log('Executing token association transaction...');
        await signedAssociateTx.execute(client);
        console.log('Token association completed or already exists');
      } catch (error) {
        // If the token is already associated, this will fail but we can continue
        console.log('Note: Token may already be associated with the account or other error:', error.message);
      }

      // Now transfer the tokens
      console.log(`Creating token transfer transaction...`);
      const transaction = new TransferTransaction()
        .addTokenTransfer(tokenId, AccountId.fromString(fromAccountId), -amount)
        .addTokenTransfer(tokenId, AccountId.fromString(toAccountId), amount)
        .setTransactionMemo(memo)
        .freezeWith(client);

      console.log('Signing token transfer transaction...');
      const signedTx = await transaction.sign(this.operatorKey);
      console.log('Executing token transfer transaction...');
      const txResponse = await signedTx.execute(client);
      console.log('Getting token transfer receipt...');
      const receipt = await txResponse.getReceipt(client);
      console.log(`Token transfer completed with status: ${receipt.status}`);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to transfer tokens:', error);
      
      // Check if we should fall back to simulation
      const fallbackToSimulation = import.meta.env.VITE_ENABLE_SIMULATION === 'true';
      
      if (fallbackToSimulation) {
        console.log('Falling back to simulation mode due to error');
        
        return {
          success: true,
          transactionId: `simulated-token-transfer-fallback-${Date.now()}`,
          status: 'SUCCESS',
          fromAccount: fromAccountId,
          toAccount: toAccountId,
          tokenId: tokenId,
          amount: amount,
          simulated: true,
          originalError: error.message,
          explorerUrl: `https://hashscan.io/${this.network || 'testnet'}/transaction/simulated-${Date.now()}`
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Verify a transaction on the Hedera network
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<object>} Transaction info
   */
  async verifyTransaction(transactionId) {
    try {
      await this.ensureInitialized();
      
      // Get transaction details from Hedera Mirror Node API
      const mirrorNodeUrl = `${this.mirrorNodeUrl}/api/v1/transactions/${transactionId}`;
      
      const response = await fetch(mirrorNodeUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve transaction: ${response.statusText}`);
      }
      
      const transactionData = await response.json();
      
      return {
        success: true,
        data: transactionData
      };
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create a single instance to export
const hederaService = new HederaService();
export default hederaService; 