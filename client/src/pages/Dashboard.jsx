import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaChartLine, FaBuilding, FaLeaf, FaLightbulb, FaRoad, FaRobot } from 'react-icons/fa';
import apiService from '../services/api';

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
          const statusResponse = await apiService.getStatus();
          if (statusResponse?.success) {
            setHederaStatus(statusResponse.data);
            
            // If we have an account ID, fetch its balance
            if (statusResponse.data.accountId) {
              const balanceResponse = await apiService.getAccountBalance(statusResponse.data.accountId);
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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your infrastructure investment portfolio</p>
      </div>
      
      {/* Hedera Network Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${hederaStatus.isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h2 className="text-lg font-semibold">Hedera Network Status: {hederaStatus.isConfigured ? 'Connected' : 'Disconnected'}</h2>
        </div>
        {hederaStatus.isConfigured && (
          <p className="text-sm text-gray-600 mt-1">
            Connected to account: {hederaStatus.accountId} • Last updated: {new Date(hederaStatus.timestamp).toLocaleString()}
          </p>
        )}
      </div>

      {/* Portfolio summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Portfolio Value</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">{portfolioStats.totalValue.toLocaleString()} ℏ</span>
            <span className={`ml-2 ${portfolioStats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
              {portfolioStats.changePercent >= 0 ? <FaArrowUp className="h-3 w-3 mr-1" /> : <FaArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(portfolioStats.changePercent).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Projects</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">{portfolioStats.projects}</span>
            <span className="ml-2 text-gray-500 text-sm">active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Returns</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">{portfolioStats.returns}%</span>
            <span className="ml-2 text-gray-500 text-sm">projected</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Risk Level</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold text-gray-900">{portfolioStats.risk}</span>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Featured Projects</h2>
          <Link to="/projects" className="text-primary hover:text-primary-dark">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {project.icon}
                  <h3 className="text-lg font-semibold text-gray-900 ml-2">{project.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{project.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected ROI:</span>
                    <span className="font-medium">{project.roi}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk Level:</span>
                    <span className="font-medium">{project.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ESG Score:</span>
                    <span className="font-medium">{project.esgScore}/100</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-2">
                      <div 
                        className="bg-primary h-2 rounded" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
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