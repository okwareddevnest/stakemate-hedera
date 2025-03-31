import { NavLink } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaProjectDiagram, 
  FaChartLine, 
  FaComments, 
  FaGraduationCap, 
  FaUser,
  FaInfoCircle,
  FaArrowLeft
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome className="w-5 h-5" /> },
    { path: '/projects', name: 'Projects', icon: <FaProjectDiagram className="w-5 h-5" /> },
    { path: '/portfolio', name: 'Portfolio', icon: <FaChartLine className="w-5 h-5" /> },
    { path: '/chat', name: 'AI Assistant', icon: <FaComments className="w-5 h-5" /> },
    { path: '/learn', name: 'Learn', icon: <FaGraduationCap className="w-5 h-5" /> },
    { path: '/profile', name: 'Profile', icon: <FaUser className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white text-gray-700 shadow-md border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-semibold tracking-wider text-gray-800">StakeMate</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 lg:hidden"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          {/* Landing page link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm rounded-md transition-colors mb-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900`
            }
          >
            <span className="mr-3"><FaArrowLeft className="w-5 h-5" /></span>
            Back to Home
          </NavLink>
          
          <div className="border-t border-gray-200 my-2"></div>
          
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3 flex items-start text-xs">
            <FaInfoCircle className="text-blue-500 w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium mb-1">Hedera-Powered</p>
              <p className="text-gray-600">
                All transactions are secured and recorded on the Hedera network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 