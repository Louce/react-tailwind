import React, { useState, useEffect } from 'react';

// Modern contact form animations
const contactAnimations = `
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeUp {
    animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.98);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  @keyframes borderPulse {
    0% {
      border-color: rgba(59, 130, 246, 0.3);
    }
    50% {
      border-color: rgba(59, 130, 246, 0.6);
    }
    100% {
      border-color: rgba(59, 130, 246, 0.3);
    }
  }
  
  .animate-borderPulse {
    animation: borderPulse 2s infinite;
  }
  
  .contact-input {
    transition: all 0.3s ease;
    border-bottom-width: 1px;
  }
  
  .contact-input:focus {
    border-color: #3B82F6;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
  }
  
  .btn-modern {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .btn-modern:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.2);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }
  
  .btn-modern:hover:after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(100, 100);
      opacity: 0;
    }
  }
  
  /* Link hover effect */
  .hover-link {
    position: relative;
  }
  
  .hover-link:after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: currentColor;
    transition: width 0.3s ease;
  }
  
  .hover-link:hover:after {
    width: 100%;
  }
  
  @keyframes neonPulse {
    0% {
      box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff;
    }
    50% {
      box-shadow: 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 25px #0ff;
    }
    100% {
      box-shadow: 0 0 5px #0ff, 0 0 10px #0ff, 0 0 15px #0ff, 0 0 20px #0ff;
    }
  }
  
  .neon-pulse {
    animation: neonPulse 2.5s ease-in-out infinite;
  }
  
  @keyframes scanLine {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
  
  .scan-line {
    position: relative;
    overflow: hidden;
  }
  
  .scan-line::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(to bottom, 
      rgba(64, 154, 255, 0) 0%,
      rgba(64, 154, 255, 0.1) 50%,
      rgba(64, 154, 255, 0) 100%);
    opacity: 0.5;
    pointer-events: none;
    animation: scanLine 5s linear infinite;
  }
  
  .cyberpunk-grid-overlay {
    background-image: 
      linear-gradient(rgba(70, 130, 220, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(70, 130, 220, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  /* Floating particles animation */
  @keyframes twinkle {
    0%, 100% { 
      opacity: 0.2;
      transform: scale(0.8);
    }
    50% { 
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  .animate-twinkle {
    animation: twinkle ease-in-out infinite;
  }
  
  /* Data flow effect */
  .data-flow {
    background: linear-gradient(to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(30, 120, 255, 0.05) 25%,
      rgba(30, 120, 255, 0) 50%,
      rgba(30, 120, 255, 0.05) 75%,
      rgba(0, 0, 0, 0) 100%
    );
    background-size: 100% 600px;
    animation: dataFlow 10s linear infinite;
  }
  
  @keyframes dataFlow {
    0% {
      background-position: 0 -600px;
    }
    100% {
      background-position: 0 600px;
    }
  }
`;

// Night mode styles update for better readability
const nightModeStyles = `
  .night-mode {
    --text-primary: rgba(245, 245, 255, 0.95);
    --text-secondary: rgba(220, 220, 240, 0.75);
    --text-tertiary: rgba(180, 180, 210, 0.6);
    --accent-primary: rgb(99, 179, 237);
    --accent-secondary: rgb(56, 161, 217);
    --bg-primary: rgb(12, 15, 25);
    --bg-card: rgba(25, 30, 50, 0.6);
    --bg-elevated: rgba(35, 40, 65, 0.8);
  }
  
  .night-mode-text-glow {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  .night-mode-card {
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 
                0 0 30px rgba(20, 70, 180, 0.1),
                inset 0 0 0 1px rgba(120, 120, 180, 0.1);
  }
  
  .cyberpunk-text-shadow {
    text-shadow: 
      0 0 2px rgba(90, 120, 250, 0.7),
      0 0 10px rgba(100, 140, 250, 0.5),
      0 0 15px rgba(120, 170, 255, 0.3);
  }
  
  /* Make sure form placeholder text is readable in dark mode */
  .night-mode input::placeholder,
  .night-mode textarea::placeholder {
    color: rgba(180, 190, 210, 0.6);
  }
  
  /* Ensure form labels are readable */
  .night-mode .form-label {
    color: rgba(200, 210, 230, 0.8);
  }
  
  /* Fancy border gradient */
  .fancy-border-gradient {
    position: relative;
    z-index: 0;
  }
  
  .fancy-border-gradient:before {
    content: '';
    position: absolute;
    z-index: -2;
    inset: -1px;
    border-radius: inherit;
    background: linear-gradient(to right, #3B82F6, #8B5CF6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .fancy-border-gradient:hover:before {
    opacity: 1;
  }
  
  /* Night mode specific glow effect */
  .animate-glitch {
    position: relative;
  }
  
  .animate-glitch:hover {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(59, 130, 246, 0.8);
  }
`;

