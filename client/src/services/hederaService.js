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
      let transaction = new TopicCreateTransaction()
        .setTopicMemo(memo);

      if (submitKeyRequired) {
        transaction.setSubmitKey(this.operatorKey.publicKey);
      }

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      const topicId = receipt.topicId.toString();

      return {
        success: true,
        topicId,
        transactionId: txResponse.transactionId.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to create topic:', error);
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
   * @param {number} amount - Amount to transfer in HBAR
   * @param {string} memo - Transaction memo
   * @returns {Promise<object>} Transaction receipt
   */
  async transferHBAR(fromAccountId, toAccountId, amount, memo = '') {
    try {
      const client = await this.ensureInitialized();

      const transaction = await new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(fromAccountId), new Hbar(-amount))
        .addHbarTransfer(AccountId.fromString(toAccountId), new Hbar(amount))
        .setTransactionMemo(memo)
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
      console.error('Failed to transfer HBAR:', error);
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
      const client = await this.ensureInitialized();

      const transaction = await new TokenCreateTransaction()
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

      const signedTx = await transaction.sign(this.operatorKey);
      const txResponse = await signedTx.execute(client);
      const receipt = await txResponse.getReceipt(client);
      const tokenId = receipt.tokenId.toString();

      return {
        success: true,
        tokenId,
        transactionId: txResponse.transactionId.toString(),
        status: receipt.status.toString(),
        explorerUrl: this.getExplorerUrl(txResponse.transactionId.toString())
      };
    } catch (error) {
      console.error('Failed to create token:', error);
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
      const client = await this.ensureInitialized();

      // First, ensure the receiving account is associated with the token
      try {
        const associateTransaction = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(toAccountId))
          .setTokenIds([tokenId])
          .freezeWith(client);

        const signedAssociateTx = await associateTransaction.sign(this.operatorKey);
        await signedAssociateTx.execute(client);
      } catch (error) {
        // If the token is already associated, this will fail but we can continue
        console.log('Note: Token may already be associated with the account or other error:', error.message);
      }

      // Now transfer the tokens
      const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, AccountId.fromString(fromAccountId), -amount)
        .addTokenTransfer(tokenId, AccountId.fromString(toAccountId), amount)
        .setTransactionMemo(memo)
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
      console.error('Failed to transfer tokens:', error);
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