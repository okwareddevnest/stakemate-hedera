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

// Import chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Portfolio = () => {
  // Sample user portfolio data
  const [portfolio, setPortfolio] = useState({
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

  // Sample investments data
  const [investments, setInvestments] = useState([
    {
      id: 1,
      projectId: 1,
      name: 'Nairobi Commuter Rail',
      type: 'Transportation',
      location: 'Nairobi, Kenya',
      investmentDate: '2023-12-10',
      amount: 10000,
      currentValue: 11200,
      changePercent: 12.0,
      tokens: 200,
      tokenSymbol: 'NCR',
      tokenPrice: 56,
    },
    {
      id: 2,
      projectId: 2,
      name: 'Lake Turkana Wind Power',
      type: 'Energy',
      location: 'Turkana, Kenya',
      investmentDate: '2024-01-05',
      amount: 15000,
      currentValue: 17100,
      changePercent: 14.0,
      tokens: 300,
      tokenSymbol: 'LTW',
      tokenPrice: 57,
    },
    {
      id: 3,
      projectId: 3,
      name: 'Mombasa Water Supply',
      type: 'Water',
      location: 'Mombasa, Kenya',
      investmentDate: '2024-02-18',
      amount: 7500,
      currentValue: 8250,
      changePercent: 10.0,
      tokens: 150,
      tokenSymbol: 'MWS',
      tokenPrice: 55,
    },
    {
      id: 4,
      projectId: 4,
      name: 'Nakuru Smart City Initiative',
      type: 'Digital',
      location: 'Nakuru, Kenya',
      investmentDate: '2024-03-22',
      amount: 4500,
      currentValue: 4275,
      changePercent: -5.0,
      tokens: 75,
      tokenSymbol: 'NSC',
      tokenPrice: 57,
    },
    {
      id: 5,
      projectId: 5,
      name: 'Affordable Housing Kisumu',
      type: 'Social',
      location: 'Kisumu, Kenya',
      investmentDate: '2024-04-15',
      amount: 5000,
      currentValue: 5675,
      changePercent: 13.5,
      tokens: 110,
      tokenSymbol: 'AHK',
      tokenPrice: 51.59,
    }
  ]);

  // Get project type icon
  const getProjectIcon = (type) => {
    switch (type) {
      case 'Transportation':
        return <FaRoad className="text-primary" />;
      case 'Energy':
        return <FaLightbulb className="text-yellow-500" />;
      case 'Water':
        return <FaWater className="text-blue-500" />;
      case 'Digital':
        return <FaNetworkWired className="text-purple-500" />;
      case 'Social':
        return <FaBuilding className="text-orange-500" />;
      case 'Environmental':
        return <FaLeaf className="text-secondary" />;
      default:
        return <FaBuilding className="text-gray-500" />;
    }
  };

  // Chart data for portfolio allocation
  const allocationData = {
    labels: investments.map(inv => inv.name),
    datasets: [
      {
        data: investments.map(inv => inv.currentValue),
        backgroundColor: [
          '#3B82F6', // primary - Transport
          '#F59E0B', // yellow - Energy
          '#60A5FA', // blue-400 - Water
          '#8B5CF6', // purple - Digital
          '#F97316', // orange - Social
          '#10B981', // secondary - Environmental
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for portfolio performance
  const performanceData = {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [42000, 42800, 43500, 44800, 45300, 46500],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Portfolio</h1>
          <p className="text-gray-600">Overview of your infrastructure investments</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button className="btn btn-outline flex items-center gap-2">
            <FaDownload className="h-4 w-4" /> Export Report
          </button>
          <Link to="/projects" className="btn btn-primary">
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="card bg-white p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h2 className="font-bold text-xl mb-1">Portfolio Summary</h2>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="mt-2 md:mt-0 flex flex-col items-end">
            <div className="text-2xl font-bold">KES {portfolio.totalValue.toLocaleString()}</div>
            <div className={`flex items-center ${portfolio.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.changePercent >= 0 ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              <span>
                {portfolio.changePercent >= 0 ? '+' : ''}
                {portfolio.changeAmount.toLocaleString()} ({portfolio.changePercent}%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Portfolio Allocation</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={allocationData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const value = context.raw;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `KES ${value.toLocaleString()} (${percentage}%)`;
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Performance Trend</h3>
            <div className="h-64">
              <Line 
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `KES ${context.raw.toLocaleString()}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: function(value) {
                          return 'KES ' + value.toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800">Token Holdings</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                {Object.entries(portfolio.tokenBalance).map(([symbol, amount]) => (
                  <div key={symbol} className="bg-white p-3 rounded-md shadow-sm">
                    <div className="text-gray-600 text-xs">{symbol} Tokens</div>
                    <div className="font-bold">{amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="card bg-white p-6 overflow-x-auto">
        <h2 className="font-bold text-xl mb-4">My Investments</h2>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investment Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount (KES)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tokens
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investments.map((investment) => (
              <tr key={investment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      {getProjectIcon(investment.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        <Link to={`/projects/${investment.projectId}`} className="hover:text-primary">
                          {investment.name}
                        </Link>
                      </div>
                      <div className="text-sm text-gray-500">{investment.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(investment.investmentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {investment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {investment.currentValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${investment.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {investment.changePercent >= 0 ? (
                      <FaArrowUp className="mr-1" />
                    ) : (
                      <FaArrowDown className="mr-1" />
                    )}
                    <span>
                      {investment.changePercent >= 0 ? '+' : ''}
                      {investment.changePercent}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {investment.tokens} {investment.tokenSymbol}
                  </div>
                  <div className="text-xs text-gray-500">
                    @ KES {investment.tokenPrice}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-primary hover:text-primary-dark mr-3">
                    <FaExchangeAlt /> Trade
                  </button>
                  <Link to={`/projects/${investment.projectId}`} className="text-gray-600 hover:text-gray-900">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800">Investment Disclaimer</h4>
            <p className="text-sm text-gray-700 mt-1">
              Past performance is not indicative of future results. The value of investments and the income from them can go down as well as up and investors may not get back the amounts originally invested. 
              All investments involve risks including the potential loss of principal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

 