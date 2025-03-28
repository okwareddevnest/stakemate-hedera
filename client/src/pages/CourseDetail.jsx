import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaRegClock, FaGraduationCap, FaRegStar, FaCheck, FaLock, FaPlay, FaDownload, FaRegBookmark } from 'react-icons/fa';

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock course data
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to get course details
    const fetchCourse = async () => {
      setLoading(true);
      // In a real app, this would be an API call using the id parameter
      setTimeout(() => {
        const courseData = {
          id: parseInt(id),
          title: 'Infrastructure Investment Basics',
          description: 'Learn the fundamentals of infrastructure investment in Kenya and how to evaluate potential projects for maximum returns and social impact.',
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          level: 'Beginner',
          duration: '3 hours',
          modules: 7,
          category: 'Investment',
          rating: 4.8,
          totalStudents: 342,
          author: 'Dr. Sarah Kamau',
          authorTitle: 'Investment Specialist',
          authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
          lastUpdated: 'March 2024',
          objectives: [
            'Understand the infrastructure investment landscape in Kenya',
            'Learn to evaluate the potential of infrastructure projects',
            'Analyze risk factors in infrastructure investments',
            'Understand how infrastructure tokens work on Hedera',
            'Build a basic infrastructure investment strategy'
          ],
          moduleList: [
            {
              id: 1,
              title: 'Introduction to Infrastructure Investment',
              duration: '30 min',
              lessons: 4,
              completed: true
            },
            {
              id: 2,
              title: 'Key Infrastructure Sectors in Kenya',
              duration: '45 min',
              lessons: 5,
              completed: true
            },
            {
              id: 3,
              title: 'Project Evaluation Techniques',
              duration: '60 min',
              lessons: 6,
              completed: false,
              current: true
            },
            {
              id: 4,
              title: 'Risk Assessment in Infrastructure',
              duration: '45 min',
              lessons: 4,
              completed: false
            },
            {
              id: 5,
              title: 'Tokenization Process',
              duration: '30 min',
              lessons: 3,
              completed: false
            },
            {
              id: 6,
              title: 'Building an Investment Strategy',
              duration: '40 min',
              lessons: 4,
              completed: false
            },
            {
              id: 7,
              title: 'Case Studies & Success Stories',
              duration: '50 min',
              lessons: 5,
              completed: false
            }
          ],
          requirements: [
            'Basic understanding of investment concepts',
            'Interest in infrastructure development',
            'No prior blockchain experience needed'
          ],
          resources: [
            {
              name: 'Infrastructure Investment Checklist',
              type: 'PDF',
              size: '2.4 MB'
            },
            {
              name: 'Project Evaluation Template',
              type: 'Excel',
              size: '1.8 MB'
            },
            {
              name: 'Risk Assessment Matrix',
              type: 'PDF',
              size: '1.2 MB'
            }
          ]
        };
        setCourse(courseData);
        setLoading(false);
      }, 1000);
    };
    
    fetchCourse();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Link to="/learn" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to courses
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/learn" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to courses
      </Link>
      
      {/* Course header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">
                    {course.category}
                  </span>
                  <span className="text-xs">{course.level}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center text-sm">
                  <FaRegStar className="text-yellow-400 mr-1" />
                  <span className="mr-3">{course.rating} ({course.totalStudents} students)</span>
                  <FaRegClock className="mr-1" />
                  <span className="mr-3">{course.duration}</span>
                  <FaGraduationCap className="mr-1" />
                  <span>{course.modules} modules</span>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'curriculum'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === 'resources'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Resources
                </button>
              </nav>
            </div>
            
            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 dark:text-white">About This Course</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {course.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Requirements</h3>
                  <ul className="space-y-2 mb-6">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        • {requirement}
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Instructor</h3>
                  <div className="flex items-center">
                    <img 
                      src={course.authorImage} 
                      alt={course.author} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{course.author}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.authorTitle}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'curriculum' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Course Curriculum</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    This course contains {course.modules} modules with a total of {
                      course.moduleList.reduce((total, module) => total + module.lessons, 0)
                    } lessons.
                  </p>
                  
                  <div className="space-y-4">
                    {course.moduleList.map((module) => (
                      <div 
                        key={module.id} 
                        className={`border rounded-lg ${
                          module.current ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center p-4">
                          <div className="flex items-start">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                              module.completed 
                                ? 'bg-green-500 text-white' 
                                : module.current 
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                            }`}>
                              {module.completed ? <FaCheck size={12} /> : module.id}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">{module.title}</h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <FaRegClock className="mr-1" />
                                <span className="mr-3">{module.duration}</span>
                                <FaGraduationCap className="mr-1" />
                                <span>{module.lessons} lessons</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {module.current ? (
                              <button className="text-blue-500 hover:text-blue-600">
                                <FaPlay />
                              </button>
                            ) : module.completed ? (
                              <span className="text-green-500">
                                <FaCheck />
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                <FaLock />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Course Resources</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Download these resources to enhance your learning experience.
                  </p>
                  
                  <div className="space-y-4">
                    {course.resources.map((resource, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                            <FaRegBookmark className="text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">{resource.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {resource.type} • {resource.size}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-500 hover:text-blue-600">
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Continue Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                You've completed 2 of 7 modules
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: '28.5%' }}
                />
              </div>
            </div>
            
            <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mb-4">
              Continue to Module 3
            </button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Enrolled</span>
                <span className="text-gray-800 dark:text-white">January 15, 2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-gray-800 dark:text-white">{course.lastUpdated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completion</span>
                <span className="text-gray-800 dark:text-white">28.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Certification</span>
                <span className="text-gray-800 dark:text-white">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 