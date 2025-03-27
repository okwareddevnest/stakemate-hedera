/**
 * InfrastructureProject model representing a tokenized infrastructure project
 * Includes financials, milestones, and ESG metrics as required
 */
class InfrastructureProject {
  constructor(data) {
    // Basic information
    this.id = data.id || null;
    this.name = data.name;
    this.symbol = data.symbol;
    this.description = data.description;
    this.location = data.location;
    this.type = data.type; // e.g., energy, transportation, water, etc.
    this.website = data.website;
    
    // Hedera token information
    this.tokenId = data.tokenId || null;
    this.tokenDecimals = data.decimals || 8;
    this.initialSupply = data.initialSupply || 1000000;
    
    // Financial information
    this.financials = {
      totalBudget: data.totalBudget,
      fundingSecured: data.fundingSecured || 0,
      expectedReturn: data.expectedReturn || 0,
      maturityPeriod: data.maturityPeriod || 0, // in years
      governmentBacked: data.governmentBacked || false,
      cashflowPositive: data.cashflowPositive || false,
      dividendSchedule: data.dividendSchedule || 'quarterly',
      currency: data.currency || 'KES'
    };
    
    // Timeline and milestones
    this.timeline = {
      startDate: data.startDate || new Date().toISOString(),
      estimatedCompletionDate: data.estimatedCompletionDate,
      currentPhase: data.currentPhase || 'planning',
      milestones: data.milestones || []
    };
    
    // ESG metrics
    this.esgMetrics = {
      environmentalImpact: data.environmentalImpact || 'medium',
      carbonReduction: data.carbonReduction || 0,
      socialBenefit: data.socialBenefit || 'medium',
      jobsCreated: data.jobsCreated || 0,
      governanceRating: data.governanceRating || 'medium',
      sustainabilityScore: data.sustainabilityScore || 0,
      sdgAlignment: data.sdgAlignment || []
    };
    
    // Risk assessment
    this.risk = {
      overallScore: data.riskScore || 50, // Scale of 0-100, higher is riskier
      regulatoryRisk: data.regulatoryRisk || 'medium',
      executionRisk: data.executionRisk || 'medium',
      marketRisk: data.marketRisk || 'medium',
      politicalRisk: data.politicalRisk || 'medium',
      environmentalRisk: data.environmentalRisk || 'medium'
    };
    
    // Regulatory information
    this.regulatory = {
      regulator: data.regulator || 'CMA',
      compliant: data.compliant !== undefined ? data.compliant : true,
      licenses: data.licenses || [],
      lastComplianceCheck: data.lastComplianceCheck || new Date().toISOString()
    };
    
    // Sentiment tracking
    this.sentiment = {
      overall: data.overallSentiment || 'neutral',
      lastUpdate: data.lastSentimentUpdate || new Date().toISOString(),
      trendDirection: data.sentimentTrend || 'stable',
      mediaSources: data.mediaSources || []
    };
    
    // Investment metrics
    this.investmentMetrics = {
      minInvestmentAmount: data.minInvestmentAmount || 10,
      currentInvestorCount: data.currentInvestorCount || 0,
      totalInvested: data.totalInvested || 0,
      priceHistory: data.priceHistory || []
    };
  }

  /**
   * Calculate overall risk score based on individual risk factors
   * @returns {number} Updated risk score (0-100)
   */
  calculateRiskScore() {
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
  }

  /**
   * Add a milestone update to the project
   * @param {Object} milestone Milestone data
   */
  addMilestone(milestone) {
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
  }

  /**
   * Update sentiment data for the project
   * @param {Object} sentimentData New sentiment data
   */
  updateSentiment(sentimentData) {
    this.sentiment.overall = sentimentData.overall || this.sentiment.overall;
    this.sentiment.lastUpdate = new Date().toISOString();
    this.sentiment.trendDirection = sentimentData.trendDirection || this.sentiment.trendDirection;
    
    // Add new media sources if provided
    if (sentimentData.mediaSources && Array.isArray(sentimentData.mediaSources)) {
      this.sentiment.mediaSources = [
        ...this.sentiment.mediaSources,
        ...sentimentData.mediaSources
      ];
    }
    
    return this.sentiment;
  }

  /**
   * Check if project is compliant with regulations
   * @returns {boolean} Compliance status
   */
  checkCompliance() {
    // This would implement actual compliance checking logic
    // For now, just return the stored value
    this.regulatory.lastComplianceCheck = new Date().toISOString();
    return this.regulatory.compliant;
  }

  /**
   * Convert to format suitable for token creation
   * @returns {Object} Token creation data
   */
  toTokenData() {
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
  }

  /**
   * Convert to JSON representation
   * @returns {Object} JSON object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      location: this.location,
      type: this.type,
      website: this.website,
      tokenId: this.tokenId,
      tokenDecimals: this.tokenDecimals,
      initialSupply: this.initialSupply,
      financials: this.financials,
      timeline: this.timeline,
      esgMetrics: this.esgMetrics,
      risk: this.risk,
      regulatory: this.regulatory,
      sentiment: this.sentiment,
      investmentMetrics: this.investmentMetrics
    };
  }
}

module.exports = InfrastructureProject; 