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
      const sentimentData = {
        overall: 'neutral',
        score: 50,
        trendDirection: 'stable',
        lastUpdate: new Date().toISOString(),
        mediaSources: [
          {
            source: 'Twitter',
            sentiment: 'neutral',
            score: 50,
            sampleSize: 0,
            timestamp: new Date().toISOString()
          },
          {
            source: 'News Articles',
            sentiment: 'neutral',
            score: 50,
            sampleSize: 0,
            timestamp: new Date().toISOString()
          },
          {
            source: 'Local Media',
            sentiment: 'neutral',
            score: 50,
            sampleSize: 0,
            timestamp: new Date().toISOString()
          }
        ],
        keywords: [
          {
            keyword: projectName,
            frequency: 50
          },
          {
            keyword: 'investment',
            frequency: 25
          },
          {
            keyword: 'infrastructure',
            frequency: 25
          }
        ]
      };
      
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
   * Analyze sentiment from a specific source
   * @param {string} source The source to analyze (twitter, news, blogs, etc)
   * @param {Object} project Project data
   * @returns {Object} Source-specific sentiment data
   */
  async analyzeSourceSentiment(source, project) {
    // This would call a specific API for the given source
    return {
      source,
      sentiment: 'neutral',
      score: 50,
      sampleSize: 0,
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
    const trend = [];
    const now = new Date();
    
    // Return a flat line of neutral sentiment
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      trend.push({
        date: date.toISOString(),
        score: 50,
        volume: 0
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
      // Create neutral sentiment for each project
      const results = projectNames.map(projectName => {
        return {
          projectName,
          sentiment: {
            overall: 'neutral',
            score: 50,
            trendDirection: 'stable'
          }
        };
      });
      
      return {
        projects: results,
        rankings: results.map((item, index) => ({
          rank: index + 1,
          projectName: item.projectName,
          score: 50
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
      const sentiment = {
        overall: 'neutral',
        score: 50
      };
      
      const momentum = 0;
      const recommendation = 'neutral';
      const confidence = 'low';
      
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
        return `The project has neutral sentiment (${sentiment.score}/100) with stable momentum. No strong timing signal in either direction based on current sentiment analysis.`;
      default:
        return `Current sentiment is ${sentiment.score}/100 with neutral momentum.`;
    }
  }
}

module.exports = SentimentService; 