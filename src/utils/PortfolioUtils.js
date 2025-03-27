/**
 * PortfolioUtils - Utilities for portfolio management, allocation strategies, and performance tracking
 * Helps with investment portfolio management for infrastructure projects
 */
class PortfolioUtils {
  /**
   * Generate optimal portfolio allocation based on user risk profile and available projects
   * @param {Object} user User object with risk tolerance
   * @param {Array} projects Array of available infrastructure projects
   * @returns {Object} Recommended portfolio allocation
   */
  static generateAllocation(user, projects) {
    if (!user || !projects || projects.length === 0) {
      return {
        success: false,
        message: 'Insufficient data for portfolio allocation'
      };
    }
    
    // Map risk tolerance to allocation strategy
    const riskToleranceMapping = {
      'very_low': { highRisk: 0.1, mediumRisk: 0.3, lowRisk: 0.6 },
      'low': { highRisk: 0.2, mediumRisk: 0.4, lowRisk: 0.4 },
      'moderate': { highRisk: 0.3, mediumRisk: 0.5, lowRisk: 0.2 },
      'high': { highRisk: 0.5, mediumRisk: 0.4, lowRisk: 0.1 },
      'very_high': { highRisk: 0.7, mediumRisk: 0.2, lowRisk: 0.1 }
    };
    
    // Default to moderate if not specified
    const riskProfile = riskToleranceMapping[user.riskTolerance] || riskToleranceMapping.moderate;
    
    // Categorize projects by risk level
    const projectsByRisk = {
      highRisk: [],
      mediumRisk: [],
      lowRisk: []
    };
    
    projects.forEach(project => {
      // Determine project risk based on multiple factors
      const riskCategory = this.assessProjectRisk(project);
      projectsByRisk[riskCategory].push(project);
    });
    
    // Calculate allocation percentages
    const totalAllocation = {};
    let remainingPercentage = 100;
    
    // Allocate by risk category, starting with low risk
    ['lowRisk', 'mediumRisk', 'highRisk'].forEach(riskCategory => {
      const categoryProjects = projectsByRisk[riskCategory];
      if (categoryProjects.length === 0) return;
      
      const categoryAllocation = riskProfile[riskCategory] * 100;
      const projectAllocation = categoryAllocation / categoryProjects.length;
      
      categoryProjects.forEach(project => {
        totalAllocation[project.id] = {
          projectId: project.id,
          projectName: project.name,
          allocation: parseFloat(projectAllocation.toFixed(2)),
          riskCategory
        };
        remainingPercentage -= projectAllocation;
      });
    });
    
    // Distribute any remaining percentage proportionally
    if (remainingPercentage > 0.1 && Object.keys(totalAllocation).length > 0) {
      const additionalPerProject = remainingPercentage / Object.keys(totalAllocation).length;
      Object.keys(totalAllocation).forEach(projectId => {
        totalAllocation[projectId].allocation = parseFloat(
          (totalAllocation[projectId].allocation + additionalPerProject).toFixed(2)
        );
      });
    }
    
    return {
      success: true,
      userRiskProfile: user.riskTolerance || 'moderate',
      totalProjects: projects.length,
      allocations: Object.values(totalAllocation),
      allocationByRisk: {
        highRisk: parseFloat((riskProfile.highRisk * 100).toFixed(2)),
        mediumRisk: parseFloat((riskProfile.mediumRisk * 100).toFixed(2)),
        lowRisk: parseFloat((riskProfile.lowRisk * 100).toFixed(2))
      },
      generatedTimestamp: new Date().toISOString()
    };
  }

