require('dotenv').config();

/**
 * ComplianceService - Handles regulatory compliance checking
 * Verifies if projects comply with CMA guidelines
 */
class ComplianceService {
  constructor() {
    // Initialize compliance rule sets
    this.ruleSets = {
      'CMA': [
        {
          id: 'KE001',
          name: 'Project Disclosure',
          description: 'Project must provide adequate disclosure documentation',
          severity: 'critical'
        },
        {
          id: 'KE002',
          name: 'Risk Disclosure',
          description: 'Project must disclose all relevant risks to investors',
          severity: 'critical'
        },
        {
          id: 'KE003',
          name: 'Financial Reporting',
          description: 'Project must maintain regular financial reporting',
          severity: 'high'
        },
        {
          id: 'KE004',
          name: 'Environmental Compliance',
          description: 'Project must meet environmental regulations',
          severity: 'high'
        },
        {
          id: 'KE005',
          name: 'Social Impact Assessment',
          description: 'Project must assess and disclose social impacts',
          severity: 'medium'
        },
        {
          id: 'KE006',
          name: 'Token Structure',
          description: 'Tokenization must follow approved security token structures',
          severity: 'critical'
        },
        {
          id: 'KE007',
          name: 'KYC/AML Procedures',
          description: 'Project must implement KYC/AML procedures for investors',
          severity: 'critical'
        },
        {
          id: 'KE008',
          name: 'Investment Minimums',
          description: 'Project must respect investment minimum thresholds',
          severity: 'medium'
        },
        {
          id: 'KE009',
          name: 'Governance Transparency',
          description: 'Project must maintain transparent governance',
          severity: 'high'
        },
        {
          id: 'KE010',
          name: 'Investor Rights',
          description: 'Project must respect investor rights and protections',
          severity: 'critical'
        }
      ]
    };
    
    // Cache for compliance check results
    this.complianceCache = new Map();
  }

