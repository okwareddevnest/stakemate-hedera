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
    
    // Initialize state
    this.projects = new Map(); // Map of infrastructure projects
    this.users = new Map(); // Map of users
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
      const project = new InfrastructureProject(projectData);
      
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
      
      // Store project
      this.projects.set(project.id, project);
      
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
  getProject(projectId) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }
    return project;
  }

  /**
   * Update project data
   * @param {string} projectId Project ID
   * @param {Object} updateData Update data
   * @returns {Object} Updated project
   */
  async updateProject(projectId, updateData) {
    try {
      const project = this.getProject(projectId);
      
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
      
      // Recalculate risk score
      project.calculateRiskScore();
      
      // Update the project in storage
      this.projects.set(projectId, project);
      
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
      const project = this.getProject(projectId);
      
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
  createUser(userData) {
    try {
      // Create user model
      const user = new User(userData);
      
      // Store user
      this.users.set(user.id, user);
      
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
  getUser(userId) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    return user;
  }

  /**
   * Update user data
   * @param {string} userId User ID
   * @param {Object} updateData Update data
   * @returns {Object} Updated user
   */
  updateUser(userId, updateData) {
    try {
      const user = this.getUser(userId);
      
      // Update user data
      Object.keys(updateData).forEach(key => {
        if (key === 'riskProfile' && updateData.riskProfile) {
          // Handle risk profile updates
          user.updateRiskProfile(updateData.riskProfile);
        } else if (key === 'learningProgress' && updateData.learningProgress) {
          // Handle learning progress updates
          if (updateData.learningProgress.completedLesson) {
            user.completeLesson(updateData.learningProgress.completedLesson);
          }
        } else if (user[key] !== undefined) {
          // Update other properties
          user[key] = updateData[key];
        }
      });
      
      // Update the user in storage
      this.users.set(userId, user);
      
      return user;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get educational content based on user's learning progress
   * @param {string} userId User ID
   * @param {string} topic Topic to learn about
   * @returns {Object} Educational content
   */
  getEducationalContent(userId, topic) {
    try {
      const user = this.getUser(userId);
      
      // Get current knowledge level
      const knowledgeScore = user.learningProgress.knowledgeScore[topic] || 0;
      
      // Determine content difficulty level
      let level = 'beginner';
      if (knowledgeScore > 70) {
        level = 'advanced';
      } else if (knowledgeScore > 30) {
        level = 'intermediate';
      }
      
      // In a real implementation, this would fetch from a content database
      // For now, return mock content
      const content = {
        topic,
        level,
        title: `Understanding ${topic} in infrastructure investing`,
        content: `This is educational content about ${topic} at ${level} level.`,
        lessonId: `lesson-${topic}-${level}-${Date.now()}`,
        scoreIncrement: 10
      };
      
      return content;
    } catch (error) {
      console.error(`Error getting educational content for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a lesson for a user
   * @param {string} userId User ID
   * @param {string} lessonId Lesson ID
   * @param {number} score Score (0-100)
   * @returns {Object} Updated learning progress
   */
  completeLesson(userId, lessonId, score = 100) {
    try {
      const user = this.getUser(userId);
      
      // Get lesson details (in a real implementation, this would come from a database)
      const lesson = {
        id: lessonId,
        name: `Lesson ${lessonId}`,
        topic: lessonId.split('-')[1], // Extract topic from lesson ID
        score
      };
      
      // Record lesson completion
      const updatedProgress = user.completeLesson(lesson);
      
      // Update user
      this.users.set(userId, user);
      
      return updatedProgress;
    } catch (error) {
      console.error(`Error completing lesson for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Analyze a project for a user
   * @param {string} userId User ID
   * @param {string} projectId Project ID
   * @returns {Object} Analysis results
   */
  analyzeProject(userId, projectId) {
    try {
      const user = this.getUser(userId);
      const project = this.getProject(projectId);
      
      // Get user risk profile
      const userRiskTolerance = user.riskProfile.toleranceScore;
      
      // Compare project risk to user tolerance
      const riskAlignment = {
        projectRisk: project.risk.overallScore,
        userTolerance: userRiskTolerance,
        difference: project.risk.overallScore - userRiskTolerance,
        aligned: Math.abs(project.risk.overallScore - userRiskTolerance) <= 20
      };
      
      // Check ESG alignment with user preferences
      const esgAlignment = {
        environmentalAlignment: true, // In a real implementation, this would be calculated
        socialAlignment: true,
        governanceAlignment: true,
        overallAlignment: true
      };
      
      // Check project compliance
      const compliant = project.checkCompliance();
      
      // Get sentiment data
      const sentiment = project.sentiment;
      
      // Create analysis result
      const analysis = {
        projectId,
        projectName: project.name,
        tokenId: project.tokenId,
        riskAnalysis: {
          score: project.risk.overallScore,
          regulatoryRisk: project.risk.regulatoryRisk,
          executionRisk: project.risk.executionRisk,
          marketRisk: project.risk.marketRisk,
          politicalRisk: project.risk.politicalRisk,
          environmentalRisk: project.risk.environmentalRisk
        },
        financialAnalysis: {
          expectedReturn: project.financials.expectedReturn,
          maturityPeriod: project.financials.maturityPeriod,
          governmentBacked: project.financials.governmentBacked,
          fundingStatus: project.financials.fundingSecured / project.financials.totalBudget
        },
        esgAnalysis: {
          environmentalImpact: project.esgMetrics.environmentalImpact,
          carbonReduction: project.esgMetrics.carbonReduction,
          socialBenefit: project.esgMetrics.socialBenefit,
          jobsCreated: project.esgMetrics.jobsCreated,
          governanceRating: project.esgMetrics.governanceRating,
          sustainabilityScore: project.esgMetrics.sustainabilityScore
        },
        regulatoryAnalysis: {
          compliant,
          regulator: project.regulatory.regulator,
          lastCheck: project.regulatory.lastComplianceCheck
        },
        sentimentAnalysis: sentiment,
        userAlignment: {
          risk: riskAlignment,
          esg: esgAlignment
        },
        timestamp: new Date().toISOString()
      };
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing project ${projectId} for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Generate investment recommendation for a user
   * @param {string} userId User ID
   * @param {Array} projectIds Array of project IDs to consider
   * @returns {Object} Recommendation
   */
  async generateRecommendation(userId, projectIds) {
    try {
      const user = this.getUser(userId);
      
      // Get projects
      const projects = projectIds.map(id => this.getProject(id));
      
      // Get recommended projects based on user profile
      const recommendedProjects = user.getRecommendedProjects(projects);
      
      // Create allocation percentages
      const allocations = this.calculateAllocations(recommendedProjects, user);
      
      // Create recommendation
      const recommendation = {
        userId,
        timestamp: new Date().toISOString(),
        projects: recommendedProjects.map(project => ({
          projectId: project.id,
          projectName: project.name,
          projectType: project.type,
          tokenId: project.tokenId,
          allocation: allocations[project.id] || 0,
          riskScore: project.risk.overallScore,
          expectedReturn: project.financials.expectedReturn
        })),
        explanation: {
          riskBased: `This allocation balances risk across different project types, aligning with your ${user.riskProfile.tolerance} risk tolerance.`,
          goalBased: `Projects were selected to align with your investment goals: ${user.riskProfile.investmentGoals.join(', ')}.`,
          timeHorizon: `The recommended allocation considers your ${user.riskProfile.timeHorizon} time horizon.`
        }
      };
      
      // Store recommendation
      this.recommendations.set(userId, recommendation);
      
      // Record recommendation on Hedera
      await this.recordRecommendation(userId, recommendation);
      
      return recommendation;
    } catch (error) {
      console.error(`Error generating recommendation for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate allocation percentages for recommended projects
   * @param {Array} projects Array of projects
   * @param {Object} user User object
   * @returns {Object} Allocation percentages by project ID
   */
  calculateAllocations(projects, user) {
    // This would implement a more sophisticated allocation algorithm
    // For now, use a simple allocation based on project risk and user tolerance
    const allocations = {};
    
    if (projects.length === 0) {
      return allocations;
    }
    
    // Get user risk tolerance
    const userTolerance = user.riskProfile.toleranceScore;
    
    // Calculate risk-weighted allocations
    const totalRiskDiff = projects.reduce((sum, project) => {
      return sum + Math.abs(project.risk.overallScore - userTolerance);
    }, 0);
    
    if (totalRiskDiff === 0) {
      // Equal allocation if all projects have the same risk difference
      const equalAllocation = 100 / projects.length;
      projects.forEach(project => {
        allocations[project.id] = Math.round(equalAllocation);
      });
    } else {
      // Allocate more to projects closer to user's risk tolerance
      let remainingPercent = 100;
      projects.forEach((project, index) => {
        if (index === projects.length - 1) {
          // Last project gets the remainder to ensure sum is 100%
          allocations[project.id] = remainingPercent;
        } else {
          // Calculate allocation based on risk alignment
          const riskDiff = Math.abs(project.risk.overallScore - userTolerance);
          const riskWeight = 1 - (riskDiff / totalRiskDiff);
          const allocation = Math.round(riskWeight * 100 / projects.length);
          allocations[project.id] = allocation;
          remainingPercent -= allocation;
        }
      });
    }
    
    return allocations;
  }

  /**
   * Record recommendation on Hedera
   * @param {string} userId User ID
   * @param {Object} recommendation Recommendation data
   * @returns {Object} Transaction result
   */
  async recordRecommendation(userId, recommendation) {
    try {
      // Create recommendation record for Hedera
      const record = {
        userId,
        timestamp: recommendation.timestamp,
        projects: recommendation.projects.map(p => ({
          projectTokenId: p.tokenId,
          allocation: p.allocation
        })),
        type: 'INVESTMENT_RECOMMENDATION'
      };
      
      // Record on Hedera
      const result = await this.hederaKit.recordRecommendation({
        userId,
        projectTokenId: recommendation.projects.map(p => p.tokenId).join(','),
        recommendationData: JSON.stringify(record),
        topicId: this.recommendationTopicId
      });
      
      return result;
    } catch (error) {
      console.error(`Error recording recommendation for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Simulate investment for a user
   * @param {string} userId User ID
   * @param {string} projectId Project ID
   * @param {number} amount Investment amount
   * @returns {Object} Simulation results
   */
  async simulateInvestment(userId, projectId, amount) {
    try {
      const user = this.getUser(userId);
      const project = this.getProject(projectId);
      
      // Check if amount meets minimum
      if (amount < project.investmentMetrics.minInvestmentAmount) {
        throw new Error(`Minimum investment amount is ${project.investmentMetrics.minInvestmentAmount}`);
      }
      
      // Calculate number of tokens
      const price = 1; // In a real implementation, this would be the current token price
      const units = amount / price;
      
      // Create investment data
      const investmentData = {
        projectId,
        projectName: project.name,
        projectType: project.type,
        tokenId: project.tokenId,
        amount,
        units,
        price,
        type: 'simulated'
      };
      
      // Add investment to user portfolio
      const investment = user.addInvestment(investmentData);
      
      // Update user
      this.users.set(userId, user);
      
      // Record simulation on Hedera
      const result = await this.hederaKit.simulateInvestment({
        userId,
        tokenId: project.tokenId,
        amount,
        units,
        topicId: this.simulationTopicId
      });
      
      // Return simulation results
      return {
        investment,
        portfolio: user.portfolio,
        transaction: result
      };
    } catch (error) {
      console.error(`Error simulating investment for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Check compliance of a project
   * @param {string} projectId Project ID
   * @returns {Object} Compliance check results
   */
  checkProjectCompliance(projectId) {
    try {
      const project = this.getProject(projectId);
      
      // Check compliance
      const compliant = project.checkCompliance();
      
      // Return compliance check results
      return {
        projectId,
        projectName: project.name,
        tokenId: project.tokenId,
        compliant,
        regulator: project.regulatory.regulator,
        lastCheck: project.regulatory.lastComplianceCheck,
        licenses: project.regulatory.licenses
      };
    } catch (error) {
      console.error(`Error checking compliance for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get project sentiment data
   * @param {string} projectId Project ID
   * @returns {Object} Sentiment data
   */
  getProjectSentiment(projectId) {
    try {
      const project = this.getProject(projectId);
      
      // Get current sentiment
      const sentiment = project.sentiment;
      
      // In a real implementation, this would fetch live sentiment data
      // For now, return the stored sentiment
      return {
        projectId,
        projectName: project.name,
        tokenId: project.tokenId,
        sentiment,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting sentiment for project ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Update project sentiment data
   * @param {string} projectId Project ID
   * @param {Object} sentimentData Sentiment data
   * @returns {Object} Updated sentiment
   */
  async updateProjectSentiment(projectId, sentimentData) {
    try {
      const project = this.getProject(projectId);
      
      // Update sentiment
      const updatedSentiment = project.updateSentiment(sentimentData);
      
      // Update project
      this.projects.set(projectId, project);
      
      // Record update on Hedera
      await this.recordProjectUpdate(projectId, { sentiment: updatedSentiment });
      
      return updatedSentiment;
    } catch (error) {
      console.error(`Error updating sentiment for project ${projectId}:`, error);
      throw error;
    }
  }
}

module.exports = StakemateAgent; 