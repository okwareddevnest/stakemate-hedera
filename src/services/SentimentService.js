require('dotenv').config();

/**
 * SentimentService - Handles sentiment analysis for infrastructure projects
 * Collects and interprets social media and news trends
 */
class SentimentService {
  constructor() {
    this.apiKey = process.env.SENTIMENT_API_KEY;
    
    // Data sources for sentiment analysis
    this.dataSources = {
      twitter: true,
      news: true,
      blogs: true,
      reddit: true,
      localMedia: true
    };
    
    // Cache for sentiment data
    this.sentimentCache = new Map();
  }

  /**
   * Analyze sentiment for a project from multiple sources
   * @param {Object} project Project object or project data
   * @returns {Object} Sentiment analysis results
   */
  async analyzeSentiment(project) {
    try {
      // Get project details
      const projectName = project.name || project;
      const projectId = project.id || `project-${Date.now()}`;
      
      // Check cache
      const cacheKey = `${projectId}-${Date.now().toString().substr(0, 8)}`;
      if (this.sentimentCache.has(cacheKey)) {
        return this.sentimentCache.get(cacheKey);
      }
      
      // In a real implementation, this would call external sentiment API
      // For now, generate mock sentiment data
      const sentimentData = this.generateMockSentiment(projectName);
      
      // Cache the results
      this.sentimentCache.set(cacheKey, sentimentData);
      
      return sentimentData;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      
      // Return neutral sentiment if analysis fails
      return {
        overall: 'neutral',
        score: 50,
        trendDirection: 'stable',
        lastUpdate: new Date().toISOString(),
        mediaSources: [],
        error: error.message
      };
    }
  }

  /**
   * Generate mock sentiment data for testing
   * @param {string} projectName Project name
   * @returns {Object} Mock sentiment data
   */
  generateMockSentiment(projectName) {
    // Random sentiment score between 0-100
    const score = Math.floor(Math.random() * 100);
    
    // Determine sentiment category
    let overall;
    if (score >= 70) {
      overall = 'positive';
    } else if (score >= 40) {
      overall = 'neutral';
    } else {
      overall = 'negative';
    }
    
    // Determine trend
    const trendOptions = ['improving', 'declining', 'stable'];
    const trendDirection = trendOptions[Math.floor(Math.random() * trendOptions.length)];
    
    // Create mock media sources
    const mediaSources = [
      {
        source: 'Twitter',
        sentiment: overall,
        score: score + (Math.random() * 10 - 5),
        sampleSize: Math.floor(Math.random() * 1000) + 100,
        timestamp: new Date().toISOString()
      },
      {
        source: 'News Articles',
        sentiment: overall,
        score: score + (Math.random() * 10 - 5),
        sampleSize: Math.floor(Math.random() * 50) + 10,
        timestamp: new Date().toISOString()
      },
      {
        source: 'Kenya Local Media',
        sentiment: overall,
        score: score + (Math.random() * 10 - 5),
        sampleSize: Math.floor(Math.random() * 30) + 5,
        timestamp: new Date().toISOString()
      }
    ];
    
    return {
      overall,
      score,
      trendDirection,
      lastUpdate: new Date().toISOString(),
      mediaSources,
      keywords: [
        {
          keyword: projectName,
          frequency: Math.floor(Math.random() * 100) + 50
        },
        {
          keyword: 'investment',
          frequency: Math.floor(Math.random() * 100) + 20
        },
        {
          keyword: 'infrastructure',
          frequency: Math.floor(Math.random() * 100) + 30
        }
      ]
    };
  }

