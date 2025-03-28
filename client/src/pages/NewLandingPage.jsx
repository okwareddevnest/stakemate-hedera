import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, LineChart, MessageSquare, GraduationCap, User, ChevronDown, Leaf, CreditCard, Coins, Check, TrendingUp, Wallet, Building, BarChart3, BrainCircuit, Briefcase } from 'lucide-react';
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
      <TransparentNavbar navItems={navItems} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative bg-gray-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Graffiti/Bubble elements */}
        <div className="absolute top-16 right-[15%] w-24 h-24 opacity-10 animate-float">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FF0066" d="M46.5,-58.2C59.3,-47.9,68.5,-33.4,73.3,-17C78.1,-0.6,78.5,17.7,71.1,32.3C63.7,46.9,48.5,57.9,32.4,65.1C16.4,72.3,-0.6,75.7,-19.4,73.8C-38.1,71.9,-58.7,64.7,-69.8,50.1C-80.9,35.5,-82.6,13.6,-79.9,-6.8C-77.1,-27.1,-69.9,-45.9,-56.7,-56.7C-43.5,-67.4,-24.3,-70.2,-5.7,-63.9C12.9,-57.5,33.8,-68.5,46.5,-58.2Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute top-[40%] left-[5%] w-28 h-28 opacity-15 animate-float animation-delay-3000">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#3B82F6" d="M42.1,-68.5C53.9,-57.7,62.4,-44.8,69.6,-30.7C76.7,-16.6,82.5,-1.2,80.6,13.1C78.8,27.4,69.3,40.6,57.7,51.8C46.1,63,32.3,72.1,16.9,76.9C1.6,81.7,-15.4,82.2,-30.2,76.5C-45.1,70.9,-57.9,59.2,-67.8,45C-77.8,30.8,-84.8,14.1,-85,0C-85.2,-14.1,-78.6,-28.3,-68.9,-39.1C-59.2,-49.9,-46.3,-57.4,-33.6,-67.5C-20.9,-77.7,-8.5,-90.5,3.5,-96.1C15.5,-101.7,31,-101,42.1,-68.5Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="absolute bottom-28 right-[20%] w-20 h-20 opacity-20 animate-float animation-delay-2000">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#A855F7" d="M49.5,-57.6C65.2,-47.8,79.9,-33.1,81.8,-16.9C83.7,-0.8,72.9,16.7,62.5,33.2C52.1,49.7,42.2,65.3,27.4,72.8C12.7,80.3,-6.8,79.9,-22.4,72.3C-37.9,64.8,-49.5,50.3,-58.1,34.5C-66.6,18.8,-72.1,1.7,-69.6,-14.3C-67.1,-30.3,-56.7,-45.2,-43.4,-55.5C-30.1,-65.8,-13.9,-71.5,1.8,-73.7C17.5,-75.9,33.9,-67.5,49.5,-57.6Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Graffiti text elements */}
        <div className="absolute top-[20%] right-[30%] opacity-5 rotate-12">
          <svg width="150" height="80" viewBox="0 0 150 80">
            <text x="0" y="50" fontFamily="Arial" fontSize="42" fontWeight="bold" fill="#FF0066" className="font-josefin">STAKE</text>
          </svg>
        </div>
        <div className="absolute bottom-[25%] left-[18%] opacity-5 -rotate-6">
          <svg width="180" height="80" viewBox="0 0 180 80">
            <text x="0" y="50" fontFamily="Arial" fontSize="38" fontWeight="bold" fill="#3B82F6" className="font-josefin">HEDERA</text>
          </svg>
        </div>
        
        {/* Multiple floating bubbles */}
        <div className="absolute inset-0">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
          <div className="bubble bubble-6"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-conic from-pink-100 via-blue-100 to-pink-50 opacity-30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 font-josefin">
              The All-In-One Hub for
            </h1>
            <div className="h-16 mb-6">
              {rotatingWords.map((word, index) => (
                <h1 
                  key={word}
                  className={`text-4xl md:text-6xl font-bold font-josefin bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text absolute left-0 right-0 transition-opacity duration-1000 ${
                    currentWordIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {word}
                </h1>
              ))}
            </div>
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
          <div className="flex justify-center flex-wrap gap-8 mt-20">
            <Link to="/dashboard" className="flex flex-col items-center text-center">
              <div className="bg-pink-100 p-5 rounded-full mb-3 hover:bg-pink-200 transition-colors">
                <Home className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-pink-500 transition-colors font-ubuntu">Dashboard</span>
            </Link>
            
            <Link to="/projects" className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-5 rounded-full mb-3 hover:bg-blue-200 transition-colors">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-blue-500 transition-colors font-ubuntu">Projects</span>
            </Link>
            
            <Link to="/portfolio" className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-5 rounded-full mb-3 hover:bg-green-200 transition-colors">
                <LineChart className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-green-500 transition-colors font-ubuntu">Portfolio</span>
            </Link>
            
            <Link to="/chat" className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-5 rounded-full mb-3 hover:bg-purple-200 transition-colors">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-purple-500 transition-colors font-ubuntu">AI Assistant</span>
            </Link>
            
            <Link to="/learn" className="flex flex-col items-center text-center">
              <div className="bg-pink-100 p-5 rounded-full mb-3 hover:bg-pink-200 transition-colors">
                <GraduationCap className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-pink-500 transition-colors font-ubuntu">Learn</span>
            </Link>
            
            <Link to="/profile" className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-5 rounded-full mb-3 hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 hover:text-blue-500 transition-colors font-ubuntu">Profile</span>
            </Link>
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
                    StakeMate.AI
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
      <section className="py-16 bg-gray-50">
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
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

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

      {/* Partners Marquee */}
      <section className="py-12 bg-gray-50 overflow-hidden">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 font-josefin">Trusted by Industry Leaders</h3>
        </div>
        <div className="relative flex items-center h-20">
          {/* First Marquee - Left to Right */}
          <div className="flex animate-marquee items-center">
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Hedera</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Hashport</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">WalletConnect</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Akord</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">HBAR Foundation</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">European Union</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Swirlds Labs</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">SaucerSwap</span>
              </div>
            </div>
          </div>
          
          {/* Second Marquee - Duplicate for continuous effect */}
          <div className="flex animate-marquee2 items-center absolute left-0">
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Hedera</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Hashport</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">WalletConnect</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Akord</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">HBAR Foundation</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">European Union</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">Swirlds Labs</span>
              </div>
            </div>
            <div className="mx-10 flex items-center justify-center">
              <div className="h-10 min-w-[100px] flex items-center justify-center">
                <span className="text-gray-800 font-semibold">SaucerSwap</span>
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