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
  FaExchangeAlt
} from 'react-icons/fa';
import apiService, { portfolioService } from '../services/api';

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

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would use the actual user ID from authentication
        const userId = 'user-1743081696155'; // Demo user ID
        
        // Get user's portfolio
        const portfolioResponse = await portfolioService.getUserPortfolio(userId);
        if (portfolioResponse?.success) {
          const portfolioData = portfolioResponse.data;
          
          // Calculate portfolio metrics
          const totalValue = portfolioData.totalValue || 0;
          const initialInvestment = portfolioData.holdings.reduce((sum, holding) => sum + holding.amount, 0);
          const changeAmount = totalValue - initialInvestment;
          const changePercent = initialInvestment > 0 ? (changeAmount / initialInvestment) * 100 : 0;
          
          // Get token balances
          const tokenBalance = {};
          portfolioData.holdings.forEach(holding => {
            const symbol = holding.projectType.substring(0, 3).toUpperCase();
            tokenBalance[symbol] = holding.units;
          });
          
          setPortfolio({
            totalValue,
            initialInvestment,
            changeAmount,
            changePercent,
            tokenBalance
          });
        }
        
        // Get user's investments
        const investmentsResponse = await portfolioService.getUserInvestments(userId);
        if (investmentsResponse?.success) {
          const investmentsData = investmentsResponse.data;
          
          // Format investments for UI
          const formattedInvestments = investmentsData.map(inv => ({
            id: inv.id,
            project: inv.projectName,
            symbol: inv.projectType.substring(0, 3).toUpperCase(),
            tokenId: inv.tokenId,
            amount: inv.amount,
            tokenValue: inv.price,
            date: new Date(inv.timestamp).toISOString().split('T')[0],
            totalValue: inv.units * inv.price,
            changePercent: 0 // We don't have historical data yet
          }));
          
          setInvestments(formattedInvestments);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message || 'Failed to load portfolio data');
        setIsLoading(false);
        
        // Fallback to sample data
        setPortfolio({
          totalValue: 46500,
          initialInvestment: 42000,
          changeAmount: 4500,
          changePercent: 10.71,
          tokenBalance: {
            NCR: 200,
            LTW: 300,
            MWS: 150,
            NSC: 75,
            AHK: 110,
          }
        });
        
        setInvestments([
          {
            id: 1,
            project: 'Nairobi Commuter Rail',
            symbol: 'NCR',
            tokenId: '0.0.5783117',
            amount: 200,
            tokenValue: 50,
            date: '2024-01-15',
            totalValue: 10000,
            changePercent: 12.5
          },
          {
            id: 2,
            project: 'Lake Turkana Wind Power',
            symbol: 'LTW',
            tokenId: '0.0.5783118',
            amount: 300,
            tokenValue: 65,
            date: '2024-02-10',
            totalValue: 19500,
            changePercent: 8.3
          },
          {
            id: 3,
            project: 'Mombasa Water Supply',
            symbol: 'MWS',
            tokenId: '0.0.5783119',
            amount: 150,
            tokenValue: 45,
            date: '2024-03-05',
            totalValue: 6750,
            changePercent: -2.1
          },
          {
            id: 4,
            project: 'Nakuru Smart City',
            symbol: 'NSC',
            tokenId: '0.0.5783120',
            amount: 75,
            tokenValue: 80,
            date: '2024-03-20',
            totalValue: 6000,
            changePercent: 15.7
          },
          {
            id: 5,
            project: 'Affordable Housing Kenya',
            symbol: 'AHK',
            tokenId: '0.0.5783121',
            amount: 110,
            tokenValue: 42,
            date: '2024-01-25',
            totalValue: 4620,
            changePercent: 3.8
          }
        ]);
      }
    };
    
    fetchPortfolioData();
  }, []);

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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [40000, 42000, 41500, 43500, 45000, portfolio.totalValue],
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
    try {
      // In a real app, you would use the actual user ID from authentication
      const userId = 'user-1743081696155'; // Demo user ID
      const response = await portfolioService.simulateInvestment(userId, projectId, parseFloat(amount));
      
      alert(`Investment simulation successful! You've invested ${amount} KES. This is a demo, no actual investment was made.`);
      
      // Refresh portfolio data
      fetchPortfolioData();
    } catch (error) {
      console.error('Investment simulation failed:', error);
      alert(`Investment simulation failed: ${error.message || 'Unknown error'}`);
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
                {Object.keys(portfolio.tokenBalance).length > 0 ? (
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

      {/* Investments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Investment Details</h2>
          
          {investments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="relative px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{investment.project}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{investment.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{investment.tokenId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{investment.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{investment.tokenValue.toLocaleString()} ℏ</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{investment.totalValue.toLocaleString()} ℏ</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${investment.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.changePercent >= 0 ? (
                            <FaArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <FaArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(investment.changePercent).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{investment.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/projects/${investment.id}`} className="text-primary hover:text-primary-dark">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaInfoCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No investments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't made any investments yet. Start by exploring available projects.
              </p>
              <div className="mt-6">
                <Link
                  to="/projects"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

 