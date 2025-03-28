import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, LineChart, MessageSquare, GraduationCap, User } from 'lucide-react';
import TransparentNavbar from '../components/layout/TransparentNavbar';
import FooterNew from '../components/layout/FooterNew';

const NewLandingPage = () => {
  // Navigation items with icons
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Projects', icon: Shield, path: '/projects' },
    { name: 'Portfolio', icon: LineChart, path: '/portfolio' },
    { name: 'AI Assistant', icon: MessageSquare, path: '/chat' },
    { name: 'Learn', icon: GraduationCap, path: '/learn' },
    { name: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="min-h-screen font-roboto">
      {/* Navigation */}
      <TransparentNavbar navItems={navItems} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative bg-gray-50">
        <div className="absolute inset-0 bg-gradient-conic from-pink-100 via-blue-100 to-pink-50 opacity-30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 font-josefin">
              The All-in-One Hub for
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-josefin bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              Infrastructure Investments
            </h1>
            <p className="text-lg text-gray-600 mb-10 font-roboto">
              Leverage Hedera's IaS for secure, efficient infrastructure investments that empower communities
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-medium font-ubuntu flex items-center shadow-md transition-colors">
                Get Started <span className="ml-2">→</span>
              </Link>
              <button className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full font-medium font-ubuntu transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 mt-20">
            {navItems.map((item, index) => (
              <Link to={item.path} key={index} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="bg-white p-4 rounded-xl mb-3 group-hover:bg-pink-50 transition-colors shadow-md">
                  <item.icon className="w-6 h-6 text-pink-500" />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-pink-500 transition-colors font-ubuntu">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-4 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              alt="Analytics Dashboard"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Investment Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-josefin">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              Infrastructure Investments
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Infrastructure",
                image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&q=80",
                description: "Track your infrastructure investments with advanced monitoring"
              },
              {
                title: "Real Projects",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
                description: "Infrastructure projects backed as NFTs, making ownership and trading seamless"
              },
              {
                title: "Community Driven",
                image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
                description: "Connect with like-minded investors and develop meaningful partnerships"
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all group shadow-lg">
                <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-pink-500 transition-colors font-josefin">{card.title}</h3>
                  <p className="text-gray-600 font-roboto">{card.description}</p>
                  <button className="mt-4 text-pink-500 flex items-center group-hover:text-pink-600 font-ubuntu">
                    Learn more <span className="ml-2">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-blue-500">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white font-josefin">A tribe of passionate investors</h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 text-white font-josefin">+31</div>
              <div className="text-sm text-pink-100 font-ubuntu">Infrastructure Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-white font-josefin">$50.8M</div>
              <div className="text-sm text-pink-100 font-ubuntu">Total Investment</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-white font-josefin">+94k</div>
              <div className="text-sm text-pink-100 font-ubuntu">Active Investors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterNew />
    </div>
  );
};

export default NewLandingPage; 