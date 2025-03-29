import React, { useState, useEffect } from 'react';
import { FaChartPie, FaRobot, FaChartLine, FaCoins, FaInfoCircle, FaExchangeAlt } from 'react-icons/fa';

const PortfolioSimulator = ({ projects }) => {
  const [totalAmount, setTotalAmount] = useState(10000);
  const [allocations, setAllocations] = useState({});
  const [remainingAmount, setRemainingAmount] = useState(totalAmount);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);
  
  // Initialize allocations
  useEffect(() => {
    const initialAllocations = {};
    projects.forEach(project => {
      initialAllocations[project.id] = 0;
    });
    setAllocations(initialAllocations);
  }, [projects]);

  // Calculate remaining amount
  useEffect(() => {
    const allocated = Object.values(allocations).reduce((sum, value) => sum + value, 0);
    setRemainingAmount(totalAmount - allocated);
  }, [allocations, totalAmount]);

  // Handler for slider changes
  const handleAllocationChange = (projectId, value) => {
    const numericValue = parseInt(value, 10);
    const currentTotal = Object.entries(allocations)
      .filter(([id]) => id !== projectId.toString())
      .reduce((sum, [, value]) => sum + value, 0);
    
    // Ensure we don't exceed total amount
    const maxPossible = totalAmount - currentTotal;
    const newValue = Math.min(numericValue, maxPossible);
    
    setAllocations({
      ...allocations,
      [projectId]: newValue
    });
  };

  // Reset all allocations
  const resetAllocations = () => {
    const resetValues = {};
    projects.forEach(project => {
      resetValues[project.id] = 0;
    });
    setAllocations(resetValues);
  };

  // Apply AI recommendation
  const applyAiRecommendation = () => {
    if (!aiRecommendation) generateAiRecommendation();
    
    if (aiRecommendation) {
      setAllocations(aiRecommendation.allocations);
      setShowAiRecommendation(true);
    }
  };

  // Generate AI recommendation
  const generateAiRecommendation = () => {
    // Sort projects by a combination of ESG score and ROI
    const sortedProjects = [...projects].sort((a, b) => {
      const scoreA = (a.esgScore / 100) * (a.roi) / getRiskValue(a.riskLevel);
      const scoreB = (b.esgScore / 100) * (b.roi) / getRiskValue(b.riskLevel);
      return scoreB - scoreA;
    });
    
    // Create optimized allocation
    const recommendedAllocations = {};
    projects.forEach(project => {
      recommendedAllocations[project.id] = 0;
    });
    
    // Allocate based on ranking with weighted distribution
    if (sortedProjects.length >= 3) {
      recommendedAllocations[sortedProjects[0].id] = Math.round(totalAmount * 0.5 / 100) * 100; // 50% to top project
      recommendedAllocations[sortedProjects[1].id] = Math.round(totalAmount * 0.3 / 100) * 100; // 30% to second
      recommendedAllocations[sortedProjects[2].id] = totalAmount - recommendedAllocations[sortedProjects[0].id] - recommendedAllocations[sortedProjects[1].id]; // Remainder to third
    } else if (sortedProjects.length === 2) {
      recommendedAllocations[sortedProjects[0].id] = Math.round(totalAmount * 0.6 / 100) * 100; // 60% to top project
      recommendedAllocations[sortedProjects[1].id] = totalAmount - recommendedAllocations[sortedProjects[0].id]; // 40% to second
    } else if (sortedProjects.length === 1) {
      recommendedAllocations[sortedProjects[0].id] = totalAmount; // 100% to the only project
    }
    
    const recommendation = {
      allocations: recommendedAllocations,
      expectedReturn: calculateExpectedReturn(recommendedAllocations),
      riskLevel: calculateRiskLevel(recommendedAllocations),
      esgScore: calculateEsgScore(recommendedAllocations),
      reasoning: "This allocation maximizes your expected return while maintaining a balanced risk profile and strong ESG impact."
    };
    
    setAiRecommendation(recommendation);
    return recommendation;
  };
  
  // Helper function to get risk value
  const getRiskValue = (level) => {
    switch (level) {
      case 'Low': return 1;
      case 'Medium-Low': return 1.5;
      case 'Medium': return 2;
      case 'Medium-High': return 2.5;
      case 'High': return 3;
      default: return 2;
    }
  };
  
  // Helper function for risk label
  const getRiskLabel = (value) => {
    if (value < 1.5) return 'Low';
    if (value < 2) return 'Medium-Low';
    if (value < 2.5) return 'Medium';
    if (value < 3) return 'Medium-High';
    return 'High';
  };
  
  // Calculate expected return based on allocations
  const calculateExpectedReturn = (allocations) => {
    let totalReturn = 0;
    let totalAllocated = 0;
    
    projects.forEach(project => {
      const amount = allocations[project.id] || 0;
      totalReturn += (amount * project.roi) / 100;
      totalAllocated += amount;
    });
    
    return totalAllocated > 0 ? parseFloat((totalReturn / totalAllocated * 100).toFixed(2)) : 0;
  };
  
  // Calculate risk level based on allocations
  const calculateRiskLevel = (allocations) => {
    let totalRisk = 0;
    let totalAllocated = 0;
    
    projects.forEach(project => {
      const amount = allocations[project.id] || 0;
      totalRisk += amount * getRiskValue(project.riskLevel);
      totalAllocated += amount;
    });
    
    return totalAllocated > 0 ? totalRisk / totalAllocated : 0;
  };
  
  // Calculate ESG score based on allocations
  const calculateEsgScore = (allocations) => {
    let totalEsg = 0;
    let totalAllocated = 0;
    
    projects.forEach(project => {
      const amount = allocations[project.id] || 0;
      totalEsg += amount * project.esgScore;
      totalAllocated += amount;
    });
    
    return totalAllocated > 0 ? Math.round(totalEsg / totalAllocated) : 0;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get percentage of total
  const getPercentage = (amount) => {
    return totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0;
  };
  
  // Current portfolio metrics
  const currentExpectedReturn = calculateExpectedReturn(allocations);
  const currentRiskLevel = calculateRiskLevel(allocations);
  const currentEsgScore = calculateEsgScore(allocations);
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Simulator</h3>
          <p className="text-sm text-gray-500">Build your virtual portfolio</p>
        </div>
        <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
      </div>
      
      <div className="p-5">
        {/* Investment allocation sliders */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700">Allocate Your Investment</h4>
            <div className="text-sm text-gray-500">
              Remaining: <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-gray-500">
                    {formatCurrency(allocations[project.id] || 0)} ({getPercentage(allocations[project.id] || 0)}%)
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0"
                    max={totalAmount}
                    step="100"
                    value={allocations[project.id] || 0}
                    onChange={(e) => handleAllocationChange(project.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    step="100"
                    value={allocations[project.id] || 0}
                    onChange={(e) => handleAllocationChange(project.id, e.target.value)}
                    className="w-24 text-right border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div className="flex space-x-3 text-xs text-gray-500">
                  <div>ROI: {project.roi}%</div>
                  <div>Risk: {project.riskLevel}</div>
                  <div>ESG: {project.esgScore}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Portfolio metrics */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Portfolio Metrics</h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Expected Return</div>
              <div className="text-2xl font-bold text-green-600">{currentExpectedReturn}%</div>
              <div className="text-xs text-gray-500">Annual</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Risk Level</div>
              <div className="text-2xl font-bold">{getRiskLabel(currentRiskLevel)}</div>
              <div className="text-xs text-gray-500">Blended</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">ESG Score</div>
              <div className="text-2xl font-bold text-blue-600">{currentEsgScore}</div>
              <div className="text-xs text-gray-500">Weighted Avg</div>
            </div>
          </div>
        </div>
        
        {/* AI Recommendation */}
        {showAiRecommendation && aiRecommendation && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <FaRobot className="text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-blue-800">AI Recommendation</h4>
            </div>
            
            <p className="text-sm text-blue-700 mb-3">
              {aiRecommendation.reasoning}
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white bg-opacity-50 p-2 rounded">
                <div className="text-xs text-gray-500">Expected Return</div>
                <div className="font-bold text-green-600">{aiRecommendation.expectedReturn}%</div>
              </div>
              <div className="bg-white bg-opacity-50 p-2 rounded">
                <div className="text-xs text-gray-500">Risk Level</div>
                <div className="font-bold">{getRiskLabel(aiRecommendation.riskLevel)}</div>
              </div>
              <div className="bg-white bg-opacity-50 p-2 rounded">
                <div className="text-xs text-gray-500">ESG Score</div>
                <div className="font-bold text-blue-600">{aiRecommendation.esgScore}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={resetAllocations}
            className="btn btn-outline flex-1"
          >
            Reset
          </button>
          <button
            onClick={applyAiRecommendation}
            className="btn btn-primary flex-1 flex items-center justify-center"
          >
            <FaRobot className="mr-2" />
            AI Recommend
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSimulator; 