const Contact = () => {
  // For now, using a placeholder image
  const profileImage = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064&auto=format&fit=crop";
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [nightMode, setNightMode] = useState(false);
  
  // Animation timing
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    
    // Check if dark mode is saved in localStorage
    const savedMode = localStorage.getItem('nightMode');
    if (savedMode === 'true') {
      setNightMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Update localStorage when nightMode changes
  useEffect(() => {
    localStorage.setItem('nightMode', nightMode.toString());
    
    // Apply/remove dark class to document for scrollbar styling
    if (nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formState);
    // Reset form or show success message
  };

  const toggleNightMode = () => {
    setNightMode(!nightMode);
  };

  return (
    <div className={`min-h-screen ${nightMode ? 'night-mode bg-[#050A15] text-white' : 'bg-white'} flex flex-col transition-colors duration-500`}>
      <style>{contactAnimations}</style>
      <style>{nightModeStyles}</style>
      
      {/* Background for night mode */}
      {nightMode && (
        <>
          <div className="fixed inset-0 bg-gradient-radial from-[#141e33] to-[#050A15] opacity-90"></div>
          <div className="fixed inset-0 cyberpunk-grid-overlay opacity-30 z-1"></div>
          <div className="fixed inset-0 scan-line pointer-events-none z-1"></div>
          <div className="fixed inset-0 data-flow opacity-20 pointer-events-none z-1"></div>
          
          {/* Floating particles */}
          <div className="fixed inset-0 pointer-events-none z-1">
            {[...Array(40)].map((_, index) => (
              <div
                key={index}
                className={`absolute w-1 h-1 rounded-full animate-twinkle ${
                  index % 3 === 0 ? 'bg-blue-400' : index % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.3 + Math.random() * 0.7,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 7}s`
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Light mode subtle background */}
      {!nightMode && (
        <div className="fixed inset-0 z-1">
          <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-rose-50 to-teal-50 opacity-70"></div>
          <div className="fixed inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 25px 25px, #000 2%, transparent 0%), radial-gradient(circle at 75px 75px, #000 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            opacity: 0.02
          }}></div>
        </div>
      )}
      
      {/* Header with navigation */}
      <header className={`w-full py-4 px-6 ${nightMode ? 'bg-transparent' : 'bg-white bg-opacity-70 backdrop-blur-sm'} relative z-10 transition-colors duration-500`}>
        <div 
          className={`max-w-6xl mx-auto flex justify-between items-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a href="/" className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} font-light hover-link transition-colors duration-500 fancy-border-gradient px-3 py-1 rounded-full`}>@rivaldydendy</a>
          <nav className="flex items-center space-x-8">
            <a href="/#about" className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} hover-link transition-all duration-300`}>About</a>
            <a href="/#work" className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} hover-link transition-all duration-300`}>Work</a>
            <a href="/contact" className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} hover-link transition-all duration-300 border-b ${nightMode ? 'border-white' : 'border-black'} transition-colors duration-500`}>Contact</a>
            
            {/* Night mode toggle - matching landing page */}
            <button 
              onClick={toggleNightMode} 
              className={`flex items-center justify-center rounded-full p-2 transition-all duration-500 ${
                nightMode 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gradient-to-r from-amber-200 to-yellow-400 text-gray-700 shadow-lg shadow-amber-200/20'
              } hover:shadow-xl`}
              aria-label={nightMode ? "Switch to light mode" : "Switch to night mode"}
            >
              {nightMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main contact content */}
      <main className={`flex-grow flex items-center justify-center p-4 relative z-10 transition-colors duration-500`}>
        <div 
          className={`${nightMode ? 'bg-[rgba(20,30,51,0.5)] night-mode-card' : 'bg-white bg-opacity-80 shadow-xl'} max-w-6xl w-full mx-auto rounded-2xl overflow-hidden transition-all duration-1000 relative ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col md:flex-row relative">
            {/* Left column - Contact Info */}
            <div className={`w-full md:w-1/3 p-8 md:p-12 ${nightMode ? 'bg-[rgba(30,40,65,0.7)]' : 'bg-indigo-50 bg-opacity-40'} transition-colors duration-500`}>
              {/* Profile photo */}
              <div 
                className={`mx-auto md:mx-0 w-24 h-24 rounded-full overflow-hidden mb-6 transition-all duration-700 ${
                  nightMode ? 'border-2 border-blue-400 shadow-lg neon-pulse' : 'border-2 border-indigo-200 shadow-lg'
                } ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <img 
                  src={profileImage}
                  alt="Rivaldy Dendy" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Contact info with staggered animations */}
              <div className="space-y-6">
                <div 
                  className="transform transition-all duration-700" 
                  style={{ 
                    transitionDelay: '300ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-indigo-500'} transition-colors duration-500`}>Email</h3>
                  <a href="mailto:rivaldy.dendy@example.com" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>
                    rivaldy.dendy@example.com
                  </a>
                </div>
                
                <div 
                  className="transform transition-all duration-700" 
                  style={{ 
                    transitionDelay: '400ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-indigo-500'} transition-colors duration-500`}>Call</h3>
                  <a href="tel:+1234567890" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>
                    +1 (234) 567-890
                  </a>
                </div>

                <div 
                  className="pt-4 transform transition-all duration-700" 
                  style={{ 
                    transitionDelay: '500ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-indigo-500'} transition-colors duration-500`}>Social</h3>
                  <div className="flex flex-col space-y-2 mt-2">
                    <a href="#" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>LinkedIn</a>
                    <a href="#" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>Instagram</a>
                    <a href="#" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>Twitter</a>
                    <a href="#" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>Webflow</a>
                    <a href="#" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>Figma</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Contact Form */}
            <div className={`w-full md:w-2/3 p-8 md:p-12 ${nightMode ? 'bg-[rgba(20,30,51,0.6)]' : 'bg-white bg-opacity-60 backdrop-blur-sm'} transition-colors duration-500`}>
              <h2 
                className={`text-3xl font-extralight mb-8 transform transition-all duration-700 ${nightMode ? 'text-white cyberpunk-text-shadow tracking-wide' : 'tracking-wide'} ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '300ms' }}
              >
                Let's build something cool together
              </h2>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div 
                  className="transform transition-all duration-700"
                  style={{ 
                    transitionDelay: '400ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <label htmlFor="name" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-indigo-500'} mb-1 transition-all duration-300 ${focusedField === 'name' ? 'text-blue-500' : ''}`}>Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your Name" 
                    className={`w-full p-2 contact-input focus:outline-none rounded-md ${focusedField === 'name' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
                  />
                </div>
                
                <div 
                  className="transform transition-all duration-700"
                  style={{ 
                    transitionDelay: '500ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <label htmlFor="email" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-indigo-500'} mb-1 transition-all duration-300 ${focusedField === 'email' ? 'text-blue-500' : ''}`}>Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your.email@example.com" 
                    className={`w-full p-2 contact-input focus:outline-none rounded-md ${focusedField === 'email' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
                  />
                </div>
                
                <div 
                  className="transform transition-all duration-700"
                  style={{ 
                    transitionDelay: '600ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <label htmlFor="subject" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-indigo-500'} mb-1 transition-all duration-300 ${focusedField === 'subject' ? 'text-blue-500' : ''}`}>Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    value={formState.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Project Inquiry" 
                    className={`w-full p-2 contact-input focus:outline-none rounded-md ${focusedField === 'subject' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
                  />
                </div>
                
                <div 
                  className="transform transition-all duration-700"
                  style={{ 
                    transitionDelay: '700ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <label htmlFor="message" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-indigo-500'} mb-1 transition-all duration-300 ${focusedField === 'message' ? 'text-blue-500' : ''}`}>Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formState.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell me about your project..." 
                    className={`w-full p-2 contact-input focus:outline-none rounded-md ${focusedField === 'message' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
                  ></textarea>
                </div>
                
                <div 
                  className="pt-4 transform transition-all duration-700"
                  style={{ 
                    transitionDelay: '800ms',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isLoaded ? 1 : 0
                  }}
                >
                  <button 
                    type="submit" 
                    className={`px-8 py-3 ${
                      nightMode 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-gradient-to-r from-indigo-500 to-rose-500 shadow-lg shadow-indigo-500/20'
                    } text-white rounded-full hover:shadow-xl transition-all btn-modern relative overflow-hidden`}
                  >
                    <span className="relative z-10">Send Message</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-blue-500 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`w-full py-4 px-6 ${nightMode ? 'border-gray-800 bg-[rgba(10,15,25,0.95)]' : 'border-gray-200 bg-white bg-opacity-80 backdrop-blur-sm'} relative z-10 transition-colors duration-500`}>
        <div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center"
          style={{ 
            transitionDelay: '900ms',
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-500'} transition-colors duration-500`}>© 2025 By Rivaldy Dendy</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className={`text-sm ${nightMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'} hover-link transition-colors duration-300`}>LinkedIn</a>
            <a href="#" className={`text-sm ${nightMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'} hover-link transition-colors duration-300`}>Twitter</a>
            <a href="#" className={`text-sm ${nightMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'} hover-link transition-colors duration-300`}>Instagram</a>
            <a href="#" className={`text-sm ${nightMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-black'} hover-link transition-colors duration-300`}>Webflow</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact; 