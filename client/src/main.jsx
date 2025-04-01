import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: StrictMode is disabled to prevent double mounting in development
// In production builds, you may want to re-enable StrictMode for additional checks
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