  /**
   * Assess the risk level of a project
   * @param {Object} project Project object
   * @returns {string} Risk category (highRisk, mediumRisk, lowRisk)
   */
  static assessProjectRisk(project) {
    // Default risk score
    let riskScore = 50;
    
    // If project has a risk score already, use it
    if (project.riskScore) {
      riskScore = project.riskScore;
    } else {
      // Calculate risk based on various factors
      
      // 1. Project type risk
      const projectTypeRisks = {
        'energy': 40,
        'solar': 30,
        'wind': 35,
        'hydro': 45,
        'transportation': 50,
        'rail': 55,
        'road': 45,
        'water': 40,
        'wastewater': 45,
        'telecom': 40,
        'digital': 60,
        'housing': 50,
        'healthcare': 35,
        'education': 30
      };
      
      // Get base risk from project type
      for (const [type, risk] of Object.entries(projectTypeRisks)) {
        if (project.type && project.type.toLowerCase().includes(type)) {
          riskScore = risk;
          break;
        }
      }
      
      // 2. Project phase adjustment
      if (project.phase) {
        const phaseRiskAdjustment = {
          'planning': 20, // Higher risk in planning phase
          'development': 15,
          'construction': 10,
          'operational': -15 // Lower risk when operational
        };
        
        for (const [phase, adjustment] of Object.entries(phaseRiskAdjustment)) {
          if (project.phase.toLowerCase().includes(phase)) {
            riskScore += adjustment;
            break;
          }
        }
      }
      
      // 3. Duration risk (longer projects have higher risk)
      if (project.duration) {
        if (project.duration > 60) riskScore += 15; // > 5 years
        else if (project.duration > 36) riskScore += 10; // 3-5 years
        else if (project.duration > 12) riskScore += 5; // 1-3 years
      }
      
      // 4. Size/budget risk
      if (project.totalInvestment) {
        if (project.totalInvestment > 10000000) riskScore += 10; // > $10M
        else if (project.totalInvestment > 5000000) riskScore += 5; // > $5M
        else if (project.totalInvestment < 1000000) riskScore -= 5; // < $1M
      }
      
      // 5. Regulatory risk
      if (project.regulatoryComplexity) {
        if (project.regulatoryComplexity === 'high') riskScore += 15;
        else if (project.regulatoryComplexity === 'medium') riskScore += 5;
        else if (project.regulatoryComplexity === 'low') riskScore -= 5;
      }
      
      // Ensure risk score is within bounds
      riskScore = Math.max(0, Math.min(100, riskScore));
    }
    
    // Map score to risk category
    if (riskScore >= 65) return 'highRisk';
    if (riskScore >= 35) return 'mediumRisk';
    return 'lowRisk';
  }

