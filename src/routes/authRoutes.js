const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    authMiddleware,
    check('name', 'Name cannot be empty if provided').optional().not().isEmpty(),
    check('phoneNumber', 'Phone number cannot be empty if provided').optional().not().isEmpty()
  ],
  authController.updateProfile
);

/**
 * @route   PUT /api/auth/risk-profile
 * @desc    Update user risk profile
 * @access  Private
 */
router.put(
  '/risk-profile',
  [
    authMiddleware,
    check('tolerance', 'Risk tolerance must be valid').optional().isIn(['conservative', 'moderate', 'aggressive']),
    check('timeHorizon', 'Time horizon must be valid').optional().isIn(['short', 'medium', 'long'])
  ],
  authController.updateRiskProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/change-password',
  [
    authMiddleware,
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.changePassword
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail()
  ],
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password/:token',
  [
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.resetPassword
);

module.exports = router; 