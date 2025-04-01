import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaLightbulb, 
  FaRoad, 
  FaWater, 
  FaNetworkWired, 
  FaBuilding,
  FaLeaf, 
  FaArrowUp, 
  FaArrowDown,
  FaDownload,
  FaExchangeAlt,
  FaServer,
  FaUsers
} from 'react-icons/fa';
import apiService, { portfolioService } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Import chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Portfolio = () => {
  // State for portfolio data
  const [portfolio, setPortfolio] = useState({
    totalValue: 0,
    initialInvestment: 0,
    changeAmount: 0,
    changePercent: 0,
    tokenBalance: {}
  });
  
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [hederaAccount, setHederaAccount] = useState(null);
  const { user } = useAuth();

  // Function to fetch portfolio data
  const fetchPortfolioData = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Get user's portfolio
      const portfolioResponse = await portfolioService.getUserPortfolio(user.id);
      if (portfolioResponse?.success) {
        const portfolioData = portfolioResponse.data || {};
        
        // Calculate portfolio metrics
        const totalValue = portfolioData.totalValue || 0;
        const initialInvestment = portfolioData.holdings?.reduce((sum, holding) => sum + holding.amount, 0) || 0;
        const changeAmount = totalValue - initialInvestment;
        const changePercent = initialInvestment > 0 ? (changeAmount / initialInvestment) * 100 : 0;
        
        // Get token balances
        const tokenBalance = {};
        if (portfolioData.holdings && portfolioData.holdings.length > 0) {
          portfolioData.holdings.forEach(holding => {
            const symbol = holding.projectType?.substring(0, 3).toUpperCase() || 'UNK';
            tokenBalance[symbol] = holding.units || 0;
          });
        }
        
        setPortfolio({
          totalValue,
          initialInvestment,
          changeAmount,
          changePercent,
          tokenBalance
        });
      } else if (portfolioResponse?.error) {
        console.error('Error from portfolio API:', portfolioResponse.error);
        // Use empty portfolio data
        setPortfolio({
          totalValue: 0,
          initialInvestment: 0,
          changeAmount: 0,
          changePercent: 0,
          tokenBalance: {}
        });
      }
      
      // Get user's investments
      try {
        const investmentsResponse = await portfolioService.getUserInvestments(user.id);
        
        console.log('Investments response:', investmentsResponse);
        
        if (investmentsResponse?.success && investmentsResponse?.data) {
          // Ensure data is an array
          const investmentsData = Array.isArray(investmentsResponse.data) 
            ? investmentsResponse.data 
            : [];
          
          console.log('Investments data array:', investmentsData);
          
          // Format investments for UI
          const formattedInvestments = investmentsData.map(inv => ({
            id: inv.id,
            projectName: inv.projectName || 'Unknown Project',
            projectType: inv.projectType || 'Other',
            symbol: inv.projectType?.substring(0, 3).toUpperCase() || 'UNK',
            tokenId: inv.tokenId || 'N/A',
            amount: inv.amount || 0,
            tokenValue: inv.price || 0,
            date: inv.timestamp ? new Date(inv.timestamp).toISOString().split('T')[0] : 'N/A',
            totalValue: (inv.units || 0) * (inv.price || 0),
            changePercent: 0 // We don't have historical data yet
          }));
          
          setInvestments(formattedInvestments);
        } else {
          // Empty investments array
          console.log('No investments data found or invalid format');
          setInvestments([]);
        }
      } catch (investError) {
        console.error('Error fetching investments:', investError);
        setInvestments([]);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
      setIsLoading(false);
      
      // Empty portfolio data
      setPortfolio({
        totalValue: 0,
        initialInvestment: 0,
        changeAmount: 0,
        changePercent: 0,
        tokenBalance: {}
      });
      
      // Empty investments array
      setInvestments([]);
    }
  };

  // Fetch portfolio data
  useEffect(() => {
    fetchPortfolioData();
  }, [user]);

  // Chart data - portfolio allocation
  const allocationData = {
    labels: Object.keys(portfolio.tokenBalance),
    datasets: [
      {
        data: Object.values(portfolio.tokenBalance),
        backgroundColor: [
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#10b981', // emerald
          '#8b5cf6', // violet
          '#ec4899', // pink
          '#f43f5e', // rose
          '#6366f1', // indigo
          '#14b8a6', // teal
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart data - performance over time
  const performanceData = {
    labels: ['Current'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [portfolio.totalValue || 0],
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

  const handleSimulateInvestment = async (projectId, amount) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }
    
    try {
      const response = await portfolioService.simulateInvestment(user.id, projectId, parseFloat(amount));
      
      if (response.success) {
        alert(`Investment simulation successful! You've invested ${amount} HBAR. This is a simulation, no actual investment was made.`);
        
        // Refresh portfolio data
        fetchPortfolioData();
      } else {
        console.error('Investment simulation failed:', response.error);
        alert(`Investment simulation failed: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Investment simulation failed:', error);
      alert(`Investment simulation failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Get project icon based on type
  const getProjectIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'transportation':
        return <FaRoad />;
      case 'energy':
        return <FaLightbulb />;
      case 'water':
        return <FaWater />;
      case 'digital':
        return <FaServer />;
      case 'social':
        return <FaUsers />;
      default:
        return <FaBuilding />;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
        <p className="text-gray-600">Manage and track your infrastructure investments</p>
      </div>

      {/* Portfolio Summary Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Portfolio Overview</h2>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{portfolio.totalValue.toLocaleString()} ℏ</span>
                <span className={`ml-2 ${portfolio.changePercent >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {portfolio.changePercent >= 0 ? (
                    <FaArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <FaArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(portfolio.changePercent).toFixed(2)}%
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Initial investment: {portfolio.initialInvestment.toLocaleString()} ℏ
              </p>
            </div>
            
            {hederaAccount && (
              <div className="mt-4 md:mt-0">
                <p className="text-sm font-medium text-gray-700">Hedera Account</p>
                <p className="text-gray-600 text-sm">{hederaAccount}</p>
              </div>
            )}
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-primary bg-blue-50 rounded-md hover:bg-blue-100 flex items-center">
                <FaDownload className="mr-2 h-4 w-4" /> Export
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark flex items-center">
                <FaExchangeAlt className="mr-2 h-4 w-4" /> Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Token Holdings and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Investment Performance</h2>
              <div className="h-72">
                <Line 
                  data={performanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      }
                    },
                    scales: {
                      y: {
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString() + ' ℏ';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Allocation</h2>
              <div className="h-72 flex items-center justify-center">
                {Object.keys(portfolio.tokenBalance || {}).length > 0 ? (
                  <Doughnut 
                    data={allocationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No investment data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Your Investments</h3>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {investments.map((investment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                          {getProjectIcon(investment.projectType)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{investment.projectName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.tokenId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{investment.tokenValue} ℏ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(investment.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{investment.totalValue} ℏ</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${investment.changePercent >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {investment.changePercent >= 0 ? '+' : ''}{investment.changePercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaChartLine className="h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-700">No investments yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">Start investing in infrastructure projects to build your tokenized portfolio and track your returns.</p>
              <Link 
                to="/projects" 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Browse Projects
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;

 