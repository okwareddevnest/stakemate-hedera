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
        
        // Use sample projects as fallback if API fails
        setProjects([
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
          }
        ]);
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
  
  // Show error message if there's an error
  const renderErrorMessage = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        <div className="flex items-center">
          <FaExclamationTriangle className="h-5 w-5 mr-2" />
          <span>Error loading projects</span>
        </div>
        <p className="text-sm mt-1">Request failed with status code 404</p>
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
        
        {/* ... Rest of the filtering UI ... */}
      </div>

      {/* Display error message if there is one */}
      {renderErrorMessage()}

      {/* If loading, show loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        // Projects grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-light text-primary mb-4">
                  {project.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{project.location}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-medium">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expected ROI</p>
                    <p className="font-medium">{project.roi}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Risk Level</p>
                    <p className="font-medium">{project.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ESG Score</p>
                    <p className="font-medium">{project.esgScore}/100</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Min. Investment</p>
                    <p className="font-medium">{project.minInvestment.toLocaleString()} KES</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Funding</p>
                    <p className="font-medium">{Math.round((project.currentFunding / project.totalFunding) * 100)}%</p>
                  </div>
                </div>
                
                <Link
                  to={`/projects/${project.id}`}
                  className="w-full block text-center bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects; 