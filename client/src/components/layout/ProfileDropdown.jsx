import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium overflow-hidden">
          {user?.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            <span>D</span>
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 z-20">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Guest User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'Not signed in'}</p>
          </div>
          
          <div className="py-1">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FaUser className="h-4 w-4 mr-3 text-gray-500" />
              Your Profile
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FaCog className="h-4 w-4 mr-3 text-gray-500" />
              Settings
            </Link>
          </div>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <div className="py-1">
            <button 
              onClick={handleSignOut}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
            >
              <FaSignOutAlt className="h-4 w-4 mr-3 text-red-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 