  /**
   * Verify project compliance with regulatory requirements
   * @param {Object} project Project object
   * @param {string} regulatorId Regulator ID (default: 'CMA')
   * @returns {Object} Compliance verification results
   */
  async verifyCompliance(project, regulatorId = 'CMA') {
    try {
      // Get project details
      const projectId = project.id || project;
      
      // Check cache for recent compliance check
      const cacheKey = `${projectId}-${regulatorId}`;
      if (this.complianceCache.has(cacheKey)) {
        const cachedResult = this.complianceCache.get(cacheKey);
        // Only use cache if it's less than 24 hours old
        const cacheAge = Date.now() - new Date(cachedResult.timestamp).getTime();
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return cachedResult;
        }
      }
      
      // Get rule set for the specified regulator
      const rules = this.ruleSets[regulatorId];
      if (!rules) {
        throw new Error(`Rule set not found for regulator: ${regulatorId}`);
      }
      
      // In a real implementation, this would perform actual compliance checks
      // For now, generate simulated compliance results
      const complianceResults = await this.simulateComplianceCheck(project, rules);
      
      // Calculate overall compliance
      const criticalFailures = complianceResults.checkResults.filter(
        r => !r.compliant && r.rule.severity === 'critical'
      );
      
      const highFailures = complianceResults.checkResults.filter(
        r => !r.compliant && r.rule.severity === 'high'
      );
      
      const compliant = criticalFailures.length === 0;
      const score = this.calculateComplianceScore(complianceResults.checkResults);
      
      // Prepare compliance result
      const result = {
        projectId,
        regulatorId,
        compliant,
        score,
        checkResults: complianceResults.checkResults,
        criticalFailures,
        highFailures,
        timestamp: new Date().toISOString(),
        verificationMethod: 'automated',
        recommendations: this.generateRecommendations(complianceResults.checkResults)
      };
      
      // Cache the result
      this.complianceCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error verifying compliance:', error);
      throw error;
    }
  }

  /**
   * Simulate compliance checks for testing
   * @param {Object} project Project object
   * @param {Array} rules Compliance rules
   * @returns {Object} Simulated check results
   */
  async simulateComplianceCheck(project, rules) {
    // Simulate compliance checks with mostly positive results
    const checkResults = rules.map(rule => {
      // 80% chance of compliance for each rule
      const compliant = Math.random() > 0.2;
      
      return {
        ruleId: rule.id,
        rule,
        compliant,
        details: compliant
          ? `Passed ${rule.name} check`
          : `Failed ${rule.name} check: ${this.getRandomFailureReason(rule)}`,
        timestamp: new Date().toISOString()
      };
    });
    
    return {
      checkResults
    };
  }

  /**
   * Generate a random failure reason for testing
   * @param {Object} rule Rule object
   * @returns {string} Failure reason
   */
  getRandomFailureReason(rule) {
    const reasons = {
      'KE001': [
        'Missing project timeline',
        'Incomplete risk section',
        'Inadequate financial projections'
      ],
      'KE002': [
        'Risk factors not quantified',
        'Political risk not addressed',
        'Market risks inadequately explained'
      ],
      'KE003': [
        'Financial reports not up to date',
        'Missing quarterly statements',
        'Audit requirements not met'
      ],
      'KE004': [
        'Environmental impact assessment incomplete',
        'Missing NEMA approval',
        'Carbon footprint not disclosed'
      ],
      'KE005': [
        'Community impact not assessed',
        'No local employment plans',
        'Cultural heritage impacts not addressed'
      ],
      'KE006': [
        'Token structure not compliant with security regulations',
        'Dividend mechanism unclear',
        'Voting rights not properly implemented'
      ],
      'KE007': [
        'KYC procedures inadequate',
        'AML checks insufficient',
        'Investor verification not robust'
      ],
      'KE008': [
        'Minimum investment too low',
        'No maximum investment cap',
        'Retail investor protections missing'
      ],
      'KE009': [
        'Board structure not transparent',
        'Decision-making process unclear',
        'Conflict of interest policies missing'
      ],
      'KE010': [
        'Investor redemption rights unclear',
        'No dispute resolution mechanism',
        'Voting rights implementation issues'
      ]
    };
    
    const ruleReasons = reasons[rule.id] || [
      'Documentation incomplete',
      'Requirements not met',
      'Verification failed'
    ];
    
    return ruleReasons[Math.floor(Math.random() * ruleReasons.length)];
  }

  /**
   * Calculate compliance score based on check results
   * @param {Array} checkResults Compliance check results
   * @returns {number} Compliance score (0-100)
   */
  calculateComplianceScore(checkResults) {
    // Define severity weights
    const severityWeights = {
      critical: 5,
      high: 3,
      medium: 2,
      low: 1
    };
    
    // Calculate total possible points
    const totalPossiblePoints = checkResults.reduce((sum, check) => {
      return sum + (severityWeights[check.rule.severity] || 1);
    }, 0);
    
    // Calculate earned points
    const earnedPoints = checkResults.reduce((sum, check) => {
      if (check.compliant) {
        return sum + (severityWeights[check.rule.severity] || 1);
      }
      return sum;
    }, 0);
    
    // Calculate score (0-100)
    return Math.round((earnedPoints / totalPossiblePoints) * 100);
  }

  /**
   * Generate recommendations based on compliance check results
   * @param {Array} checkResults Compliance check results
   * @returns {Array} Recommendations
   */
  generateRecommendations(checkResults) {
    // Filter failed checks
    const failedChecks = checkResults.filter(check => !check.compliant);
    
    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    failedChecks.sort((a, b) => {
      return severityOrder[a.rule.severity] - severityOrder[b.rule.severity];
    });
    
    // Generate recommendations
    return failedChecks.map(check => {
      return {
        ruleId: check.ruleId,
        severity: check.rule.severity,
        recommendation: this.getRecommendationForRule(check.rule),
        timeframe: this.getTimeframeForSeverity(check.rule.severity)
      };
    });
  }

  /**
   * Get recommendation for a specific rule
   * @param {Object} rule Rule object
   * @returns {string} Recommendation
   */
  getRecommendationForRule(rule) {
    const recommendations = {
      'KE001': 'Update project disclosure documentation to include all required sections: timeline, risks, and financials.',
      'KE002': 'Enhance risk disclosure with quantified assessments of political, market, and project-specific risks.',
      'KE003': 'Ensure financial reports are up to date and comply with quarterly reporting requirements.',
      'KE004': 'Complete environmental impact assessment and obtain necessary NEMA approvals.',
      'KE005': 'Conduct comprehensive social impact assessment including community engagement and local employment plans.',
      'KE006': 'Revise token structure to ensure compliance with current security token regulations.',
      'KE007': 'Strengthen KYC/AML procedures to meet current regulatory requirements.',
      'KE008': 'Adjust investment thresholds to comply with retail investor protection guidelines.',
      'KE009': 'Improve governance transparency with clear board structure and decision-making processes.',
      'KE010': 'Clarify investor rights including redemption options and dispute resolution mechanisms.'
    };
    
    return recommendations[rule.id] || `Address issues with ${rule.name} to ensure regulatory compliance.`;
  }

  /**
   * Get recommended timeframe for addressing issues based on severity
   * @param {string} severity Severity level
   * @returns {string} Recommended timeframe
   */
  getTimeframeForSeverity(severity) {
    switch (severity) {
      case 'critical':
        return 'immediate (0-7 days)';
      case 'high':
        return 'urgent (8-30 days)';
      case 'medium':
        return 'important (1-3 months)';
      case 'low':
        return 'routine (3-6 months)';
      default:
        return 'as soon as possible';
    }
  }

  /**
   * Check if a specific compliance rule is met
   * @param {Object} project Project object
   * @param {string} ruleId Rule ID
   * @returns {Object} Rule check result
   */
  async checkSpecificRule(project, ruleId) {
    try {
      // Find the rule in available rule sets
      let rule = null;
      let regulatorId = null;
      
      // Search for the rule in all rule sets
      for (const [regId, rules] of Object.entries(this.ruleSets)) {
        const foundRule = rules.find(r => r.id === ruleId);
        if (foundRule) {
          rule = foundRule;
          regulatorId = regId;
          break;
        }
      }
      
      if (!rule) {
        throw new Error(`Rule not found: ${ruleId}`);
      }
      
      // In a real implementation, this would check the specific rule
      // For now, simulate a check result
      const compliant = Math.random() > 0.2;
      
      return {
        projectId: project.id || project,
        regulatorId,
        ruleId,
        rule,
        compliant,
        details: compliant
          ? `Passed ${rule.name} check`
          : `Failed ${rule.name} check: ${this.getRandomFailureReason(rule)}`,
        timestamp: new Date().toISOString(),
        recommendation: compliant ? null : this.getRecommendationForRule(rule)
      };
    } catch (error) {
      console.error(`Error checking rule ${ruleId}:`, error);
      throw error;
    }
  }

  /**
   * Get available compliance rules for a regulator
   * @param {string} regulatorId Regulator ID (default: 'CMA')
   * @returns {Array} Available rules
   */
  getRules(regulatorId = 'CMA') {
    return this.ruleSets[regulatorId] || [];
  }
}

module.exports = ComplianceService; 