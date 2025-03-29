const express = require('express');
const { body } = require('express-validator');
const directHederaController = require('../controllers/directHederaController');

const router = express.Router();

/**
 * @route   GET /api/direct-hedera/status
 * @desc    Get direct Hedera client status
 * @access  Public
 */
router.get('/status', directHederaController.getClientStatus);

/**
 * @route   GET /api/direct-hedera/account/:accountId/balance
 * @desc    Get account HBAR balance
 * @access  Public
 */
router.get('/account/:accountId/balance', directHederaController.getAccountBalance);

/**
 * @route   GET /api/direct-hedera/account/:accountId/info
 * @desc    Get detailed account information
 * @access  Public
 */
router.get('/account/:accountId/info', directHederaController.getAccountInfo);

/**
 * @route   GET /api/direct-hedera/token/:tokenId/info
 * @desc    Get token information
 * @access  Public
 */
router.get('/token/:tokenId/info', directHederaController.getTokenInfo);

/**
 * @route   GET /api/direct-hedera/account/:accountId/token/:tokenId/balance
 * @desc    Get token balance for specific account
 * @access  Public
 */
router.get('/account/:accountId/token/:tokenId/balance', directHederaController.getTokenBalance);

/**
 * @route   POST /api/direct-hedera/token/associate
 * @desc    Associate a token with an account
 * @access  Public
 */
router.post(
  '/token/associate',
  [
    body('accountId').notEmpty().withMessage('Account ID is required'),
    body('tokenId').notEmpty().withMessage('Token ID is required')
  ],
  directHederaController.associateToken
);

/**
 * @route   POST /api/direct-hedera/hbar/transfer
 * @desc    Transfer HBAR to another account
 * @access  Public
 */
router.post(
  '/hbar/transfer',
  [
    body('recipientId').notEmpty().withMessage('Recipient ID is required'),
    body('amount').notEmpty().withMessage('Amount is required')
  ],
  directHederaController.transferHbar
);

/**
 * @route   POST /api/direct-hedera/token/transfer
 * @desc    Transfer tokens to another account
 * @access  Public
 */
router.post(
  '/token/transfer',
  [
    body('tokenId').notEmpty().withMessage('Token ID is required'),
    body('recipientId').notEmpty().withMessage('Recipient ID is required'),
    body('amount').notEmpty().withMessage('Amount is required')
  ],
  directHederaController.transferTokens
);

/**
 * @route   POST /api/direct-hedera/token/create
 * @desc    Create a new token
 * @access  Public
 */
router.post(
  '/token/create',
  [
    body('name').notEmpty().withMessage('Token name is required'),
    body('symbol').notEmpty().withMessage('Token symbol is required'),
    body('decimals').optional().isInt({min: 0}).withMessage('Decimals must be a non-negative integer'),
    body('initialSupply').optional().isNumeric().withMessage('Initial supply must be a number')
  ],
  directHederaController.createToken
);

/**
 * @route   POST /api/direct-hedera/token/mint
 * @desc    Mint additional tokens
 * @access  Public
 */
router.post(
  '/token/mint',
  [
    body('tokenId').notEmpty().withMessage('Token ID is required'),
    body('amount').notEmpty().isNumeric().withMessage('Amount is required and must be a number')
  ],
  directHederaController.mintTokens
);

module.exports = router; 