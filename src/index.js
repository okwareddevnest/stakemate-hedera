require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/database');
const StakemateAgent = require('./agent/StakemateAgent');
const SentimentService = require('./services/SentimentService');
const ComplianceService = require('./services/ComplianceService');
const ESGUtils = require('./utils/ESGUtils');
const PortfolioUtils = require('./utils/PortfolioUtils');
const TokenAnalytics = require('./utils/TokenAnalytics');
const MilestoneUtils = require('./utils/MilestoneUtils');

// Import route handlers
const hederaRoutes = require('./routes/hederaRoutes');
const directHederaRoutes = require('./routes/directHederaRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize services
const stakemateAgent = new StakemateAgent();
const sentimentService = new SentimentService();
const complianceService = new ComplianceService();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Set port
const PORT = process.env.PORT || 3000;

// API routes
app.use('/api/hedera', hederaRoutes);
app.use('/api/direct-hedera', directHederaRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    elizaStatus: process.env.ELIZA_API_URL ? 'configured' : 'not configured',
    hederaClientStatus: require('./hedera/HederaClient').isConfigured ? 'configured' : 'not configured',
    dbStatus: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Infrastructure Project endpoints
app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body;
    const result = await stakemateAgent.createProject(project);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedProject = req.body;
    const result = await stakemateAgent.updateProject(projectId, updatedProject);
    
    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await stakemateAgent.listProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User endpoints
app.post('/api/users', async (req, res) => {
  try {
    const user = req.body;
    const result = await stakemateAgent.createUser(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await stakemateAgent.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = req.body;
    const result = await stakemateAgent.updateUser(userId, updatedUser);
    
    if (!result) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Educational content endpoints
app.get('/api/education/:userId/:topic', async (req, res) => {
  try {
    const { userId, topic } = req.params;
    const content = await stakemateAgent.getEducationalContent(userId, topic);
    res.status(200).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/education/:userId/complete', async (req, res) => {
  try {
    const { userId } = req.params;
    const { lessonId } = req.body;
    const result = await stakemateAgent.markLessonComplete(userId, lessonId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Project analysis endpoints
app.get('/api/analysis/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const analysis = await stakemateAgent.analyzeProjectForUser(userId, projectId);
    res.status(200).json(analysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Investment recommendation endpoints
app.post('/api/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { projectIds } = req.body;
    const recommendations = await stakemateAgent.generateRecommendations(userId, projectIds);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Investment simulation endpoints
app.post('/api/simulation/:userId/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { amount, duration } = req.body;
    const simulation = await stakemateAgent.simulateInvestment(userId, projectId, amount, duration);
    res.status(200).json(simulation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Compliance endpoints
app.get('/api/compliance/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { regulatorId } = req.query;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const complianceResults = await complianceService.verifyCompliance(project, regulatorId);
    res.status(200).json(complianceResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/compliance/:projectId/rule/:ruleId', async (req, res) => {
  try {
    const { projectId, ruleId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const rule = complianceService.getRule(ruleId);
    
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    
    const complianceResult = await complianceService.checkRule(project, rule);
    res.status(200).json(complianceResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sentiment analysis endpoints
app.get('/api/sentiment/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const sentimentResults = await sentimentService.analyzeProjectSentiment(project.name, project.description);
    res.status(200).json(sentimentResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/sentiment/market/:sector', async (req, res) => {
  try {
    const { sector } = req.params;
    const insights = await sentimentService.generateMarketInsights(sector);
    res.status(200).json(insights);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/sentiment/compare', async (req, res) => {
  try {
    const { projectIds } = req.body;
    const projects = projectIds.map(id => stakemateAgent.getProject(id));
    const projectNames = projects.map(p => p.name);
    const comparison = await sentimentService.compareSentiment(projectNames);
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing sentiment:', error);
    res.status(500).json({ error: error.message });
  }
});

// ESG analysis endpoints
app.get('/api/esg/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const esgScore = ESGUtils.calculateESGScore(project);
    res.status(200).json(esgScore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/esg/:projectId/statement', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const esgStatement = ESGUtils.generateESGStatement(project);
    res.status(200).json({ projectId, statement: esgStatement });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/esg/:projectId/sdgs', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const sdgs = ESGUtils.mapToSDGs(project);
    res.status(200).json({ projectId, sdgs });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/esg/compare', async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Project IDs array is required' });
    }
    
    const projects = [];
    for (const projectId of projectIds) {
      const project = await stakemateAgent.getProject(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'No valid projects found' });
    }
    
    const comparison = ESGUtils.compareESGProfiles(projects);
    res.status(200).json(comparison);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Portfolio management endpoints
app.post('/api/portfolio/:userId/allocate', async (req, res) => {
  try {
    const { userId } = req.params;
    const { projectIds } = req.body;
    
    const user = await stakemateAgent.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Project IDs array is required' });
    }
    
    const projects = [];
    for (const projectId of projectIds) {
      const project = await stakemateAgent.getProject(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'No valid projects found' });
    }
    
    const allocation = PortfolioUtils.generateAllocation(user, projects);
    res.status(200).json(allocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user portfolio
app.get('/api/users/:userId/portfolio', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await stakemateAgent.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the portfolio data
    return res.status(200).json({
      success: true,
      data: user.portfolio
    });
  } catch (error) {
    console.error('Error getting user portfolio:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get user investments
app.get('/api/users/:userId/investments', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await stakemateAgent.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the investments data
    return res.status(200).json({
      success: true,
      data: user.investmentHistory
    });
  } catch (error) {
    console.error('Error getting user investments:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.post('/api/portfolio/:userId/metrics', async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = req.body;
    
    if (!portfolio || !portfolio.allocations) {
      return res.status(400).json({ error: 'Valid portfolio with allocations is required' });
    }
    
    const projectIds = portfolio.allocations.map(a => a.projectId);
    const projects = [];
    
    for (const projectId of projectIds) {
      const project = await stakemateAgent.getProject(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'No valid projects found in portfolio' });
    }
    
    const metrics = PortfolioUtils.calculatePortfolioMetrics(portfolio, projects);
    res.status(200).json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/portfolio/:userId/simulate', async (req, res) => {
  try {
    const { userId } = req.params;
    const { portfolio, months } = req.body;
    
    if (!portfolio || !portfolio.allocations) {
      return res.status(400).json({ error: 'Valid portfolio with allocations is required' });
    }
    
    const projectIds = portfolio.allocations.map(a => a.projectId);
    const projects = [];
    
    for (const projectId of projectIds) {
      const project = await stakemateAgent.getProject(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'No valid projects found in portfolio' });
    }
    
    const simulationResults = PortfolioUtils.simulatePerformance(portfolio, projects, months || 36);
    res.status(200).json(simulationResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/portfolio/:userId/rebalance', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPortfolio, targetPortfolio } = req.body;
    
    if (!currentPortfolio || !targetPortfolio) {
      return res.status(400).json({ error: 'Both current and target portfolios are required' });
    }
    
    const rebalancingPlan = PortfolioUtils.generateRebalancingPlan(currentPortfolio, targetPortfolio);
    res.status(200).json(rebalancingPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Token analysis endpoints
app.get('/api/tokens/:projectId/distribution', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const distributionAnalysis = TokenAnalytics.analyzeTokenDistribution(project);
    res.status(200).json(distributionAnalysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tokens/:projectId/predict', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { months } = req.query;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const prediction = TokenAnalytics.predictTokenPrice(project, parseInt(months) || 12);
    res.status(200).json(prediction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tokens/:projectId/metrics', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const metrics = TokenAnalytics.calculateTokenMetrics(project);
    res.status(200).json(metrics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/tokens/compare', async (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Project IDs array is required' });
    }
    
    const projects = [];
    for (const projectId of projectIds) {
      const project = await stakemateAgent.getProject(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'No valid projects found' });
    }
    
    const comparison = TokenAnalytics.compareTokens(projects);
    res.status(200).json(comparison);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Milestone management endpoints
app.post('/api/milestones/:projectId/generate', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { startDate, endDate } = req.body;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const milestones = MilestoneUtils.generateStandardMilestones(
      project.type,
      startDate,
      endDate
    );
    
    // Save generated milestones to project
    project.milestones = milestones;
    await stakemateAgent.updateProject(projectId, project);
    
    res.status(200).json({ projectId, milestones });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/milestones/:projectId/progress', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.milestones || project.milestones.length === 0) {
      return res.status(400).json({ error: 'Project has no milestones' });
    }
    
    const progress = MilestoneUtils.calculateProgress(project.milestones);
    res.status(200).json({ projectId, ...progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/milestones/:projectId/:milestoneId', async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const updates = req.body;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.milestones) {
      return res.status(400).json({ error: 'Project has no milestones' });
    }
    
    const milestoneIndex = project.milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) {
      return res.status(404).json({ error: 'Milestone not found' });
    }
    
    // Update milestone
    project.milestones[milestoneIndex] = {
      ...project.milestones[milestoneIndex],
      ...updates,
      
      // If marked as completed, set the completion date
      ...(updates.completed ? { completedDate: new Date().toISOString() } : {})
    };
    
    // Save updated project
    await stakemateAgent.updateProject(projectId, project);
    
    // Format for consensus if needed
    const consensusFormat = MilestoneUtils.formatMilestoneForConsensus(
      project.milestones[milestoneIndex],
      projectId
    );
    
    // Generate update message
    const updateMessage = MilestoneUtils.generateUpdateMessage(
      project.milestones[milestoneIndex],
      project
    );
    
    res.status(200).json({
      projectId,
      milestone: project.milestones[milestoneIndex],
      consensusFormat,
      updateMessage
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/milestones/:projectId/risk', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await stakemateAgent.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.milestones || project.milestones.length === 0) {
      return res.status(400).json({ error: 'Project has no milestones' });
    }
    
    const riskAssessment = MilestoneUtils.assessMilestoneRisk(project.milestones);
    res.status(200).json({ projectId, ...riskAssessment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chatbot endpoint for agent conversation
app.post('/api/chat/:userId', (req, res) => {
  try {
    const { message } = req.body;
    // This would integrate with an LLM or the Eliza pattern for agent responses
    // For now, return a mock response
    res.json({
      userId: req.params.userId,
      message,
      response: "I'm Stakemate, your AI financial advisor. I'm here to help you with infrastructure micro-investments in Kenya. What would you like to know about today?",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'An unexpected error occurred',
    message: err.message
  });
});

// Import and connect to MongoDB, then start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Initialize demo data if in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(async () => {
          try {
            await stakemateAgent.createDemoData();
            console.log('Demo data created successfully');
          } catch (error) {
            console.error('Error creating demo data:', error);
          }
        }, 2000);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; 