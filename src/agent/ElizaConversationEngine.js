/**
 * ElizaConversationEngine - Conversation processor based on Eliza pattern
 * Customized for Stakemate AI agent to provide financial education and investment guidance
 */
class ElizaConversationEngine {
  constructor() {
    // Initialize keyword patterns for matching user input
    this.keywords = [
      // Investment-related patterns
      { pattern: /\b(invest|investing|investment)\b/i, weight: 10, responses: [
        "What kind of infrastructure projects are you interested in investing in?",
        "Would you like me to analyze some investment opportunities for you?",
        "I can help you understand the risks and benefits of infrastructure investments. What would you like to know?"
      ]},
      
      // Project-related patterns
      { pattern: /\b(project|projects)\b/i, weight: 9, responses: [
        "I can help you explore various infrastructure projects. Are you interested in a specific sector like energy, transportation, or water?",
        "Would you like me to compare different infrastructure projects for you?",
        "Are you looking for information about a particular project, or would you like recommendations?"
      ]},
      
      // Risk-related patterns
      { pattern: /\b(risk|risks|risky)\b/i, weight: 8, responses: [
        "Understanding risk is important. Would you like me to explain the risk factors for infrastructure investments?",
        "Each project has different risk profiles. Would you like me to assess the risk of a specific project?",
        "How would you describe your risk tolerance? This helps me provide more personalized recommendations."
      ]},
      
      // ESG-related patterns
      { pattern: /\b(ESG|environmental|social|governance|sustainable|impact)\b/i, weight: 8, responses: [
        "ESG factors are increasingly important in infrastructure investments. Would you like to learn more about them?",
        "Would you like me to filter projects based on their ESG scores?",
        "I can help you understand how ESG impacts long-term project value. What specific aspects interest you?"
      ]},
      
      // Learning-related patterns
      { pattern: /\b(learn|understand|explain|how|what is)\b/i, weight: 7, responses: [
        "I'd be happy to explain that. What specific aspect would you like to learn about?",
        "Financial education is important. Would you like me to start with the basics or dive deeper?",
        "I can provide resources to help you understand infrastructure investing. Where would you like to start?"
      ]},
      
      // Portfolio-related patterns
      { pattern: /\b(portfolio|diversify|allocation)\b/i, weight: 9, responses: [
        "A well-balanced portfolio is important. Would you like me to help you develop an allocation strategy?",
        "I can analyze your current portfolio and suggest optimizations. Would that be helpful?",
        "Diversification can help manage risk. Would you like me to suggest a diversified infrastructure portfolio?"
      ]},
      
      // Token-related patterns
      { pattern: /\b(token|tokenize|tokenization)\b/i, weight: 7, responses: [
        "Tokenization makes infrastructure investments more accessible. Would you like to learn more about this process?",
        "I can explain how blockchain tokens represent infrastructure assets. Would that interest you?",
        "Would you like me to show you some tokenized infrastructure projects available now?"
      ]},
      
      // Regulatory-related patterns
      { pattern: /\b(regulation|compliance|legal|CMA)\b/i, weight: 6, responses: [
        "Regulatory compliance is essential for infrastructure projects. Would you like me to check a project's compliance status?",
        "The CMA has specific requirements for infrastructure investments. Would you like me to explain them?",
        "I can help you understand the regulatory landscape for infrastructure investing in Kenya. What would you like to know?"
      ]},
      
      // Returns-related patterns
      { pattern: /\b(return|returns|profit|yield|dividend)\b/i, weight: 8, responses: [
        "Returns on infrastructure investments can come from both dividends and value appreciation. Would you like me to explain more?",
        "Would you like me to analyze the potential returns of specific projects?",
        "I can simulate possible investment outcomes based on historical data. Would that be helpful?"
      ]},
      
      // Hedera-related patterns
      { pattern: /\b(hedera|hbar|hashgraph|blockchain|crypto)\b/i, weight: 7, responses: [
        "Hedera provides the secure blockchain infrastructure for our investment platform. Would you like to learn more?",
        "Our transactions are recorded on Hedera's distributed ledger for transparency and security. Would you like to know how this benefits you?",
        "Would you like me to explain how we use Hedera to verify project milestones and investment records?"
      ]},
      
      // Greeting patterns
      { pattern: /\b(hello|hi|hey|greetings)\b/i, weight: 1, responses: [
        "Hello! I'm StakeMate, your AI investment assistant. How can I help you today?",
        "Hi there! I can help you learn about infrastructure investing. What would you like to know?",
        "Greetings! Would you like me to help you explore investment opportunities or learn about infrastructure projects?"
      ]},
      
      // Help patterns
      { pattern: /\b(help|assist|support)\b/i, weight: 2, responses: [
        "I can help you with infrastructure investing in several ways. Would you like to explore projects, learn investing basics, or analyze your portfolio?",
        "How can I assist you today? I can provide education, project analysis, investment simulations, or portfolio recommendations.",
        "I'm here to support your investment journey. What specific area would you like help with?"
      ]},
      
      // Fallback pattern
      { pattern: /.*/, weight: 0, responses: [
        "That's interesting. Could you tell me more about what you're looking for in infrastructure investments?",
        "I want to make sure I understand correctly. Are you interested in learning about infrastructure investments or analyzing specific projects?",
        "I'm here to help with your infrastructure investment needs. Could you provide more details about what you're looking for?"
      ]}
    ];
    
    // State tracking
    this.conversationContext = {
      userName: null,
      userRiskTolerance: null,
      mentionedProjects: [],
      interestsExpressed: [],
      lastTopic: null,
      educationProgress: {},
      questionsAsked: 0
    };
    
    // Greetings to start the conversation
    this.initialGreetings = [
      "Hello! I'm StakeMate, your AI investment assistant for infrastructure projects. How can I help you today?",
      "Welcome to StakeMate! I can help you learn about infrastructure investing, analyze projects, and build a portfolio. What are you interested in?",
      "Hi there! I'm your StakeMate assistant. Would you like to explore infrastructure investment opportunities or learn more about how our platform works?"
    ];
  }

