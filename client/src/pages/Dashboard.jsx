import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaChartLine, FaBuilding, FaLeaf, FaLightbulb, FaRoad, FaRobot } from 'react-icons/fa';
import apiService, { hederaService } from '../services/api';

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

  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hederaStatus, setHederaStatus] = useState({ isConfigured: false });
  const [accountInfo, setAccountInfo] = useState({});
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch projects
        const projectsResponse = await apiService.getProjects();
        if (projectsResponse && Array.isArray(projectsResponse)) {
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
        }
        
        // Fetch Hedera status
        try {
          const statusResponse = await hederaService.getStatus();
          if (statusResponse?.success) {
            setHederaStatus(statusResponse.data);
            
            // If we have an account ID, fetch its balance
            if (statusResponse.data.accountId) {
              const balanceResponse = await hederaService.getAccountBalance(statusResponse.data.accountId);
              if (balanceResponse?.success) {
                const tokenCount = Object.keys(JSON.parse(balanceResponse.data.tokens || '{}')).length;
                
                // Update portfolio stats
                setPortfolioStats({
                  totalValue: parseFloat(balanceResponse.data.hbars.split(' ')[0]),
                  changePercent: 3.2, // Mock data for now
                  projects: tokenCount,
                  returns: 12.5, // Mock data for now
                  risk: 'Medium' // Mock data for now
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching Hedera status:', error);
          setHederaStatus({ isConfigured: false });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // If API fails, fallback to sample data
        setFeaturedProjects([
          {
            id: 1,
            name: 'Nairobi Commuter Rail',
            type: 'Transportation',
            roi: 8.5,
            riskLevel: 'Medium',
            esgScore: 78,
            progress: 45,
            icon: <FaRoad className="h-6 w-6 text-primary" />
          },
          {
            id: 2,
            name: 'Lake Turkana Wind Power',
            type: 'Energy',
            roi: 12.8,
            riskLevel: 'Medium-High',
            esgScore: 92,
            progress: 68,
            icon: <FaLightbulb className="h-6 w-6 text-yellow-500" />
          },
          {
            id: 3,
            name: 'Mombasa Water Supply',
            type: 'Water',
            roi: 6.2,
            riskLevel: 'Low',
            esgScore: 85,
            progress: 85,
            icon: <FaLeaf className="h-6 w-6 text-secondary" />
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
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

  // Chart data for portfolio allocation
  const portfolioAllocationData = {
    labels: ['Transportation', 'Energy', 'Water', 'Other'],
    datasets: [
      {
        data: [30, 40, 20, 10],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#6366f1',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart data for performance over time
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [20000, 21500, 22800, 23400, 24500, 25000],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
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
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Hedera Network Status: Disconnected</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>Hedera network connection is not properly configured. Please check server configuration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Value */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Portfolio Value</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.totalValue.toLocaleString()} ℏ</h3>
              <span className={`ml-2 text-sm font-medium ${portfolioStats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {portfolioStats.changePercent >= 0 ? <FaArrowUp className="h-3 w-3 mr-1" /> : <FaArrowDown className="h-3 w-3 mr-1" />}
                {Math.abs(portfolioStats.changePercent).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Projects</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.projects}</h3>
              <span className="ml-2 text-sm font-medium text-gray-500">active</span>
            </div>
          </div>
        </div>

        {/* Avg. Returns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 mb-1">Avg. Returns</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-800">{portfolioStats.returns}%</h3>
              <span className="ml-2 text-sm font-medium text-gray-500">projected</span>
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
          <a href="/projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {project.icon}
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
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/projects/${project.id}`} 
                    className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
          <div className="h-64">
            <Doughnut 
              data={portfolioAllocationData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance</h2>
          <div className="h-64">
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
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <FaRobot className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 ml-2">AI Insights</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-800">Based on your investment profile, renewable energy projects may provide the best balance of returns and risk for your portfolio.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-gray-800">ESG-focused projects are showing stronger long-term stability in the current market conditions.</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-gray-800">Consider diversifying with 20% allocation to water infrastructure projects to balance your transportation-heavy portfolio.</p>
          </div>
        </div>
        <div className="mt-4">
          <Link to="/chat" className="text-primary hover:text-primary-dark flex items-center">
            <span>Ask StakeMate AI for personalized recommendations</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 