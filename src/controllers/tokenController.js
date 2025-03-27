const tokenService = require('../services/tokenService');
const stakemateAgent = require('../agent/StakemateAgent');
const { validationResult } = require('express-validator');

/**
 * Controller for tokenized infrastructure projects
 */
class TokenController {
  /**
   * Create a new token for a project
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
      
      const { projectId } = req.params;
      
      // Get project information
      const project = await stakemateAgent.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      // Create token
      const result = await tokenService.createProjectToken(project);
      
      // Update project with token information
      project.tokenId = result.tokenId;
      await stakemateAgent.updateProject(projectId, project);
      
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
      
      const tokenInfo = await tokenService.getTokenInfo(tokenId);
      
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
   * Get token holders
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async getTokenHolders(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId || !tokenId.match(/^\d+\.\d+\.\d+$/)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid token ID format. Expected format: 0.0.0' 
        });
      }
      
      const holders = await tokenService.getTokenHolders(tokenId);
      
      return res.status(200).json({
        success: true,
        data: holders
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
   * Create a token distribution plan
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async createDistributionPlan(req, res) {
    try {
      const { projectId } = req.params;
      
      // Get project information
      const project = await stakemateAgent.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      const distributionPlan = tokenService.createDistributionPlan(project);
      
      return res.status(200).json({
        success: true,
        data: distributionPlan
      });
    } catch (error) {
      console.error('Error in createDistributionPlan:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error creating distribution plan'
      });
    }
  }
  
  /**
   * Simulate token valuation
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async simulateTokenValuation(req, res) {
    try {
      const { projectId } = req.params;
      const { months } = req.query;
      
      // Get project information
      const project = await stakemateAgent.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      const valuation = tokenService.simulateTokenValuation(
        project, 
        months ? parseInt(months) : 36
      );
      
      return res.status(200).json({
        success: true,
        data: valuation
      });
    } catch (error) {
      console.error('Error in simulateTokenValuation:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error simulating token valuation'
      });
    }
  }
  
  /**
   * Calculate token metrics
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async calculateTokenMetrics(req, res) {
    try {
      const { projectId } = req.params;
      
      // Get project information
      const project = await stakemateAgent.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      const metrics = tokenService.calculateTokenMetrics(project);
      
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error in calculateTokenMetrics:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error calculating token metrics'
      });
    }
  }
  
  /**
   * Associate a token with a user's account
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
      
      const result = await tokenService.associateToken(accountId, tokenId);
      
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
   * Process a simulated investment
   * 
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async processInvestment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
      
      const { userId, projectId } = req.params;
      const { amount } = req.body;
      
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Amount must be a positive number' 
        });
      }
      
      // Get user and project information
      const user = await stakemateAgent.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }
      
      const project = await stakemateAgent.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ 
          success: false, 
          error: 'Project not found' 
        });
      }
      
      const investment = await tokenService.processInvestment(
        user, 
        project, 
        parseFloat(amount)
      );
      
      return res.status(200).json({
        success: true,
        data: investment
      });
    } catch (error) {
      console.error('Error in processInvestment:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Error processing investment'
      });
    }
  }
  
  /**
   * Transfer tokens to an investor
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
      
      const result = await tokenService.transferTokens(
        recipientId, 
        tokenId, 
        parseInt(amount)
      );
      
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

module.exports = new TokenController(); 