import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Contact from './components/Contact'
import LoadingTransition from './components/LoadingTransition'

// Create NightMode Context
export const NightModeContext = createContext<{
  nightMode: boolean;
  toggleNightMode: () => void;
}>({
  nightMode: false,
  toggleNightMode: () => {},
});

// Create NightMode Provider
const NightModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [nightMode, setNightMode] = useState(() => {
    const savedMode = localStorage.getItem('nightMode')
    return savedMode ? savedMode === 'true' : false
  })

  const toggleNightMode = () => {
    const newMode = !nightMode
    setNightMode(newMode)
    localStorage.setItem('nightMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    if (nightMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <NightModeContext.Provider value={{ nightMode, toggleNightMode }}>
      {children}
    </NightModeContext.Provider>
  )
}

// Create a component to handle route transitions
const PageTransitionHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [prevLocation, setPrevLocation] = useState('')
  const { nightMode } = useContext(NightModeContext)
  
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;

      // Update background color based on scroll position
      const hue = Math.min(240 + scrollPercentage * 2, 360);
      const saturation = Math.max(50 - scrollPercentage * 0.5, 20);
      const lightness = Math.max(50 - scrollPercentage * 0.3, 30);
      document.documentElement.style.setProperty('--bg-hue', `${hue}`);
      document.documentElement.style.setProperty('--bg-saturation', `${saturation}%`);
      document.documentElement.style.setProperty('--bg-lightness', `${lightness}%`);

      // Update text color based on scroll position
      const textLightness = Math.min(90 + scrollPercentage * 0.2, 100);
      document.documentElement.style.setProperty('--text-lightness', `${textLightness}%`);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

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
      <NightModeProvider>
        <PageTransitionHandler>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </PageTransitionHandler>
      </NightModeProvider>
    </Router>
  )
}

export default App
