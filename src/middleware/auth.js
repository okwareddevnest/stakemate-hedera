const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 */
module.exports = async function(req, res, next) {
  try {
    // Get token from header
    const token = req.header('x-auth-token') || 
                  req.header('authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Get JWT secret from environment
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Get user from payload - try both id field and _id field
    let user = null;
    
    if (decoded.id) {
      // First try looking up by the custom id field
      user = await User.findOne({ id: decoded.id });
      
      // If not found, try looking up by MongoDB _id
      if (!user && decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findById(decoded.id);
      }
    }
    
    // Check if user exists
    if (!user) {
      console.error('User not found with id:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      _id: user._id,
      email: user.email,
      role: user.role,
      hederaAccountId: user.hederaAccountId
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Provide more specific error messages
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
}; 