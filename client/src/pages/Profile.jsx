import React, { useState, useEffect } from 'react';
import { FaUser, FaChartLine, FaShieldAlt, FaGraduationCap, FaCog, FaBell, FaWallet } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import HederaAccountSection from '../components/profile/HederaAccountSection';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get authenticated user from context
  const { user: authUser, updateProfile } = useAuth();
  
  // Local state for user data (initialized with context data but will be updated from API)
  const [user, setUser] = useState({
    name: '',
    email: '',
    hederaAccountId: '',
    country: '',
    city: '',
    joinedDate: '',
    riskProfile: {
      tolerance: 'moderate',
      toleranceScore: 50,
      investmentGoals: [],
      timeHorizon: 'medium'
    },
    learningProgress: {
      completedLessons: 0,
      totalLessons: 0,
      knowledgeScore: {
        basics: 0,
        tokenization: 0,
        infrastructure: 0,
        regulation: 0,
        esg: 0,
        riskManagement: 0
      }
    }
  });

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showPortfolio: true,
      showActivity: true
    },
    preferences: {
      currency: 'KES',
      language: 'English',
      theme: 'dark'
    }
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getProfile();
        
        if (response.success) {
          // Format the joined date
          const joinedDate = new Date(response.data.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });
          
          // Format completed lessons count
          const completedLessonsCount = response.data.learningProgress?.completedLessons?.length || 0;
          
          // Update user state with API data
          setUser({
            name: response.data.name || '',
            email: response.data.email || '',
            hederaAccountId: response.data.hederaAccountId || '',
            country: response.data.country || '',
            city: response.data.city || '',
            joinedDate: joinedDate,
            riskProfile: response.data.riskProfile || user.riskProfile,
            learningProgress: {
              ...user.learningProgress,
              completedLessons: completedLessonsCount,
              totalLessons: 30, // This should come from API eventually
              knowledgeScore: response.data.learningProgress?.knowledgeScore || user.learningProgress.knowledgeScore
            }
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchUserProfile();
    }
  }, [authUser]);

  // Handle saving profile changes
  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const profileData = {
        name: user.name,
        country: user.country,
        city: user.city,
        hederaAccountId: user.hederaAccountId
      };
      
      await updateProfile(profileData);
      // Show success message or notification here
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to save profile changes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getTabClassName = (tabName) => {
    return `px-4 py-2 rounded-lg ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }`;
  };

  if (loading && !user.name) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Member since {user.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="flex flex-wrap space-x-2 mb-8">
        <button
          onClick={() => setActiveTab('personal')}
          className={getTabClassName('personal')}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={getTabClassName('investment')}
        >
          Investment Profile
        </button>
        <button
          onClick={() => setActiveTab('learning')}
          className={getTabClassName('learning')}
        >
          Learning Progress
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={getTabClassName('settings')}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('hedera')}
          className={getTabClassName('hedera')}
        >
          <FaWallet className="inline-block mr-1" /> Hedera Wallet
        </button>
      </div>

      {/* Profile Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {activeTab === 'personal' && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={true} // Email shouldn't be changed here
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                <input
                  type="text"
                  value={user.country}
                  onChange={(e) => setUser({...user, country: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <input
                  type="text"
                  value={user.city}
                  onChange={(e) => setUser({...user, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                onClick={handleSaveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'investment' && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Investment Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Risk Tolerance</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Score</span>
                    <span className="text-blue-500">{user.riskProfile.toleranceScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${user.riskProfile.toleranceScore}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Investment Goals</h3>
                <div className="space-y-2">
                  {user.riskProfile.investmentGoals && user.riskProfile.investmentGoals.length > 0 ? (
                    user.riskProfile.investmentGoals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FaChartLine className="text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No investment goals set yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Course Completion</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-blue-500">
                      {Math.round((user.learningProgress.completedLessons / user.learningProgress.totalLessons) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${(user.learningProgress.completedLessons / user.learningProgress.totalLessons) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Knowledge Areas</h3>
                <div className="space-y-2">
                  {Object.entries(user.learningProgress.knowledgeScore).map(([area, score]) => (
                    <div key={area} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{area}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Notifications</h3>
                <div className="space-y-2">
                  {Object.entries(settings.notifications).map(([type, enabled]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={enabled} 
                          onChange={() => setSettings({
                            ...settings, 
                            notifications: {...settings.notifications, [type]: !enabled}
                          })}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, currency: e.target.value}
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings, 
                        preferences: {...settings.preferences, language: e.target.value}
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Save Settings
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'hedera' && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Hedera Integration</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HederaAccountSection />
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Hedera Benefits</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Instant transactions with low fees</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Secure ownership of tokenized assets</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Passwordless authentication for enhanced security</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Direct integration with digital wallets</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 