import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaChartLine, 
  FaShieldAlt, 
  FaLeaf, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileAlt,
  FaLightbulb,
  FaRoad,
  FaWater,
  FaNetworkWired,
  FaBuilding,
  FaUsers,
  FaSpinner,
  FaExternalLinkAlt
} from 'react-icons/fa';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const { user } = useAuth();

  // Helper functions
  const getRiskLevelText = (riskScore) => {
    if (riskScore < 30) return 'Low';
    if (riskScore < 60) return 'Medium';
    if (riskScore < 80) return 'Medium-High';
    return 'High';
  };
  
  const calculateESGScore = (esgMetrics) => {
    if (!esgMetrics) return 70; // Default score
    
    // Simple scoring based on available metrics
    let score = 70;
    if (esgMetrics.environmentalImpact === 'positive') score += 10;
    if (esgMetrics.environmentalImpact === 'very positive') score += 20;
    if (esgMetrics.socialBenefit === 'high') score += 10;
    if (esgMetrics.jobsCreated > 1000) score += 5;
    if (esgMetrics.carbonReduction > 50000) score += 5;
    
    return Math.min(score, 100);
  };
  
  const calculateProgress = (timeline) => {
    if (!timeline) return 30; // Default progress
    
    const now = new Date();
    const start = new Date(timeline.startDate);
    const end = new Date(timeline.estimatedCompletionDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 30;
    
    const totalDuration = end - start;
    const elapsed = now - start;
    
    let progress = Math.round((elapsed / totalDuration) * 100);
    // Cap between 0 and 100
    return Math.max(0, Math.min(100, progress));
  };
  
  const getProjectIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'transportation':
        return <FaRoad className="h-6 w-6 text-primary" />;
      case 'energy':
        return <FaLightbulb className="h-6 w-6 text-yellow-500" />;
      case 'water':
        return <FaWater className="h-6 w-6 text-blue-500" />;
      case 'digital':
        return <FaNetworkWired className="h-6 w-6 text-purple-500" />;
      default:
        return <FaBuilding className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': 
        return 'bg-green-100 text-green-800';
      case 'Medium': 
        return 'bg-yellow-100 text-yellow-800';
      case 'Medium-High': 
        return 'bg-orange-100 text-orange-800';
      case 'High': 
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch project data
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // Fetch project details
        const projectResponse = await apiService.getProjectById(id);
        
        if (!projectResponse) {
          throw new Error('Project not found');
        }
        
        // Transform project data
        const projectData = {
          ...projectResponse,
          riskLevel: getRiskLevelText(projectResponse.risk?.overallScore || 50),
          esgScore: calculateESGScore(projectResponse.esgMetrics),
          progress: calculateProgress(projectResponse.timeline),
          longDescription: projectResponse.description || '',
          startDate: projectResponse.timeline?.startDate,
          estimatedCompletion: projectResponse.timeline?.estimatedCompletionDate,
          minInvestment: projectResponse.investmentMetrics?.minInvestmentAmount || 5000,
          totalFunding: projectResponse.financials?.totalBudget || 0,
          currentFunding: projectResponse.financials?.fundingSecured || 0,
          tokenSymbol: projectResponse.symbol,
          tokenPrice: 50, // Mock data for now
          stakeholders: projectResponse.stakeholders || ['Government of Kenya', 'Local Communities', 'Private Investors'],
          documents: [
            { name: 'Environmental Impact Assessment', url: '#' },
            { name: 'Feasibility Study', url: '#' },
            { name: 'Project Timeline', url: '#' }
          ],
        };
        
        setProject(projectData);
        
        // If we have a token ID, fetch token information
        if (projectResponse.tokenId) {
          try {
            const tokenResponse = await apiService.getTokenInfo(projectResponse.tokenId);
            if (tokenResponse?.success) {
              setTokenInfo(tokenResponse.data);
            }
          } catch (tokenError) {
            console.error('Error fetching token info:', tokenError);
          }
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project details');
        
        // Use sample data as fallback for demo purposes
        // Using the ID from the URL to create a consistent experience
        setProject({
          id: id,
          name: id.startsWith('inv-') ? 'Investment Opportunity' : 'Nairobi Commuter Rail',
          type: 'Transportation',
          location: 'Nairobi, Kenya',
          roi: 8.5,
          riskLevel: 'Medium',
          esgScore: 78,
          progress: 45,
          description: 'Urban railway system connecting Nairobi suburbs to reduce traffic congestion and carbon emissions.',
          longDescription: `This infrastructure project aims to transform urban mobility by expanding and modernizing the existing network. This initiative will connect major suburbs to the central business district, significantly reducing traffic congestion and carbon emissions.

The project includes the construction of new lines, modernization of existing tracks, and development of modern stations with digital payment systems and real-time tracking. Solar-powered stations will further reduce the environmental impact of the transit system.

Benefits include reduced travel time for commuters, decreased air pollution, and creation of jobs both during construction and operation. The project aligns with national transportation and environmental goals.`,
          startDate: '2023-01-15',
          estimatedCompletion: '2025-06-30',
          minInvestment: 5000,
          totalFunding: 45000000,
          currentFunding: 28000000,
          tokenSymbol: 'NCR',
          tokenPrice: 50,
          stakeholders: ['Government of Kenya', 'Local Communities', 'Private Investors'],
          documents: [
            { name: 'Environmental Impact Assessment', url: '#' },
            { name: 'Feasibility Study', url: '#' },
            { name: 'Project Timeline', url: '#' }
          ],
          risks: [
            { category: 'Construction', level: 'Medium', description: 'Potential delays due to weather conditions and supply chain issues.' },
            { category: 'Regulatory', level: 'Low', description: 'All major approvals obtained, minimal regulatory risk remains.' },
            { category: 'Financial', level: 'Medium', description: 'Currency fluctuation may impact imported material costs.' }
          ],
          impact: {
            economic: 'Creates 1,200+ jobs during construction and 300+ permanent positions. Estimated to save commuters 2 hours daily.',
            environmental: 'Projected reduction of 25,000 metric tons of CO2 emissions annually by reducing private vehicle usage.',
            social: 'Improves access to employment, education, and services for underserved communities. Enhances urban mobility for all.'
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  // Handle investment form submission
  const handleInvestmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!investmentAmount || isNaN(parseFloat(investmentAmount)) || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }
    
    // Check if amount meets minimum
    if (parseFloat(investmentAmount) < project.minInvestment) {
      alert(`Minimum investment amount is ${project.minInvestment} KES`);
      return;
    }
    
    try {
      // In a real application, you would use the actual user ID
      const userId = 'user-1743079616219'; // Demo user ID
      const response = await apiService.simulateInvestment(userId, project.id, parseFloat(investmentAmount));
      
      if (response) {
        alert(`Investment simulation successful! You've invested ${investmentAmount} KES in ${project.name}. This is a demo, no actual investment was made.`);
        setInvestmentAmount('');
      }
    } catch (error) {
      console.error('Investment simulation failed:', error);
      alert(`Investment simulation failed: ${error.message || 'Unknown error'}`);
    }
  };

  const TokenInvestmentModal = ({ isOpen, onClose, project }) => {
    const [amount, setAmount] = useState(1000);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionResult, setTransactionResult] = useState(null);
    
    if (!isOpen) return null;
    
    const handleInvest = async () => {
      setIsProcessing(true);
      
      try {
        // Call backend to process investment
        const result = await apiService.processInvestment(
          user.id,
          project.id,
          amount
        );
        
        if (result.success) {
          setTransactionResult({
            success: true,
            tokenId: result.tokenId,
            transactionId: result.transactionIds.token,
            quantity: result.tokenAmount,
            pricePerToken: amount / result.tokenAmount,
            timestamp: result.timestamp
          });
        } else {
          setTransactionResult({
            success: false,
            error: result.error || 'Transaction failed. Please try again.'
          });
        }
      } catch (error) {
        setTransactionResult({
          success: false,
          error: error.message || 'Transaction failed. Please try again.'
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    const handleAmountChange = (e) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= project.minInvestmentAmount) {
        setAmount(value);
      }
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Invest in {project.name}</h2>
          
          {!transactionResult ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (HBAR)
                </label>
                <input
                  type="number"
                  min={project.minInvestmentAmount}
                  step={100}
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full p-2 border rounded"
                  disabled={isProcessing}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum investment: {project.minInvestmentAmount} HBAR
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Investment Summary</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="flex justify-between mb-2">
                    <span>HBAR Amount:</span>
                    <span>{amount}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Estimated Tokens:</span>
                    <span>{Math.floor(amount * 100)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Price per Token:</span>
                    <span>{(amount / (amount * 100)).toFixed(4)} HBAR</span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvest}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Invest Now'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              {transactionResult.success ? (
                <>
                  <div className="mb-4 text-green-600">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Investment Successful!</h3>
                  <div className="bg-gray-50 p-4 rounded text-left mb-4">
                    <p className="mb-2"><span className="font-medium">Token ID:</span> {transactionResult.tokenId}</p>
                    <p className="mb-2"><span className="font-medium">Transaction ID:</span> {transactionResult.transactionId}</p>
                    <p className="mb-2"><span className="font-medium">Tokens Received:</span> {transactionResult.quantity}</p>
                    <p><span className="font-medium">Price per Token:</span> {transactionResult.pricePerToken.toFixed(4)} HBAR</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 text-red-600">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Failed</h3>
                  <p className="text-red-600 mb-4">{transactionResult.error}</p>
                </>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
        <p className="mt-1 text-sm text-gray-500">Please try another project or return to the projects list</p>
        <div className="mt-6">
          <Link 
            to="/projects" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and project title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/projects" className="inline-flex items-center text-primary hover:text-primary-dark mb-2">
            <FaArrowLeft className="mr-2" /> Back to Projects
          </Link>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              {getProjectIcon(project.type)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
            {project.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Project summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FaChartLine className="text-primary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Expected ROI</p>
              <p className="text-xl font-bold text-primary">{project.roi}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <FaLeaf className="text-secondary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">ESG Score</p>
              <p className="text-xl font-bold">{project.esgScore}/100</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <FaMoneyBillWave className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Min. Investment</p>
              <p className="text-xl font-bold">KES {project.minInvestment.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <FaCalendarAlt className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Est. Completion</p>
              <p className="text-xl font-bold">{new Date(project.estimatedCompletion).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding progress */}
      <div className="card bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Funding Progress</h2>
            <p className="text-gray-600">
              KES {project.currentFunding.toLocaleString()} raised of KES {project.totalFunding.toLocaleString()}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-lg font-bold text-primary">
              {Math.round(project.currentFunding / project.totalFunding * 100)}% Complete
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-primary rounded-full h-4"
            style={{ width: `${(project.currentFunding / project.totalFunding) * 100}%` }}
          ></div>
        </div>

        {/* Investment form */}
        <form onSubmit={handleInvestmentSubmit} className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-3">Invest in this project</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (KES)
            </label>
            <div className="flex">
              <input
                type="number"
                className="flex-grow input"
                placeholder="Enter amount"
                min={project.minInvestment}
                step="100"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
              />
              <button
                type="submit"
                onClick={() => setShowInvestModal(true)}
                className="ml-2 btn btn-primary w-full mb-3"
                disabled={!investmentAmount || Number(investmentAmount) < project.minInvestment}
              >
                Invest Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum investment: KES {project.minInvestment.toLocaleString()}
            </p>
          </div>
          <div className="text-xs text-gray-600 flex items-start">
            <FaInfoCircle className="text-primary mr-1 mt-0.5 flex-shrink-0" />
            <p>
              By investing, you'll receive {project.tokenSymbol} tokens at a rate of KES {project.tokenPrice} per token.
              These tokens represent your stake in this infrastructure project.
            </p>
          </div>
        </form>
      </div>

      {/* Project details tabs */}
      <div className="card bg-white overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'milestones'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('milestones')}
            >
              Milestones
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'updates'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('updates')}
            >
              Updates
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'risks'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('risks')}
            >
              Risks
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'impact'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('impact')}
            >
              Impact
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'documents'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-bold text-lg mb-3">Project Description</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{project.longDescription}</p>
              
              <h4 className="font-semibold text-md mb-2">Key Stakeholders</h4>
              <ul className="list-disc list-inside mb-4 text-gray-700">
                {project.stakeholders.map((stakeholder, idx) => (
                  <li key={idx}>{stakeholder}</li>
                ))}
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Project Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Project Type:</span> {project.type}
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Token Symbol:</span> {project.tokenSymbol}
                      </div>
                      <div>
                        <span className="text-gray-600">Token Price:</span> KES {project.tokenPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Milestones</h3>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {project.milestones.map((milestone, idx) => (
                    <div key={idx} className="relative flex items-start pl-12">
                      <div className="absolute left-0 mt-1.5">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          milestone.status === 'Completed' 
                            ? 'bg-green-500' 
                            : milestone.status === 'In Progress' 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                        }`}>
                          {milestone.status === 'Completed' && <FaCheckCircle className="text-white h-4 w-4" />}
                          {milestone.status === 'In Progress' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                          {milestone.status === 'Planned' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            milestone.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : milestone.status === 'In Progress' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(milestone.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'updates' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Updates</h3>
              <div className="space-y-6">
                {project.updates.map((update, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{update.title}</h4>
                      <span className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                {project.risks.map((risk, idx) => (
                  <div key={idx} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{risk.category} Risk</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(risk.level)}`}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-gray-700">{risk.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <div className="flex">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Risk Disclaimer</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      All investments involve risk, including the possible loss of principal. The risk assessments provided are estimates and actual outcomes may differ. Please conduct your own research before investing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FaChartLine className="mr-2" /> Economic Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.economic}</p>
                </div>
                <div className="card bg-green-50 p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <FaLeaf className="mr-2" /> Environmental Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.environmental}</p>
                </div>
                <div className="card bg-purple-50 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <FaUsers className="mr-2" /> Social Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.social}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Documents</h3>
              <div className="space-y-3">
                {project.documents.map((doc, idx) => (
                  <a 
                    key={idx} 
                    href={doc.url} 
                    className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FaFileAlt className="text-gray-400 mr-3" />
                    <span className="text-primary">{doc.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <div className="flex">
                  <FaShieldAlt className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Verified Documents</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      All project documents are timestamped and verified on the Hedera distributed ledger, ensuring authenticity and preventing document tampering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showInvestModal && (
        <TokenInvestmentModal 
          isOpen={showInvestModal} 
          onClose={() => setShowInvestModal(false)} 
          project={project} 
        />
      )}
    </div>
  );
};

export default ProjectDetail; 