  /**
   * Process user input and generate a response
   * @param {string} input User's message
   * @param {Object} userData User profile data if available
   * @returns {Object} Response object with message and actions
   */
  processInput(input, userData = null) {
    // Update conversation context with user data if available
    if (userData) {
      this.conversationContext.userName = userData.name || this.conversationContext.userName;
      this.conversationContext.userRiskTolerance = userData.riskTolerance || this.conversationContext.userRiskTolerance;
    }
    
    // Increment questions counter
    this.conversationContext.questionsAsked++;
    
    // Check for direct commands that should trigger specific actions
    const actionCommand = this.checkForActionCommand(input);
    if (actionCommand) {
      return actionCommand;
    }
    
    // Extract entities and intents from the user input
    this.extractEntities(input);
    const userIntent = this.identifyIntent(input);
    
    // Match keywords to determine best response
    const response = this.generateResponse(input, userIntent);
    
    // Add follow-up questions or suggestions based on context
    const enrichedResponse = this.enrichResponse(response, userIntent);
    
    return {
      message: enrichedResponse,
      actions: this.suggestNextActions(userIntent),
      context: {
        intent: userIntent,
        entities: [...this.conversationContext.mentionedProjects],
        interests: [...this.conversationContext.interestsExpressed]
      }
    };
  }

  /**
   * Check for direct action commands
   * @param {string} input User input
   * @returns {Object|null} Action response or null
   */
  checkForActionCommand(input) {
    // Check for specific command patterns
    
    // Help command
    if (/^\/help$/i.test(input)) {
      return {
        message: "I can help you with:\n- Learning about infrastructure investing\n- Analyzing specific projects\n- Building and managing a portfolio\n- Simulating investment returns\n- Understanding ESG factors\n\nJust tell me what you're interested in!",
        actions: [
          { type: 'SUGGEST_TOPIC', payload: 'Learn basics' },
          { type: 'SUGGEST_TOPIC', payload: 'Explore projects' },
          { type: 'SUGGEST_TOPIC', payload: 'Check my portfolio' }
        ]
      };
    }
    
    // Projects command
    if (/^\/projects$/i.test(input)) {
      return {
        message: "I'd be happy to help you explore infrastructure projects. Would you like to see projects in a specific sector like energy, transportation, or water?",
        actions: [
          { type: 'LIST_PROJECTS', payload: { limit: 5 } },
          { type: 'SUGGEST_TOPIC', payload: 'Energy projects' },
          { type: 'SUGGEST_TOPIC', payload: 'Transportation projects' },
          { type: 'SUGGEST_TOPIC', payload: 'Water projects' }
        ]
      };
    }
    
    // Portfolio command
    if (/^\/portfolio$/i.test(input)) {
      return {
        message: "Let's look at your investment portfolio. I can help you analyze your current allocations or suggest optimizations.",
        actions: [
          { type: 'SHOW_PORTFOLIO', payload: {} },
          { type: 'SUGGEST_TOPIC', payload: 'Optimize my portfolio' },
          { type: 'SUGGEST_TOPIC', payload: 'Simulate returns' }
        ]
      };
    }
    
    // Simulate command
    if (/^\/simulate$/i.test(input)) {
      return {
        message: "I can help you simulate investment returns. Would you like to simulate a specific amount or see projected returns for different scenarios?",
        actions: [
          { type: 'START_SIMULATION', payload: {} },
          { type: 'SUGGEST_TOPIC', payload: 'Simulate 10,000 KES investment' },
          { type: 'SUGGEST_TOPIC', payload: 'Compare project returns' }
        ]
      };
    }
    
    // Learn command
    if (/^\/learn$/i.test(input)) {
      return {
        message: "I'd be happy to help you learn about infrastructure investing. What topics are you most interested in?",
        actions: [
          { type: 'SHOW_EDUCATION_TOPICS', payload: {} },
          { type: 'SUGGEST_TOPIC', payload: 'Investment basics' },
          { type: 'SUGGEST_TOPIC', payload: 'Understanding risk' },
          { type: 'SUGGEST_TOPIC', payload: 'ESG investing' }
        ]
      };
    }
    
    return null;
  }

