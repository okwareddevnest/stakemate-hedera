import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaLeaf, FaLightbulb, FaRoad, FaWater, FaNetworkWired, FaBuilding } from 'react-icons/fa';

const Projects = () => {
  // Placeholder data for projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Nairobi Commuter Rail',
      type: 'Transportation',
      location: 'Nairobi, Kenya',
      roi: 8.5,
      riskLevel: 'Medium',
      esgScore: 78,
      progress: 45,
      description: 'Urban railway system connecting Nairobi suburbs to reduce traffic congestion and carbon emissions.',
      minInvestment: 5000,
      totalFunding: 45000000,
      currentFunding: 28000000,
      icon: <FaRoad />
    },
    {
      id: 2,
      name: 'Lake Turkana Wind Power',
      type: 'Energy',
      location: 'Turkana, Kenya',
      roi: 12.8,
      riskLevel: 'Medium-High',
      esgScore: 92,
      progress: 68,
      description: 'Expansion of wind power facility to generate clean energy for northern Kenya communities.',
      minInvestment: 10000,
      totalFunding: 85000000,
      currentFunding: 62000000,
      icon: <FaLightbulb />
    },
    {
      id: 3,
      name: 'Mombasa Water Supply',
      type: 'Water',
      location: 'Mombasa, Kenya',
      roi: 6.2,
      riskLevel: 'Low',
      esgScore: 85,
      progress: 85,
      description: 'Infrastructure to improve clean water access for Mombasa residents and surrounding communities.',
      minInvestment: 3000,
      totalFunding: 28000000,
      currentFunding: 24000000,
      icon: <FaWater />
    },
    {
      id: 4,
      name: 'Nakuru Smart City Initiative',
      type: 'Digital',
      location: 'Nakuru, Kenya',
      roi: 9.4,
      riskLevel: 'Medium',
      esgScore: 74,
      progress: 35,
      description: 'Smart infrastructure including digital connectivity, IoT sensors, and data management for urban planning.',
      minInvestment: 7500,
      totalFunding: 32000000,
      currentFunding: 12000000,
      icon: <FaNetworkWired />
    },
    {
      id: 5,
      name: 'Affordable Housing Kisumu',
      type: 'Social',
      location: 'Kisumu, Kenya',
      roi: 5.8,
      riskLevel: 'Low',
      esgScore: 88,
      progress: 62,
      description: 'Sustainable, affordable housing development to address urban housing shortages and improve living conditions.',
      minInvestment: 4000,
      totalFunding: 18000000,
      currentFunding: 11000000,
      icon: <FaBuilding />
    },
    {
      id: 6,
      name: 'Green Corridor Reforestation',
      type: 'Environmental',
      location: 'Western Kenya',
      roi: 7.2,
      riskLevel: 'Medium-Low',
      esgScore: 96,
      progress: 40,
      description: 'Large-scale reforestation project to restore biodiversity corridors and create carbon offsets.',
      minInvestment: 2500,
      totalFunding: 12000000,
      currentFunding: 5000000,
      icon: <FaLeaf />
    }
  ]);

  // Filter and search state
  const [filters, setFilters] = useState({
    type: '',
    minROI: 0,
    maxRisk: '',
    minESG: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  // Get risk level color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium-Low':
        return 'bg-teal-100 text-teal-800';
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

  // Filter projects based on filters and search
  const filteredProjects = projects.filter(project => {
    // Apply search term filter
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply type filter
    if (filters.type && project.type !== filters.type) {
      return false;
    }

    // Apply ROI filter
    if (filters.minROI > 0 && project.roi < filters.minROI) {
      return false;
    }

    // Apply risk level filter
    if (filters.maxRisk) {
      const riskLevels = ['Low', 'Medium-Low', 'Medium', 'Medium-High', 'High'];
      const maxRiskIndex = riskLevels.indexOf(filters.maxRisk);
      const projectRiskIndex = riskLevels.indexOf(project.riskLevel);
      
      if (projectRiskIndex > maxRiskIndex) {
        return false;
      }
    }

    // Apply ESG filter
    if (filters.minESG > 0 && project.esgScore < filters.minESG) {
      return false;
    }

    return true;
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      minROI: 0,
      maxRisk: '',
      minESG: 0
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Infrastructure Projects</h1>
          <p className="text-gray-600">Explore tokenized projects available for micro-investing</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects by name, description or location..."
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mr-2" /> Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-white rounded-md shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Type</label>
              <select
                name="type"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Transportation">Transportation</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water</option>
                <option value="Digital">Digital</option>
                <option value="Social">Social</option>
                <option value="Environmental">Environmental</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum ROI (%)</label>
              <input
                type="number"
                name="minROI"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.minROI}
                onChange={handleFilterChange}
                min="0"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Risk Level</label>
              <select
                name="maxRisk"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.maxRisk}
                onChange={handleFilterChange}
              >
                <option value="">Any Risk Level</option>
                <option value="Low">Low</option>
                <option value="Medium-Low">Medium-Low</option>
                <option value="Medium">Medium</option>
                <option value="Medium-High">Medium-High</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum ESG Score</label>
              <input
                type="number"
                name="minESG"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.minESG}
                onChange={handleFilterChange}
                min="0"
                max="100"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="card">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-gray-100 mr-3">
                {getProjectIcon(project.type)}
              </div>
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.location}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{project.type}</p>
              </div>
              <div>
                <p className="text-gray-500">Expected ROI</p>
                <p className="font-medium text-secondary">{project.roi}%</p>
              </div>
              <div>
                <p className="text-gray-500">Risk Level</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
                  {project.riskLevel}
                </span>
              </div>
              <div>
                <p className="text-gray-500">ESG Score</p>
                <p className="font-medium">{project.esgScore}/100</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm mb-4">
              <div>
                <p className="text-gray-500">Min. Investment</p>
                <p className="font-semibold">KES {project.minInvestment.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Funding</p>
                <p className="font-semibold">{Math.round(project.currentFunding / project.totalFunding * 100)}% Complete</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <Link 
                to={`/projects/${project.id}`} 
                className="btn btn-primary w-full"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          <div className="mt-6">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects; 