import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Portfolio from './pages/Portfolio'
import ChatInterface from './pages/ChatInterface'
import Profile from './pages/Profile'
import Learn from './pages/Learn'
import CourseDetail from './pages/CourseDetail'
import NewLandingPage from './pages/NewLandingPage'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Landing Page - No Sidebar */}
          <Route path="/" element={<NewLandingPage />} />
          
          {/* App with Sidebar */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen bg-gray-50">
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Main content */}
                <div className="flex flex-col flex-1 w-0 overflow-hidden">
                  <Navbar toggleSidebar={toggleSidebar} />
                  
                  <main className="relative flex-1 overflow-y-auto focus:outline-none p-4 md:p-6">
                    <div className="max-w-7xl mx-auto pb-40">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/chat" element={<ChatInterface />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/course/:id" element={<CourseDetail />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
