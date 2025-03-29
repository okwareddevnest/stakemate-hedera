import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const TransparentNavbar = ({ navItems, onLogin, onRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = () => {
    logout();
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div onClick={scrollToTop} className="cursor-pointer flex items-center">
            <span className="text-xl font-bold">
              <span className="text-pink-600">Stake</span>
              <span className="text-blue-600">Mate</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onRegister}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4 mt-2">
          <div className="flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors w-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors w-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onRegister();
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors w-full"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TransparentNavbar; 