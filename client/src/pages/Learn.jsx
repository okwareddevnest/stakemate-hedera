import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaHeart, FaShareAlt, FaChartLine, FaShieldAlt, FaLandmark, FaLeaf, FaRegClock, FaRegStar } from 'react-icons/fa';

const Learn = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const courses = [
    {
      id: 1,
      title: 'Infrastructure Investment Basics',
      description: 'Learn the fundamentals of infrastructure investment in Kenya and how to evaluate potential projects.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      duration: '3 hours',
      modules: 7,
      category: 'Investment',
      icon: <FaLandmark className="text-blue-500" />
    },
    {
      id: 2,
      title: 'Tokenization Fundamentals',
      description: 'Understand how assets are tokenized on the Hedera network and the benefits of blockchain-based investments.',
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      duration: '4 hours',
      modules: 8,
      category: 'Technology',
      icon: <FaShieldAlt className="text-purple-500" />
    },
    {
      id: 3,
      title: 'ESG in Infrastructure',
      description: 'Explore the environmental, social, and governance factors in infrastructure investments and their importance.',
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      duration: '3.5 hours',
      modules: 6,
      category: 'Sustainability',
      icon: <FaLeaf className="text-green-500" />
    },
    {
      id: 4,
      title: 'Risk Management Strategies',
      description: 'Learn how to identify, assess, and mitigate risks in your infrastructure investment portfolio.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Advanced',
      duration: '5 hours',
      modules: 9,
      category: 'Risk Management',
      icon: <FaChartLine className="text-red-500" />
    },
    {
      id: 5,
      title: 'Hedera for Investors',
      description: 'Master the essentials of Hedera Hashgraph technology and how it enables secure and transparent investments.',
      image: 'https://images.unsplash.com/photo-1639322537704-9b938ce81c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Beginner',
      duration: '2.5 hours',
      modules: 5,
      category: 'Technology',
      icon: <FaShieldAlt className="text-blue-500" />
    },
    {
      id: 6,
      title: 'Portfolio Diversification',
      description: 'Explore strategies for building a diversified infrastructure investment portfolio to maximize returns and minimize risk.',
      image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      level: 'Intermediate',
      duration: '4 hours',
      modules: 7,
      category: 'Investment',
      icon: <FaChartLine className="text-green-500" />
    }
  ];

  // Filter options
  const categories = ['All', 'Investment', 'Technology', 'Sustainability', 'Risk Management'];
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter courses
  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Learning Center</h1>
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div 
            key={course.id}
            className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            onMouseEnter={() => setHoveredCard(course.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Course image */}
            <div className="h-60 relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for hover effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  hoveredCard === course.id ? 'opacity-100' : 'opacity-70'
                }`}
              />
              
              {/* Course title on image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{course.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="mr-2">{course.icon}</span>
                  <span className="text-sm">{course.category}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{course.level}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="absolute top-3 right-3 space-y-2">
                <button className="bg-black/60 hover:bg-black/80 p-2 rounded-full text-white">
                  <FaHeart className="w-5 h-5" />
                </button>
                <button className="bg-black/60 hover:bg-black/80 p-2 rounded-full text-white">
                  <FaShareAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Course details */}
            <div className="p-4 bg-white dark:bg-gray-800">
              {/* Description only shown on hover */}
              <div 
                className={`transition-all duration-300 ${
                  hoveredCard === course.id 
                    ? 'max-h-40 opacity-100 mb-4' 
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FaRegClock className="mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <FaGraduationCap className="mr-1" />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center">
                  <FaRegStar className="mr-1" />
                  <span>4.8/5</span>
                </div>
              </div>
              
              <Link to={`/course/${course.id}`}>
                <button className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
                  Start Learning
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Learning Progress */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Course Completion</h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span className="text-blue-500">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: '35%' }}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Recommended Next</h3>
            <div className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <FaChartLine className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">Continue: Risk Management Strategies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Module 3 of 9 - 25% complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn; 