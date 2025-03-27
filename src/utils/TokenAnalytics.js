/**
 * TokenAnalytics - Utilities for token analytics, price prediction, and tokenomics analysis
 * Helps analyze project tokens and make predictions about their performance
 */
class TokenAnalytics {
  /**
   * Analyze token distribution and calculate health metrics
   * @param {Object} project Project with token data
   * @returns {Object} Token distribution analysis
   */
  static analyzeTokenDistribution(project) {
    if (!project || !project.tokenomics) {
      return {
        success: false,
        message: 'Missing token data for analysis'
      };
    }
    
    const tokenomics = project.tokenomics;
    const totalSupply = tokenomics.totalSupply || 0;
    
    if (totalSupply === 0) {
      return {
        success: false,
        message: 'Invalid total supply (0)'
      };
    }
    
    // Calculate percentages for each allocation
    const allocations = tokenomics.allocations || [];
    const calculatedAllocations = allocations.map(allocation => {
      const percentage = (allocation.amount / totalSupply) * 100;
      return {
        ...allocation,
        percentage: parseFloat(percentage.toFixed(2))
      };
    });
    
    // Calculate concentration metrics
    const concentrationMetrics = this.calculateConcentrationMetrics(calculatedAllocations);
    
    // Calculate unlock schedule metrics
    const unlockMetrics = this.calculateUnlockMetrics(tokenomics.unlockSchedule || []);
    
    // Calculate token circulation over time
    const circulationOverTime = this.calculateCirculationOverTime(
      totalSupply,
      tokenomics.unlockSchedule || [],
      tokenomics.initialCirculation || 0
    );
    
    return {
      success: true,
      projectId: project.id,
      projectName: project.name,
      totalSupply,
      symbol: tokenomics.symbol || 'TOKEN',
      allocations: calculatedAllocations,
      concentration: concentrationMetrics,
      unlockMetrics,
      circulationOverTime,
      analysisTimestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate concentration metrics for token distribution
   * @param {Array} allocations Token allocations with percentages
   * @returns {Object} Concentration metrics
   */
  static calculateConcentrationMetrics(allocations) {
    if (!allocations || allocations.length === 0) {
      return {
        topHolderPercentage: 0,
        top3HoldersPercentage: 0,
        top5HoldersPercentage: 0,
        top10HoldersPercentage: 0,
        publicPercentage: 0,
        teamPercentage: 0,
        institutionalPercentage: 0,
        healthScore: 0
      };
    }
    
    // Sort allocations by percentage (descending)
    const sortedAllocations = [...allocations].sort((a, b) => b.percentage - a.percentage);
    
    // Calculate top holder percentages
    const topHolderPercentage = sortedAllocations[0]?.percentage || 0;
    const top3HoldersPercentage = sortedAllocations.slice(0, 3).reduce((sum, a) => sum + a.percentage, 0);
    const top5HoldersPercentage = sortedAllocations.slice(0, 5).reduce((sum, a) => sum + a.percentage, 0);
    const top10HoldersPercentage = sortedAllocations.slice(0, 10).reduce((sum, a) => sum + a.percentage, 0);
    
    // Calculate type-based percentages
    const publicPercentage = allocations
      .filter(a => a.type === 'public' || a.type === 'community')
      .reduce((sum, a) => sum + a.percentage, 0);
    
    const teamPercentage = allocations
      .filter(a => a.type === 'team' || a.type === 'founders' || a.type === 'advisors')
      .reduce((sum, a) => sum + a.percentage, 0);
    
    const institutionalPercentage = allocations
      .filter(a => a.type === 'investors' || a.type === 'institutional' || a.type === 'venture')
      .reduce((sum, a) => sum + a.percentage, 0);
    
    // Calculate health score (0-100)
    let healthScore = 100;
    
    // Penalty for high concentration
    if (topHolderPercentage > 20) healthScore -= (topHolderPercentage - 20) * 1.5;
    if (top3HoldersPercentage > 40) healthScore -= (top3HoldersPercentage - 40) * 1;
    
    // Penalty for low public allocation
    if (publicPercentage < 30) healthScore -= (30 - publicPercentage) * 0.5;
    
    // Penalty for high team allocation without sufficient vesting
    if (teamPercentage > 20) healthScore -= (teamPercentage - 20) * 0.3;
    
    // Ensure the score is within valid range
    healthScore = Math.max(0, Math.min(100, healthScore));
    
    return {
      topHolderPercentage: parseFloat(topHolderPercentage.toFixed(2)),
      top3HoldersPercentage: parseFloat(top3HoldersPercentage.toFixed(2)),
      top5HoldersPercentage: parseFloat(top5HoldersPercentage.toFixed(2)),
      top10HoldersPercentage: parseFloat(top10HoldersPercentage.toFixed(2)),
      publicPercentage: parseFloat(publicPercentage.toFixed(2)),
      teamPercentage: parseFloat(teamPercentage.toFixed(2)),
      institutionalPercentage: parseFloat(institutionalPercentage.toFixed(2)),
      healthScore: Math.round(healthScore)
    };
  }

  /**
   * Calculate unlock metrics for token vesting schedules
   * @param {Array} unlockSchedule Token unlock schedule
   * @returns {Object} Unlock metrics
   */
  static calculateUnlockMetrics(unlockSchedule) {
    if (!unlockSchedule || unlockSchedule.length === 0) {
      return {
        nextUnlockDate: null,
        nextUnlockPercentage: 0,
        next3MonthsUnlockPercentage: 0,
        next6MonthsUnlockPercentage: 0,
        next12MonthsUnlockPercentage: 0,
        averageVestingPeriod: 0
      };
    }
    
    const now = new Date();
    const sortedUnlocks = [...unlockSchedule]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(unlock => new Date(unlock.date) > now);
    
    // Next unlock
    const nextUnlock = sortedUnlocks[0];
    const nextUnlockDate = nextUnlock ? nextUnlock.date : null;
    const nextUnlockPercentage = nextUnlock ? nextUnlock.percentage : 0;
    
    // Unlocks in time periods
    const next3Months = new Date(now);
    next3Months.setMonth(now.getMonth() + 3);
    
    const next6Months = new Date(now);
    next6Months.setMonth(now.getMonth() + 6);
    
    const next12Months = new Date(now);
    next12Months.setMonth(now.getMonth() + 12);
    
    const next3MonthsUnlockPercentage = sortedUnlocks
      .filter(unlock => new Date(unlock.date) <= next3Months)
      .reduce((sum, unlock) => sum + unlock.percentage, 0);
    
    const next6MonthsUnlockPercentage = sortedUnlocks
      .filter(unlock => new Date(unlock.date) <= next6Months)
      .reduce((sum, unlock) => sum + unlock.percentage, 0);
    
    const next12MonthsUnlockPercentage = sortedUnlocks
      .filter(unlock => new Date(unlock.date) <= next12Months)
      .reduce((sum, unlock) => sum + unlock.percentage, 0);
    
    // Calculate average vesting period
    let totalMonths = 0;
    let totalPercentage = 0;
    
    sortedUnlocks.forEach(unlock => {
      const unlockDate = new Date(unlock.date);
      const monthsDiff = (unlockDate.getFullYear() - now.getFullYear()) * 12 + 
                          unlockDate.getMonth() - now.getMonth();
      
      totalMonths += monthsDiff * unlock.percentage;
      totalPercentage += unlock.percentage;
    });
    
    const averageVestingPeriod = totalPercentage > 0 ? totalMonths / totalPercentage : 0;
    
    return {
      nextUnlockDate,
      nextUnlockPercentage: parseFloat(nextUnlockPercentage.toFixed(2)),
      next3MonthsUnlockPercentage: parseFloat(next3MonthsUnlockPercentage.toFixed(2)),
      next6MonthsUnlockPercentage: parseFloat(next6MonthsUnlockPercentage.toFixed(2)),
      next12MonthsUnlockPercentage: parseFloat(next12MonthsUnlockPercentage.toFixed(2)),
      averageVestingPeriod: parseFloat(averageVestingPeriod.toFixed(1))
    };
  }

  /**
   * Calculate token circulation over time
   * @param {number} totalSupply Total token supply
   * @param {Array} unlockSchedule Token unlock schedule
   * @param {number} initialCirculation Initial circulating supply
   * @returns {Array} Token circulation over time
   */
  static calculateCirculationOverTime(totalSupply, unlockSchedule, initialCirculation = 0) {
    if (!unlockSchedule || unlockSchedule.length === 0 || !totalSupply) {
      return [];
    }
    
    const now = new Date();
    const timeSeriesData = [];
    
    // Add initial point
    timeSeriesData.push({
      date: now.toISOString().split('T')[0],
      circulatingSupply: initialCirculation,
      percentCirculating: parseFloat(((initialCirculation / totalSupply) * 100).toFixed(2))
    });
    
    // Sort unlock events by date
    const sortedUnlocks = [...unlockSchedule].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let currentCirculation = initialCirculation;
    
    // Add future unlock events
    sortedUnlocks.forEach(unlock => {
      const unlockDate = new Date(unlock.date);
      if (unlockDate <= now) return; // Skip past unlocks
      
      const unlockAmount = (unlock.percentage / 100) * totalSupply;
      currentCirculation += unlockAmount;
      
      timeSeriesData.push({
        date: unlock.date.split('T')[0],
        circulatingSupply: parseFloat(currentCirculation.toFixed(0)),
        percentCirculating: parseFloat(((currentCirculation / totalSupply) * 100).toFixed(2))
      });
    });
    
    return timeSeriesData;
  }

  /**
   * Predict token price based on project metrics
   * @param {Object} project Project object with token data
   * @param {number} months Number of months to predict
   * @returns {Object} Token price prediction
   */
  static predictTokenPrice(project, months = 12) {
    if (!project || !project.tokenomics || !project.tokenomics.currentPrice) {
      return {
        success: false,
        message: 'Insufficient token data for price prediction'
      };
    }
    
    const tokenomics = project.tokenomics;
    const currentPrice = tokenomics.currentPrice;
    
    if (currentPrice <= 0) {
      return {
        success: false,
        message: 'Invalid current price (must be > 0)'
      };
    }
    
    // Determine base growth rate factors
    let baseMonthlyGrowthRate = 0.01; // Default 1% monthly growth
    
    // Adjust growth rate based on project metrics
    if (project.expectedReturn) {
      baseMonthlyGrowthRate = project.expectedReturn / 12;
    } else {
      // Calculate based on project attributes
      
      // 1. Project phase
      if (project.phase) {
        if (project.phase.includes('planning')) baseMonthlyGrowthRate += 0.01;
        else if (project.phase.includes('development')) baseMonthlyGrowthRate += 0.015;
        else if (project.phase.includes('construction')) baseMonthlyGrowthRate += 0.02;
        else if (project.phase.includes('operational')) baseMonthlyGrowthRate += 0.005;
      }
      
      // 2. Project type
      if (project.type) {
        if (project.type.includes('energy') || project.type.includes('solar')) baseMonthlyGrowthRate += 0.01;
        else if (project.type.includes('digital') || project.type.includes('tech')) baseMonthlyGrowthRate += 0.015;
        else if (project.type.includes('healthcare')) baseMonthlyGrowthRate += 0.012;
      }
      
      // 3. ESG score adjustment
      if (project.esgScore) {
        if (project.esgScore >= 80) baseMonthlyGrowthRate += 0.005;
        else if (project.esgScore >= 60) baseMonthlyGrowthRate += 0.003;
      }
    }
    
    // Token supply impact (higher circulating % = lower growth)
    if (tokenomics.circulatingSupply && tokenomics.totalSupply) {
      const circulationPercent = tokenomics.circulatingSupply / tokenomics.totalSupply;
      
      if (circulationPercent < 0.2) baseMonthlyGrowthRate += 0.01;
      else if (circulationPercent > 0.8) baseMonthlyGrowthRate -= 0.005;
    }
    
    // Generate price predictions
    const predictions = [];
    let predictedPrice = currentPrice;
    
    for (let month = 0; month <= months; month++) {
      // For month 0, just use the current price
      if (month === 0) {
        predictions.push({
          month,
          price: predictedPrice,
          percentChange: 0
        });
        continue;
      }
      
      // Add randomness to the growth rate (plus or minus 30%)
      const monthlyGrowthRate = baseMonthlyGrowthRate * (1 + (Math.random() * 0.6 - 0.3));
      
      // Calculate new price
      predictedPrice = predictedPrice * (1 + monthlyGrowthRate);
      
      // Calculate percentage change from initial
      const percentChange = ((predictedPrice / currentPrice) - 1) * 100;
      
      predictions.push({
        month,
        date: this.getDateAfterMonths(new Date(), month),
        price: parseFloat(predictedPrice.toFixed(6)),
        percentChange: parseFloat(percentChange.toFixed(2))
      });
    }
    
    // Calculate metrics
    const finalPrice = predictions[months].price;
    const annualGrowthRate = Math.pow((finalPrice / currentPrice), (12 / months)) - 1;
    
    return {
      success: true,
      projectId: project.id,
      projectName: project.name,
      symbol: tokenomics.symbol || 'TOKEN',
      currentPrice,
      finalPredictedPrice: finalPrice,
      annualGrowthRatePercent: parseFloat((annualGrowthRate * 100).toFixed(2)),
      confidenceLevel: 'Medium', // Fixed for now, could be based on data quality
      predictions,
      disclaimer: 'This prediction is for educational purposes only and should not be considered as financial advice.',
      predictionTimestamp: new Date().toISOString()
    };
  }

  /**
   * Get date after specified number of months
   * @param {Date} startDate Start date
   * @param {number} months Number of months to add
   * @returns {string} Date string (YYYY-MM-DD)
   */
  static getDateAfterMonths(startDate, months) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate token metrics for a project
   * @param {Object} project Project object
   * @returns {Object} Token metrics
   */
  static calculateTokenMetrics(project) {
    if (!project || !project.tokenomics) {
      return {
        success: false,
        message: 'Missing token data for metrics calculation'
      };
    }
    
    const tokenomics = project.tokenomics;
    
    // Basic token metrics
    const totalSupply = tokenomics.totalSupply || 0;
    const circulatingSupply = tokenomics.circulatingSupply || 0;
    const currentPrice = tokenomics.currentPrice || 0;
    
    if (totalSupply === 0 || currentPrice === 0) {
      return {
        success: false,
        message: 'Invalid token data (supply or price is 0)'
      };
    }
    
    // Calculate market cap
    const marketCap = circulatingSupply * currentPrice;
    const fullyDilutedMarketCap = totalSupply * currentPrice;
    
    // Calculate circulation percentage
    const circulationPercentage = (circulatingSupply / totalSupply) * 100;
    
    // Calculate investment metrics
    const roi = tokenomics.initialPrice ? (currentPrice / tokenomics.initialPrice) - 1 : null;
    const dividendYield = tokenomics.annualDividend ? (tokenomics.annualDividend / currentPrice) : 0;
    
    // Calculate liquidity metrics
    const dailyVolume = tokenomics.dailyVolume || 0;
    const volumeToMarketCapRatio = marketCap > 0 ? dailyVolume / marketCap : 0;
    
    return {
      success: true,
      projectId: project.id,
      projectName: project.name,
      symbol: tokenomics.symbol || 'TOKEN',
      
      // Supply metrics
      totalSupply,
      circulatingSupply,
      circulationPercentage: parseFloat(circulationPercentage.toFixed(2)),
      
      // Price metrics
      currentPrice,
      initialPrice: tokenomics.initialPrice || null,
      allTimeHigh: tokenomics.allTimeHigh || currentPrice,
      allTimeLow: tokenomics.allTimeLow || currentPrice,
      
      // Market metrics
      marketCap,
      fullyDilutedMarketCap,
      
      // Return metrics
      roiFromInitial: roi !== null ? parseFloat((roi * 100).toFixed(2)) : null,
      dividendYieldPercent: parseFloat((dividendYield * 100).toFixed(2)),
      
      // Liquidity metrics
      dailyVolume,
      volumeToMarketCapRatio: parseFloat((volumeToMarketCapRatio * 100).toFixed(2)),
      
      calculatedTimestamp: new Date().toISOString()
    };
  }

  /**
   * Compare tokens of multiple projects
   * @param {Array} projects Array of projects with token data
   * @returns {Object} Token comparison
   */
  static compareTokens(projects) {
    if (!projects || projects.length === 0) {
      return {
        success: false,
        message: 'No projects provided for token comparison'
      };
    }
    
    // Filter projects with valid token data
    const validProjects = projects.filter(p => p.tokenomics && p.tokenomics.currentPrice);
    
    if (validProjects.length === 0) {
      return {
        success: false,
        message: 'No projects with valid token data found'
      };
    }
    
    // Calculate metrics for each token
    const tokenMetrics = validProjects.map(project => {
      const metrics = this.calculateTokenMetrics(project);
      if (!metrics.success) return null;
      
      return {
        projectId: project.id,
        projectName: project.name,
        symbol: metrics.symbol,
        price: metrics.currentPrice,
        marketCap: metrics.marketCap,
        circulationPercentage: metrics.circulationPercentage,
        roiFromInitial: metrics.roiFromInitial,
        dividendYieldPercent: metrics.dividendYieldPercent,
        volumeToMarketCapRatio: metrics.volumeToMarketCapRatio
      };
    }).filter(Boolean);
    
    // Generate rankings
    const priceRanking = [...tokenMetrics].sort((a, b) => b.price - a.price);
    const marketCapRanking = [...tokenMetrics].sort((a, b) => b.marketCap - a.marketCap);
    const yieldRanking = [...tokenMetrics].sort((a, b) => b.dividendYieldPercent - a.dividendYieldPercent);
    const roiRanking = [...tokenMetrics].filter(t => t.roiFromInitial !== null)
      .sort((a, b) => b.roiFromInitial - a.roiFromInitial);
    
    return {
      success: true,
      tokenCount: tokenMetrics.length,
      metrics: tokenMetrics,
      rankings: {
        byPrice: priceRanking.map((t, i) => ({ rank: i + 1, ...t })),
        byMarketCap: marketCapRanking.map((t, i) => ({ rank: i + 1, ...t })),
        byYield: yieldRanking.map((t, i) => ({ rank: i + 1, ...t })),
        byROI: roiRanking.map((t, i) => ({ rank: i + 1, ...t }))
      },
      topPriceToken: priceRanking[0] || null,
      topMarketCapToken: marketCapRanking[0] || null,
      topYieldToken: yieldRanking[0] || null,
      topROIToken: roiRanking[0] || null,
      comparisonTimestamp: new Date().toISOString()
    };
  }
}

module.exports = TokenAnalytics; 