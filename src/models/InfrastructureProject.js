/**
 * InfrastructureProject model representing a tokenized infrastructure project
 * Includes financials, milestones, and ESG metrics as required
 */
const mongoose = require('mongoose');

// InfrastructureProject Schema
const infrastructureProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `project-${Date.now()}`,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  type: String, // e.g., energy, transportation, water, etc.
  website: String,
  
  // Hedera token information
  tokenId: String,
  tokenDecimals: {
    type: Number,
    default: 8
  },
  initialSupply: {
    type: Number,
    default: 1000000
  },
  
  // Financial information
  financials: {
    totalBudget: Number,
    fundingSecured: {
      type: Number,
      default: 0
    },
    expectedReturn: {
      type: Number,
      default: 0
    },
    maturityPeriod: {
      type: Number,
      default: 0
    }, // in years
    governmentBacked: {
      type: Boolean,
      default: false
    },
    cashflowPositive: {
      type: Boolean,
      default: false
    },
    dividendSchedule: {
      type: String,
      default: 'quarterly'
    },
    currency: {
      type: String,
      default: 'KES'
    }
  },
  
  // Timeline and milestones
  timeline: {
    startDate: {
      type: Date,
      default: Date.now
    },
    estimatedCompletionDate: Date,
    currentPhase: {
      type: String,
      default: 'planning'
    },
    milestones: [{
      id: String,
      name: {
        type: String,
        required: true
      },
      description: String,
      targetDate: {
        type: Date,
        required: true
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'delayed'],
        default: 'pending'
      }
    }]
  },
  
  // ESG metrics
  esgMetrics: {
    environmentalImpact: {
      type: String,
      enum: ['negative', 'neutral', 'medium', 'positive', 'very positive'],
      default: 'medium'
    },
    carbonReduction: {
      type: Number,
      default: 0
    },
    socialBenefit: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    jobsCreated: {
      type: Number,
      default: 0
    },
    governanceRating: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    sustainabilityScore: {
      type: Number,
      default: 0
    },
    sdgAlignment: [String] // Sustainable Development Goals
  },
  
  // Risk assessment
  risk: {
    overallScore: {
      type: Number,
      default: 50
    }, // Scale of 0-100, higher is riskier
    regulatoryRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme'],
      default: 'medium'
    },
    executionRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme'],
      default: 'medium'
    },
    marketRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme'],
      default: 'medium'
    },
    politicalRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme'],
      default: 'medium'
    },
    environmentalRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'extreme'],
      default: 'medium'
    }
  },
  
  // Regulatory information
  regulatory: {
    regulator: {
      type: String,
      default: 'CMA'
    },
    compliant: {
      type: Boolean,
      default: true
    },
    licenses: [String],
    lastComplianceCheck: {
      type: Date,
      default: Date.now
    }
  },
  
  // Sentiment tracking
  sentiment: {
    overall: {
      type: String,
      enum: ['very negative', 'negative', 'neutral', 'positive', 'very positive'],
      default: 'neutral'
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    },
    trendDirection: {
      type: String,
      enum: ['decreasing', 'stable', 'increasing'],
      default: 'stable'
    },
    mediaSources: [{
      source: String,
      url: String,
      sentiment: String,
      date: Date
    }]
  },
  
  // Investment metrics
  investmentMetrics: {
    minInvestmentAmount: {
      type: Number,
      default: 10
    },
    currentInvestorCount: {
      type: Number,
      default: 0
    },
    totalInvested: {
      type: Number,
      default: 0
    },
    priceHistory: [{
      date: Date,
      price: Number
    }]
  },

  // Additional tracking fields
  topicId: String, // Hedera topic ID for updates
  createdBy: String, // User ID of creator
  updatedBy: String // User ID of last updater
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Instance methods

/**
 * Calculate overall risk score based on individual risk factors
 * @returns {number} Updated risk score (0-100)
 */
infrastructureProjectSchema.methods.calculateRiskScore = function() {
  // Convert risk levels to numerical values
  const riskLevels = {
    low: 25,
    medium: 50,
    high: 75,
    extreme: 100
  };
  
  // Get numerical values for each risk
  const regulatoryRiskValue = riskLevels[this.risk.regulatoryRisk] || 50;
  const executionRiskValue = riskLevels[this.risk.executionRisk] || 50;
  const marketRiskValue = riskLevels[this.risk.marketRisk] || 50;
  const politicalRiskValue = riskLevels[this.risk.politicalRisk] || 50;
  const environmentalRiskValue = riskLevels[this.risk.environmentalRisk] || 50;
  
  // Calculate weighted average (could adjust weights based on project type)
  const overallRisk = Math.round(
    (regulatoryRiskValue * 0.2) +
    (executionRiskValue * 0.3) +
    (marketRiskValue * 0.2) +
    (politicalRiskValue * 0.15) +
    (environmentalRiskValue * 0.15)
  );
  
  // Update the risk score
  this.risk.overallScore = overallRisk;
  return overallRisk;
};

/**
 * Add a milestone update to the project
 * @param {Object} milestone Milestone data
 */
infrastructureProjectSchema.methods.addMilestone = function(milestone) {
  if (!milestone.name || !milestone.targetDate) {
    throw new Error('Milestone requires name and target date');
  }
  
  // Create milestone object with default values
  const newMilestone = {
    id: milestone.id || `ms-${Date.now()}`,
    name: milestone.name,
    description: milestone.description || '',
    targetDate: milestone.targetDate,
    completed: milestone.completed || false,
    completedDate: milestone.completedDate || null,
    status: milestone.status || 'pending'
  };
  
  // Add to milestones array
  this.timeline.milestones.push(newMilestone);
  
  // Update current phase if provided
  if (milestone.updatePhase) {
    this.timeline.currentPhase = milestone.updatePhase;
  }
  
  return newMilestone;
};

/**
 * Update sentiment data for the project
 * @param {Object} sentimentData New sentiment data
 */
infrastructureProjectSchema.methods.updateSentiment = function(sentimentData) {
  this.sentiment.overall = sentimentData.overall || this.sentiment.overall;
  this.sentiment.lastUpdate = new Date();
  this.sentiment.trendDirection = sentimentData.trendDirection || this.sentiment.trendDirection;
  
  // Add new media sources if provided
  if (sentimentData.mediaSources && Array.isArray(sentimentData.mediaSources)) {
    this.sentiment.mediaSources = [
      ...this.sentiment.mediaSources,
      ...sentimentData.mediaSources.map(source => ({
        ...source,
        date: source.date || new Date()
      }))
    ];
  }
  
  return this.sentiment;
};

/**
 * Check if project is compliant with regulations
 * @returns {boolean} Compliance status
 */
infrastructureProjectSchema.methods.checkCompliance = function() {
  // This would implement actual compliance checking logic
  // For now, just update the timestamp and return the stored value
  this.regulatory.lastComplianceCheck = new Date();
  return this.regulatory.compliant;
};

/**
 * Convert to format suitable for token creation
 * @returns {Object} Token creation data
 */
infrastructureProjectSchema.methods.toTokenData = function() {
  return {
    name: this.name,
    symbol: this.symbol,
    description: this.description,
    decimals: this.tokenDecimals,
    initialSupply: this.initialSupply,
    location: this.location,
    type: this.type,
    esgMetrics: this.esgMetrics,
    timeline: this.timeline,
    website: this.website,
    riskScore: this.risk.overallScore,
    regulator: this.regulatory.regulator
  };
};

// Create the model
const InfrastructureProject = mongoose.model('InfrastructureProject', infrastructureProjectSchema);

module.exports = InfrastructureProject; 