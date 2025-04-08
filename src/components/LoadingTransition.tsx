import React, { useEffect, useState } from 'react';

interface LoadingTransitionProps {
  isLoading: boolean;
  onTransitionComplete?: () => void;
  nightMode?: boolean;
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({ 
  isLoading, 
  onTransitionComplete,
  nightMode = false 
}) => {
  const [isVisible, setIsVisible] = useState(isLoading);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onTransitionComplete) onTransitionComplete();
      }, 600); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isLoading, onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-600 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        backgroundColor: nightMode ? '#0f172a' : '#f8fafc',
        transition: 'opacity 0.6s ease-in-out'
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* Solar System Loading Animation */}
        <div className="relative w-24 h-24 mb-8">
          {/* Sun */}
          <div 
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full animate-pulse-slow" 
            style={{ 
              transform: 'translate(-50%, -50%)',
              background: nightMode 
                ? 'radial-gradient(circle at 30% 30%, #fb923c, #ea580c, #9a3412)' 
                : 'radial-gradient(circle at 30% 30%, #fef3c7, #fbbf24, #d97706)',
              boxShadow: `0 0 20px ${nightMode ? 'rgba(234, 88, 12, 0.8)' : 'rgba(251, 191, 36, 0.8)'}`,
            }}
          ></div>
          
          {/* Orbiting Planet */}
          <div className="absolute top-1/2 left-1/2 w-full h-full animate-spin" style={{ animationDuration: '2s', transform: 'translate(-50%, -50%)' }}>
            <div 
              className="absolute top-0 left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
              style={{
                background: nightMode 
                  ? 'radial-gradient(circle at 30% 30%, #60a5fa, #2563eb)' 
                  : 'radial-gradient(circle at 30% 30%, #93c5fd, #60a5fa)',
                boxShadow: `0 0 10px ${nightMode ? 'rgba(37, 99, 235, 0.6)' : 'rgba(96, 165, 250, 0.6)'}`
              }}
            ></div>
          </div>
          
          {/* Second Orbiting Planet */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 animate-spin" style={{ animationDuration: '3s', transform: 'translate(-50%, -50%)' }}>
            <div 
              className="absolute top-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2"
              style={{
                background: nightMode 
                  ? 'radial-gradient(circle at 30% 30%, #f472b6, #be185d)' 
                  : 'radial-gradient(circle at 30% 30%, #f9a8d4, #ec4899)',
                boxShadow: `0 0 8px ${nightMode ? 'rgba(190, 24, 93, 0.6)' : 'rgba(236, 72, 153, 0.6)'}`
              }}
            ></div>
          </div>
          
          {/* Third Orbiting Planet */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse', transform: 'translate(-50%, -50%)' }}>
            <div 
              className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full -translate-x-1/2"
              style={{
                background: nightMode 
                  ? 'radial-gradient(circle at 30% 30%, #fb7185, #e11d48)' 
                  : 'radial-gradient(circle at 30% 30%, #fda4af, #fb7185)',
                boxShadow: `0 0 8px ${nightMode ? 'rgba(225, 29, 72, 0.6)' : 'rgba(251, 113, 133, 0.6)'}`
              }}
            ></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className={`text-lg ${nightMode ? 'text-gray-200' : 'text-gray-700'} font-light tracking-widest`}>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0s' }}>L</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.1s' }}>O</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>A</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>D</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>I</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.5s' }}>N</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.6s' }}>G</span>
        </div>
        
        {/* Background stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle-bright"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                backgroundColor: nightMode ? 'white' : '#94a3b8',
                boxShadow: `0 0 ${Math.random() * 3 + 2}px ${nightMode ? 'white' : '#94a3b8'}`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition; 