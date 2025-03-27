/**
 * MilestoneUtils - Utilities for handling project milestones
 * Helps with milestone tracking and verification on Hedera
 */
class MilestoneUtils {
  /**
   * Generate a standard set of milestones for an infrastructure project
   * @param {string} projectType Project type (e.g., 'transportation', 'energy')
   * @param {string} startDate Project start date (ISO string)
   * @param {string} endDate Project estimated completion date (ISO string)
   * @returns {Array} Generated milestones
   */
  static generateStandardMilestones(projectType, startDate, endDate) {
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate project duration in months
    const durationMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                          (end.getMonth() - start.getMonth());
    
    // Define milestone templates by project type
    const milestoneTemplates = {
      'transportation': [
        { name: 'Planning Phase Complete', phase: 'planning', percentComplete: 0.1 },
        { name: 'Environmental Impact Assessment', phase: 'planning', percentComplete: 0.15 },
        { name: 'Land Acquisition Complete', phase: 'planning', percentComplete: 0.2 },
        { name: 'Design Phase Complete', phase: 'design', percentComplete: 0.3 },
        { name: 'Construction Bidding Complete', phase: 'planning', percentComplete: 0.35 },
        { name: 'Groundbreaking', phase: 'construction', percentComplete: 0.4 },
        { name: 'Foundation Work Complete', phase: 'construction', percentComplete: 0.5 },
        { name: 'Infrastructure 50% Complete', phase: 'construction', percentComplete: 0.6 },
        { name: 'Infrastructure 75% Complete', phase: 'construction', percentComplete: 0.7 },
        { name: 'Testing Phase Start', phase: 'testing', percentComplete: 0.8 },
        { name: 'Commissioning', phase: 'commissioning', percentComplete: 0.9 },
        { name: 'Project Handover', phase: 'complete', percentComplete: 1.0 }
      ],
      'energy': [
        { name: 'Feasibility Study Complete', phase: 'planning', percentComplete: 0.1 },
        { name: 'Environmental Impact Assessment', phase: 'planning', percentComplete: 0.15 },
        { name: 'Land Acquisition Complete', phase: 'planning', percentComplete: 0.2 },
        { name: 'Design Phase Complete', phase: 'design', percentComplete: 0.3 },
        { name: 'Equipment Procurement', phase: 'procurement', percentComplete: 0.4 },
        { name: 'Site Preparation Complete', phase: 'construction', percentComplete: 0.5 },
        { name: 'Installation 50% Complete', phase: 'construction', percentComplete: 0.6 },
        { name: 'Installation 100% Complete', phase: 'construction', percentComplete: 0.7 },
        { name: 'Grid Connection', phase: 'testing', percentComplete: 0.8 },
        { name: 'Testing Complete', phase: 'testing', percentComplete: 0.9 },
        { name: 'Commercial Operation', phase: 'complete', percentComplete: 1.0 }
      ],
      'water': [
        { name: 'Feasibility Study Complete', phase: 'planning', percentComplete: 0.1 },
        { name: 'Environmental Impact Assessment', phase: 'planning', percentComplete: 0.15 },
        { name: 'Water Rights Secured', phase: 'planning', percentComplete: 0.2 },
        { name: 'Design Phase Complete', phase: 'design', percentComplete: 0.3 },
        { name: 'Equipment Procurement', phase: 'procurement', percentComplete: 0.4 },
        { name: 'Site Preparation Complete', phase: 'construction', percentComplete: 0.5 },
        { name: 'Pipeline/Infrastructure 50% Complete', phase: 'construction', percentComplete: 0.6 },
        { name: 'Pipeline/Infrastructure 100% Complete', phase: 'construction', percentComplete: 0.7 },
        { name: 'Treatment Systems Installation', phase: 'construction', percentComplete: 0.8 },
        { name: 'Testing and Quality Verification', phase: 'testing', percentComplete: 0.9 },
        { name: 'System Launch', phase: 'complete', percentComplete: 1.0 }
      ]
    };
    
    // Use general template if specific type not found
    const templates = milestoneTemplates[projectType] || [
      { name: 'Planning Phase Complete', phase: 'planning', percentComplete: 0.1 },
      { name: 'Design Phase Complete', phase: 'design', percentComplete: 0.3 },
      { name: 'Construction 25% Complete', phase: 'construction', percentComplete: 0.4 },
      { name: 'Construction 50% Complete', phase: 'construction', percentComplete: 0.5 },
      { name: 'Construction 75% Complete', phase: 'construction', percentComplete: 0.7 },
      { name: 'Testing Phase', phase: 'testing', percentComplete: 0.9 },
      { name: 'Project Complete', phase: 'complete', percentComplete: 1.0 }
    ];
    
    // Generate milestones with dates
    return templates.map((template, index) => {
      // Calculate target date based on percentage complete
      const targetDate = new Date(start);
      targetDate.setMonth(start.getMonth() + Math.floor(durationMonths * template.percentComplete));
      
      return {
        id: `ms-${index + 1}`,
        name: template.name,
        description: `${template.name} for the project`,
        targetDate: targetDate.toISOString(),
        completed: false,
        completedDate: null,
        status: 'pending',
        updatePhase: template.phase
      };
    });
  }

