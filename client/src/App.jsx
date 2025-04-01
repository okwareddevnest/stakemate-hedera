import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import CreateProject from './pages/CreateProject'
import Portfolio from './pages/Portfolio'
import ChatInterface from './pages/ChatInterface'
import Profile from './pages/Profile'
import Learn from './pages/Learn'
import CourseDetail from './pages/CourseDetail'
import NewLandingPage from './pages/NewLandingPage'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to landing page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page - No Sidebar, accessible by both logged in and logged out users */}
        <Route path="/" element={<NewLandingPage />} />
        
        {/* App with Sidebar - Protected Routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-[#F1F3F8] overflow-hidden">
              {/* Sidebar - fixed position */}
              <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              
              {/* Main content area */}
              <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Navbar - fixed position */}
                <Navbar toggleSidebar={toggleSidebar} />
                
                {/* Main scrollable area */}
                <main className="flex-1 overflow-y-auto pt-16 px-4 md:px-6 lg:px-8 pb-8">
                  <div className="max-w-7xl mx-auto w-full">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/create" element={<CreateProject />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/chat" element={<ChatInterface />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/course/:id" element={<CourseDetail />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
