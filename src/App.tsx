import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Contact from './components/Contact'
import LoadingTransition from './components/LoadingTransition'

// Create a component to handle route transitions
const PageTransitionHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [prevLocation, setPrevLocation] = useState('')
  const [nightMode, setNightMode] = useState(false)
  
  // Get initial nightMode state from localStorage if available
  useEffect(() => {
    const savedMode = localStorage.getItem('nightMode')
    if (savedMode !== null) {
      setNightMode(savedMode === 'true')
    }
  }, [])
  
  // Listen for nightMode changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nightMode') {
        setNightMode(e.newValue === 'true')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // Handle route changes
  useEffect(() => {
    if (location.pathname !== prevLocation) {
      // Start loading animation when route changes
      setIsLoading(true)
      
      // Delay to simulate page loading and ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false)
        setPrevLocation(location.pathname)
      }, 800) // Adjust loading time as needed
      
      return () => clearTimeout(timer)
    }
  }, [location, prevLocation])
  
  // Initial page load
  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false)
      setPrevLocation(location.pathname)
    }, 1500) // Longer for initial load
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingTransition isLoading={isLoading} nightMode={nightMode} />
      {children}
    </>
  )
}

function App() {
  return (
    <Router>
      <PageTransitionHandler>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransitionHandler>
    </Router>
  )
}

export default App
