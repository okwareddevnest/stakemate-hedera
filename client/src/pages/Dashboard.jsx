import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaChartLine, FaBuilding, FaLeaf, FaLightbulb, FaRoad, FaRobot, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import apiService, { hederaService, portfolioService } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Import chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  // Initialize state
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    changePercent: 0,
    projects: 0,
    returns: 0,
    risk: 'Low'
  });

  const [portfolio, setPortfolio] = useState({
    tokenBalance: {}
  });

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hederaStatus, setHederaStatus] = useState({ isConnected: false, network: '', accountId: '' });
  
  // Get auth context to access user and account info
  const { user, hederaAccount } = useAuth();
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Check Hedera connection status
        const checkHederaStatus = async () => {
          try {
            // Check if we have account info from auth context
            if (hederaAccount && hederaAccount.isConnected) {
              setHederaStatus({
                isConnected: true,
                network: hederaAccount.network || 'testnet',
                accountId: hederaAccount.accountId,
                lastChecked: hederaAccount.lastChecked
              });
              return hederaAccount;
            }
            
            // Otherwise, try to get status from backend
            const statusResponse = await hederaService.getStatus();
            if (statusResponse?.success) {
              setHederaStatus({
                isConnected: true,
                network: statusResponse.data?.network || 'testnet',
                accountId: statusResponse.data?.accountId || 'Not Available',
                lastChecked: new Date().toISOString()
              });
              return statusResponse.data;
            }
            
            // If we reached here, connection failed
            setHederaStatus({
              isConnected: false,
              network: 'Not connected',
              accountId: 'Not available',
              lastChecked: new Date().toISOString()
            });
            return null;
          } catch (error) {
            console.error('Error checking Hedera status:', error);
            setHederaStatus({
              isConnected: false,
              network: 'Error',
              accountId: 'Not available',
              error: error.message,
              lastChecked: new Date().toISOString()
            });
            return null;
          }
        };
        
        // Check Hedera status first
        const status = await checkHederaStatus();
        
        // Fetch projects
        const projectsResponse = await apiService.getProjects();
        if (projectsResponse && Array.isArray(projectsResponse)) {
          // Set featured projects (max 3)
          setFeaturedProjects(projectsResponse.slice(0, 3).map(project => ({
            id: project.id,
            name: project.name,
            type: project.type,
            roi: project.financials?.expectedReturn || 0,
            riskLevel: getRiskLevelText(project.risk?.overallScore || 50),
            esgScore: calculateESGScore(project.esgMetrics),
            progress: calculateProgress(project.timeline),
            icon: getProjectIcon(project.type)
          })));
          
          // Calculate average returns from all projects
          const totalReturns = projectsResponse.reduce((sum, project) => 
            sum + (project.financials?.expectedReturn || 0), 0);
          const avgReturns = projectsResponse.length ? 
            (totalReturns / projectsResponse.length).toFixed(2) : 0;
            
          // Calculate average risk level from all projects
          const totalRisk = projectsResponse.reduce((sum, project) => 
            sum + (project.risk?.overallScore || 50), 0);
          const avgRisk = projectsResponse.length ? 
            totalRisk / projectsResponse.length : 50;
          const riskLevel = getRiskLevelText(avgRisk);
          
          // Fetch portfolio data if user is authenticated
          if (user?.id) {
            try {
              const portfolioData = await portfolioService.getUserPortfolio(user.id);
              if (portfolioData) {
                setPortfolio({
                  tokenBalance: portfolioData.tokenBalance || {},
                  totalValue: portfolioData.totalValue || 0,
                  investments: portfolioData.investments || []
                });
                
                // Set portfolio stats based on actual data
                setPortfolioStats(prevStats => ({
                  ...prevStats,
                  totalValue: portfolioData.totalValue || 0,
                  changePercent: portfolioData.changePercent || 0,
                  projects: projectsResponse.length,
                  returns: parseFloat(avgReturns),
                  risk: riskLevel
                }));
              }
            } catch (error) {
              console.error('Error fetching portfolio data:', error);
              
              // Set portfolio stats with project data only
              setPortfolioStats(prevStats => ({
                ...prevStats,
                projects: projectsResponse.length,
                returns: parseFloat(avgReturns),
                risk: riskLevel
              }));
            }
          } else {
            // No user authenticated, just update project-related stats
            setPortfolioStats(prevStats => ({
              ...prevStats,
              projects: projectsResponse.length,
              returns: parseFloat(avgReturns),
              risk: riskLevel
            }));
          }
        }
        
        // If we have Hedera account info, fetch balances
        if (status?.accountId && hederaStatus.isConnected) {
          try {
            const balanceResponse = await hederaService.getAccountBalance(status.accountId);
            if (balanceResponse?.success) {
              // Parse token balances if available
              const tokens = balanceResponse.data?.tokens ? 
                JSON.parse(balanceResponse.data.tokens) : {};
              
              // Update portfolio with actual balance data
              setPortfolio(prevPortfolio => ({
                ...prevPortfolio,
                tokenBalance: tokens,
                hbarBalance: parseFloat(balanceResponse.data.hbars.split(' ')[0]) || 0
              }));
              
              // Update total value in portfolio stats if needed
              if (!user?.id) {
                // Only update if we didn't get portfolio from user data
                setPortfolioStats(prevStats => ({
                  ...prevStats,
                  totalValue: parseFloat(balanceResponse.data.hbars.split(' ')[0]) || 0
                }));
              }
            }
          } catch (error) {
            console.error('Error fetching account balance:', error);
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Use empty array instead of demo projects
        setFeaturedProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, hederaAccount]);
  
  // Prepare chart data
  const portfolioAllocationData = useMemo(() => {
    return {
      labels: Object.keys(portfolio?.tokenBalance || {}).length > 0 
        ? Object.keys(portfolio.tokenBalance) 
        : ['No Data'],
      datasets: [
        {
          data: Object.keys(portfolio?.tokenBalance || {}).length > 0 
            ? Object.values(portfolio.tokenBalance)
            : [1],
          backgroundColor: [
            '#3b82f6',
            '#f59e0b',
            '#10b981',
            '#6366f1',
            '#ec4899',
            '#8b5cf6',
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [portfolio.tokenBalance]);

  // Chart data for performance over time
  const performanceData = useMemo(() => {
    return {
      labels: ['Current'],
      datasets: [
        {
          label: 'Portfolio Value',
          data: [portfolioStats.totalValue || 0],
          fill: false,
          borderColor: '#3b82f6',
          tension: 0.1,
        },
      ],
    };
  }, [portfolioStats.totalValue]);
  
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
        return <FaLeaf className="h-6 w-6 text-blue-500" />;
      default:
        return <FaBuilding className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col space-y-1.5 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Overview of your infrastructure investment portfolio</p>
      </div>

      {/* Network status alert */}
      <div className={`${hederaStatus.isConnected ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'} border-l-4 p-4 rounded-md mb-6 hover:shadow-md transition-shadow duration-300`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {hederaStatus.isConnected ? (
              <FaCheckCircle className="h-5 w-5 text-green-500 transition-transform duration-300 hover:scale-110" />
            ) : (
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:scale-110" />
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800">
              Hedera Network Status: {hederaStatus.isConnected ? 'Connected' : 'Disconnected'}
            </h3>
            <div className="mt-1 text-sm text-gray-700">
              {hederaStatus.isConnected ? (
                <p>Connected to Hedera {hederaStatus.network} network using account {hederaStatus.accountId}.</p>
              ) : (
                <p>Hedera network connection is not properly configured. Please check server configuration.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Value */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Portfolio Value</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.totalValue.toLocaleString()} ℏ</h3>
              <span className={`ml-2 text-sm font-medium ${portfolioStats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioStats.changePercent >= 0 ? <FaArrowUp className="inline h-3 w-3 mr-1" /> : <FaArrowDown className="inline h-3 w-3 mr-1" />}
                {Math.abs(portfolioStats.changePercent).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Projects</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.projects}</h3>
              <span className="ml-2 text-sm font-medium text-gray-500">active</span>
            </div>
          </div>
        </div>

        {/* Avg. Returns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Avg. Returns</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.returns}%</h3>
              <span className="ml-2 text-sm font-medium text-gray-500">projected</span>
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Risk Level</p>
            <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.risk}</h3>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Featured Projects</h2>
          <a href="/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium group flex items-center">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-md hover:border-blue-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="transition-transform duration-300 hover:rotate-[15deg] hover:scale-110">
                      {project.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 ml-2">{project.name}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-700">{project.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected ROI:</span>
                      <span className="font-medium text-gray-700">{project.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Risk Level:</span>
                      <span className="font-medium text-gray-700">{project.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ESG Score:</span>
                      <span className="font-medium text-gray-700">{project.esgScore}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-700 ease-in-out" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link 
                      to={`/projects/${project.id}`} 
                      className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-2px]"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <FaBuilding className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-700">No projects available</h3>
                <p className="text-gray-500 max-w-md mx-auto">Create your first infrastructure project to start building your tokenized portfolio.</p>
                <Link 
                  to="/projects/create" 
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Project
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
          <div className="h-64 transition-transform duration-500 hover:scale-105 transform-origin-center">
            <Doughnut 
              data={portfolioAllocationData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                },
                animation: {
                  animateRotate: true,
                  animateScale: true
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
          <div className="h-64 transition-transform duration-500 hover:scale-105 transform-origin-center">
            <Line 
              data={performanceData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    ticks: {
                      callback: (value) => `${value} ℏ`
                    }
                  }
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuart'
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 transition-all duration-300 hover:shadow-md hover:border-blue-200 border border-gray-200">
        <div className="flex items-center mb-4">
          <FaRobot className="h-6 w-6 text-primary transition-transform duration-300 hover:rotate-[360deg]" />
          <h2 className="text-lg font-semibold text-gray-900 ml-2">AI Insights</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <p className="text-gray-800">Based on your investment profile, renewable energy projects may provide the best balance of returns and risk for your portfolio.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <p className="text-gray-800">ESG-focused projects are showing stronger long-term stability in the current market conditions.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
            <p className="text-gray-800">Consider diversifying with 20% allocation to water infrastructure projects to balance your transportation-heavy portfolio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 