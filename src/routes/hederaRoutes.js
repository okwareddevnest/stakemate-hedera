const express = require('express');
const { body } = require('express-validator');
const hederaController = require('../controllers/hederaController');

const router = express.Router();

/**
 * @route   GET /api/hedera/balance/:accountId
 * @desc    Get HBAR balance for a specified account
 * @access  Public
 */
router.get('/balance/:accountId', hederaController.getHbarBalance);

/**
 * @route   GET /api/hedera/tokens/:tokenId/balance/:accountId
 * @desc    Get token balance for a specific account and token
 * @access  Public
 */
router.get('/tokens/:tokenId/balance/:accountId', hederaController.getTokenBalance);

/**
 * @route   GET /api/hedera/tokens/:accountId
 * @desc    Get all token balances for an account
 * @access  Public
 */
router.get('/tokens/:accountId', hederaController.getAllTokenBalances);

/**
 * @route   GET /api/hedera/tokens/:tokenId/holders
 * @desc    Get all holders of a specific token
 * @access  Public
 */
router.get('/tokens/:tokenId/holders', hederaController.getTokenHolders);

/**
 * @route   POST /api/hedera/tokens
 * @desc    Create a new fungible token
 * @access  Public
 */
router.post(
  '/tokens',
  [
    body('name').notEmpty().withMessage('Token name is required'),
    body('symbol').notEmpty().withMessage('Token symbol is required'),
    body('initialSupply').notEmpty().withMessage('Initial supply is required')
  ],
  hederaController.createToken
);

/**
 * @route   POST /api/hedera/tokens/transfer
 * @desc    Transfer tokens from Eliza's account to another account
 * @access  Public
 */
router.post(
  '/tokens/transfer',
  [
    body('receiverId').notEmpty().withMessage('Receiver account ID is required'),
    body('tokenId').notEmpty().withMessage('Token ID is required'),
    body('amount').notEmpty().withMessage('Amount is required')
  ],
  hederaController.transferTokens
);

module.exports = router; 