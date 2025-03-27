/**
 * ESGUtils - Utilities for ESG (Environmental, Social, Governance) scoring and analysis
 * Helps with ESG metrics for infrastructure projects
 */
class ESGUtils {
  /**
   * Calculate overall ESG score for a project
   * @param {Object} project Project object with ESG metrics
   * @returns {Object} ESG score and breakdown
   */
  static calculateESGScore(project) {
    // Extract ESG metrics from project
    const esgMetrics = project.esgMetrics || {};
    
    // Environmental score (0-100)
    const environmentalScore = this.calculateEnvironmentalScore(esgMetrics);
    
    // Social score (0-100)
    const socialScore = this.calculateSocialScore(esgMetrics);
    
    // Governance score (0-100)
    const governanceScore = this.calculateGovernanceScore(esgMetrics);
    
    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (environmentalScore * 0.4) + (socialScore * 0.3) + (governanceScore * 0.3)
    );
    
    // Determine ESG rating
    const rating = this.getESGRating(overallScore);
    
    return {
      overallScore,
      rating,
      environmentalScore,
      socialScore,
      governanceScore,
      breakdown: {
        environmental: {
          score: environmentalScore,
          impact: esgMetrics.environmentalImpact || 'medium',
          carbonReduction: esgMetrics.carbonReduction || 0
        },
        social: {
          score: socialScore,
          benefit: esgMetrics.socialBenefit || 'medium',
          jobsCreated: esgMetrics.jobsCreated || 0
        },
        governance: {
          score: governanceScore,
          rating: esgMetrics.governanceRating || 'medium'
        }
      },
      sdgAlignment: esgMetrics.sdgAlignment || []
    };
  }

  /**
   * Calculate environmental score
   * @param {Object} esgMetrics ESG metrics
   * @returns {number} Environmental score (0-100)
   */
  static calculateEnvironmentalScore(esgMetrics) {
    let score = 50; // Default medium score
    
    // Adjust score based on environmental impact
    const impactScores = {
      'very positive': 90,
      'positive': 75,
      'medium': 50,
      'negative': 25,
      'very negative': 10
    };
    
    score = impactScores[esgMetrics.environmentalImpact] || score;
    
    // Adjust score based on carbon reduction
    if (esgMetrics.carbonReduction) {
      const carbonScore = Math.min(100, esgMetrics.carbonReduction / 1000);
      score = Math.round((score + carbonScore) / 2);
    }
    
    return score;
  }

  /**
   * Calculate social score
   * @param {Object} esgMetrics ESG metrics
   * @returns {number} Social score (0-100)
   */
  static calculateSocialScore(esgMetrics) {
    let score = 50; // Default medium score
    
    // Adjust score based on social benefit
    const benefitScores = {
      'very high': 90,
      'high': 75,
      'medium': 50,
      'low': 25,
      'very low': 10
    };
    
    score = benefitScores[esgMetrics.socialBenefit] || score;
    
    // Adjust score based on jobs created
    if (esgMetrics.jobsCreated) {
      const jobScore = Math.min(100, (esgMetrics.jobsCreated / 50) * 10);
      score = Math.round((score + jobScore) / 2);
    }
    
    return score;
  }

  /**
   * Calculate governance score
   * @param {Object} esgMetrics ESG metrics
   * @returns {number} Governance score (0-100)
   */
  static calculateGovernanceScore(esgMetrics) {
    let score = 50; // Default medium score
    
    // Adjust score based on governance rating
    const ratingScores = {
      'excellent': 90,
      'good': 75,
      'medium': 50,
      'fair': 25,
      'poor': 10
    };
    
    score = ratingScores[esgMetrics.governanceRating] || score;
    
    // Adjust score based on sustainability score if available
    if (esgMetrics.sustainabilityScore) {
      score = Math.round((score + esgMetrics.sustainabilityScore) / 2);
    }
    
    return score;
  }

  /**
   * Get ESG rating based on score
   * @param {number} score ESG score (0-100)
   * @returns {string} ESG rating
   */
  static getESGRating(score) {
    if (score >= 85) return 'AAA';
    if (score >= 70) return 'AA';
    if (score >= 60) return 'A';
    if (score >= 50) return 'BBB';
    if (score >= 40) return 'BB';
    if (score >= 30) return 'B';
    if (score >= 20) return 'CCC';
    if (score >= 10) return 'CC';
    return 'C';
  }

  /**
   * Map project to relevant UN Sustainable Development Goals (SDGs)
   * @param {Object} project Project object
   * @returns {Array} Relevant SDGs
   */
  static mapToSDGs(project) {
    const sdgs = [];
    const projectType = project.type || '';
    
    // SDG mappings by project type
    const sdgMappings = {
      'energy': [7, 9, 13], // SDG 7: Affordable and Clean Energy, SDG 9: Industry, Innovation and Infrastructure, SDG 13: Climate Action
      'solar': [7, 9, 13],
      'wind': [7, 9, 13],
      'hydro': [6, 7, 9, 13], // SDG 6: Clean Water and Sanitation
      'geothermal': [7, 9, 13],
      
      'transportation': [9, 11, 13], // SDG 11: Sustainable Cities and Communities
      'rail': [9, 11, 13],
      'road': [9, 11],
      'port': [9, 11, 14], // SDG 14: Life Below Water
      'airport': [9, 11],
      
      'water': [6, 9, 11],
      'wastewater': [6, 11, 14],
      'sanitation': [6, 11],
      
      'telecom': [9, 17], // SDG 17: Partnerships for the Goals
      'digital': [9, 17],
      
      'housing': [9, 11],
      'healthcare': [3, 9, 11], // SDG 3: Good Health and Well-being
      'education': [4, 9], // SDG 4: Quality Education
      
      'agriculture': [2, 9, 12], // SDG 2: Zero Hunger, SDG 12: Responsible Consumption and Production
      'forestry': [13, 15], // SDG 15: Life on Land
      
      'waste': [11, 12],
      'recycling': [11, 12]
    };
    
    // Add SDGs based on project type
    Object.keys(sdgMappings).forEach(key => {
      if (projectType.toLowerCase().includes(key)) {
        sdgs.push(...sdgMappings[key]);
      }
    });
    
    // Add SDGs based on specific project attributes
    if (project.esgMetrics) {
      if (project.esgMetrics.carbonReduction > 0) {
        sdgs.push(13); // Climate Action
      }
      
      if (project.esgMetrics.jobsCreated > 100) {
        sdgs.push(8); // SDG 8: Decent Work and Economic Growth
      }
      
      if (project.esgMetrics.environmentalImpact === 'very positive' || 
          project.esgMetrics.environmentalImpact === 'positive') {
        sdgs.push(13); // Climate Action
      }
    }
    
    // Remove duplicates and sort
    return [...new Set(sdgs)].sort((a, b) => a - b);
  }

  /**
   * Generate ESG impact statement for a project
   * @param {Object} project Project object
   * @returns {string} ESG impact statement
   */
  static generateESGStatement(project) {
    if (!project.esgMetrics) {
      return 'ESG metrics not available for this project.';
    }
    
    const esgScore = this.calculateESGScore(project);
    const sdgs = this.mapToSDGs(project);
    
    let statement = `${project.name} has an overall ESG rating of ${esgScore.rating} (${esgScore.overallScore}/100), `;
    
    // Environmental impact
    if (project.esgMetrics.environmentalImpact === 'very positive' || project.esgMetrics.environmentalImpact === 'positive') {
      statement += `with a positive environmental impact that includes an estimated annual carbon reduction of ${project.esgMetrics.carbonReduction || 0} tonnes of CO2. `;
    } else if (project.esgMetrics.environmentalImpact === 'medium') {
      statement += `with a neutral environmental impact and moderate carbon reduction measures. `;
    } else {
      statement += `with environmental considerations that require further attention. `;
    }
    
    // Social impact
    if (project.esgMetrics.jobsCreated) {
      statement += `The project is expected to create approximately ${project.esgMetrics.jobsCreated} jobs `;
      
      if (project.esgMetrics.socialBenefit === 'very high' || project.esgMetrics.socialBenefit === 'high') {
        statement += `and provide significant social benefits to the local community. `;
      } else if (project.esgMetrics.socialBenefit === 'medium') {
        statement += `and provide moderate social benefits to the local community. `;
      } else {
        statement += `with limited broader social benefits. `;
      }
    }
    
    // Governance
    if (project.esgMetrics.governanceRating === 'excellent' || project.esgMetrics.governanceRating === 'good') {
      statement += `The project demonstrates strong governance practices. `;
    } else if (project.esgMetrics.governanceRating === 'medium') {
      statement += `The project has adequate governance structures in place. `;
    } else {
      statement += `The project would benefit from improved governance practices. `;
    }
    
    // SDG alignment
    if (sdgs.length > 0) {
      statement += `This project aligns with ${sdgs.length} UN Sustainable Development Goals, including `;
      
      const sdgNames = {
        1: 'No Poverty',
        2: 'Zero Hunger',
        3: 'Good Health and Well-being',
        4: 'Quality Education',
        5: 'Gender Equality',
        6: 'Clean Water and Sanitation',
        7: 'Affordable and Clean Energy',
        8: 'Decent Work and Economic Growth',
        9: 'Industry, Innovation and Infrastructure',
        10: 'Reduced Inequalities',
        11: 'Sustainable Cities and Communities',
        12: 'Responsible Consumption and Production',
        13: 'Climate Action',
        14: 'Life Below Water',
        15: 'Life on Land',
        16: 'Peace, Justice and Strong Institutions',
        17: 'Partnerships for the Goals'
      };
      
      const sdgText = sdgs.map(sdg => `SDG ${sdg} (${sdgNames[sdg] || 'Unknown'})`).join(', ');
      statement += sdgText + '.';
    }
    
    return statement;
  }

  /**
   * Compare ESG profiles of multiple projects
   * @param {Array} projects Array of project objects
   * @returns {Object} Comparison results
   */
  static compareESGProfiles(projects) {
    if (!projects || projects.length === 0) {
      return {
        count: 0,
        scores: [],
        rankings: {},
        topPerformer: null,
        bottomPerformer: null
      };
    }
    
    // Calculate ESG scores for all projects
    const projectScores = projects.map(project => {
      const esgScore = this.calculateESGScore(project);
      return {
        projectId: project.id,
        projectName: project.name,
        overallScore: esgScore.overallScore,
        rating: esgScore.rating,
        environmentalScore: esgScore.environmentalScore,
        socialScore: esgScore.socialScore,
        governanceScore: esgScore.governanceScore
      };
    });
    
    // Sort by overall score (descending)
    projectScores.sort((a, b) => b.overallScore - a.overallScore);
    
    // Generate rankings
    const environmentalRanking = [...projectScores].sort((a, b) => b.environmentalScore - a.environmentalScore);
    const socialRanking = [...projectScores].sort((a, b) => b.socialScore - a.socialScore);
    const governanceRanking = [...projectScores].sort((a, b) => b.governanceScore - a.governanceScore);
    
    return {
      count: projects.length,
      scores: projectScores,
      rankings: {
        overall: projectScores.map((p, i) => ({ rank: i + 1, projectId: p.projectId, projectName: p.projectName, score: p.overallScore })),
        environmental: environmentalRanking.map((p, i) => ({ rank: i + 1, projectId: p.projectId, projectName: p.projectName, score: p.environmentalScore })),
        social: socialRanking.map((p, i) => ({ rank: i + 1, projectId: p.projectId, projectName: p.projectName, score: p.socialScore })),
        governance: governanceRanking.map((p, i) => ({ rank: i + 1, projectId: p.projectId, projectName: p.projectName, score: p.governanceScore }))
      },
      topPerformer: projectScores[0] || null,
      bottomPerformer: projectScores[projectScores.length - 1] || null
    };
  }
}

module.exports = ESGUtils; 