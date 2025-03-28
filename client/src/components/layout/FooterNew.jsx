import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const FooterNew = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-xl font-semibold mb-4">
              <span className="text-pink-400">Stake</span>
              <span className="text-blue-400">Mate</span>
            </h2>
          </div>
          
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h2 className="text-white font-semibold mb-4">Platform</h2>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Projects</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Portfolio</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Community</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Learning</a>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h2 className="text-white font-semibold mb-4">Resources</h2>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">API</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Support</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Terms</a>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/4">
            <h2 className="text-white font-semibold mb-4">Company</h2>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">About</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Blog</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Careers</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-pink-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>© 2025 StakeMate. All rights reserved.</p>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <h2 className="text-white font-semibold mr-4">Connect</h2>
            <a href="#" className="text-gray-300 hover:text-pink-400 mx-2">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-pink-400 mx-2">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-pink-400 mx-2">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center md:text-right text-sm">
          <a href="#" className="text-gray-400 hover:text-pink-400 mx-2">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-pink-400 mx-2">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-pink-400 mx-2">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew; 