  /**
   * Calculate project progress based on completed milestones
   * @param {Array} milestones Project milestones
   * @returns {Object} Progress information
   */
  static calculateProgress(milestones) {
    if (!milestones || milestones.length === 0) {
      return {
        percentComplete: 0,
        completedMilestones: 0,
        totalMilestones: 0,
        onTrack: true,
        estimatedDelay: 0
      };
    }
    
    // Count completed milestones
    const completedMilestones = milestones.filter(m => m.completed).length;
    
    // Calculate percentage complete
    const percentComplete = (completedMilestones / milestones.length) * 100;
    
    // Check if project is on track
    const now = new Date();
    let delay = 0;
    let onTrack = true;
    
    // Find incomplete milestones with past target dates
    const overdueMilestones = milestones.filter(m => {
      if (!m.completed && new Date(m.targetDate) < now) {
        return true;
      }
      return false;
    });
    
    if (overdueMilestones.length > 0) {
      onTrack = false;
      
      // Calculate average delay in days
      const delayDays = overdueMilestones.reduce((sum, m) => {
        const targetDate = new Date(m.targetDate);
        const diffDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      
      delay = Math.floor(delayDays / overdueMilestones.length);
    }
    
    return {
      percentComplete: Math.round(percentComplete),
      completedMilestones,
      totalMilestones: milestones.length,
      onTrack,
      estimatedDelay: delay,
      overdueMilestones: overdueMilestones.length
    };
  }

  /**
   * Find the current phase based on milestones
   * @param {Array} milestones Project milestones
   * @returns {string} Current project phase
   */
  static getCurrentPhase(milestones) {
    if (!milestones || milestones.length === 0) {
      return 'planning';
    }
    
    // Sort milestones by completion status and target date
    const sortedMilestones = [...milestones].sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return new Date(a.targetDate) - new Date(b.targetDate);
    });
    
    // Find the last completed milestone
    const lastCompletedIndex = sortedMilestones.findIndex(m => !m.completed) - 1;
    
    if (lastCompletedIndex >= 0) {
      return sortedMilestones[lastCompletedIndex].updatePhase || 'in-progress';
    }
    
    // If no milestones are completed, use the first milestone's phase
    return sortedMilestones[0].updatePhase || 'planning';
  }

  /**
   * Format milestone for Hedera consensus recording
   * @param {Object} milestone Milestone data
   * @param {string} projectId Project ID
   * @returns {Object} Formatted milestone for consensus
   */
  static formatMilestoneForConsensus(milestone, projectId) {
    return {
      milestoneId: milestone.id,
      projectId,
      name: milestone.name,
      description: milestone.description,
      targetDate: milestone.targetDate,
      completed: milestone.completed,
      completedDate: milestone.completedDate,
      status: milestone.status,
      phase: milestone.updatePhase,
      verificationMethod: 'consensus',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate milestone update message for stakeholders
   * @param {Object} milestone Milestone data
   * @param {Object} project Project data
   * @returns {string} Update message
   */
  static generateUpdateMessage(milestone, project) {
    if (milestone.completed) {
      return `${project.name} has completed the "${milestone.name}" milestone on ${new Date(milestone.completedDate).toLocaleDateString()}. This project is now in the ${milestone.updatePhase} phase.`;
    } else {
      return `${project.name} has updated the "${milestone.name}" milestone. The target date is ${new Date(milestone.targetDate).toLocaleDateString()}, and the status is now "${milestone.status}".`;
    }
  }

  /**
   * Calculate milestone risk based on completion status and delays
   * @param {Array} milestones Project milestones
   * @returns {Object} Risk assessment
   */
  static assessMilestoneRisk(milestones) {
    if (!milestones || milestones.length === 0) {
      return {
        risk: 'low',
        riskScore: 25,
        delayRisk: 'low',
        completionRisk: 'low',
        explanation: 'No milestones found to assess risk.'
      };
    }
    
    // Calculate progress
    const progress = this.calculateProgress(milestones);
    
    // Assess delay risk
    let delayRisk = 'low';
    if (progress.estimatedDelay > 120) {
      delayRisk = 'extreme';
    } else if (progress.estimatedDelay > 60) {
      delayRisk = 'high';
    } else if (progress.estimatedDelay > 30) {
      delayRisk = 'medium';
    }
    
    // Assess completion risk based on percentage complete
    let completionRisk = 'low';
    if (progress.percentComplete < 25) {
      completionRisk = 'high';
    } else if (progress.percentComplete < 50) {
      completionRisk = 'medium';
    }
    
    // Calculate overall risk score (0-100)
    let riskScore = 0;
    
    // Factor 1: Percentage of overdue milestones
    const overduePercentage = (progress.overdueMilestones / progress.totalMilestones) * 100;
    riskScore += overduePercentage;
    
    // Factor 2: Delay duration impact
    riskScore += Math.min(50, progress.estimatedDelay / 2);
    
    // Normalize to 0-100
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    // Determine risk level
    let risk = 'low';
    if (riskScore > 75) {
      risk = 'high';
    } else if (riskScore > 50) {
      risk = 'medium';
    }
    
    // Generate explanation
    let explanation = '';
    if (progress.onTrack) {
      explanation = `Project milestones are currently on track with ${progress.percentComplete}% completion.`;
    } else {
      explanation = `Project has ${progress.overdueMilestones} overdue milestones with an average delay of ${progress.estimatedDelay} days. Current completion is at ${progress.percentComplete}%.`;
    }
    
    return {
      risk,
      riskScore: Math.round(riskScore),
      delayRisk,
      completionRisk,
      explanation,
      progress
    };
  }
}

module.exports = MilestoneUtils; 