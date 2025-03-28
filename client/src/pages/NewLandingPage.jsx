import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield, LineChart, MessageSquare, GraduationCap, User, ChevronDown, Leaf, CreditCard, Coins } from 'lucide-react';
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