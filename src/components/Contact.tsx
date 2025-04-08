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
    }
  }, []);
  
  // Update localStorage when nightMode changes
  useEffect(() => {
    localStorage.setItem('nightMode', nightMode.toString());
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

  return (
    <div className={`min-h-screen ${nightMode ? 'night-mode bg-[#0c0f19] text-white' : 'bg-gray-100'} flex flex-col transition-colors duration-500`}>
      <style>{contactAnimations}</style>
      <style>{nightModeStyles}</style>
      
      {/* Background for night mode */}
      {nightMode && (
        <>
          <div className="fixed inset-0 bg-gradient-radial from-[#141e33] to-[#0c0f19] opacity-90"></div>
        </>
      )}
      
      {/* Header with navigation */}
      <header className={`w-full py-4 px-6 ${nightMode ? 'bg-transparent' : 'bg-[#e6edf3]'} relative z-10 transition-colors duration-500`}>
        <div 
          className={`max-w-6xl mx-auto flex justify-between items-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a href="/" className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} font-light hover-link transition-colors duration-500`}>@Ayush Barnwal</a>
          <nav className="flex items-center space-x-8">
            <a href="/#about" className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} hover-link transition-all duration-300`}>About</a>
            <a href="/#work" className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} hover-link transition-all duration-300`}>Work</a>
            <a href="/contact" className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} hover-link transition-all duration-300 border-b ${nightMode ? 'border-white' : 'border-black'} transition-colors duration-500`}>Contact</a>
            
            {/* Night mode toggle */}
            <button 
              onClick={() => setNightMode(!nightMode)} 
              className={`flex items-center justify-center rounded-full p-2 transition-all duration-300 ${nightMode ? 'bg-blue-600 text-white neon-pulse' : 'bg-gray-200 text-gray-700'} hover:shadow-lg ml-2`}
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
      <main className={`flex-grow flex items-center justify-center p-4 ${nightMode ? 'bg-transparent' : 'bg-gray-100'} relative z-10 transition-colors duration-500`}>
        <div 
          className={`${nightMode ? 'bg-[rgba(20,30,51,0.5)] night-mode-card' : 'bg-gray-50'} max-w-6xl w-full mx-auto shadow-lg rounded-lg overflow-hidden transition-all duration-1000 relative ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {nightMode && (
            <>
              <div className="absolute inset-0 cyberpunk-grid-overlay opacity-10 pointer-events-none"></div>
              <div className="absolute inset-0 scan-line pointer-events-none"></div>
            </>
          )}
          <div className="flex flex-col md:flex-row relative">
            {/* Left column - Contact Info */}
            <div className={`w-full md:w-1/3 p-8 md:p-12 ${nightMode ? 'bg-[rgba(30,40,65,0.7)]' : 'bg-[#e6edf3]'} transition-colors duration-500`}>
              {/* Profile photo */}
              <div 
                className={`mx-auto md:mx-0 w-24 h-24 rounded-full overflow-hidden mb-6 transition-all duration-700 border-2 border-blue-400 shadow-lg ${nightMode ? 'neon-pulse' : ''} ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <img 
                  src={profileImage}
                  alt="Ayush Barnwal" 
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
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-gray-500'} transition-colors duration-500`}>Email</h3>
                  <a href="mailto:ayush.barnwal@righteous.id" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>
                    ayush.barnwal@righteous.id
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
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-gray-500'} transition-colors duration-500`}>Call</h3>
                  <a href="tel:+919891447621" className={`${nightMode ? 'text-white cyberpunk-text-shadow' : 'text-black'} hover-link transition-colors duration-500`}>
                    +91 9891447621
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
                  <h3 className={`text-sm ${nightMode ? 'text-blue-300' : 'text-gray-500'} transition-colors duration-500`}>Social</h3>
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
            <div className={`w-full md:w-2/3 p-8 md:p-12 ${nightMode ? 'bg-[rgba(20,30,51,0.6)]' : 'bg-white'} transition-colors duration-500`}>
              <h2 
                className={`text-2xl font-normal mb-8 transform transition-all duration-700 ${nightMode ? 'text-white cyberpunk-text-shadow' : ''} ${
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
                  <label htmlFor="name" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-gray-500'} mb-1 transition-all duration-300 ${focusedField === 'name' ? 'text-blue-500' : ''}`}>Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="James Robert" 
                    className={`w-full p-2 contact-input focus:outline-none ${focusedField === 'name' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
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
                  <label htmlFor="email" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-gray-500'} mb-1 transition-all duration-300 ${focusedField === 'email' ? 'text-blue-500' : ''}`}>Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="ayush.barnwal@righteous.id" 
                    className={`w-full p-2 contact-input focus:outline-none ${focusedField === 'email' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
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
                  <label htmlFor="subject" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-gray-500'} mb-1 transition-all duration-300 ${focusedField === 'subject' ? 'text-blue-500' : ''}`}>Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    value={formState.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="For web design work Enquire" 
                    className={`w-full p-2 contact-input focus:outline-none ${focusedField === 'subject' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
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
                  <label htmlFor="message" className={`block text-sm form-label ${nightMode ? 'text-blue-300' : 'text-gray-500'} mb-1 transition-all duration-300 ${focusedField === 'message' ? 'text-blue-500' : ''}`}>Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formState.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Type your Message" 
                    className={`w-full p-2 contact-input focus:outline-none ${focusedField === 'message' ? 'border-blue-500' : nightMode ? 'border-gray-600 bg-[rgba(30,40,65,0.6)] text-white' : 'border-gray-300 bg-gray-50 text-black'} transition-colors duration-500`}
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
                    className={`px-8 py-3 ${nightMode ? 'bg-blue-600 neon-pulse' : 'bg-black'} text-white rounded-full hover:bg-opacity-90 transition-all btn-modern relative overflow-hidden group`}
                  >
                    <span className="relative z-10">Submit</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-blue-500 transition-opacity duration-300"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`w-full py-4 px-6 border-t ${nightMode ? 'border-gray-800 bg-[rgba(10,15,25,0.95)]' : 'border-gray-200 bg-gray-50'} relative z-10 transition-colors duration-500`}>
        <div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center"
          style={{ 
            transitionDelay: '900ms',
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            opacity: isLoaded ? 1 : 0,
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <p className={`text-sm ${nightMode ? 'text-gray-300' : 'text-gray-500'} transition-colors duration-500`}>© 2024 By Ayush Barnwal</p>
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