import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaCoins, FaUsers, FaGraduationCap, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-10 top-0 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70"></div>
          <div className="absolute right-0 bottom-20 w-96 h-96 bg-blue-200 dark:bg-blue-800/20 rounded-full filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 relative z-10">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The All-in-One Hub for
            </motion.h1>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-blue-600">Infrastructure</span> & <span className="text-blue-600">Investments</span>.
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Leverage Hedera's DLT for secure, efficient infrastructure investments that empower communities.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/dashboard">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                  Get Started <FaArrowRight className="ml-2" />
                </button>
              </Link>
              <Link to="/learn">
                <button className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
                  Learn More
                </button>
              </Link>
            </motion.div>
          </div>
          
          {/* Icons */}
          <motion.div 
            className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: "🏗️", text: "Infrastructure" },
              { icon: "🔐", text: "Security" },
              { icon: "📊", text: "Analytics" },
              { icon: "💰", text: "Investments" },
              { icon: "🌍", text: "Community" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <span className="text-3xl mb-2">{item.icon}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Dashboard Preview */}
          <motion.div 
            className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="StakeMate Dashboard" 
              className="w-full h-auto rounded-xl border-8 border-white dark:border-gray-800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent rounded-xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything you need to navigate <span className="text-blue-600">Infrastructure Investments</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 relative overflow-hidden"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Your tokens, your world.</h3>
                <p className="text-gray-600 dark:text-gray-300">Secure and track your infrastructure investments with transparent tokenization on Hedera.</p>
              </div>
              <Link to="/projects">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-300">
                  Explore Projects
                </button>
              </Link>
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" 
                alt="Infrastructure Tokens" 
                className="mt-8 rounded-lg border-4 border-white dark:border-gray-800 shadow-lg"
              />
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 relative overflow-hidden"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Explore, buy, and sell Hedera NFTs.</h3>
                <p className="text-gray-600 dark:text-gray-300">Infrastructure projects tokenized as NFTs, making ownership and trading seamless.</p>
              </div>
              <Link to="/portfolio">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-300">
                  Build Portfolio
                </button>
              </Link>
              <img 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop" 
                alt="NFT Marketplace" 
                className="mt-8 rounded-lg border-4 border-white dark:border-gray-800 shadow-lg"
              />
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 relative overflow-hidden"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Create your Investment Community.</h3>
                <p className="text-gray-600 dark:text-gray-300">Connect with like-minded investors and project developers to share insights.</p>
              </div>
              <Link to="/community">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-300">
                  Join Community
                </button>
              </Link>
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop" 
                alt="Investment Community" 
                className="mt-8 rounded-lg border-4 border-white dark:border-gray-800 shadow-lg"
              />
            </motion.div>
          </div>
          
          {/* Learning Section */}
          <motion.div 
            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 relative overflow-hidden mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-4">Learn how to invest in Infrastructure.</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Understand project tokenization, risk assessment, and maximizing returns with our comprehensive learning resources.
                </p>
                <Link to="/learn">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-300">
                    Start Learning
                  </button>
                </Link>
              </div>
              <div className="md:w-1/2 relative">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
                      <div className="h-24 bg-blue-100 dark:bg-blue-900/40 rounded-md flex items-center justify-center mb-2">
                        <FaGraduationCap className="text-blue-600 text-2xl" />
                      </div>
                      <p className="text-sm font-medium">Course Module {item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why choose us?</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
            StakeMate offers unique advantages for infrastructure investments
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Get Funded",
                icon: <FaCoins className="text-blue-600 text-4xl mb-4" />,
                description: "Access capital for infrastructure projects through fractional investments backed by Hedera's secure ledger."
              },
              {
                title: "Own your following",
                icon: <FaUsers className="text-blue-600 text-4xl mb-4" />,
                description: "Build a community of investors and supporters who believe in your infrastructure vision."
              },
              {
                title: "Monetize your work",
                icon: <FaChartLine className="text-blue-600 text-4xl mb-4" />,
                description: "Generate returns from infrastructure projects with transparent revenue sharing and tokenization."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-10 top-10 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute right-10 bottom-10 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">A tribe of passionate investors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "+31", label: "Infrastructure Projects" },
              { number: "$14.2M", label: "Total Investments" },
              { number: "+12k", label: "Active Investors" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Hear from <span className="text-blue-600">Investors</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Brandon",
                title: "Angel Investor",
                quote: "StakeMate simplified the process of investing in infrastructure projects. The transparency and security provided by Hedera give me confidence in my investments.",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Alice",
                title: "Fund Manager",
                quote: "The ability to fractionally invest in major infrastructure projects has transformed how we allocate capital. Our returns have increased significantly.",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "David",
                title: "Community Leader",
                quote: "Our community was able to pool resources and invest in local infrastructure development. StakeMate made this possible with minimal overhead.",
                image: "https://randomuser.me/api/portraits/men/67.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Start your investment journey now
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/dashboard">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl">
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StakeMate</h3>
              <p className="text-gray-400 mb-4">Empowering infrastructure investments with Hedera's distributed ledger technology.</p>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'GitHub'].map((platform) => (
                  <a key={platform} href="#" className="text-gray-400 hover:text-blue-400">
                    {platform}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                {['Projects', 'Portfolio', 'Community', 'Learning'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                {['FAQ', 'Documentation', 'API', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                {['Terms', 'Privacy', 'Cookies', 'Licenses'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">© 2024 StakeMate. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Hedera_Hashgraph_logo.svg/1200px-Hedera_Hashgraph_logo.svg.png" alt="Hedera" className="h-6" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 