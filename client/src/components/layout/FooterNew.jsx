import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const FooterNew = () => {
  const [showFooter, setShowFooter] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        
        // Show footer when user is near the bottom (within 100px)
        if (documentHeight - (scrollTop + windowHeight) < 100) {
          setShowFooter(true);
        } else {
          setShowFooter(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer 
      ref={footerRef}
      className={`bg-gray-50 pt-16 pb-8 transition-all duration-500 ${
        showFooter ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 font-josefin">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/projects" className="text-gray-600 hover:text-pink-500 font-ubuntu">Projects</Link></li>
              <li><Link to="/portfolio" className="text-gray-600 hover:text-pink-500 font-ubuntu">Portfolio</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Community</a></li>
              <li><Link to="/learn" className="text-gray-600 hover:text-pink-500 font-ubuntu">Learning</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 font-josefin">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Documentation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">API</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Support</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 font-josefin">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 font-josefin">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 font-roboto mb-4 md:mb-0">© 2025 StakeMate. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-pink-500 font-ubuntu">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew; 