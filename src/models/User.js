/**
 * User model for tracking user profiles
 * Includes risk tolerance, history, and learning progress as required
 */
class User {
  constructor(data) {
    // Basic user information
    this.id = data.id || `user-${Date.now()}`;
    this.name = data.name;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.country = data.country || 'Kenya';
    this.city = data.city;
    
    // Hedera account information
    this.hederaAccountId = data.hederaAccountId;
    this.hederaPublicKey = data.hederaPublicKey;
    
    // Risk profile
    this.riskProfile = {
      tolerance: data.riskTolerance || 'moderate', // conservative, moderate, aggressive
      toleranceScore: data.riskToleranceScore || 50, // 0-100 scale
      investmentGoals: data.investmentGoals || [],
      timeHorizon: data.timeHorizon || 'medium', // short, medium, long
      incomeLevel: data.incomeLevel || 'middle',
      lastAssessmentDate: data.lastRiskAssessmentDate || new Date().toISOString()
    };
    
    // Investment history
    this.investmentHistory = data.investmentHistory || [];
    
    // Learning progress
    this.learningProgress = {
      completedLessons: data.completedLessons || [],
      knowledgeScore: data.knowledgeScore || {
        basics: 0,
        tokenization: 0,
        infrastructure: 0,
        regulation: 0,
        esg: 0,
        riskManagement: 0
      },
      recommendedTopics: data.recommendedTopics || [],
      lastLessonDate: data.lastLessonDate || null
    };
    
    // Portfolio data
    this.portfolio = {
      totalValue: data.portfolioValue || 0,
      simulatedValue: data.simulatedValue || 0,
      holdings: data.holdings || [],
      lastUpdated: data.portfolioLastUpdated || new Date().toISOString(),
      performanceHistory: data.performanceHistory || []
    };
    
    // Notifications and settings
    this.preferences = {
      notificationFrequency: data.notificationFrequency || 'daily',
      subscribedTopics: data.subscribedTopics || ['general', 'recommendations'],
      maxInvestmentPerProject: data.maxInvestmentPerProject || 0,
      language: data.language || 'en',
      currency: data.currency || 'KES'
    };
    
    // Activity tracking
    this.activity = {
      lastLogin: data.lastLogin || new Date().toISOString(),
      loginCount: data.loginCount || 0,
      lastRecommendationViewed: data.lastRecommendationViewed || null,
      lastRecommendationAction: data.lastRecommendationAction || null
    };
  }

  /**
   * Add an investment record to the user's history
   * @param {Object} investment Investment data
   */
  addInvestment(investment) {
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
      timestamp: investment.timestamp || new Date().toISOString(),
      type: investment.type || 'simulated', // simulated or real
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
      existingHolding.lastUpdated = new Date().toISOString();
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
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Update portfolio total value
    this.updatePortfolioValue();
    
    return investmentRecord;
  }

  /**
   * Record a completed lesson
   * @param {Object} lesson Lesson data
   */
  completeLesson(lesson) {
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
        completedDate: new Date().toISOString(),
        score: lesson.score || 100
      };
      
      // Add to completed lessons
      this.learningProgress.completedLessons.push(lessonRecord);
      
      // Update knowledge score for the relevant topic
      if (this.learningProgress.knowledgeScore.hasOwnProperty(lesson.topic)) {
        // Increment the score for this topic (max 100)
        this.learningProgress.knowledgeScore[lesson.topic] = Math.min(
          100,
          this.learningProgress.knowledgeScore[lesson.topic] + (lesson.scoreIncrement || 10)
        );
      }
      
      // Update last lesson date
      this.learningProgress.lastLessonDate = new Date().toISOString();
    }
    
    return this.learningProgress;
  }

  /**
   * Update the user's risk tolerance profile
   * @param {Object} riskData Risk profile data
   */
  updateRiskProfile(riskData) {
    this.riskProfile.tolerance = riskData.tolerance || this.riskProfile.tolerance;
    this.riskProfile.toleranceScore = riskData.toleranceScore || this.riskProfile.toleranceScore;
    
    if (riskData.investmentGoals) {
      this.riskProfile.investmentGoals = riskData.investmentGoals;
    }
    
    this.riskProfile.timeHorizon = riskData.timeHorizon || this.riskProfile.timeHorizon;
    this.riskProfile.incomeLevel = riskData.incomeLevel || this.riskProfile.incomeLevel;
    this.riskProfile.lastAssessmentDate = new Date().toISOString();
    
    return this.riskProfile;
  }

  /**
   * Update total portfolio value based on holdings
   */
  updatePortfolioValue() {
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
    this.portfolio.lastUpdated = new Date().toISOString();
    
    // Add to performance history
    this.portfolio.performanceHistory.push({
      date: new Date().toISOString(),
      totalValue,
      simulatedValue
    });
    
    return this.portfolio;
  }

  /**
   * Get recommended projects based on user profile
   * @param {Array} availableProjects List of available projects
   * @param {number} limit Maximum number of recommendations
   * @returns {Array} Recommended projects
   */
  getRecommendedProjects(availableProjects, limit = 3) {
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
  }

  /**
   * Record user login activity
   */
  recordLogin() {
    this.activity.lastLogin = new Date().toISOString();
    this.activity.loginCount += 1;
    return this.activity;
  }

  /**
   * Convert to JSON representation
   * @returns {Object} JSON object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      country: this.country,
      city: this.city,
      hederaAccountId: this.hederaAccountId,
      hederaPublicKey: this.hederaPublicKey,
      riskProfile: this.riskProfile,
      investmentHistory: this.investmentHistory,
      learningProgress: this.learningProgress,
      portfolio: this.portfolio,
      preferences: this.preferences,
      activity: this.activity
    };
  }
}

module.exports = User; 