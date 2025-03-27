import { NavLink } from 'react-router-dom';
import { 
  FaTimes, 
  FaHome, 
  FaProjectDiagram, 
  FaChartLine, 
  FaComments, 
  FaGraduationCap, 
  FaUser,
  FaInfoCircle
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <FaHome className="w-5 h-5" /> },
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
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-darkBg text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <span className="text-xl font-semibold tracking-wider">StakeMate</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white lg:hidden"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-gray-800 rounded-md p-3 flex items-start text-xs">
            <FaInfoCircle className="text-primary w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-medium mb-1">Hedera-Powered</p>
              <p className="text-gray-400">
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