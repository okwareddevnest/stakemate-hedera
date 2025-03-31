const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * User model for tracking user profiles
 * Includes authentication, risk tolerance, history, and learning progress
 */
const userSchema = new mongoose.Schema({
  // Basic user information
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => `user-${Date.now()}`
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false, // Don't return password by default
    // Password is optional when using Hedera authentication
    required: function() {
      return !this.hederaAccountId; // Only required if not using Hedera auth
    }
  },
  phoneNumber: String,
  country: {
    type: String,
    default: 'Kenya'
  },
  city: String,
  
  // Authentication
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Hedera account information
  hederaAccountId: String,
  hederaPublicKey: String,
  
  // Risk profile
  riskProfile: {
    tolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    toleranceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    investmentGoals: [String],
    timeHorizon: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'medium'
    },
    incomeLevel: {
      type: String,
      default: 'middle'
    },
    lastAssessmentDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Investment history
  investmentHistory: [{
    id: String,
    projectId: String,
    projectName: String,
    projectType: String,
    tokenId: String,
    amount: Number,
    units: Number,
    price: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['simulated', 'real'],
      default: 'simulated'
    },
    status: {
      type: String,
      enum: ['active', 'complete', 'cancelled'],
      default: 'active'
    }
  }],
  
  // Learning progress
  learningProgress: {
    completedLessons: [{
      id: String,
      name: String,
      topic: String,
      completedDate: Date,
      score: Number
    }],
    knowledgeScore: {
      basics: {
        type: Number,
        default: 0
      },
      tokenization: {
        type: Number,
        default: 0
      },
      infrastructure: {
        type: Number,
        default: 0
      },
      regulation: {
        type: Number,
        default: 0
      },
      esg: {
        type: Number,
        default: 0
      },
      riskManagement: {
        type: Number,
        default: 0
      }
    },
    recommendedTopics: [String],
    lastLessonDate: Date
  },
  
  // Portfolio data
  portfolio: {
    totalValue: {
      type: Number,
      default: 0
    },
    simulatedValue: {
      type: Number,
      default: 0
    },
    holdings: [{
      projectId: String,
      projectName: String,
      projectType: String,
      tokenId: String,
      amount: Number,
      units: Number,
      entryPrice: Number,
      currentPrice: Number,
      lastUpdated: Date,
      type: {
        type: String,
        enum: ['simulated', 'real'],
        default: 'simulated'
      }
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    performanceHistory: [{
      date: Date,
      totalValue: Number,
      simulatedValue: Number
    }]
  },
  
  // Notifications and settings
  preferences: {
    notificationFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'none'],
      default: 'daily'
    },
    subscribedTopics: {
      type: [String],
      default: ['general', 'recommendations']
    },
    maxInvestmentPerProject: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },
  
  // Activity tracking
  activity: {
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginCount: {
      type: Number,
      default: 0
    },
    lastRecommendationViewed: Date,
    lastRecommendationAction: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password encryption middleware
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this.id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'stakemate-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance methods

/**
 * Add an investment record to the user's history
 * @param {Object} investment Investment data
 */
userSchema.methods.addInvestment = function(investment) {
  if (!investment.projectId || !investment.amount) {
    throw new Error('Investment requires projectId and amount');
  }
  
  // Create investment record
  const investmentRecord = {
    id: investment.id || `inv-${Date.now()}`,
    projectId: investment.projectId,
    projectName: investment.projectName,
    projectType: investment.projectType,
    tokenId: investment.tokenId,
    amount: investment.amount,
    units: investment.units || 0,
    price: investment.price || 0,
    timestamp: investment.timestamp || new Date(),
    type: investment.type || 'simulated',
    status: investment.status || 'active'
  };
  
  // Add to investment history
  this.investmentHistory.push(investmentRecord);
  
  // Update portfolio holdings
  const existingHolding = this.portfolio.holdings.find(
    h => h.projectId === investment.projectId
  );
  
  if (existingHolding) {
    // Update existing holding
    existingHolding.amount += investment.amount;
    existingHolding.units += investment.units || 0;
    existingHolding.lastUpdated = new Date();
  } else {
    // Add new holding
    this.portfolio.holdings.push({
      projectId: investment.projectId,
      projectName: investment.projectName,
      projectType: investment.projectType,
      tokenId: investment.tokenId,
      amount: investment.amount,
      units: investment.units || 0,
      entryPrice: investment.price || 0,
      currentPrice: investment.price || 0,
      lastUpdated: new Date(),
      type: investment.type || 'simulated'
    });
  }
  
  // Update total portfolio value
  this.recalculatePortfolioValue();
  
  return this;
};

/**
 * Recalculate total portfolio value based on holdings
 */
userSchema.methods.recalculatePortfolioValue = function() {
  let totalValue = 0;
  let simulatedValue = 0;
  
  // Sum up values from all holdings
  this.portfolio.holdings.forEach(holding => {
    const holdingValue = holding.units * (holding.currentPrice || holding.entryPrice);
    
    if (holding.type === 'simulated') {
      simulatedValue += holdingValue;
    } else {
      totalValue += holdingValue;
    }
  });
  
  // Update portfolio values
  this.portfolio.totalValue = totalValue;
  this.portfolio.simulatedValue = simulatedValue;
  this.portfolio.lastUpdated = new Date();
  
  // Add to performance history
  this.portfolio.performanceHistory.push({
    date: new Date(),
    totalValue,
    simulatedValue
  });
  
  return this;
};

/**
 * Update user's risk profile based on assessment data
 * @param {Object} assessmentData Risk assessment data
 */
userSchema.methods.updateRiskProfile = function(assessmentData) {
  if (!assessmentData || !assessmentData.tolerance) {
    throw new Error('Risk profile update requires tolerance level');
  }
  
  // Map tolerance string to numerical score if not provided
  if (!assessmentData.toleranceScore) {
    const toleranceScores = {
      conservative: 25,
      moderate: 50,
      aggressive: 75
    };
    
    assessmentData.toleranceScore = toleranceScores[assessmentData.tolerance] || 50;
  }
  
  // Update risk profile fields
  this.riskProfile = {
    ...this.riskProfile,
    ...assessmentData,
    lastAssessmentDate: new Date()
  };
  
  return this;
};

/**
 * Record a completed learning lesson
 * @param {Object} lesson Lesson data
 */
userSchema.methods.completeLesson = function(lesson) {
  if (!lesson.id || !lesson.name) {
    throw new Error('Lesson completion requires id and name');
  }
  
  // Create lesson record
  const lessonRecord = {
    id: lesson.id,
    name: lesson.name,
    topic: lesson.topic || 'general',
    completedDate: new Date(),
    score: lesson.score || 100
  };
  
  // Add to completed lessons
  this.learningProgress.completedLessons.push(lessonRecord);
  
  // Update knowledge score
  if (lesson.topic && this.learningProgress.knowledgeScore[lesson.topic] !== undefined) {
    // Calculate new score (weighted average)
    const currentScore = this.learningProgress.knowledgeScore[lesson.topic];
    const lessonWeight = 0.3; // New lesson is 30% of total score
    
    this.learningProgress.knowledgeScore[lesson.topic] = 
      currentScore * (1 - lessonWeight) + (lesson.score || 100) * lessonWeight;
  }
  
  // Update last lesson date
  this.learningProgress.lastLessonDate = new Date();
  
  return this;
};

/**
 * Record user login activity
 */
userSchema.methods.recordLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  
  return this;
};

