const elizaService = require('../services/elizaService');
const { validationResult } = require('express-validator');

/**
 * Controller for Hedera operations through Eliza
 */
class HederaController {
  /**
   * Get HBAR balance for a specific account
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getHbarBalance(req, res) {
    try {
      const { accountId } = req.params;
      
      if (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0' 
        });
      }
      
      const result = await elizaService.getHbarBalance(accountId);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getHbarBalance:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching HBAR balance'
      });
    }
  }
  
  /**
   * Get token balance for a specific account and token
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
      
      const result = await elizaService.getTokenBalance(accountId, tokenId);
      
      return res.status(200).json({
        success: true,
        data: result
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
   * Get all token balances for an account
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getAllTokenBalances(req, res) {
    try {
      const { accountId } = req.params;
      
      // Allow special 'me' keyword to use Eliza's own account
      if (accountId !== 'me' && (!accountId || !accountId.match(/^\d+\.\d+\.\d+$/))) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid account ID format. Expected format: 0.0.0 or "me"' 
        });
      }
      
      // Use actual account ID if not 'me'
      const actualAccountId = accountId === 'me' ? null : accountId;
      const result = await elizaService.getAllTokenBalances(actualAccountId);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getAllTokenBalances:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching token balances'
      });
    }
  }
  
  /**
   * Get all holders of a specific token
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getTokenHolders(req, res) {
    try {
      const { tokenId } = req.params;
      const { threshold } = req.query;
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      const thresholdValue = threshold ? parseInt(threshold) : 0;
      const result = await elizaService.getTokenHolders(tokenId, thresholdValue);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getTokenHolders:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error fetching token holders'
      });
    }
  }
  
  /**
   * Create a new fungible token
   *
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async createToken(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { name, symbol, initialSupply, decimals = 2, memo } = req.body;
      
      const tokenInfo = {
        name,
        symbol,
        initialSupply: parseInt(initialSupply),
        decimals: parseInt(decimals),
        memo
      };
      
      const result = await elizaService.createToken(tokenInfo);
      
      return res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in createToken:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error creating token'
      });
    }
  }
  
  /**
   * Transfer tokens from Eliza's account to another account
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
      
      const { receiverId, tokenId, amount } = req.body;
      
      if (!receiverId || !receiverId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid receiver ID format. Expected format: 0.0.0' 
        });
      }
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Amount must be a positive number' 
        });
      }
      
      const result = await elizaService.transferTokens(receiverId, tokenId, parseInt(amount));
      
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
}

module.exports = new HederaController(); 