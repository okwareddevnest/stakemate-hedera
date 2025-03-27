const express = require('express');
const { body } = require('express-validator');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

/**
 * @route   POST /api/tokens/projects/:projectId
 * @desc    Create a new token for a project
 * @access  Public
 */
router.post('/projects/:projectId', tokenController.createToken);

/**
 * @route   GET /api/tokens/:tokenId/info
 * @desc    Get token information
 * @access  Public
 */
router.get('/:tokenId/info', tokenController.getTokenInfo);

/**
 * @route   GET /api/tokens/:tokenId/holders
 * @desc    Get token holders
 * @access  Public
 */
router.get('/:tokenId/holders', tokenController.getTokenHolders);

/**
 * @route   GET /api/tokens/projects/:projectId/distribution
 * @desc    Create a token distribution plan
 * @access  Public
 */
router.get('/projects/:projectId/distribution', tokenController.createDistributionPlan);

/**
 * @route   GET /api/tokens/projects/:projectId/valuation
 * @desc    Simulate token valuation
 * @access  Public
 */
router.get('/projects/:projectId/valuation', tokenController.simulateTokenValuation);

/**
 * @route   GET /api/tokens/projects/:projectId/metrics
 * @desc    Calculate token metrics
 * @access  Public
 */
router.get('/projects/:projectId/metrics', tokenController.calculateTokenMetrics);

/**
 * @route   POST /api/tokens/associate
 * @desc    Associate a token with a user's account
 * @access  Public
 */
router.post(
  '/associate',
  [
    body('accountId').notEmpty().withMessage('Account ID is required'),
    body('tokenId').notEmpty().withMessage('Token ID is required')
  ],
  tokenController.associateToken
);

/**
 * @route   POST /api/tokens/users/:userId/projects/:projectId/invest
 * @desc    Process a simulated investment
 * @access  Public
 */
router.post(
  '/users/:userId/projects/:projectId/invest',
  [
    body('amount').notEmpty().withMessage('Amount is required')
  ],
  tokenController.processInvestment
);

/**
 * @route   POST /api/tokens/transfer
 * @desc    Transfer tokens to an investor
 * @access  Public
 */
router.post(
  '/transfer',
  [
    body('tokenId').notEmpty().withMessage('Token ID is required'),
    body('recipientId').notEmpty().withMessage('Recipient ID is required'),
    body('amount').notEmpty().withMessage('Amount is required')
  ],
  tokenController.transferTokens
);

module.exports = router; 