  /**
   * Analyze sentiment from a specific source
   * @param {string} projectName Project name
   * @param {string} source Source name (e.g., 'twitter', 'news')
   * @returns {Object} Source-specific sentiment data
   */
  async analyzeSourceSentiment(projectName, source) {
    // This would call a specific API for the given source
    // For now, return mock data
    return {
      source,
      sentiment: Math.random() > 0.3 ? 'positive' : 'neutral',
      score: Math.floor(Math.random() * 100),
      sampleSize: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Track sentiment changes over time
   * @param {string} projectId Project ID
   * @param {number} days Number of days to look back
   * @returns {Array} Historical sentiment data
   */
  async trackSentimentTrend(projectId, days = 30) {
    // This would fetch historical sentiment data
    // For now, generate mock trend data
    const trend = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      trend.push({
        date: date.toISOString(),
        score: Math.floor(Math.random() * 100),
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    // Sort by date ascending
    trend.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return trend;
  }

  /**
   * Compare sentiment between multiple projects
   * @param {Array} projectNames Array of project names
   * @returns {Object} Comparative sentiment data
   */
  async compareSentiment(projectNames) {
    try {
      // Analyze sentiment for each project
      const results = await Promise.all(
        projectNames.map(async projectName => {
          const sentiment = await this.analyzeSentiment(projectName);
          return {
            projectName,
            sentiment
          };
        })
      );
      
      // Determine rankings
      const rankings = [...results].sort((a, b) => b.sentiment.score - a.sentiment.score);
      
      return {
        projects: results,
        rankings: rankings.map((item, index) => ({
          rank: index + 1,
          projectName: item.projectName,
          score: item.sentiment.score
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error comparing sentiment:', error);
      throw error;
    }
  }

  /**
   * Get sentiment insights for investment timing
   * @param {string} projectId Project ID
   * @returns {Object} Timing recommendations based on sentiment
   */
  async getSentimentTiming(projectId) {
    try {
      // Get current sentiment
      const sentiment = await this.analyzeSentiment(projectId);
      
      // Get historical trend
      const trend = await this.trackSentimentTrend(projectId, 30);
      
      // Calculate momentum (rate of change over last 7 days)
      const recentTrend = trend.slice(-7);
      const startScore = recentTrend[0].score;
      const endScore = recentTrend[recentTrend.length - 1].score;
      const momentum = endScore - startScore;
      
      // Determine recommendation
      let recommendation;
      let confidence;
      
      if (sentiment.score > 70 && momentum > 5) {
        recommendation = 'strong_buy';
        confidence = 'high';
      } else if (sentiment.score > 60 && momentum > 0) {
        recommendation = 'buy';
        confidence = 'medium';
      } else if (sentiment.score < 30 && momentum < -5) {
        recommendation = 'avoid';
        confidence = 'high';
      } else if (sentiment.score < 40 && momentum < 0) {
        recommendation = 'cautious';
        confidence = 'medium';
      } else {
        recommendation = 'neutral';
        confidence = 'medium';
      }
      
      return {
        projectId,
        currentSentiment: sentiment.overall,
        currentScore: sentiment.score,
        momentum,
        recommendation,
        confidence,
        explanation: this.getTimingExplanation(recommendation, sentiment, momentum),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting sentiment timing for ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Generate an explanation for timing recommendation
   */
  getTimingExplanation(recommendation, sentiment, momentum) {
    switch (recommendation) {
      case 'strong_buy':
        return `The project is enjoying strong positive sentiment (${sentiment.score}/100) with increasing positive momentum (${momentum} points). This suggests growing investor confidence and positive news coverage, potentially making this an optimal entry point.`;
      case 'buy':
        return `The project has positive sentiment (${sentiment.score}/100) with stable or slightly improving momentum (${momentum} points). Market perception is favorable, which could indicate a good entry opportunity.`;
      case 'avoid':
        return `The project is experiencing negative sentiment (${sentiment.score}/100) with declining momentum (${momentum} points). This suggests investors and stakeholders may have concerns that could affect project value in the near term.`;
      case 'cautious':
        return `The project has somewhat negative sentiment (${sentiment.score}/100) with slight negative momentum (${momentum} points). Consider waiting for sentiment improvement before investing.`;
      case 'neutral':
        return `The project has mixed sentiment (${sentiment.score}/100) with relatively stable momentum (${momentum} points). No strong timing signal in either direction based on current sentiment analysis.`;
      default:
        return `Current sentiment is ${sentiment.score}/100 with momentum of ${momentum} points over the last 7 days.`;
    }
  }
}

module.exports = SentimentService; 