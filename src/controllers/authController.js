const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
      hederaAccountId: user.hederaAccountId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );
};

/**
 * Auth Controller for handling user authentication
 */
class AuthController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async register(req, res) {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { name, email, password, phoneNumber, country, city } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        country,
        city
      });

      // Generate JWT token
      const token = user.getSignedJwtToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Login a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async login(req, res) {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Record login
      user.recordLogin();
      await user.save();

      // Generate JWT token
      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getProfile(req, res) {
    try {
      // Try to find user by both id field and _id field
      let user = null;
      
      if (req.user.id) {
        user = await User.findOne({ id: req.user.id });
      }
      
      // If not found by id, try _id
      if (!user && req.user._id) {
        user = await User.findById(req.user._id);
      }

      if (!user) {
        console.error('Profile not found for user:', req.user);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          country: user.country,
          city: user.city,
          role: user.role,
          riskProfile: user.riskProfile,
          portfolio: {
            totalValue: user.portfolio.totalValue,
            simulatedValue: user.portfolio.simulatedValue,
            lastUpdated: user.portfolio.lastUpdated
          },
          hederaAccountId: user.hederaAccountId,
          learningProgress: {
            completedLessons: user.learningProgress.completedLessons.length,
            knowledgeScore: user.learningProgress.knowledgeScore
          },
          activity: {
            lastLogin: user.activity.lastLogin,
            loginCount: user.activity.loginCount
          },
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateProfile(req, res) {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { name, phoneNumber, country, city } = req.body;
      
      // Try to find user by both id field and _id field
      let user = null;
      
      if (req.user.id) {
        user = await User.findOne({ id: req.user.id });
      }
      
      // If not found by id, try _id
      if (!user && req.user._id) {
        user = await User.findById(req.user._id);
      }
      
      if (!user) {
        console.error('User not found for update:', req.user);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update fields
      if (name) user.name = name;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (country) user.country = country;
      if (city) user.city = city;
      
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          country: user.country,
          city: user.city
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Update user risk profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateRiskProfile(req, res) {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { 
        tolerance, 
        toleranceScore, 
        investmentGoals, 
        timeHorizon, 
        incomeLevel 
      } = req.body;
      
      // Try to find user by both id field and _id field
      let user = null;
      
      if (req.user.id) {
        user = await User.findOne({ id: req.user.id });
      }
      
      // If not found by id, try _id
      if (!user && req.user._id) {
        user = await User.findById(req.user._id);
      }
      
      if (!user) {
        console.error('User not found for risk profile update:', req.user);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update risk profile
      user.updateRiskProfile({
        tolerance,
        toleranceScore,
        investmentGoals,
        timeHorizon,
        incomeLevel
      });
      
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Risk profile updated successfully',
        data: user.riskProfile
      });
    } catch (error) {
      console.error('Update risk profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Change user password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async changePassword(req, res) {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      
      // Try to find user with password by both id field and _id field
      let user = null;
      
      if (req.user.id) {
        user = await User.findOne({ id: req.user.id }).select('+password');
      }
      
      // If not found by id, try _id
      if (!user && req.user._id) {
        user = await User.findById(req.user._id).select('+password');
      }
      
      if (!user) {
        console.error('User not found for password change:', req.user);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Verify current password
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Update password
      user.password = newPassword;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Handle forgot password request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      // Find user with this email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No user found with that email'
        });
      }
      
      // Generate reset token
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      
      // In a production app, this would send an email with a reset link
      // For security, we only acknowledge the request here
      
      res.status(200).json({
        success: true,
        message: 'If your email exists in our system, you will receive password reset instructions'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Reset password using token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async resetPassword(req, res) {
    try {
      // Get hashed token
      const resetToken = req.params.token;
      const { password } = req.body;
      
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      // Find user with token and valid expiry
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      
      await user.save();
      
      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  /**
   * Login or register a user with Hedera account
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async loginWithHedera(req, res) {
    try {
      const { accountId, signature } = req.body;

      if (!accountId) {
        return res.status(400).json({
          success: false,
          message: 'Hedera account ID is required'
        });
      }

      // Find or create user
      let user = await User.findOne({ hederaAccountId: accountId });

      if (!user) {
        // Create new user with Hedera account
        user = await User.create({
          id: `user-${Date.now()}`,
          name: `Hedera User ${accountId}`,
          email: `${accountId.replace(/\./g, '_')}@hedera.example.com`,
          hederaAccountId: accountId,
          // Initialize required fields with default values
          riskProfile: {
            tolerance: 'moderate',
            toleranceScore: 50,
            timeHorizon: 'medium'
          },
          portfolio: {
            totalValue: 0,
            simulatedValue: 0,
            holdings: [],
            performanceHistory: []
          },
          learningProgress: {
            completedLessons: [],
            knowledgeScore: {
              basics: 0,
              tokenization: 0,
              infrastructure: 0,
              regulation: 0,
              esg: 0,
              riskManagement: 0
            }
          }
        });
      }

      // Generate JWT token
      const token = generateToken(user);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          hederaAccountId: user.hederaAccountId,
          riskProfile: user.riskProfile,
          portfolio: {
            totalValue: user.portfolio.totalValue,
            simulatedValue: user.portfolio.simulatedValue
          }
        }
      });
    } catch (error) {
      console.error('Hedera login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during Hedera authentication',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController(); 