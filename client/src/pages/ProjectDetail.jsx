import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaChartLine, 
  FaShieldAlt, 
  FaLeaf, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileAlt,
  FaLightbulb,
  FaRoad,
  FaWater,
  FaNetworkWired,
  FaBuilding,
  FaUsers
} from 'react-icons/fa';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data
  const projectData = {
    1: {
      id: 1,
      name: 'Nairobi Commuter Rail',
      type: 'Transportation',
      location: 'Nairobi, Kenya',
      roi: 8.5,
      riskLevel: 'Medium',
      esgScore: 78,
      progress: 45,
      description: 'Urban railway system connecting Nairobi suburbs to reduce traffic congestion and carbon emissions.',
      longDescription: `The Nairobi Commuter Rail project aims to transform urban mobility in Kenya's capital by expanding and modernizing the existing rail network. This infrastructure initiative will connect major suburbs to the central business district, significantly reducing traffic congestion and carbon emissions.

The project includes the construction of new rail lines, modernization of existing tracks, and development of modern stations with digital payment systems and real-time tracking. Solar-powered stations will further reduce the environmental impact of the transit system.

By improving public transportation infrastructure, the project will enhance economic productivity by reducing commute times, lower transportation costs for residents, and contribute to climate change mitigation through reduced vehicle emissions.`,
      startDate: '2023-06-15',
      estimatedCompletion: '2026-12-31',
      minInvestment: 5000,
      totalFunding: 45000000,
      currentFunding: 28000000,
      tokenSymbol: 'NCR',
      tokenPrice: 50,
      stakeholders: ['Kenya Railways Corporation', 'Nairobi Metropolitan Services', 'Ministry of Transport'],
      documents: [
        { name: 'Environmental Impact Assessment', url: '#' },
        { name: 'Feasibility Study', url: '#' },
        { name: 'Project Timeline', url: '#' }
      ],
      milestones: [
        { name: 'Land Acquisition', status: 'Completed', date: '2023-09-01' },
        { name: 'Environmental Approval', status: 'Completed', date: '2023-11-15' },
        { name: 'Foundation Work', status: 'In Progress', date: '2024-05-01' },
        { name: 'Track Installation', status: 'Planned', date: '2025-02-01' },
        { name: 'Station Construction', status: 'Planned', date: '2025-07-01' },
        { name: 'System Testing', status: 'Planned', date: '2026-06-01' },
        { name: 'Project Completion', status: 'Planned', date: '2026-12-01' }
      ],
      updates: [
        { date: '2024-02-15', title: 'Construction Commenced', content: 'Official groundbreaking ceremony held with stakeholders present.' },
        { date: '2024-01-10', title: 'Contractor Selected', content: 'After competitive bidding, primary contractor has been selected.' },
        { date: '2023-12-05', title: 'Funding Milestone Reached', content: '50% of required funding secured through public and private investment.' }
      ],
      risks: [
        { category: 'Construction', level: 'Medium', description: 'Potential delays due to weather conditions and supply chain issues.' },
        { category: 'Regulatory', level: 'Low', description: 'All major approvals obtained, minimal regulatory risk remains.' },
        { category: 'Financial', level: 'Medium', description: 'Currency fluctuation may impact imported material costs.' }
      ],
      impact: {
        economic: 'Creates 1,200+ jobs during construction and 300+ permanent positions. Estimated to save commuters 2 hours daily.',
        environmental: 'Projected reduction of 25,000 metric tons of CO2 emissions annually by reducing private vehicle usage.',
        social: 'Improves access to employment, education, and services for underserved communities. Enhances urban mobility for all.'
      }
    },
    // Add more projects as needed
  };

  // Fetch project data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const foundProject = projectData[id];
      if (foundProject) {
        setProject(foundProject);
        setLoading(false);
      } else {
        setError('Project not found');
        setLoading(false);
      }
    }, 500);
  }, [id]);

  // Get project type icon
  const getProjectIcon = (type) => {
    switch (type) {
      case 'Transportation':
        return <FaRoad className="text-primary h-6 w-6" />;
      case 'Energy':
        return <FaLightbulb className="text-yellow-500 h-6 w-6" />;
      case 'Water':
        return <FaWater className="text-blue-500 h-6 w-6" />;
      case 'Digital':
        return <FaNetworkWired className="text-purple-500 h-6 w-6" />;
      case 'Social':
        return <FaBuilding className="text-orange-500 h-6 w-6" />;
      case 'Environmental':
        return <FaLeaf className="text-secondary h-6 w-6" />;
      default:
        return <FaBuilding className="text-gray-500 h-6 w-6" />;
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

  // Handle investment form submission
  const handleInvestmentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would connect to the backend and handle the investment
    alert(`Investment of KES ${investmentAmount} submitted for ${project.name}. This is a demo, no actual investment was made.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
        <p className="mt-1 text-sm text-gray-500">Please try another project or return to the projects list</p>
        <div className="mt-6">
          <Link 
            to="/projects" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and project title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/projects" className="inline-flex items-center text-primary hover:text-primary-dark mb-2">
            <FaArrowLeft className="mr-2" /> Back to Projects
          </Link>
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              {getProjectIcon(project.type)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-1" />
                <span>{project.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
            {project.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Project summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FaChartLine className="text-primary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Expected ROI</p>
              <p className="text-xl font-bold text-primary">{project.roi}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <FaLeaf className="text-secondary" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">ESG Score</p>
              <p className="text-xl font-bold">{project.esgScore}/100</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              <FaMoneyBillWave className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Min. Investment</p>
              <p className="text-xl font-bold">KES {project.minInvestment.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-white p-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-purple-100 mr-3">
              <FaCalendarAlt className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Est. Completion</p>
              <p className="text-xl font-bold">{new Date(project.estimatedCompletion).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding progress */}
      <div className="card bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Funding Progress</h2>
            <p className="text-gray-600">
              KES {project.currentFunding.toLocaleString()} raised of KES {project.totalFunding.toLocaleString()}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-lg font-bold text-primary">
              {Math.round(project.currentFunding / project.totalFunding * 100)}% Complete
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-primary rounded-full h-4"
            style={{ width: `${(project.currentFunding / project.totalFunding) * 100}%` }}
          ></div>
        </div>

        {/* Investment form */}
        <form onSubmit={handleInvestmentSubmit} className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-3">Invest in this project</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (KES)
            </label>
            <div className="flex">
              <input
                type="number"
                className="flex-grow input"
                placeholder="Enter amount"
                min={project.minInvestment}
                step="100"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
              />
              <button
                type="submit"
                className="ml-2 btn btn-primary"
                disabled={!investmentAmount || Number(investmentAmount) < project.minInvestment}
              >
                Invest Now
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum investment: KES {project.minInvestment.toLocaleString()}
            </p>
          </div>
          <div className="text-xs text-gray-600 flex items-start">
            <FaInfoCircle className="text-primary mr-1 mt-0.5 flex-shrink-0" />
            <p>
              By investing, you'll receive {project.tokenSymbol} tokens at a rate of KES {project.tokenPrice} per token.
              These tokens represent your stake in this infrastructure project.
            </p>
          </div>
        </form>
      </div>

      {/* Project details tabs */}
      <div className="card bg-white overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'milestones'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('milestones')}
            >
              Milestones
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'updates'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('updates')}
            >
              Updates
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'risks'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('risks')}
            >
              Risks
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'impact'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('impact')}
            >
              Impact
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'documents'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="font-bold text-lg mb-3">Project Description</h3>
              <p className="text-gray-700 mb-4 whitespace-pre-line">{project.longDescription}</p>
              
              <h4 className="font-semibold text-md mb-2">Key Stakeholders</h4>
              <ul className="list-disc list-inside mb-4 text-gray-700">
                {project.stakeholders.map((stakeholder, idx) => (
                  <li key={idx}>{stakeholder}</li>
                ))}
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Project Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Project Type:</span> {project.type}
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-gray-600">Token Symbol:</span> {project.tokenSymbol}
                      </div>
                      <div>
                        <span className="text-gray-600">Token Price:</span> KES {project.tokenPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Milestones</h3>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {project.milestones.map((milestone, idx) => (
                    <div key={idx} className="relative flex items-start pl-12">
                      <div className="absolute left-0 mt-1.5">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          milestone.status === 'Completed' 
                            ? 'bg-green-500' 
                            : milestone.status === 'In Progress' 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                        }`}>
                          {milestone.status === 'Completed' && <FaCheckCircle className="text-white h-4 w-4" />}
                          {milestone.status === 'In Progress' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                          {milestone.status === 'Planned' && <div className="h-2 w-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">{milestone.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            milestone.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : milestone.status === 'In Progress' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(milestone.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'updates' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Updates</h3>
              <div className="space-y-6">
                {project.updates.map((update, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{update.title}</h4>
                      <span className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{update.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Risk Assessment</h3>
              <div className="space-y-4">
                {project.risks.map((risk, idx) => (
                  <div key={idx} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{risk.category} Risk</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRiskColor(risk.level)}`}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-gray-700">{risk.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                <div className="flex">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Risk Disclaimer</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      All investments involve risk, including the possible loss of principal. The risk assessments provided are estimates and actual outcomes may differ. Please conduct your own research before investing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <FaChartLine className="mr-2" /> Economic Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.economic}</p>
                </div>
                <div className="card bg-green-50 p-4">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <FaLeaf className="mr-2" /> Environmental Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.environmental}</p>
                </div>
                <div className="card bg-purple-50 p-4">
                  <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <FaUsers className="mr-2" /> Social Impact
                  </h4>
                  <p className="text-gray-700">{project.impact.social}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="font-bold text-lg mb-4">Project Documents</h3>
              <div className="space-y-3">
                {project.documents.map((doc, idx) => (
                  <a 
                    key={idx} 
                    href={doc.url} 
                    className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FaFileAlt className="text-gray-400 mr-3" />
                    <span className="text-primary">{doc.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <div className="flex">
                  <FaShieldAlt className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Verified Documents</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      All project documents are timestamped and verified on the Hedera distributed ledger, ensuring authenticity and preventing document tampering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 