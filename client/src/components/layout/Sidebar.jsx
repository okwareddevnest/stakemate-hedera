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
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight
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
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-md border-r border-gray-200 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'lg:w-64 w-64' : 'lg:w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          {isOpen ? (
            <h1 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">StakeMate</h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-800 mx-auto">SM</h1>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 hover:rotate-90 transform transition-all duration-300 focus:outline-none lg:hidden"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Toggle button (desktop only) - visible at bottom of sidebar */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute bottom-4 right-0 transform translate-x-1/2 z-40 items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none"
        >
          {isOpen ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
        </button>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
          <div className="flex-1 py-4">
            {/* Back to Home */}
            {isOpen ? (
              <NavLink
                to="/"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:pl-8 transition-all duration-300"
              >
                <FaArrowLeft className="h-5 w-5 mr-3 text-gray-500 group-hover:text-blue-500 transition-transform duration-300 hover:-translate-x-1" />
                <span>Back to Home</span>
              </NavLink>
            ) : (
              <NavLink
                to="/"
                className="flex items-center justify-center py-3 text-gray-700 hover:bg-gray-100 transition-all duration-300"
              >
                <FaArrowLeft className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-transform duration-300 hover:-translate-x-1" />
              </NavLink>
            )}

            <div className="mt-6">
              {isOpen && (
                <div className="px-6 mb-3">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Navigation</h2>
                </div>
              )}
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isOpen
                      ? `group flex items-center px-6 py-3 hover:pl-8 transition-all duration-300 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      : `group flex flex-col items-center justify-center py-3 transition-all duration-300 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                  }
                  title={item.name}
                >
                  <span className={`text-gray-500 group-hover:text-blue-500 transition-transform duration-300 group-hover:scale-110 ${!isOpen && 'mx-auto'}`}>
                    {item.icon}
                  </span>
                  {isOpen && (
                    <span className="group-hover:font-medium transition-all duration-300 ml-3">
                      {item.name}
                    </span>
                  )}
                  {!isOpen && (
                    <span className="text-xs mt-1 font-medium">
                      {item.name.substring(0, 1)}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                <FaInfoCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 transition-transform duration-300 hover:rotate-[360deg]" />
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Hedera-Powered</p>
                  <p className="text-xs text-gray-500">
                    All transactions are secured and recorded on the Hedera network.
                  </p>
                </div>
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="p-2 border-t border-gray-200 flex justify-center">
              <FaInfoCircle className="h-5 w-5 text-blue-500 transition-transform duration-300 hover:rotate-[360deg]" title="Hedera-Powered" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 