  /**
   * Calculate portfolio metrics
   * @param {Object} portfolio Portfolio object with allocations
   * @param {Array} projects Array of projects in the portfolio
   * @returns {Object} Portfolio metrics
   */
  static calculatePortfolioMetrics(portfolio, projects) {
    if (!portfolio || !portfolio.allocations || !projects || projects.length === 0) {
      return {
        success: false,
        message: 'Insufficient data for portfolio metrics calculation'
      };
    }
    
    const projectsMap = {};
    projects.forEach(project => {
      projectsMap[project.id] = project;
    });
    
    // Calculate weighted expected return
    let expectedReturn = 0;
    let totalRisk = 0;
    let totalTokens = 0;
    let weightedESGScore = 0;
    
    // Project-specific metrics
    const projectMetrics = [];
    
    portfolio.allocations.forEach(allocation => {
      const project = projectsMap[allocation.projectId];
      if (!project) return;
      
      const allocationPercent = allocation.allocation / 100;
      const projectReturn = project.expectedReturn || 0;
      
      // Calculate expected return weighted by allocation
      expectedReturn += projectReturn * allocationPercent;
      
      // Calculate risk
      const riskValue = this.getRiskValue(allocation.riskCategory);
      totalRisk += riskValue * allocationPercent;
      
      // Calculate token allocation if available
      if (project.tokenPrice && project.totalSupply) {
        const investmentValue = portfolio.totalInvestment * allocationPercent;
        const tokensAllocated = investmentValue / project.tokenPrice;
        totalTokens += tokensAllocated;
        
        // Add to project metrics
        projectMetrics.push({
          projectId: project.id,
          projectName: project.name,
          allocation: allocation.allocation,
          expectedReturn: projectReturn,
          tokensAllocated,
          investmentValue,
          riskCategory: allocation.riskCategory
        });
      }
      
      // Add ESG score if available
      if (project.esgScore) {
        weightedESGScore += project.esgScore * allocationPercent;
      }
    });
    
    // Calculate diversification score (0-100)
    const diversificationScore = this.calculateDiversificationScore(portfolio.allocations, projects);
    
    // Risk-adjusted return (Sharpe ratio simplified)
    const riskAdjustedReturn = totalRisk > 0 ? expectedReturn / totalRisk : 0;
    
    return {
      success: true,
      portfolioId: portfolio.id,
      expectedAnnualReturn: parseFloat(expectedReturn.toFixed(2)),
      riskLevel: this.getRiskLevelFromValue(totalRisk),
      riskValue: parseFloat(totalRisk.toFixed(2)),
      diversificationScore,
      riskAdjustedReturn: parseFloat(riskAdjustedReturn.toFixed(2)),
      totalTokensAllocated: totalTokens,
      esgScore: parseFloat(weightedESGScore.toFixed(2)) || null,
      projectMetrics,
      calculatedTimestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate diversification score based on allocations
   * @param {Array} allocations Array of project allocations
   * @param {Array} projects Array of projects
   * @returns {number} Diversification score (0-100)
   */
  static calculateDiversificationScore(allocations, projects) {
    if (!allocations || allocations.length === 0) return 0;
    
    // More projects = better diversification
    const projectCountScore = Math.min(100, allocations.length * 10);
    
    // Even distribution = better diversification
    const allocationValues = allocations.map(a => a.allocation);
    const avgAllocation = allocationValues.reduce((sum, val) => sum + val, 0) / allocationValues.length;
    const allocationVariance = allocationValues.reduce((sum, val) => sum + Math.pow(val - avgAllocation, 2), 0) / allocationValues.length;
    const allocationScore = 100 - Math.min(100, allocationVariance);
    
    // Sector diversification
    const sectorMap = {};
    allocations.forEach(allocation => {
      const project = projects.find(p => p.id === allocation.projectId);
      if (project && project.sector) {
        sectorMap[project.sector] = (sectorMap[project.sector] || 0) + allocation.allocation;
      }
    });
    const sectorCount = Object.keys(sectorMap).length;
    const sectorScore = Math.min(100, sectorCount * 20);
    
    // Weighted average
    return Math.round((projectCountScore * 0.3) + (allocationScore * 0.4) + (sectorScore * 0.3));
  }

  /**
   * Get risk value from risk category
   * @param {string} riskCategory Risk category (highRisk, mediumRisk, lowRisk)
   * @returns {number} Risk value
   */
  static getRiskValue(riskCategory) {
    switch (riskCategory) {
      case 'highRisk': return 0.8;
      case 'mediumRisk': return 0.5;
      case 'lowRisk': return 0.2;
      default: return 0.5;
    }
  }

  /**
   * Get risk level from risk value
   * @param {number} riskValue Risk value
   * @returns {string} Risk level
   */
  static getRiskLevelFromValue(riskValue) {
    if (riskValue >= 0.7) return 'High';
    if (riskValue >= 0.4) return 'Medium';
    return 'Low';
  }

  /**
   * Simulate portfolio performance over time
   * @param {Object} portfolio Portfolio object with allocations
   * @param {Array} projects Array of projects in the portfolio
   * @param {number} months Number of months to simulate
   * @returns {Object} Simulated performance
   */
  static simulatePerformance(portfolio, projects, months = 36) {
    if (!portfolio || !portfolio.allocations || !projects || projects.length === 0) {
      return {
        success: false,
        message: 'Insufficient data for performance simulation'
      };
    }
    
    const projectsMap = {};
    projects.forEach(project => {
      projectsMap[project.id] = project;
    });
    
    // Initial portfolio value
    const initialValue = portfolio.totalInvestment || 10000;
    let currentValue = initialValue;
    
    // Monthly data points
    const timeSeriesData = [];
    const projectValues = {};
    
    // Initialize project values
    portfolio.allocations.forEach(allocation => {
      const projectId = allocation.projectId;
      const allocationAmount = initialValue * (allocation.allocation / 100);
      projectValues[projectId] = allocationAmount;
    });
    
    // Simulate each month
    for (let month = 0; month <= months; month++) {
      // For month 0, just record the initial value
      if (month === 0) {
        timeSeriesData.push({
          month,
          totalValue: initialValue,
          projectValues: { ...projectValues },
          percentChange: 0
        });
        continue;
      }
      
      let newTotalValue = 0;
      const newProjectValues = {};
      
      // Calculate new value for each project
      portfolio.allocations.forEach(allocation => {
        const projectId = allocation.projectId;
        const project = projectsMap[projectId];
        
        if (!project) return;
        
        // Get current project value
        const currentProjectValue = projectValues[projectId];
        
        // Calculate growth based on expected return and volatility
        const expectedMonthlyReturn = (project.expectedReturn || 0.05) / 12;
        const volatility = this.getVolatilityByRiskCategory(allocation.riskCategory);
        
        // Add random variation based on volatility (simple random walk model)
        const randomFactor = 1 + expectedMonthlyReturn + (Math.random() * 2 - 1) * volatility;
        
        // New project value
        const newProjectValue = currentProjectValue * randomFactor;
        newProjectValues[projectId] = newProjectValue;
        newTotalValue += newProjectValue;
      });
      
      // Record time series data
      timeSeriesData.push({
        month,
        totalValue: parseFloat(newTotalValue.toFixed(2)),
        projectValues: Object.fromEntries(
          Object.entries(newProjectValues).map(([k, v]) => [k, parseFloat(v.toFixed(2))])
        ),
        percentChange: parseFloat((((newTotalValue - initialValue) / initialValue) * 100).toFixed(2))
      });
      
      // Update current values for next iteration
      currentValue = newTotalValue;
      Object.assign(projectValues, newProjectValues);
    }
    
    // Calculate final metrics
    const finalValue = timeSeriesData[months].totalValue;
    const totalReturn = ((finalValue - initialValue) / initialValue) * 100;
    const annualizedReturn = Math.pow((finalValue / initialValue), (12 / months)) - 1;
    
    return {
      success: true,
      initialValue,
      finalValue: parseFloat(finalValue.toFixed(2)),
      totalReturnPercent: parseFloat(totalReturn.toFixed(2)),
      annualizedReturnPercent: parseFloat((annualizedReturn * 100).toFixed(2)),
      simulationMonths: months,
      timeSeriesData,
      simulatedTimestamp: new Date().toISOString()
    };
  }

  /**
   * Get volatility value by risk category
   * @param {string} riskCategory Risk category (highRisk, mediumRisk, lowRisk)
   * @returns {number} Volatility value
   */
  static getVolatilityByRiskCategory(riskCategory) {
    switch (riskCategory) {
      case 'highRisk': return 0.04; // 4% monthly volatility
      case 'mediumRisk': return 0.025; // 2.5% monthly volatility
      case 'lowRisk': return 0.01; // 1% monthly volatility
      default: return 0.025;
    }
  }

  /**
   * Generate portfolio rebalancing recommendations
   * @param {Object} currentPortfolio Current portfolio with allocations
   * @param {Object} targetPortfolio Target portfolio with allocations
   * @returns {Object} Rebalancing recommendations
   */
  static generateRebalancingPlan(currentPortfolio, targetPortfolio) {
    if (!currentPortfolio || !targetPortfolio || 
        !currentPortfolio.allocations || !targetPortfolio.allocations) {
      return {
        success: false,
        message: 'Insufficient data for rebalancing plan'
      };
    }
    
    const currentAllocationMap = {};
    currentPortfolio.allocations.forEach(allocation => {
      currentAllocationMap[allocation.projectId] = allocation.allocation;
    });
    
    const targetAllocationMap = {};
    targetPortfolio.allocations.forEach(allocation => {
      targetAllocationMap[allocation.projectId] = allocation.allocation;
    });
    
    // Calculate changes needed
    const allProjectIds = [...new Set([
      ...Object.keys(currentAllocationMap),
      ...Object.keys(targetAllocationMap)
    ])];
    
    const changes = [];
    let totalAbsoluteChange = 0;
    
    allProjectIds.forEach(projectId => {
      const currentAllocation = currentAllocationMap[projectId] || 0;
      const targetAllocation = targetAllocationMap[projectId] || 0;
      const difference = targetAllocation - currentAllocation;
      
      if (Math.abs(difference) > 0.1) { // Only include meaningful changes (>0.1%)
        changes.push({
          projectId,
          currentAllocation,
          targetAllocation,
          difference,
          action: difference > 0 ? 'increase' : 'decrease'
        });
        totalAbsoluteChange += Math.abs(difference);
      }
    });
    
    // Sort changes by absolute difference (descending)
    changes.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
    
    return {
      success: true,
      portfolioId: currentPortfolio.id,
      targetPortfolioId: targetPortfolio.id,
      totalAbsoluteChange: parseFloat(totalAbsoluteChange.toFixed(2)),
      changeCount: changes.length,
      changes,
      generatedTimestamp: new Date().toISOString()
    };
  }
}

module.exports = PortfolioUtils; 