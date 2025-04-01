import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaLeaf, FaLightbulb, FaRoad, FaWater, FaNetworkWired, FaBuilding, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import apiService from '../services/api';

const Projects = () => {
  const navigate = useNavigate();
  // State for projects and loading status
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and search state
  const [filters, setFilters] = useState({
    type: '',
    minROI: 0,
    maxRisk: '',
    minESG: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getProjects();
        if (response && Array.isArray(response)) {
          // Transform API response to match our UI structure
          const transformedProjects = response.map(project => ({
            id: project.id,
            name: project.name,
            type: project.type || 'Other',
            location: project.location || 'Kenya',
            roi: project.financials?.expectedReturn || 0,
            riskLevel: getRiskLevelText(project.risk?.overallScore || 50),
            esgScore: calculateESGScore(project.esgMetrics),
            progress: calculateProgress(project.timeline),
            description: project.description || '',
            minInvestment: project.investmentMetrics?.minInvestmentAmount || 5000,
            totalFunding: project.financials?.totalBudget || 0,
            currentFunding: project.financials?.fundingSecured || 0,
            tokenId: project.tokenId || null,
            icon: getProjectIcon(project.type)
          }));
          setProjects(transformedProjects);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
        
        // No demo projects as fallback - just show empty list
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Helper functions for transforming data
  const getRiskLevelText = (riskScore) => {
    if (riskScore < 30) return 'Low';
    if (riskScore < 45) return 'Medium-Low';
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

  // Get project type icon
  const getProjectIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'transportation':
        return <FaRoad className="text-primary" />;
      case 'energy':
        return <FaLightbulb className="text-yellow-500" />;
      case 'water':
        return <FaWater className="text-blue-500" />;
      case 'digital':
        return <FaNetworkWired className="text-purple-500" />;
      case 'social':
        return <FaBuilding className="text-orange-500" />;
      case 'environmental':
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
  
  // Render the filteredProjects
  const renderProjects = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (filteredProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">No projects available.</p>
          <Link to="/projects/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Create New Project
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-50 rounded-full mr-3">
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(project.riskLevel)}`}>
                  {project.riskLevel}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500">ROI</p>
                  <p className="text-sm font-medium">{project.roi}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ESG Score</p>
                  <p className="text-sm font-medium">{project.esgScore}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Min Investment</p>
                  <p className="text-sm font-medium">${project.minInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-xs text-gray-500">Token ID</p>
                <p className="text-sm font-medium truncate">{project.tokenId || 'Not tokenized yet'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Infrastructure Projects</h1>
        <button
          onClick={() => navigate('/projects/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Create New Project
        </button>
      </div>

      {/* Search and filter section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search projects by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center shadow-sm hover:bg-gray-50"
          >
            <FaFilter className="mr-2 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum ROI</label>
                <input
                  type="range"
                  name="minROI"
                  min="0"
                  max="15"
                  step="0.5"
                  value={filters.minROI}
                  onChange={handleFilterChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="block text-center text-sm mt-1">
                  {filters.minROI}%+
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Risk</label>
                <select
                  name="maxRisk"
                  value={filters.maxRisk}
                  onChange={handleFilterChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any Risk</option>
                  <option value="Low">Low</option>
                  <option value="Medium-Low">Medium-Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Medium-High">Medium-High</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum ESG Score</label>
                <input
                  type="range"
                  name="minESG"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.minESG}
                  onChange={handleFilterChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="block text-center text-sm mt-1">
                  {filters.minESG}+
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({ type: '', minROI: 0, maxRisk: '', minESG: 0 })}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render the projects */}
      {renderProjects()}
    </div>
  );
};

export default Projects; 