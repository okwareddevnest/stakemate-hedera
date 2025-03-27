const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Service for interacting with the Eliza agent for Hedera operations
 */
class ElizaService {
  constructor() {
    this.apiUrl = process.env.ELIZA_API_URL || 'http://localhost:3001';
  }

  /**
   * Send a natural language prompt to Eliza
   * 
   * @param {string} prompt - The prompt to send to Eliza
   * @returns {Promise<object>} The response from Eliza
   */
  async sendPrompt(prompt) {
    try {
      console.log(`Sending prompt to Eliza: ${prompt}`);
      const response = await axios.post(`${this.apiUrl}/api/prompt`, { prompt });
      return response.data;
    } catch (error) {
      console.error('Error communicating with Eliza:', error.message);
      throw new Error(`Failed to communicate with Eliza: ${error.message}`);
    }
  }

  /**
   * Get HBAR balance for a Hedera account
   * 
   * @param {string} accountId - The Hedera account ID
   * @returns {Promise<object>} The HBAR balance
   */
  async getHbarBalance(accountId) {
    const prompt = `Show me HBAR balance of wallet ${accountId}`;
    return this.sendPrompt(prompt);
  }

  /**
   * Get token balance for a specific token and account
   * 
   * @param {string} accountId - The Hedera account ID
   * @param {string} tokenId - The token ID
   * @returns {Promise<object>} The token balance
   */
  async getTokenBalance(accountId, tokenId) {
    const prompt = `Show me balance of token ${tokenId} for wallet ${accountId}`;
    return this.sendPrompt(prompt);
  }

  /**
   * Get all token balances for an account
   * 
   * @param {string} accountId - The Hedera account ID (optional, if not provided will use Eliza's own account)
   * @returns {Promise<object>} All token balances
   */
  async getAllTokenBalances(accountId) {
    const prompt = accountId 
      ? `Show me the balances of all HTS tokens for wallet ${accountId}`
      : `Show me your HTS token balances`;
    return this.sendPrompt(prompt);
  }

  /**
   * Get all holders of a specific token
   * 
   * @param {string} tokenId - The token ID
   * @param {number} threshold - Minimum balance threshold (optional)
   * @returns {Promise<object>} Token holder information
   */
  async getTokenHolders(tokenId, threshold = 0) {
    let prompt = `Show me all holders of token ${tokenId}`;
    if (threshold > 0) {
      prompt += ` with balance greater than ${threshold}`;
    }
    return this.sendPrompt(prompt);
  }

  /**
   * Create a new fungible token
   * 
   * @param {object} tokenInfo - Token information
   * @returns {Promise<object>} Created token information
   */
  async createToken(tokenInfo) {
    const { name, symbol, initialSupply, decimals } = tokenInfo;
    const prompt = `Create a new token with name ${name}, symbol ${symbol}, initial supply ${initialSupply}, and ${decimals} decimals`;
    return this.sendPrompt(prompt);
  }

  /**
   * Transfer tokens from Eliza's account to another account
   * 
   * @param {string} receiverAccountId - Receiver account ID
   * @param {string} tokenId - Token ID
   * @param {number} amount - Amount to transfer
   * @returns {Promise<object>} Transfer result
   */
  async transferTokens(receiverAccountId, tokenId, amount) {
    const prompt = `Transfer ${amount} of token ${tokenId} to account ${receiverAccountId}`;
    return this.sendPrompt(prompt);
  }
}

module.exports = new ElizaService(); 