require('dotenv').config();
const HederaAgentKit = require('../hedera/HederaAgentKit');
const InfrastructureProject = require('../models/InfrastructureProject');
const User = require('../models/User');

/**
 * StakemateAgent - Core AI agent implementation
 * Handles education, analysis, simulation, and guidance capabilities
 */
class StakemateAgent {
  constructor() {
    // Initialize Hedera integration
    this.hederaKit = new HederaAgentKit();
    
    // Initialize state for sentiment and recommendations (these are kept in memory)
    this.recommendations = new Map(); // Map of recommendations by user
    this.sentimentData = new Map(); // Map of sentiment data by project
    
    // Initialize topic IDs
    this.recommendationTopicId = process.env.RECOMMENDATION_TOPIC_ID || null;
    this.simulationTopicId = process.env.SIMULATION_TOPIC_ID || null;
    
    // Initialize event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for reactivity
   */
  setupEventListeners() {
    // This would set up event listeners for various triggers
    // For now, it's a placeholder for future implementation
    console.log('Setting up Stakemate Agent event listeners');
  }

  /**
   * Create a new infrastructure project
   * @param {Object} projectData Project data
   * @returns {Object} Created project
   */
  async createProject(projectData) {
    try {
      // Create project model
      const project = new InfrastructureProject({
        ...projectData,
        id: `project-${Date.now()}`
      });
      
      // Calculate risk score
      project.calculateRiskScore();
      
      // Create token on Hedera
      const tokenData = project.toTokenData();
      const tokenResult = await this.hederaKit.createInfrastructureToken(tokenData);
      
      // Update project with token ID
      project.tokenId = tokenResult.tokenId;
      
      // Create topic for project updates
      const topicResult = await this.hederaKit.createProjectTopic({
        projectName: project.name,
        tokenId: project.tokenId,
        description: project.description
      });
      
      // Update project with topic ID
      project.topicId = topicResult.topicId;
      
      // Save project to database
      await project.save();
      
      console.log(`Created project: ${project.name} with token ID ${project.tokenId}`);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get project by ID
   * @param {string} projectId Project ID
   * @returns {Object} Project
   */
  async getProject(projectId) {
    const project = await InfrastructureProject.findOne({ id: projectId });
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }
    return project;
  }

  /**
   * List all projects
   * @param {Object} filters Optional filters
   * @returns {Array} Projects
   */
  async listProjects(filters = {}) {
    return await InfrastructureProject.find(filters);
  }

  /**
   * Update project data
   * @param {string} projectId Project ID
   * @param {Object} updateData Update data
   * @returns {Object} Updated project
   */
  async updateProject(projectId, updateData) {
    try {
      const project = await this.getProject(projectId);
      
      // Update project data
      Object.keys(updateData).forEach(key => {
        if (key === 'milestones' && updateData.milestones) {
          // Handle milestone updates
          updateData.milestones.forEach(milestone => {
            project.addMilestone(milestone);
          });
        } else if (key === 'sentiment' && updateData.sentiment) {
          // Handle sentiment updates
          project.updateSentiment(updateData.sentiment);
        } else if (key === 'financials' && updateData.financials) {
          // Handle financials updates
          Object.assign(project.financials, updateData.financials);
        } else if (key === 'esgMetrics' && updateData.esgMetrics) {
          // Handle ESG updates
          Object.assign(project.esgMetrics, updateData.esgMetrics);
        } else if (project[key] !== undefined) {
          // Update other properties
          project[key] = updateData[key];
        }
      });
      
      // Update the updatedBy field
      if (updateData.updatedBy) {
        project.updatedBy = updateData.updatedBy;
      }
      
      // Recalculate risk score
      project.calculateRiskScore();
      
      // Save the updated project
      await project.save();
      
      // Record update on Hedera
      await this.recordProjectUpdate(projectId, updateData);
      
      return project;
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Record project update on Hedera
   * @param {string} projectId Project ID
   * @param {Object} updateData Update data
   * @returns {Object} Transaction result
   */
  async recordProjectUpdate(projectId, updateData) {
    try {
      const project = await this.getProject(projectId);
      
      // Create update record
      const updateRecord = {
        projectId,
        tokenId: project.tokenId,
        timestamp: new Date().toISOString(),
        updates: updateData,
        type: 'PROJECT_UPDATE'
      };
      
      // Submit to Hedera
      const result = await this.hederaKit.submitProjectUpdate(
        project.topicId, 
        updateRecord
      );
      
      return result;
    } catch (error) {
      console.error(`Error recording project update for ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData User data
   * @returns {Object} Created user
   */
  async createUser(userData) {
    try {
      // Create user model
      const user = new User({
        ...userData,
        id: `user-${Date.now()}`
      });
      
      // Save user to database
      await user.save();
      
      console.log(`Created user: ${user.name} with ID ${user.id}`);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId User ID
   * @returns {Object} User
   */
  async getUser(userId) {
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    return user;
  }

  /**
   * List all users
   * @param {Object} filters Optional filters
   * @returns {Array} Users
   */
  async listUsers(filters = {}) {
    return await User.find(filters);
  }

  /**
   * Update user data
   * @param {string} userId User ID
   * @param {Object} updateData Update data
   * @returns {Object} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      const user = await this.getUser(userId);
      
      // Update user data
      Object.keys(updateData).forEach(key => {
        if (key === 'riskProfile' && updateData.riskProfile) {
          // Handle risk profile updates
          user.updateRiskProfile(updateData.riskProfile);
        } else if (key === 'investmentHistory' && updateData.investmentHistory) {
          // Handle investment history updates
          if (Array.isArray(updateData.investmentHistory)) {
            // Replace entire history
            user.investmentHistory = updateData.investmentHistory;
          } else {
            // Add single investment
            user.addInvestment(updateData.investmentHistory);
          }
        } else if (key === 'learningProgress' && updateData.learningProgress) {
          // Handle learning progress updates
          if (updateData.learningProgress.completedLesson) {
            // Complete a lesson
            user.completeLesson(updateData.learningProgress.completedLesson);
          } else {
            // Update other learning progress properties
            Object.assign(user.learningProgress, updateData.learningProgress);
          }
        } else if (key === 'preferences' && updateData.preferences) {
          // Handle preferences updates
          Object.assign(user.preferences, updateData.preferences);
        } else if (user[key] !== undefined) {
          // Update other properties
          user[key] = updateData[key];
        }
      });
      
      // Save the updated user
      await user.save();
      
      return user;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get personalized educational content for a user
   * @param {string} userId User ID
   * @param {string} topic Topic of interest
   * @returns {Object} Educational content
   */
  async getEducationalContent(userId, topic) {
    try {
      const user = await this.getUser(userId);
      
      // In a real implementation, this would fetch personalized content from a learning system
      const topicScores = user.learningProgress.knowledgeScore;
      const topicScore = topicScores[topic] || 0;
      
      let difficultyLevel = 'beginner';
      if (topicScore > 70) {
        difficultyLevel = 'advanced';
      } else if (topicScore > 30) {
        difficultyLevel = 'intermediate';
      }
      
      // Return basic content structure that would be filled by a real system
      return {
        userId,
        topic,
        difficultyLevel,
        title: `${topic} in Infrastructure Investing`,
        content: `Content about ${topic} would be provided by the learning system.`,
        resources: [],
        quiz: []
      };
    } catch (error) {
      console.error(`Error getting educational content for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Mark a lesson as complete for a user
   * @param {string} userId User ID
   * @param {string} lessonId Lesson ID
   * @returns {Object} Updated learning progress
   */
  async markLessonComplete(userId, lessonId) {
    try {
      const user = await this.getUser(userId);
      
      // In a real implementation, this would fetch the actual lesson details
      const lesson = {
        id: lessonId,
        name: `Lesson ${lessonId}`,
        topic: 'infrastructure',
        score: 10,
        scoreIncrement: 10
      };
      
      // Mark lesson as complete
      const updatedProgress = user.completeLesson(lesson);
      
      // Save the updated user
      await user.save();
      
      return updatedProgress;
    } catch (error) {
      console.error(`Error marking lesson complete for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Analyze a project for a specific user
   * @param {string} userId User ID
   * @param {string} projectId Project ID
   * @returns {Object} Analysis results
   */
  async analyzeProjectForUser(userId, projectId) {
    try {
      const [user, project] = await Promise.all([
        this.getUser(userId),
        this.getProject(projectId)
      ]);
      
      // Compare user risk profile with project risk
      const riskMatch = this.calculateRiskMatch(user.riskProfile, project.risk);
      
      // Calculate suitability score
      const suitabilityScore = this.calculateSuitabilityScore(user, project);
      
      // Personalized recommendations
      const recommendations = this.generatePersonalizedRecommendations(user, project);
      
      return {
        userId,
        projectId,
        projectName: project.name,
        riskMatch,
        suitabilityScore,
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error analyzing project ${projectId} for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate risk match between user profile and project
   * @param {Object} userRiskProfile User risk profile
   * @param {Object} projectRisk Project risk assessment
   * @returns {Object} Risk match assessment
   */
  calculateRiskMatch(userRiskProfile, projectRisk) {
    // Convert user risk tolerance to a numerical value
    const toleranceMap = {
      conservative: 30,
      moderate: 60,
      aggressive: 90
    };
    
    const userRiskValue = userRiskProfile.toleranceScore || 
      toleranceMap[userRiskProfile.tolerance] || 50;
    
    const projectRiskValue = projectRisk.overallScore;
    
    // Calculate the difference (how well they match)
    const diff = Math.abs(userRiskValue - projectRiskValue);
    
    // Determine match level
    let matchLevel;
    if (diff <= 10) {
      matchLevel = 'excellent';
    } else if (diff <= 20) {
      matchLevel = 'good';
    } else if (diff <= 30) {
      matchLevel = 'fair';
    } else {
      matchLevel = 'poor';
    }
    
    // Determine if the project is too risky or too safe for the user
    let riskAssessment;
    if (projectRiskValue > userRiskValue + 15) {
      riskAssessment = 'Project may be too risky for this investor';
    } else if (projectRiskValue < userRiskValue - 15) {
      riskAssessment = 'Project may be too conservative for this investor';
    } else {
      riskAssessment = 'Project risk aligns with investor profile';
    }
    
    return {
      matchLevel,
      userRiskValue,
      projectRiskValue,
      difference: diff,
      riskAssessment
    };
  }

  /**
   * Calculate suitability score for a project based on user profile
   * @param {Object} user User
   * @param {Object} project Project
   * @returns {Object} Suitability score and factors
   */
  calculateSuitabilityScore(user, project) {
    // Base score starts at 50
    let score = 50;
    const factors = [];
    
    // Risk match (up to +/- 25 points)
    const riskMatch = this.calculateRiskMatch(user.riskProfile, project.risk);
    if (riskMatch.matchLevel === 'excellent') {
      score += 25;
      factors.push({ factor: 'Risk Profile Match', impact: 25, description: 'Excellent risk profile alignment' });
    } else if (riskMatch.matchLevel === 'good') {
      score += 15;
      factors.push({ factor: 'Risk Profile Match', impact: 15, description: 'Good risk profile alignment' });
    } else if (riskMatch.matchLevel === 'fair') {
      score += 5;
      factors.push({ factor: 'Risk Profile Match', impact: 5, description: 'Fair risk profile alignment' });
    } else {
      score -= 15;
      factors.push({ factor: 'Risk Profile Match', impact: -15, description: 'Poor risk profile alignment' });
    }
    
    // Investment goals alignment (up to +15 points)
    if (user.riskProfile.investmentGoals && user.riskProfile.investmentGoals.length > 0) {
      // Check if project type aligns with any of the user's investment goals
      const goalAlignment = user.riskProfile.investmentGoals.some(
        goal => goal.toLowerCase().includes(project.type.toLowerCase()) ||
          project.type.toLowerCase().includes(goal.toLowerCase())
      );
      
      if (goalAlignment) {
        score += 15;
        factors.push({ factor: 'Investment Goal Alignment', impact: 15, description: 'Project aligns with investment goals' });
      }
    }
    
    // Investment amount threshold (up to -20 points)
    const minInvestment = project.investmentMetrics.minInvestmentAmount;
    const maxInvestment = user.preferences.maxInvestmentPerProject;
    
    if (maxInvestment > 0 && minInvestment > maxInvestment) {
      score -= 20;
      factors.push({ factor: 'Investment Amount', impact: -20, description: 'Minimum investment exceeds user threshold' });
    }
    
    // Portfolio diversification (up to +10 points)
    const userInvestmentTypes = new Set(
      user.portfolio.holdings.map(holding => holding.projectType)
    );
    
    if (!userInvestmentTypes.has(project.type)) {
      score += 10;
      factors.push({ factor: 'Portfolio Diversification', impact: 10, description: 'Adds a new project type to portfolio' });
    }
    
    // Cap the score between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      factors,
      recommendation: this.getSuitabilityRecommendation(score)
    };
  }

  /**
   * Get a suitability recommendation based on score
   * @param {number} score Suitability score
   * @returns {string} Recommendation
   */
  getSuitabilityRecommendation(score) {
    if (score >= 80) {
      return 'Highly Recommended';
    } else if (score >= 65) {
      return 'Recommended';
    } else if (score >= 50) {
      return 'Consider with Caution';
    } else if (score >= 30) {
      return 'Not Recommended';
    } else {
      return 'Strongly Not Recommended';
    }
  }

  /**
   * Generate personalized recommendations for a user based on a project
   * @param {Object} user User
   * @param {Object} project Project
   * @returns {Array} Recommendations
   */
  generatePersonalizedRecommendations(user, project) {
    const recommendations = [];
    
    // Recommendation based on risk profile
    const riskMatch = this.calculateRiskMatch(user.riskProfile, project.risk);
    if (riskMatch.matchLevel === 'poor') {
      recommendations.push({
        type: 'risk',
        title: 'Risk Mismatch',
        description: riskMatch.riskAssessment,
        action: riskMatch.projectRiskValue > riskMatch.userRiskValue ? 
          'Consider more conservative investments' : 'Consider higher-risk investments for better returns'
      });
    }
    
    // Recommendation based on investment amount
    const minInvestment = project.investmentMetrics.minInvestmentAmount;
    if (minInvestment > 1000) {
      recommendations.push({
        type: 'investment',
        title: 'Investment Strategy',
        description: 'This project has a significant minimum investment',
        action: 'Consider starting with a smaller position to test performance'
      });
    }
    
    // Recommendation based on project type and portfolio
    const hasProjectType = user.portfolio.holdings.some(
      holding => holding.projectType === project.type
    );
    
    if (hasProjectType) {
      recommendations.push({
        type: 'diversification',
        title: 'Portfolio Concentration',
        description: `You already have investments in ${project.type} projects`,
        action: 'Consider diversifying into other project types'
      });
    }
    
    // Add a general education recommendation if user knowledge score is low
    const knowledgeScore = user.learningProgress.knowledgeScore[project.type.toLowerCase()] || 0;
    if (knowledgeScore < 50) {
      recommendations.push({
        type: 'education',
        title: 'Knowledge Gap',
        description: `Your knowledge of ${project.type} infrastructure is limited`,
        action: `Complete our ${project.type} basics course before investing`
      });
    }
    
    return recommendations;
  }

  /**
   * Generate investment recommendations for a user
   * @param {string} userId User ID
   * @param {Array} projectIds Optional array of project IDs to consider
   * @returns {Object} Recommendations
   */
  async generateRecommendations(userId, projectIds = []) {
    try {
      const user = await this.getUser(userId);
      
      // Get projects to consider
      let projects;
      if (projectIds && projectIds.length > 0) {
        // Get specific projects
        const projectPromises = projectIds.map(id => this.getProject(id));
        projects = await Promise.all(projectPromises);
      } else {
        // Get all projects
        projects = await this.listProjects();
      }
      
      // Calculate suitability for each project
      const projectRecommendations = await Promise.all(
        projects.map(async project => {
          const suitability = this.calculateSuitabilityScore(user, project);
          return {
            projectId: project.id,
            projectName: project.name,
            projectType: project.type,
            tokenId: project.tokenId,
            location: project.location,
            expectedReturn: project.financials.expectedReturn,
            minInvestment: project.investmentMetrics.minInvestmentAmount,
            suitabilityScore: suitability.score,
            recommendation: suitability.recommendation,
            key_factors: suitability.factors
          };
        })
      );
      
      // Sort by suitability score (descending)
      projectRecommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
      
      // Store recommendations for this user
      const recommendationRecord = {
        userId,
        timestamp: new Date().toISOString(),
        projects: projectRecommendations
      };
      
      this.recommendations.set(userId, recommendationRecord);
      
      // Record recommendations on Hedera
      if (this.recommendationTopicId) {
        await this.hederaKit.submitRecommendation(this.recommendationTopicId, recommendationRecord);
      }
      
      return recommendationRecord;
    } catch (error) {
      console.error(`Error generating recommendations for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Simulate an investment for a user
   * @param {string} userId User ID
   * @param {string} projectId Project ID
   * @param {number} amount Investment amount
   * @param {number} duration Investment duration in months
   * @returns {Object} Simulation results
   */
  async simulateInvestment(userId, projectId, amount, duration = 36) {
    try {
      const [user, project] = await Promise.all([
        this.getUser(userId),
        this.getProject(projectId)
      ]);
      
      // Check if amount meets minimum
      if (amount < project.investmentMetrics.minInvestmentAmount) {
        throw new Error(`Minimum investment amount is ${project.investmentMetrics.minInvestmentAmount}`);
      }
      
      // Calculate token amount based on current price
      const tokenPrice = 50; // Placeholder for actual token price logic
      const tokenAmount = amount / tokenPrice;
      
      // Generate projected returns
      const returnRate = project.financials.expectedReturn / 100; // Convert percentage to decimal
      
      // Calculate monthly compounding return
      const monthlyRate = returnRate / 12;
      let projectedValue = amount;
      
      const monthlyProjections = [];
      for (let month = 1; month <= duration; month++) {
        // Apply monthly return
        projectedValue *= (1 + monthlyRate);
        
        // Record monthly projection
        monthlyProjections.push({
          month,
          value: projectedValue
        });
      }
      
      // Calculate final values
      const finalValue = projectedValue;
      const totalReturn = finalValue - amount;
      const totalReturnPercentage = (totalReturn / amount) * 100;
      
      // Create investment record
      const investmentRecord = {
        projectId,
        projectName: project.name,
        projectType: project.type,
        tokenId: project.tokenId,
        amount,
        units: tokenAmount,
        price: tokenPrice,
        timestamp: new Date().toISOString(),
        type: 'simulated',
        status: 'complete'
      };
      
      // Add to user's investment history
      user.addInvestment(investmentRecord);
      
      // Save updated user
      await user.save();
      
      // Create simulation result
      const simulationResult = {
        userId,
        projectId,
        amount,
        tokenAmount,
        tokenPrice,
        duration,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000).toISOString(),
        finalValue,
        totalReturn,
        totalReturnPercentage,
        monthlyProjections,
        investmentRecord
      };
      
      // Record simulation on Hedera
      if (this.simulationTopicId) {
        await this.hederaKit.simulateInvestment(this.simulationTopicId, simulationResult);
      }
      
      return simulationResult;
    } catch (error) {
      console.error(`Error simulating investment for user ${userId} in project ${projectId}:`, error);
      throw error;
    }
  }
}

module.exports = StakemateAgent; 