  /**
   * Extract entities like project names, investment amounts, etc.
   * @param {string} input User input
   */
  extractEntities(input) {
    // Extract project mentions (simplified - in production would use NER)
    const projectMatches = input.match(/\b(solar|rail|water|energy|transport|road|airport|dam)\b/gi);
    if (projectMatches) {
      for (const match of projectMatches) {
        if (!this.conversationContext.mentionedProjects.includes(match.toLowerCase())) {
          this.conversationContext.mentionedProjects.push(match.toLowerCase());
        }
      }
    }
    
    // Extract interests
    const interestMatches = input.match(/\b(interested in|like|prefer|want|looking for)\s+([a-z\s]+)\b/i);
    if (interestMatches && interestMatches[2]) {
      const interest = interestMatches[2].trim().toLowerCase();
      if (!this.conversationContext.interestsExpressed.includes(interest)) {
        this.conversationContext.interestsExpressed.push(interest);
      }
    }
  }

  /**
   * Identify the user's intent
   * @param {string} input User input
   * @returns {string} Identified intent
   */
  identifyIntent(input) {
    // Simplified intent recognition - would use NLU in production
    if (/\b(how|what|explain|understand|learn|tell me about)\b/i.test(input)) {
      return 'SEEKING_INFORMATION';
    }
    
    if (/\b(compare|difference|versus|vs|better)\b/i.test(input)) {
      return 'COMPARING_OPTIONS';
    }
    
    if (/\b(recommend|suggest|advice|should i|best|top)\b/i.test(input)) {
      return 'SEEKING_RECOMMENDATION';
    }
    
    if (/\b(buy|purchase|invest in|get|acquire)\b/i.test(input)) {
      return 'EXPRESSING_INTEREST';
    }
    
    if (/\b(risk|safe|risky|dangerous|secure)\b/i.test(input)) {
      return 'CONCERNED_ABOUT_RISK';
    }
    
    if (/\b(return|profit|make money|yield|dividend|earn)\b/i.test(input)) {
      return 'FOCUSED_ON_RETURNS';
    }
    
    if (/\b(portfolio|diversify|allocate|spread|balance)\b/i.test(input)) {
      return 'PORTFOLIO_MANAGEMENT';
    }
    
    if (/\b(simulate|projection|forecast|predict|what if)\b/i.test(input)) {
      return 'SIMULATION_REQUEST';
    }
    
    return 'GENERAL_QUERY';
  }

  /**
   * Generate a response based on the input and detected intent
   * @param {string} input User input
   * @param {string} intent Detected intent
   * @returns {string} Generated response
   */
  generateResponse(input, intent) {
    // Find the highest weighted matching pattern
    let bestMatch = { weight: -1, responses: [] };
    
    for (const keyword of this.keywords) {
      if (keyword.pattern.test(input) && keyword.weight > bestMatch.weight) {
        bestMatch = keyword;
      }
    }
    
    // If no match found (unlikely due to fallback), use general response
    if (bestMatch.weight === -1) {
      return "I'm here to help with your infrastructure investment questions. Could you tell me more about what you're looking for?";
    }
    
    // Randomly select one of the responses for this pattern
    const responseIndex = Math.floor(Math.random() * bestMatch.responses.length);
    this.conversationContext.lastTopic = bestMatch.pattern.toString();
    
    return bestMatch.responses[responseIndex];
  }

