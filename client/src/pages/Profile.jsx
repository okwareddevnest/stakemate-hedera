import React, { useState } from 'react';
import { FaUser, FaChartLine, FaShieldAlt, FaGraduationCap, FaCog, FaBell } from 'react-icons/fa';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    hederaAccountId: '0.0.5760067',
    country: 'Kenya',
    city: 'Nairobi',
    joinedDate: 'March 2024',
    riskProfile: {
      tolerance: 'moderate',
      toleranceScore: 65,
      investmentGoals: ['Long-term Growth', 'Infrastructure Development'],
      timeHorizon: 'medium'
    },
    learningProgress: {
      completedLessons: 12,
      totalLessons: 30,
      knowledgeScore: {
        basics: 80,
        tokenization: 70,
        infrastructure: 75,
        regulation: 60,
        esg: 85,
        riskManagement: 65
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

  const getTabClassName = (tabName) => {
    return `px-4 py-2 rounded-lg ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }`;
  };

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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hedera Account ID</label>
                <input
                  type="text"
                  value={user.hederaAccountId}
                  onChange={(e) => setUser({...user, hederaAccountId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            </div>
            <div className="mt-6">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Save Changes
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
                  {user.riskProfile.investmentGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaChartLine className="text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                    </div>
                  ))}
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
      </div>
    </div>
  );
};

export default Profile; 