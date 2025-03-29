import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="bg-white shadow-sm z-10">
      <div className="px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-600 lg:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
            <div className="hidden md:block ml-4">
              <div className="relative">
                <input
                  className="input w-72 pl-10"
                  type="text"
                  placeholder="Search projects, portfolios..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {/* Notification dropdown */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-red-500 text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <div key={index} className="px-4 py-2 border-b hover:bg-gray-50">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-gray-500">No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 