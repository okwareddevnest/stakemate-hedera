const HederaClient = require('../hedera/HederaClient');
const { validationResult } = require('express-validator');

/**
 * Controller for direct Hedera operations
 */
class DirectHederaController {
  /**
   * Get HBAR balance for a specific account
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getAccountBalance(req, res) {
    try {
      const { accountId } = req.params;
      
      if (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0' 
        });
      }
      
      const balance = await HederaClient.getAccountBalance(accountId);
      
      return res.status(200).json({
        success: true,
        data: balance
      });
    } catch (error) {
      console.error('Error in getAccountBalance:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching account balance'
      });
    }
  }
  
  /**
   * Get detailed account information
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getAccountInfo(req, res) {
    try {
      const { accountId } = req.params;
      
      if (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0' 
        });
      }
      
      const accountInfo = await HederaClient.getAccountInfo(accountId);
      
      return res.status(200).json({
        success: true,
        data: accountInfo
      });
    } catch (error) {
      console.error('Error in getAccountInfo:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching account info'
      });
    }
  }
  
  /**
   * Get token information
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getTokenInfo(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      const tokenInfo = await HederaClient.getTokenInfo(tokenId);
      
      return res.status(200).json({
        success: true,
        data: tokenInfo
      });
    } catch (error) {
      console.error('Error in getTokenInfo:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching token info'
      });
    }
  }
  
  /**
   * Get token balance for a specific account
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getTokenBalance(req, res) {
    try {
      const { accountId, tokenId } = req.params;
      
      if (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0' 
        });
      }
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      const tokenBalance = await HederaClient.getTokenBalance(accountId, tokenId);
      
      return res.status(200).json({
        success: true,
        data: tokenBalance
      });
    } catch (error) {
      console.error('Error in getTokenBalance:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching token balance'
      });
    }
  }
  
  /**
   * Associate a token with an account
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async associateToken(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { accountId, tokenId } = req.body;
      
      if (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0' 
        });
      }
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      const result = await HederaClient.associateToken(accountId, tokenId);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in associateToken:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error associating token'
      });
    }
  }
  
  /**
   * Transfer HBAR to another account
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async transferHbar(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { recipientId, amount } = req.body;
      
      if (!recipientId || !recipientId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid recipient ID format. Expected format: 0.0.0' 
        });
      }
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Amount must be a positive number' 
        });
      }
      
      const result = await HederaClient.transferHbar(recipientId, parseFloat(amount));
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in transferHbar:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error transferring HBAR'
      });
    }
  }
  
  /**
   * Transfer tokens to another account
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async transferTokens(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { tokenId, recipientId, amount } = req.body;
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      if (!recipientId || !recipientId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid recipient ID format. Expected format: 0.0.0' 
        });
      }
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Amount must be a positive number' 
        });
      }
      
      const result = await HederaClient.transferTokens(tokenId, recipientId, parseInt(amount));
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in transferTokens:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error transferring tokens'
      });
    }
  }
  
  /**
   * Check if direct Hedera client is properly configured
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  getClientStatus(req, res) {
    try {
      // Get client status
      const status = {
        isConfigured: HederaClient.isConfigured || false,
        accountId: HederaClient.isConfigured ? HederaClient.accountId : null,
        network: process.env.HEDERA_NETWORK || 'testnet',
        timestamp: new Date().toISOString()
      };
      
      return res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error in getClientStatus:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error checking client status'
      });
    }
  }
}

module.exports = new DirectHederaController(); 