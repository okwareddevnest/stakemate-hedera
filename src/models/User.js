const mongoose = require('mongoose');

/**
 * User model for tracking user profiles
 * Includes risk tolerance, history, and learning progress as required
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
  phoneNumber: String,
  country: {
    type: String,
    default: 'Kenya'
  },
  city: String,
  
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
      lastUpdated: new Date()
    });
  }
  
  // Update portfolio value
  this.updatePortfolioValue();
  
  return investmentRecord;
};

/**
 * Record a completed lesson
 * @param {Object} lesson Lesson data
 */
userSchema.methods.completeLesson = function(lesson) {
  if (!lesson.id || !lesson.topic) {
    throw new Error('Lesson requires id and topic');
  }
  
  // Check if already completed
  const alreadyCompleted = this.learningProgress.completedLessons.some(
    l => l.id === lesson.id
  );
  
  if (!alreadyCompleted) {
    // Create lesson record
    const lessonRecord = {
      id: lesson.id,
      name: lesson.name,
      topic: lesson.topic,
      completedDate: new Date(),
      score: lesson.score || 100
    };
    
    // Add to completed lessons
    this.learningProgress.completedLessons.push(lessonRecord);
    
    // Update knowledge score for the relevant topic
    if (this.learningProgress.knowledgeScore[lesson.topic] !== undefined) {
      // Increment the score for this topic (max 100)
      this.learningProgress.knowledgeScore[lesson.topic] = Math.min(
        100,
        this.learningProgress.knowledgeScore[lesson.topic] + (lesson.scoreIncrement || 10)
      );
    }
    
    // Update last lesson date
    this.learningProgress.lastLessonDate = new Date();
  }
  
  return this.learningProgress;
};

/**
 * Update the user's risk tolerance profile
 * @param {Object} riskData Risk profile data
 */
userSchema.methods.updateRiskProfile = function(riskData) {
  this.riskProfile.tolerance = riskData.tolerance || this.riskProfile.tolerance;
  this.riskProfile.toleranceScore = riskData.toleranceScore || this.riskProfile.toleranceScore;
  
  if (riskData.investmentGoals) {
    this.riskProfile.investmentGoals = riskData.investmentGoals;
  }
  
  this.riskProfile.timeHorizon = riskData.timeHorizon || this.riskProfile.timeHorizon;
  this.riskProfile.incomeLevel = riskData.incomeLevel || this.riskProfile.incomeLevel;
  this.riskProfile.lastAssessmentDate = new Date();
  
  return this.riskProfile;
};

/**
 * Update total portfolio value based on holdings
 */
userSchema.methods.updatePortfolioValue = function() {
  let totalValue = 0;
  let simulatedValue = 0;
  
  // Calculate values based on holdings
  for (const holding of this.portfolio.holdings) {
    const holdingValue = holding.units * holding.currentPrice;
    totalValue += holdingValue;
    
    if (holding.type === 'simulated') {
      simulatedValue += holdingValue;
    }
  }
  
  // Update portfolio data
  this.portfolio.totalValue = totalValue;
  this.portfolio.simulatedValue = simulatedValue;
  this.portfolio.lastUpdated = new Date();
  
  // Add to performance history
  this.portfolio.performanceHistory.push({
    date: new Date(),
    totalValue,
    simulatedValue
  });
  
  return this.portfolio;
};

/**
 * Record user login
 */
userSchema.methods.recordLogin = function() {
  this.activity.lastLogin = new Date();
  this.activity.loginCount += 1;
  return this.activity;
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