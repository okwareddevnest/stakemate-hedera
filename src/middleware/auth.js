const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user to request object
 */
module.exports = async function(req, res, next) {
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

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stakemate-secret-key');
    
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
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
}; 