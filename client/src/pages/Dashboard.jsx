import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaArrowDown, FaChartLine, FaBuilding, FaLeaf, FaLightbulb, FaRoad, FaRobot } from 'react-icons/fa';

// Import chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  // Placeholder data for demonstration
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 25000,
    changePercent: 3.2,
    projects: 5,
    returns: 12.5,
    risk: 'Medium'
  });

  const [featuredProjects, setFeaturedProjects] = useState([
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

  // Chart data for portfolio allocation
  const portfolioAllocationData = {
    labels: ['Energy', 'Transportation', 'Water', 'Digital', 'Social'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          '#10B981', // secondary
          '#3B82F6', // primary
          '#60A5FA', // blue-400
          '#8B5CF6', // accent
          '#F59E0B', // warning
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for portfolio performance
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [20000, 20800, 21300, 22500, 23800, 25000],
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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Overview of your infrastructure investments</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link to="/projects" className="btn btn-primary">
            Explore Projects
          </Link>
          <Link to="/portfolio" className="btn btn-outline">
            View Portfolio
          </Link>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold">KES {portfolioStats.totalValue.toLocaleString()}</p>
            </div>
            <div className={`flex items-center ${portfolioStats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioStats.changePercent >= 0 ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              <span>{Math.abs(portfolioStats.changePercent)}%</span>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Projects</p>
              <p className="text-2xl font-bold">{portfolioStats.projects}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              <FaBuilding className="text-primary" />
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Expected Returns</p>
              <p className="text-2xl font-bold">{portfolioStats.returns}%</p>
            </div>
            <div className="p-2 rounded-full bg-green-100">
              <FaChartLine className="text-secondary" />
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Risk Level</p>
              <p className="text-2xl font-bold">{portfolioStats.risk}</p>
            </div>
            <div className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
              {portfolioStats.risk}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold mb-4">Portfolio Allocation</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={portfolioAllocationData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold mb-4">Performance Trend</h2>
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

      {/* Featured Projects */}
      <div>
        <h2 className="font-bold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  {project.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Expected ROI</p>
                  <p className="font-semibold text-secondary">{project.roi}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <p className="font-semibold">{project.riskLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ESG Score</p>
                  <p className="font-semibold">{project.esgScore}/100</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion</p>
                  <p className="font-semibold">{project.progress}%</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Assistant Prompt */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-start space-x-4">
          <div className="bg-white rounded-full p-3">
            <FaRobot className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold mb-1">Need guidance on investing?</h3>
            <p className="mb-3">Ask StakeMate AI Assistant for personalized recommendations and educational insights.</p>
            <Link to="/chat" className="inline-block bg-white text-blue-600 rounded-md px-4 py-2 font-medium">
              Chat with StakeMate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 