import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Shield, LineChart, MessageSquare, GraduationCap, User, ChevronDown, Leaf, CreditCard, Coins, Check, TrendingUp, Wallet, Building, BarChart3, BrainCircuit, Briefcase, Monitor } from 'lucide-react';
import TransparentNavbar from '../components/layout/TransparentNavbar';
import FooterNew from '../components/layout/FooterNew';
import AuthController from '../components/auth/AuthController';
import { useAuth } from '../context/AuthContext';

const NewLandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Show login modal
  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuth(true);
  };

  // Show register modal
  const handleShowRegister = () => {
    setAuthMode('register');
    setShowAuth(true);
  };

  // Close auth modal
  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  // Navigation items with icons
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Projects', icon: Shield, path: '/projects' },
    { name: 'Portfolio', icon: LineChart, path: '/portfolio' },
    { name: 'Learn', icon: GraduationCap, path: '/learn' },
    { name: 'Profile', icon: User, path: '/profile' }
  ];

  // Rotating words for the features section
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const rotatingWords = ["Infrastructure Investment", "Portfolio Growth", "AI Automation"];
  
  // Rotating subtitles for features section
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const rotatingSubtitles = ["From confusion to clarity—on Hedera.", "Built for the bold."];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 4000);

    const subtitleInterval = setInterval(() => {
      setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % rotatingSubtitles.length);
    }, 5000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(subtitleInterval);
    };
  }, []);

  // Pricing state
  const [billingAnnually, setBillingAnnually] = useState(false);

  // FAQ items
  const [openFaq, setOpenFaq] = useState(null);
  const [visibleFaqs, setVisibleFaqs] = useState([]);
  const faqSectionRef = useRef(null);
  
  const faqItems = [
    {
      icon: Shield,
      question: "What is StakeMate?",
      answer: "StakeMate is a comprehensive platform built on Hedera's blockchain that connects investors with infrastructure projects. We tokenize real-world infrastructure assets, making them accessible to investors of all sizes while supporting community development."
    },
    {
      icon: Coins,
      question: "How does StakeMate generate returns?",
      answer: "StakeMate generates returns through multiple streams: direct asset appreciation, revenue sharing from operational infrastructure, staking rewards, and transaction fees from the marketplace. Most projects target 8-15% annual returns depending on risk profile."
    },
    {
      icon: LineChart,
      question: "What types of infrastructure projects can I invest in?",
      answer: "StakeMate offers a diverse portfolio of infrastructure investments including renewable energy facilities, telecommunications networks, transportation systems, and community development projects. Each is carefully vetted and tokenized for fractional ownership."
    },
    {
      icon: CreditCard,
      question: "What are the minimum investment requirements?",
      answer: "StakeMate is designed to be accessible with minimum investments starting as low as $100 for most projects. Premium infrastructure opportunities or exclusive projects may have higher minimums, typically starting at $1,000."
    },
    {
      icon: User,
      question: "How is my investment secured on StakeMate?",
      answer: "Your investments are secured through Hedera's industry-leading blockchain technology, multi-signature wallets, and smart contracts that enforce legal agreements. Additionally, all projects undergo rigorous vetting and regular audits by independent third parties."
    },
    {
      icon: MessageSquare,
      question: "How liquid are StakeMate investments?",
      answer: "StakeMate offers various liquidity options depending on the investment type. Our marketplace allows you to trade infrastructure tokens with other investors at any time, though infrastructure investments are typically designed for medium to long-term horizons (1-5 years) to maximize returns."
    },
    {
      icon: GraduationCap,
      question: "How does StakeMate handle regulatory compliance?",
      answer: "StakeMate works within regulatory frameworks across multiple jurisdictions. We implement comprehensive KYC/AML procedures, maintain necessary licenses for tokenized securities, and structure investments to comply with local regulations. Our legal team continuously monitors regulatory changes to ensure ongoing compliance."
    }
  ];

  // Observer for FAQ section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Start staggered animation when FAQ section is visible
          animateFaqs();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (faqSectionRef.current) {
      observer.observe(faqSectionRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Animate FAQs with staggered delay
  const animateFaqs = () => {
    faqItems.forEach((_, index) => {
      setTimeout(() => {
        setVisibleFaqs(prev => [...prev, index]);
      }, index * 1000); // 1 second delay between each item
    });
  };

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="min-h-screen font-roboto">
      {/* Navigation */}
      <TransparentNavbar 
        navItems={navItems} 
        onLogin={handleShowLogin}
        onRegister={handleShowRegister}
      />

      {/* Auth Modals */}
      <AuthController 
        isOpen={showAuth}
        onClose={handleCloseAuth}
        initialMode={authMode}
      />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <img
            src="/images/background stakemateaiagent.png"
            alt="StakeMate Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center">
            {/* Centered Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-josefin leading-tight mb-4">
                All-In-One Hub
              </h1>
              <p className="text-lg text-gray-200 font-roboto max-w-2xl mx-auto">
                Leverage Hedera's IaS for secure, efficient infrastructure investments that empower communities
              </p>
            </div>

            {/* Centered Feature Cards */}
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-2 gap-6">
                {/* AI Trading Analysis Card */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 transform transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/30 group">
                  <div className="text-blue-400 mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:translate-x-2">AI Trading Analysis</h3>
                  <p className="text-gray-200 transform transition-all duration-500 group-hover:translate-x-2">Predictive insights for optimal trades</p>
                </div>

                {/* Hedera Blockchain Card */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 transform transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/30 group">
                  <div className="text-green-400 mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:translate-x-2">Hedera Blockchain</h3>
                  <p className="text-gray-200 transform transition-all duration-500 group-hover:translate-x-2">Secure, efficient IaS technology</p>
                </div>

                {/* Advanced Analytics Card */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 transform transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/30 group">
                  <div className="text-purple-400 mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <LineChart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:translate-x-2">Advanced Analytics</h3>
                  <p className="text-gray-200 transform transition-all duration-500 group-hover:translate-x-2">Data-driven investment decisions</p>
                </div>

                {/* StakeMate Agent Card */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 transform transition-all duration-500 hover:scale-105 hover:bg-white/20 hover:border-white/30 group">
                  <div className="text-yellow-400 mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Monitor className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 transform transition-all duration-500 group-hover:translate-x-2">StakeMate Agent</h3>
                  <p className="text-gray-200 transform transition-all duration-500 group-hover:translate-x-2">Automation and Tailored investment strategies</p>
                </div>
              </div>
            </div>

            {/* Connect Form - Only show when not authenticated */}
            {!isAuthenticated && (
              <div className="mt-12 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Connect your Hedera account</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="accountId" className="block text-sm font-medium text-gray-200 mb-1">Hedera Account ID</label>
                      <input
                        type="text"
                        id="accountId"
                        placeholder="0.0.12345"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-400">Enter your Hedera account ID (e.g., 0.0.12345)</p>
                    </div>
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center group">
                      <span>Connect</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-3000"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-0 w-24 h-24 text-blue-100">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22a10 10 0 100-20 10 10 0 000 20z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Left side text content */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 font-josefin leading-tight">
                Simplify your investment
              </h2>
              <div className="h-16 relative">
                {rotatingSubtitles.map((subtitle, index) => (
                  <h2 
                    key={subtitle}
                    className={`text-3xl sm:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text font-josefin absolute transition-opacity duration-1000 ${
                      currentSubtitleIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {subtitle}
                  </h2>
                ))}
              </div>
              <p className="text-lg text-gray-600 mb-8 max-w-xl font-roboto">
                We make investments easy. So you can focus on creating your financial future.
              </p>
            </div>

            {/* Right side feature cards */}
            <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* NFT decorative elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rotate-12 hidden md:block">
                <div className="w-full h-full rounded-lg bg-blue-500 shadow-lg"></div>
              </div>
              <div className="absolute -bottom-8 right-20 w-24 h-24 -rotate-6 hidden md:block">
                <div className="w-full h-full rounded-lg bg-pink-400 shadow-lg"></div>
              </div>
              <div className="absolute top-1/2 -right-6 w-16 h-16 rotate-45 hidden md:block">
                <div className="w-full h-full rounded-lg bg-green-400 shadow-lg"></div>
              </div>
              
              {/* Card 1 - Analysis */}
              <div className="bg-pink-50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 shadow-md relative z-10 group h-64 flex flex-col feature-card overflow-hidden">
                <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 bg-cover bg-center" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"}}></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-pink-100 inline-block p-3 rounded-xl mb-4 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <BarChart3 className="w-6 h-6 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 font-josefin backdrop-blur-sm bg-white/30 p-1 rounded group-hover:bg-transparent">
                    Analyze Trade & Risk
                  </h3>
                  <p className="text-gray-600 font-roboto transition-all duration-300 opacity-0 group-hover:opacity-100 mt-auto backdrop-blur-sm bg-white/60 p-2 rounded">
                    Put the power in your hands to analyze investments and understand risks with our intuitive tools.
                  </p>
                </div>
              </div>

              {/* Card 2 - Portfolio */}
              <div className="bg-blue-50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 shadow-md relative z-10 group h-64 flex flex-col feature-card overflow-hidden">
                <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 bg-cover bg-center" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"}}></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-blue-100 inline-block p-3 rounded-xl mb-4 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 font-josefin backdrop-blur-sm bg-white/30 p-1 rounded group-hover:bg-transparent">
                    Portfolio Advisory
                  </h3>
                  <p className="text-gray-600 font-roboto transition-all duration-300 opacity-0 group-hover:opacity-100 mt-auto backdrop-blur-sm bg-white/60 p-2 rounded">
                    Build diversified portfolios with expert guidance and recommendations tailored to your goals.
                  </p>
                </div>
              </div>

              {/* Card 3 - Learning */}
              <div className="bg-green-50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 shadow-md relative z-10 group h-64 flex flex-col feature-card overflow-hidden">
                <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 bg-cover bg-center" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"}}></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-green-100 inline-block p-3 rounded-xl mb-4 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <GraduationCap className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 font-josefin backdrop-blur-sm bg-white/30 p-1 rounded group-hover:bg-transparent">
                    Trade Education
                  </h3>
                  <p className="text-gray-600 font-roboto transition-all duration-300 opacity-0 group-hover:opacity-100 mt-auto backdrop-blur-sm bg-white/60 p-2 rounded">
                    Learn investment strategies and risk analysis through our comprehensive educational resources.
                  </p>
                </div>
              </div>

              {/* Card 4 - AI Assistant */}
              <div className="bg-purple-50 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105 shadow-md relative z-10 group h-64 flex flex-col feature-card overflow-hidden">
                <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110 bg-cover bg-center" 
                     style={{backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"}}></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="bg-purple-100 inline-block p-3 rounded-xl mb-4 transition-transform duration-500 group-hover:rotate-[360deg]">
                    <BrainCircuit className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 font-josefin backdrop-blur-sm bg-white/30 p-1 rounded group-hover:bg-transparent">
                    StakeMate.Agent
                  </h3>
                  <p className="text-gray-600 font-roboto transition-all duration-300 opacity-0 group-hover:opacity-100 mt-auto backdrop-blur-sm bg-white/60 p-2 rounded">
                    AI assistant that automates risk assessment and staking decisions, even tipping you on opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500 animate-float-slow overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Analytics Dashboard"
                  className="w-full rounded-2xl border border-gray-100"
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none bg-gradient-to-tr from-transparent via-transparent to-white/10"></div>
              </div>
              
              {/* Feature highlight dots */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-12 left-12 w-4 h-4 bg-pink-500 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute top-1/3 left-12 w-4 h-4 bg-green-500 rounded-full animate-pulse animation-delay-2000"></div>
            </div>
            
            {/* Labels */}
            <div className="flex flex-wrap justify-center mt-8 gap-8">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Real-time Analytics</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Portfolio Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Infrastructure Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center font-josefin">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text flex items-center justify-center">
              Why StakeMate <span className="ml-2 inline-block animate-spin"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 19C13.0899 19 16 16.0899 16 12.5C16 8.91015 13.0899 6 9.5 6C5.91015 6 3 8.91015 3 12.5C3 16.0899 5.91015 19 9.5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 14C14.0523 14 14.5 13.5523 14.5 13C14.5 12.4477 14.0523 12 13.5 12C12.9477 12 12.5 12.4477 12.5 13C12.5 13.5523 12.9477 14 13.5 14Z" fill="currentColor"/>
                <path d="M9.5 14C10.0523 14 10.5 13.5523 10.5 13C10.5 12.4477 10.0523 12 9.5 12C8.94772 12 8.5 12.4477 8.5 13C8.5 13.5523 8.94772 14 9.5 14Z" fill="currentColor"/>
                <path d="M21 9L19 11L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 11V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg></span>
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

      {/* Pricing Section */}
      <section className="py-20 relative bg-gray-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        {/* Digital circuit pattern overlay */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white font-josefin">
              SIMPLE, TRANSPARENT PRICING
            </h2>
            <p className="text-lg text-gray-300 font-roboto">
              Change the plan that right for you. All plans include 30 days trial
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex justify-center items-center mb-12">
            <span className={`text-sm mr-3 ${billingAnnually ? 'text-gray-400' : 'text-white font-medium'}`}>
              MONTHLY
            </span>
            <button 
              onClick={() => setBillingAnnually(!billingAnnually)}
              className="relative inline-flex h-6 w-11 items-center rounded-full"
            >
              <span className={`toggle-bg transition-colors duration-300 ${billingAnnually ? 'bg-pink-500' : 'bg-gray-600'} inline-block h-6 w-11 rounded-full`}>
                <span className={`toggle-dot transition-transform duration-300 absolute top-0.5 left-0.5 h-5 w-5 transform rounded-full bg-white ${billingAnnually ? 'translate-x-5' : ''}`}></span>
              </span>
            </button>
            <span className={`text-sm ml-3 ${billingAnnually ? 'text-white font-medium' : 'text-gray-400'}`}>
              ANNUALLY
            </span>
            <span className="ml-2 px-2 py-1 text-xs bg-pink-500 text-white rounded-sm font-bold">
              SAVE 20%
            </span>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Base Plan */}
            <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-8">
                <p className="text-gray-400 text-lg mb-1 font-josefin">Base</p>
                <h3 className="text-5xl font-bold text-white mb-6 font-josefin">FREE</h3>
                <p className="text-gray-400 mb-8 font-roboto">Unlock offers free plan for personal use</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>5 Basic Projects</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>Community Access</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>Basic Analytics</span>
                  </div>
                </div>

                <button className="w-full py-3 px-4 border border-gray-600 text-gray-400 rounded-full font-ubuntu hover:bg-gray-700 transition-colors">
                  Selected plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-xl transform scale-105 relative z-20">
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-full w-full">
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
                  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                </div>
              </div>

              {/* Glowing border */}
              <div className="absolute inset-0 border border-pink-500 opacity-25 rounded-3xl"></div>

              {/* Most popular badge */}
              <div className="bg-pink-500 text-white text-xs font-semibold py-1 px-3 uppercase absolute right-8 top-4 rounded-sm font-ubuntu">
                Most Popular
              </div>

              <div className="p-8 relative z-10">
                <p className="text-pink-400 text-lg mb-1 font-josefin">Premium</p>
                <h3 className="text-5xl font-bold text-white mb-2 font-josefin">
                  ${billingAnnually ? '8' : '10'}
                </h3>
                <p className="text-gray-400 mb-8 font-roboto">/month</p>
                <p className="text-gray-300 mb-8 font-roboto">For most businesses who want to optimize their investment experience</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-200">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>20 Advanced Projects</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>Premium Analytics</span>
                  </div>
                  <div className="flex items-center text-gray-200">
                    <Check size={16} className="mr-3 text-pink-400" />
                    <span>Advanced Data Retention</span>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg font-ubuntu transition-colors relative overflow-hidden shine-effect">
                  <span className="relative z-10">Upgrade to Premium</span>
                </button>
              </div>
            </div>

            {/* Unlimited Plan */}
            <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-8">
                <p className="text-blue-400 text-lg mb-1 font-josefin">Unlimited</p>
                <h3 className="text-5xl font-bold text-white mb-2 font-josefin">
                  ${billingAnnually ? '20' : '25'}
                </h3>
                <p className="text-gray-400 mb-8 font-roboto">/month</p>
                <p className="text-gray-300 mb-8 font-roboto">Unlock the most powerful investment platform in the ecosystem</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-blue-400" />
                    <span>Unlimited Projects</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-blue-400" />
                    <span>Premium Events Access</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check size={16} className="mr-3 text-blue-400" />
                    <span>Dedicated Support Team</span>
                  </div>
                </div>

                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white rounded-full shadow-lg font-ubuntu transition-colors">
                  Upgrade to Unlimited
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqSectionRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-center font-josefin">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto font-roboto">
            Everything you need to know about StakeMate's investment opportunities
          </p>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`mb-6 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 transform ${
                  visibleFaqs.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                <button 
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-300"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl mr-4 transition-all duration-500 ${openFaq === index ? 'bg-pink-100' : 'bg-gray-100'}`}>
                      <item.icon 
                        className={`w-6 h-6 transition-all duration-500 ${
                          openFaq === index ? 'text-pink-500 animate-rotate' : 'text-gray-700'
                        }`} 
                      />
                    </div>
                    <span className={`text-xl font-semibold transition-colors duration-300 font-josefin ${openFaq === index ? 'text-pink-600' : 'text-gray-800'}`}>
                      {item.question}
                    </span>
                  </div>
                  <div className={`p-2 rounded-full transition-colors duration-300 ${openFaq === index ? 'bg-pink-100' : 'bg-gray-100'}`}>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-500 ease-in-out ${openFaq === index ? 'rotate-180 text-pink-500' : 'text-gray-500'}`}
                    />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                    <p className="text-gray-700 font-roboto leading-relaxed">{item.answer}</p>
                  </div>
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
            <div className="overflow-hidden">
              <div className="animate-slide-in-right text-4xl font-bold mb-2 text-white font-josefin">+31</div>
              <div className="text-sm text-pink-100 font-ubuntu">Infrastructure Projects</div>
            </div>
            <div className="overflow-hidden">
              <div className="animate-slide-in-left text-4xl font-bold mb-2 text-white font-josefin">$50.8M</div>
              <div className="text-sm text-pink-100 font-ubuntu">Total Investment</div>
            </div>
            <div className="overflow-hidden">
              <div className="animate-slide-in-right text-4xl font-bold mb-2 text-white font-josefin">+94k</div>
              <div className="text-sm text-pink-100 font-ubuntu">Active Investors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee / AI Agent Banner */}
      <section className="py-8 bg-gray-100 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        {/* Digital circuit pattern overlay */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-josefin mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                StakeMate
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-gray-700 font-josefin mb-4">
              Decentralized AI Agent
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mb-4"></div>
          </div>
          
          <div className="relative flex items-center h-14">
            {/* First Marquee - Left to Right */}
            <div className="flex animate-marquee items-center">
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Hedera</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Hashport</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">WalletConnect</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Akord</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">HBAR Foundation</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">European Union</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Swirlds Labs</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">SaucerSwap</span>
                </div>
              </div>
            </div>
            
            {/* Second Marquee - Duplicate for continuous effect */}
            <div className="flex animate-marquee2 items-center absolute left-0">
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Hedera</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Hashport</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">WalletConnect</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Akord</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">HBAR Foundation</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">European Union</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Swirlds Labs</span>
                </div>
              </div>
              <div className="mx-8 flex items-center justify-center">
                <div className="h-8 min-w-[80px] flex items-center justify-center">
                  <span className="text-gray-600 font-medium">SaucerSwap</span>
                </div>
              </div>
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