  /**
   * Enrich the response with context-specific information
   * @param {string} response Base response
   * @param {string} intent User intent
   * @returns {string} Enriched response
   */
  enrichResponse(response, intent) {
    let enriched = response;
    
    // Add user name if available
    if (this.conversationContext.userName && Math.random() < 0.3) {
      enriched = enriched.replace(/\?$/, `, ${this.conversationContext.userName}?`);
    }
    
    // Add follow-up based on intent
    if (intent === 'SEEKING_INFORMATION' && this.conversationContext.questionsAsked > 2) {
      enriched += " Is there a specific aspect of this topic you'd like me to focus on?";
    }
    
    if (intent === 'CONCERNED_ABOUT_RISK' && this.conversationContext.userRiskTolerance) {
      enriched += ` Based on your ${this.conversationContext.userRiskTolerance} risk tolerance, I can help you find suitable projects.`;
    }
    
    if (intent === 'SEEKING_RECOMMENDATION' && this.conversationContext.mentionedProjects.length > 0) {
      const project = this.conversationContext.mentionedProjects[this.conversationContext.mentionedProjects.length - 1];
      enriched += ` I notice you mentioned ${project} projects. Would you like specific recommendations in that sector?`;
    }
    
    return enriched;
  }

  /**
   * Suggest next actions based on the conversation context
   * @param {string} intent Current user intent
   * @returns {Array} Suggested actions
   */
  suggestNextActions(intent) {
    const actions = [];
    
    // Suggest actions based on intent
    switch (intent) {
      case 'SEEKING_INFORMATION':
        actions.push({ type: 'SHOW_EDUCATIONAL_CONTENT', payload: { topic: this.conversationContext.lastTopic } });
        break;
        
      case 'COMPARING_OPTIONS':
        if (this.conversationContext.mentionedProjects.length > 0) {
          actions.push({ type: 'COMPARE_PROJECTS', payload: { projects: this.conversationContext.mentionedProjects } });
        } else {
          actions.push({ type: 'SUGGEST_POPULAR_COMPARISONS', payload: {} });
        }
        break;
        
      case 'SEEKING_RECOMMENDATION':
        actions.push({ type: 'GENERATE_RECOMMENDATIONS', payload: { 
          riskTolerance: this.conversationContext.userRiskTolerance,
          interests: this.conversationContext.interestsExpressed
        }});
        break;
        
      case 'EXPRESSING_INTEREST':
        if (this.conversationContext.mentionedProjects.length > 0) {
          actions.push({ type: 'SHOW_PROJECT_DETAILS', payload: { 
            project: this.conversationContext.mentionedProjects[this.conversationContext.mentionedProjects.length - 1] 
          }});
        }
        break;
        
      case 'CONCERNED_ABOUT_RISK':
        actions.push({ type: 'SHOW_RISK_ASSESSMENT', payload: {} });
        break;
        
      case 'FOCUSED_ON_RETURNS':
        actions.push({ type: 'SHOW_RETURN_PROJECTIONS', payload: {} });
        break;
        
      case 'PORTFOLIO_MANAGEMENT':
        actions.push({ type: 'ANALYZE_PORTFOLIO', payload: {} });
        break;
        
      case 'SIMULATION_REQUEST':
        actions.push({ type: 'START_SIMULATION', payload: {} });
        break;
        
      default:
        // For general queries, suggest exploring projects or educational content
        actions.push({ type: 'SUGGEST_EXPLORATION', payload: {} });
    }
    
    return actions;
  }

  /**
   * Get an initial greeting to start the conversation
   * @returns {Object} Initial greeting message and actions
   */
  getInitialGreeting() {
    const randomIndex = Math.floor(Math.random() * this.initialGreetings.length);
    
    return {
      message: this.initialGreetings[randomIndex],
      actions: [
        { type: 'SUGGEST_TOPIC', payload: 'Learn about investing' },
        { type: 'SUGGEST_TOPIC', payload: 'Explore projects' },
        { type: 'SUGGEST_TOPIC', payload: 'Get recommendations' }
      ]
    };
  }

  /**
   * Reset the conversation context
   */
  resetContext() {
    this.conversationContext = {
      userName: null,
      userRiskTolerance: null,
      mentionedProjects: [],
      interestsExpressed: [],
      lastTopic: null,
      educationProgress: {},
      questionsAsked: 0
    };
  }
}

module.exports = ElizaConversationEngine; 