/**
 * Method to get recommended projects based on user profile
 * @param {Array} availableProjects List of available projects
 * @param {number} limit Maximum number of recommendations
 * @returns {Array} Recommended projects
 */
userSchema.methods.getRecommendedProjects = function(availableProjects, limit = 3) {
  if (!availableProjects || !Array.isArray(availableProjects)) {
    return [];
  }
  
  // Filter projects based on risk tolerance
  const toleranceMap = {
    conservative: project => project.risk.overallScore <= 40,
    moderate: project => project.risk.overallScore > 30 && project.risk.overallScore <= 70,
    aggressive: project => project.risk.overallScore > 50
  };
  
  // Apply risk filter based on user's tolerance
  const riskFilter = toleranceMap[this.riskProfile.tolerance] || (() => true);
  let matchingProjects = availableProjects.filter(riskFilter);
  
  // Sort by alignment with user's investment goals if available
  if (this.riskProfile.investmentGoals && this.riskProfile.investmentGoals.length > 0) {
    matchingProjects.sort((a, b) => {
      // Count how many goals align with each project type
      const aMatches = this.riskProfile.investmentGoals.includes(a.type) ? 1 : 0;
      const bMatches = this.riskProfile.investmentGoals.includes(b.type) ? 1 : 0;
      return bMatches - aMatches; // Higher matches first
    });
  }
  
  // Limit results
  return matchingProjects.slice(0, limit);
};

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User; 