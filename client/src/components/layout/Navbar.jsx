import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaSearch, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-10 h-16 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
          >
            <FaBars className="h-5 w-5" />
          </button>
          
          {/* Home link */}
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700">
            <FaHome className="h-5 w-5 mr-2" />
            <span className="font-medium hidden sm:inline">Home</span>
          </Link>
          
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search projects, portfolios..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none"
            >
              <FaBell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
                  {notifications.length}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-20">
                <div className="p-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>
                {notifications.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div key={index} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Profile dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Navbar; 