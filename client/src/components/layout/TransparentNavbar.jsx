import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const TransparentNavbar = ({ navItems }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold font-josefin">
            <span className={scrolled ? 'text-pink-600' : 'text-pink-500'}>Stake</span>
            <span className={scrolled ? 'text-blue-600' : 'text-blue-500'}>Mate</span>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 hover:text-pink-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item, index) => (
              <Link
                key={index} 
                to={item.path}
                className={`flex items-center font-ubuntu hover:text-pink-500 transition-colors ${
                  scrolled ? 'text-gray-700' : 'text-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full font-ubuntu transition-colors">
              Connect
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center text-gray-700 hover:text-pink-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              ))}
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full font-ubuntu mt-2 transition-colors">
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TransparentNavbar; 