import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { NightModeContext } from '../App';
import Footer from './Footer';

// Enhanced animation styles
const animationStyles = `
  /* Base animation styles with hardware acceleration */
  .animate-fadeInRight {
    animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  .animate-float {
    animation: floatAnimation 3s ease-in-out infinite;
    will-change: transform;
    backface-visibility: hidden;
  }

  .animate-gradient {
    animation: gradient 15s ease infinite;
    background-size: 200% 200%;
    will-change: background-position;
  }

  .animate-fadeIn {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    will-change: opacity;
  }

  .animate-scaleIn {
    animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  .animate-shimmer {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
    will-change: background-position;
  }

  .animate-twinkle {
    animation: twinkle ease-in-out infinite;
    will-change: transform, opacity;
    backface-visibility: hidden;
  }

  /* Modern Architecture Visualization Styles */
  .architecture-element {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  
  .architecture-base {
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    background-color: rgba(30, 25, 20, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  }

  .architecture-house {
    position: absolute;
    background-color: rgba(250, 250, 250, 0.95);
    border: 1px solid rgba(200, 200, 200, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }

  .architecture-window {
    position: absolute;
    background-color: rgba(20, 20, 30, 0.7);
    transition: all 0.3s ease;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }

  .architecture-window.lit {
    background-color: rgba(255, 230, 150, 0.6);
    box-shadow: 0 0 10px rgba(255, 230, 150, 0.4);
  }

  .architecture-tree {
    position: absolute;
    border-radius: 50% 50% 20% 20%;
    background-color: rgba(40, 120, 40, 0.8);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  .architecture-tree::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 15px;
    background-color: rgb(80, 50, 30);
  }

  .architecture-path {
    position: absolute;
    background-color: rgba(230, 230, 230, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .architecture-element-hover:hover {
    transform: translateZ(10px) scale(1.05);
    filter: brightness(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }

  /* Shadow effects */
  .architecture-shadow {
    position: absolute;
    background: radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%);
    border-radius: 50%;
    transform: rotateX(90deg);
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  /* Subtle animation for trees */
  @keyframes gentleSway {
    0%, 100% { transform: translateZ(0) rotate(0deg); }
    50% { transform: translateZ(0) rotate(1deg); }
  }

  .tree-animate {
    transform-origin: bottom center;
    animation: gentleSway 5s ease-in-out infinite;
    animation-delay: calc(var(--tree-delay) * 1s);
  }

  /* Window lighting animation */
  @keyframes windowGlow {
    0%, 100% { 
      background-color: rgba(255, 230, 150, 0.6);
      box-shadow: 0 0 10px rgba(255, 230, 150, 0.4);
    }
    50% { 
      background-color: rgba(255, 230, 150, 0.7);
      box-shadow: 0 0 15px rgba(255, 230, 150, 0.5);
    }
  }

  .window-lit {
    animation: windowGlow 4s ease-in-out infinite;
    animation-delay: calc(var(--window-delay) * 1s);
  }

  /* Ambient lighting effects */
  .architecture-ambient-light {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
    opacity: 0.7;
    mix-blend-mode: overlay;
  }

  .dark-mode .architecture-base {
    background-color: rgba(15, 20, 25, 0.9);
    border-color: rgba(100, 120, 150, 0.2);
  }

  .dark-mode .architecture-house {
    background-color: rgba(220, 225, 235, 0.9);
    border-color: rgba(150, 170, 200, 0.5);
  }

  .dark-mode .architecture-window {
    background-color: rgba(30, 40, 70, 0.7);
    box-shadow: 0 0 10px rgba(100, 150, 255, 0.1);
  }

  .dark-mode .architecture-tree {
    background-color: rgba(30, 100, 40, 0.8);
  }

  /* Smooth transitions for theme changes */
  .transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }

  /* Cube Structure Styles with enhanced performance */
  .cube-element {
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.02);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, border-color, background-color;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  
  .dark-mode .cube-element {
    border-color: rgba(150, 180, 255, 0.4);
    background-color: rgba(50, 80, 150, 0.03);
  }

  .cube-element:hover {
    border-color: rgba(255, 255, 255, 0.8);
    background-color: rgba(255, 255, 255, 0.05);
    transform: scale(1.05);
  }

  .dark-mode .cube-element:hover {
    border-color: rgba(200, 220, 255, 0.9);
    background-color: rgba(100, 130, 200, 0.08);
  }
  
  @keyframes cubeRotate {
    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  }

  /* Enhanced hover effects */
  .hover-scale {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-scale:hover {
    transform: scale(1.05);
  }

  /* Smooth scroll behavior */
  html {
    scroll-behavior: smooth;
  }

  /* Performance optimizations */
  .transform-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    .animate-fadeInRight,
    .animate-float,
    .animate-gradient,
    .animate-fadeIn,
    .animate-scaleIn,
    .animate-shimmer,
    .animate-twinkle,
    .cube-element {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Isometric House Animation */
  @keyframes floatHouse {
    0% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
    25% { transform: translateY(-5px) rotate3d(0, 1, 0, 1deg); }
    50% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
    75% { transform: translateY(5px) rotate3d(0, 1, 0, -1deg); }
    100% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
  }

  .house-float {
    animation: floatHouse 10s ease-in-out infinite;
  }

  /* Planet Animation */
  @keyframes floatPlanet {
    0% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
    25% { transform: translateY(-8px) rotate3d(0, 1, 0, 2deg); }
    50% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
    75% { transform: translateY(8px) rotate3d(0, 1, 0, -2deg); }
    100% { transform: translateY(0) rotate3d(0, 1, 0, 0deg); }
  }

  @keyframes slowRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .planet-float {
    animation: floatPlanet 20s ease-in-out infinite;
  }

  .planet-rotate {
    animation: slowRotate 120s linear infinite;
  }

  .glow-pulse {
    animation: pulseGlow 8s ease-in-out infinite;
  }

  /* 3D Planet Styles */
  .planet {
    position: relative;
    border-radius: 50%;
    box-shadow: inset -40px -10px 80px 0px rgba(0, 0, 0, 0.9),
                inset 10px 10px 30px 0px rgba(255, 255, 255, 0.3);
    overflow: hidden;
    transform-style: preserve-3d;
  }

  .planet-ring {
    position: absolute;
    border-radius: 50%;
    border: 5px solid rgba(255, 255, 255, 0.1);
    transform: rotateX(75deg) translateZ(-20px);
    box-shadow: 0 0 20px rgba(150, 200, 255, 0.5);
  }

  .planet-atmosphere {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0) 0%, rgba(100, 180, 255, 0.1) 40%, rgba(70, 120, 255, 0) 70%);
    pointer-events: none;
  }

  .planet-surface {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: 400% 400%;
    mix-blend-mode: soft-light;
    opacity: 0.6;
  }

  .planet-glow {
    position: absolute;
    top: -25%;
    left: -25%;
    width: 150%;
    height: 150%;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(120, 180, 255, 0.4) 0%, rgba(70, 140, 255, 0.1) 40%, rgba(70, 120, 255, 0) 70%);
    pointer-events: none;
    z-index: -1;
  }

  .planet-shadow {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 20px -20px 90px 0px rgba(0, 0, 0, 0.8);
    z-index: 2;
  }

  .stars {
    position: absolute;
    width: 1px;
    height: 1px;
    background: white;
    z-index: -2;
    border-radius: 50%;
    box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.3);
  }

  /* Shine effect animation */
  @keyframes shine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  .house-shine {
    position: relative;
    overflow: hidden;
  }

  .planet-shine {
    position: relative;
    overflow: visible;
  }

  .planet-shine::after {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: linear-gradient(
      45deg, 
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0) 100%
    );
    border-radius: 50%;
    transform: rotate(-45deg);
    animation: shine 12s ease-in-out infinite;
    pointer-events: none;
    z-index: 3;
  }
`;

// Add specific night mode styles
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
  
  .vibrant-gradient {
    background: linear-gradient(120deg, #6366f1, #8b5cf6, #ec4899, #f43f5e);
    background-size: 300% 300%;
    animation: gradientShift 15s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .interactive-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .interactive-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 30px -10px rgba(2, 12, 27, 0.2);
  }
  
  .night-mode-text-glow {
    text-shadow: 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  .fancy-border-gradient {
    position: relative;
    z-index: 0;
  }
  
  .fancy-border-gradient::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: -2px;
    border-radius: inherit;
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
    background-size: 300% 300%;
    animation: animatedgradient 6s ease alternate infinite;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  .fancy-border-gradient:hover::before {
    opacity: 1;
  }
  
  @keyframes animatedgradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .night-mode-ambient-shadow {
    box-shadow: 0 4px 20px -2px rgba(25, 100, 230, 0.12), 
                0 0 10px -2px rgba(20, 70, 180, 0.1);
  }
  
  .night-mode-card {
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 
                0 0 30px rgba(20, 70, 180, 0.1),
                inset 0 0 0 1px rgba(120, 120, 180, 0.1);
  }
  
  @keyframes ambientGlow {
    0%, 100% { box-shadow: 0 0 25px rgba(25, 100, 230, 0.15); }
    50% { box-shadow: 0 0 30px rgba(25, 100, 230, 0.25); }
  }
  
  .night-mode-accent-glow {
    animation: ambientGlow 5s ease-in-out infinite;
  }
  
  .cyberpunk-text-shadow {
    text-shadow: 
      0 0 2px rgba(90, 120, 250, 0.7),
      0 0 10px rgba(100, 140, 250, 0.5),
      0 0 15px rgba(120, 170, 255, 0.3);
  }
  
  .cyberpunk-grid-overlay {
    background-image: 
      linear-gradient(rgba(70, 130, 220, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(70, 130, 220, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  
  .accessibility-focus:focus {
    outline: 3px solid rgba(99, 179, 237, 0.6);
    outline-offset: 3px;
  }
  
  .smooth-scroll {
    scroll-behavior: smooth;
  }
`;

const LandingPage = () => {
  const { nightMode, toggleNightMode } = useContext(NightModeContext);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Replace cube state with architectural visualization state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 5, y: 5 });
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  const lastMoveTime = useRef(Date.now());

  // Add useMemo for random elements to prevent re-renders
  const audioVisualizerBars = useMemo(() => {
    return Array(20).fill(null).map(() => {
      const randomHeight = 20 + Math.floor(Math.random() * 80);
      const randomDuration = 0.5 + Math.random() * 1.5;
      return { height: randomHeight, duration: randomDuration };
    });
  }, []);

  const spaceStars = useMemo(() => {
    return Array(100).fill(null).map(() => {
      return {
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3
      };
    });
  }, []);

  const mazeConfiguration = useMemo(() => {
    return [...Array(64)].map((_, i) => {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const isWall = Math.random() > 0.7;
      const isPulsing = Math.random() > 0.8;
      
      // Make sure the path is solvable (this is simplified)
      const isPath = (row === 0 && col < 3) || 
                    (row === 7 && col > 5) ||
                    (col === 0 && row < 3) ||
                    (col === 7 && row > 5) ||
                    (row === 3 && col >= 3 && col <= 7) ||
                    (row >= 3 && row <= 7 && col === 3);
      
      return { isWall, isPulsing, isPath, row, col };
    });
  }, []);

  const orbitingPlanets = useMemo(() => {
    return [...Array(3)].map((_, i) => {
      const size = 10 + i * 8;
      return { size, index: i };
    });
  }, []);

  // Add mouse interaction for architectural visualization rotation with smoothing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse move events
      const now = Date.now();
      if (now - lastMoveTime.current < 16) { // ~60fps
        return;
      }
      lastMoveTime.current = now;
      
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({ x, y });
      
      // Set target rotation (smoother than direct rotation)
      setTargetRotation({
        x: y * 10,
        y: x * 10
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop for smooth rotation transitions
  useEffect(() => {
    let animationFrameId: number;
    
    const smoothRotation = () => {
      setRotation(prevRotation => ({
        x: prevRotation.x + (targetRotation.x - prevRotation.x) * 0.1,
        y: prevRotation.y + (targetRotation.y - prevRotation.y) * 0.1
      }));
      
      animationFrameId = requestAnimationFrame(smoothRotation);
    };
    
    animationFrameId = requestAnimationFrame(smoothRotation);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetRotation]);

  // Add initial animation effect for the box
  useEffect(() => {
    // Start with a slight rotation to show depth, but keep front face visible
    setTimeout(() => {
      setRotation({ x: 5, y: 5 });
    }, 1000);
  }, []);

  // Inject styles into the document
  useEffect(() => {
    // Create style element for animations
    const styleEl = document.createElement('style');
    styleEl.textContent = animationStyles + (nightMode ? nightModeStyles : '');
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [nightMode]);
  
  // Sample project data
  const projects = [
    { 
      name: 'Portfolio Redesign',
      tags: ['UI/UX', 'React', 'Animation']
    },
    { 
      name: 'E-commerce Platform',
      tags: ['NextJS', 'Shopify', 'UI/UX']
    },
    { 
      name: 'Financial Dashboard',
      tags: ['Data Viz', 'React', 'API']
    },
    { 
      name: 'Mobile App Design',
      tags: ['Figma', 'UI/UX', 'Prototype']
    },
  ];

  // Effect for text animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTextVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Effect for tracking scroll position and mouse movement
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
      
      // Determine which section is active based on scroll position
      const heroRect = heroRef.current?.getBoundingClientRect();
      const aboutRect = aboutRef.current?.getBoundingClientRect();
      const workRect = workRef.current?.getBoundingClientRect();
      
      if (heroRect && heroRect.bottom > 0) {
        setActiveSection('hero');
      } else if (aboutRect && aboutRect.top < window.innerHeight / 2 && aboutRect.bottom > 0) {
        setActiveSection('about');
      } else if (workRect && workRect.top < window.innerHeight / 2) {
        setActiveSection('work');
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Function to check if element is in viewport
  const isInViewport = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
      rect.bottom >= 0
    );
  };
  
  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  };
  
  // Calculate parallax values
  const parallaxOffset = {
    x: mousePosition.x * 20 - 10,
    y: mousePosition.y * 20 - 10
  };
  
  // Replace duplicate array generation with useMemo
  const renderFloatingParticles = useMemo(() => {
    return Array(20).fill(null).map(() => {
      const randomHeight = 20 + Math.floor(Math.random() * 80);
      const randomDuration = 0.5 + Math.random() * 1.5;
      return { height: randomHeight, duration: randomDuration };
    });
  }, []);

  const renderMatrixEffect = useMemo(() => {
    return Array(100).fill(null).map(() => {
      return {
        width: Math.random() * 2 + 1,
        height: Math.random() * 20 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
      };
    });
  }, []);

  return (
    <div className={`${nightMode ? 'bg-[#050A15]' : 'bg-white'} min-h-screen transition-colors duration-500 content-container`}>
      <div className={`${nightMode ? 'text-white' : 'text-gray-800'} transition-colors duration-500`}>
        {/* Progress bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50">
          <div 
            className={`h-full ${nightMode ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500'}`}
            style={{ width: `${scrollProgress * 100}%`, transition: 'width 0.1s' }}
          ></div>
        </div>
      
        {/* Hero Section with enhanced animations */}
        <div 
          ref={heroRef}
          className={`relative ${nightMode ? 'bg-transparent' : 'bg-gradient-to-br from-indigo-50 via-rose-50 to-teal-50'} h-screen flex flex-col overflow-hidden transition-colors duration-500 ${!nightMode && 'border-b border-slate-200'}`}>
          {/* Cyberpunk grid overlay - only in night mode */}
          {nightMode && (
            <div className="absolute inset-0 cyberpunk-grid-overlay opacity-30 z-1"></div>
          )}
          
          {/* Add scan line effect in night mode */}
          {nightMode && (
            <div className="absolute inset-0 scan-line pointer-events-none z-1"></div>
          )}
          
          {/* Subtle animated background pattern - only in light mode */}
          {!nightMode && (
            <div className="absolute inset-0 z-1">
              <div className="absolute inset-0 bg-[#d1dce8] opacity-5"></div>
              <div className="absolute inset-0 vibrant-gradient opacity-5"></div>
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle at 25px 25px, #000 2%, transparent 0%), radial-gradient(circle at 75px 75px, #000 2%, transparent 0%)',
                backgroundSize: '100px 100px',
                opacity: 0.02
              }}></div>
            </div>
          )}
          
          {/* Data flow background in night mode */}
          {nightMode && (
            <div className="absolute inset-0 data-flow opacity-20 pointer-events-none z-1"></div>
          )}
          
          {/* Floating particles - in both modes */}
          <div className="absolute inset-0 pointer-events-none z-1">
            {renderFloatingParticles.map((_, index) => (
              <div
                key={index}
                className={`absolute w-1 h-1 rounded-full animate-twinkle ${
                  nightMode 
                    ? index % 3 === 0 ? 'bg-blue-400' : index % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
                    : index % 3 === 0 ? 'bg-indigo-400' : index % 3 === 1 ? 'bg-rose-400' : 'bg-amber-400'
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
          
          <div className="max-w-7xl mx-auto w-full px-8 sm:px-12 relative z-10">
            {/* Header with hover effects */}
            <div className="pt-6 flex justify-between items-center">
              <p className={`${nightMode ? 'text-white night-mode-text-glow' : 'text-black'} font-light animate-fadeIn relative after:absolute after:w-0 after:h-0.5 after:bg-current after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 transition-colors duration-500 fancy-border-gradient px-3 py-1 rounded-full`} style={{ animationDelay: '200ms' }}>@rivaldydendy</p>
              <div className="hidden sm:flex items-center space-x-8">
                <a
                  href="#about"
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                  className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} ${activeSection === 'about' ? 'font-medium' : ''} relative after:absolute after:w-0 after:h-0.5 after:bg-current after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 animate-fadeIn transition-colors duration-500 accessibility-focus`} style={{ animationDelay: '300ms' }}
                >About</a>
                <a
                  href="#work"
                  onClick={(e) => { e.preventDefault(); scrollToSection('work'); }}
                  className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} ${activeSection === 'work' ? 'font-medium' : ''} relative after:absolute after:w-0 after:h-0.5 after:bg-current after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 animate-fadeIn transition-colors duration-500 accessibility-focus`} style={{ animationDelay: '400ms' }}
                >Work</a>
                <a href="/contact" className={`${nightMode ? 'text-white night-mode-text-glow animate-glitch' : 'text-black'} relative after:absolute after:w-0 after:h-0.5 after:bg-current after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 animate-fadeIn transition-colors duration-500 accessibility-focus`} style={{ animationDelay: '500ms' }}>Contact</a>
                
                {/* Night mode toggle with enhanced visual */}
                <button 
                  onClick={toggleNightMode} 
                  className={`flex items-center justify-center rounded-full p-2 transition-all duration-500 ${
                    nightMode 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-gradient-to-r from-amber-200 to-yellow-400 text-gray-700 shadow-lg shadow-amber-200/20'
                  } animate-fadeIn hover:shadow-xl accessibility-focus`}
                  style={{ animationDelay: '700ms' }}
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
              </div>
            </div>
          </div>

          {/* Main hero content */}
          <div className="flex-grow flex flex-col items-center justify-center relative z-10">
            {/* Profile image with parallax effect */}
            <div className="w-full max-w-6xl mx-auto px-4">
              <div className="w-full relative animate-scaleIn flex justify-center items-center" style={{ animationDelay: '600ms' }}>
                <div 
                  className={`absolute rounded-full ${nightMode ? 'bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10' : 'bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-teal-500/10'} blur-3xl w-[130%] h-[130%] -z-10 animate-pulse`} 
                  style={{ 
                    animationDuration: '5s',
                    transform: `translate(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px)`
                  }}
                ></div>
                <div className="relative w-full h-[450px] md:h-[600px] lg:h-[700px] mx-auto perspective-1000 overflow-visible">
                  {/* 3D Cube Structure Container */}
                  <div 
                    className="absolute inset-0 transform-gpu cube-structure-container"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Placeholder for architectural visualization */}
                  </div>

                  {/* Replace placeholder with actual architectural visualization */}
                  <div 
                    className="absolute inset-0 transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      transition: 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* 3D Planet Visualization - Replacing with 3D Box */}
                    <div 
                      className="absolute top-1/2 left-1/2 transform-gpu hover:scale-105"
                      style={{
                        width: '300px',
                        height: '300px',
                        transformStyle: 'preserve-3d',
                        transform: `translate(-50%, -50%)`,
                        transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                      onMouseEnter={() => setHoverElement('box')}
                      onMouseLeave={() => setHoverElement(null)}
                    >
                      {/* 3D Box Container with separate rotation */}
                      <div 
                        className="transform-gpu"
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          transformStyle: 'preserve-3d',
                          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                          transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          willChange: 'transform',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        {/* Parallax Gradient Layers - Fixed to avoid glitches */}
                        <div 
                          className="absolute inset-0 rounded-md opacity-50 transform-gpu"
                          style={{
                            background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.7) 0%, rgba(99, 102, 241, 0.4) 50%, rgba(16, 185, 129, 0.3) 100%)',
                            transform: `translateZ(10px) rotateX(${-rotation.x * 0.2}deg) rotateY(${-rotation.y * 0.2}deg)`,
                            filter: 'blur(8px)',
                            willChange: 'transform',
                            pointerEvents: 'none'
                          }}
                        ></div>
                        <div 
                          className="absolute inset-0 rounded-md opacity-40 transform-gpu"
                          style={{
                            background: 'conic-gradient(from 0deg at 50% 50%, #8b5cf6 0%, #ec4899 25%, #0ea5e9 50%, #10b981 75%, #8b5cf6 100%)',
                            transform: `translateZ(30px) rotateX(${-rotation.x * 0.3}deg) rotateY(${-rotation.y * 0.3}deg)`,
                            filter: 'blur(5px)',
                            willChange: 'transform',
                            pointerEvents: 'none'
                          }}
                        ></div>

                        {/* 3D Box Structure */}
                        {/* Front face - Spinning Fan Animation */}
                        <div 
                          className={`absolute w-full h-full transform-gpu ${nightMode ? 'bg-blue-900/40' : 'bg-indigo-100/80'} rounded-md border ${nightMode ? 'border-blue-600/40' : 'border-indigo-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateZ(150px)',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.2)' 
                              : '0 0 20px rgba(99, 102, 241, 0.1), inset 0 0 15px rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9,
                            backfaceVisibility: 'hidden',
                            willChange: 'transform, opacity'
                          }}
                        >
                          <div className="flex items-center justify-center h-full p-8">
                            <div className="relative w-48 h-48 transform-gpu">
                              {/* Fan center */}
                              <div className="absolute top-1/2 left-1/2 w-12 h-12 -mt-6 -ml-6 rounded-full bg-indigo-600/90 transform-gpu"></div>
                              {/* Fan blades */}
                              {[...Array(4)].map((_, i) => (
                                <div 
                                  key={i}
                                  className={`absolute top-1/2 left-1/2 w-40 h-6 -mt-3 -ml-3 transform-gpu bg-gradient-to-r ${nightMode ? 'from-blue-500 to-indigo-600' : 'from-indigo-400 to-blue-500'} rounded-md`}
                                  style={{ 
                                    transformOrigin: '12px 50%',
                                    transform: `rotate(${i * 90}deg)`,
                                    animation: 'spin 3s infinite linear',
                                    willChange: 'transform'
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Back face - Pulsing Circles */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-blue-900/40' : 'bg-indigo-100/80'} rounded-md border ${nightMode ? 'border-blue-600/40' : 'border-indigo-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateZ(-150px) rotateY(180deg)',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.2)' 
                              : '0 0 20px rgba(99, 102, 241, 0.1), inset 0 0 15px rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9,
                            overflow: 'hidden'
                          }}
                        >
                          <div className="flex items-center justify-center h-full p-8 relative">
                            {/* Pulsing circles */}
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`absolute rounded-full ${nightMode ? 'bg-blue-400/30' : 'bg-indigo-400/30'}`}
                                style={{
                                  width: `${(i + 1) * 40}px`,
                                  height: `${(i + 1) * 40}px`,
                                  animation: `pulse ${2 + i * 0.5}s infinite ease-in-out ${i * 0.2}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Left face - Clock Animation */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-purple-900/40' : 'bg-purple-100/80'} rounded-md border ${nightMode ? 'border-purple-600/40' : 'border-purple-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateX(-150px) rotateY(-90deg)',
                            transformOrigin: 'left center',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(124, 58, 237, 0.3), inset 0 0 15px rgba(124, 58, 237, 0.2)' 
                              : '0 0 20px rgba(124, 58, 237, 0.1), inset 0 0 15px rgba(124, 58, 237, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9
                          }}
                        >
                          <div className="flex items-center justify-center h-full p-8">
                            <div className={`relative w-40 h-40 rounded-full border-4 ${nightMode ? 'border-purple-400' : 'border-purple-500'}`}>
                              {/* Clock tick marks */}
                              {[...Array(12)].map((_, i) => (
                                <div 
                                  key={i}
                                  className={`absolute w-1 h-3 ${nightMode ? 'bg-purple-300' : 'bg-purple-600'}`}
                                  style={{ 
                                    top: '0px',
                                    left: '50%',
                                    transformOrigin: 'bottom center',
                                    transform: `translateX(-50%) rotate(${i * 30}deg) translateY(0px)`
                                  }}
                                ></div>
                              ))}
                              
                              {/* Hour hand */}
                              <div 
                                className={`absolute top-1/2 left-1/2 w-1 h-16 -ml-0.5 -mt-16 ${nightMode ? 'bg-purple-200' : 'bg-purple-700'} rounded-full`}
                                style={{ 
                                  transformOrigin: 'bottom center',
                                  animation: 'clockHour 43200s linear infinite'
                                }}
                              ></div>
                              
                              {/* Minute hand */}
                              <div 
                                className={`absolute top-1/2 left-1/2 w-0.5 h-20 -ml-0.25 -mt-20 ${nightMode ? 'bg-purple-300' : 'bg-purple-600'} rounded-full`}
                                style={{ 
                                  transformOrigin: 'bottom center',
                                  animation: 'clockMinute 3600s linear infinite'
                                }}
                              ></div>
                              
                              {/* Second hand */}
                              <div 
                                className={`absolute top-1/2 left-1/2 w-0.5 h-20 -ml-0.25 -mt-20 ${nightMode ? 'bg-pink-300' : 'bg-pink-500'} rounded-full`}
                                style={{ 
                                  transformOrigin: 'bottom center',
                                  animation: 'clockSecond 60s linear infinite steps(60)'
                                }}
                              ></div>
                              
                              {/* Center dot */}
                              <div className={`absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 ${nightMode ? 'bg-pink-300' : 'bg-pink-500'} rounded-full`}></div>
                            </div>
                          </div>
                        </div>

                        {/* Right face */}
                        <div 
                          className={`absolute w-full h-full transform-gpu ${nightMode ? 'bg-blue-900/40' : 'bg-indigo-100/80'} rounded-md border ${nightMode ? 'border-blue-600/40' : 'border-indigo-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateX(150px) rotateY(90deg)',
                            transformOrigin: 'right center',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.2)' 
                              : '0 0 20px rgba(99, 102, 241, 0.1), inset 0 0 15px rgba(99, 102, 241, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9,
                            overflow: 'hidden',
                            background: nightMode 
                              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
                              : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
                          }}
                        >
                          <div className="relative w-full h-full flex flex-col justify-center items-center p-6">
                            <div 
                              className={`text-4xl font-bold mb-2 ${nightMode ? 'text-blue-400' : 'text-indigo-600'}`}
                              style={{
                                textShadow: nightMode 
                                  ? '0 0 10px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.6), 0 0 30px rgba(96, 165, 250, 0.4)'
                                  : '0 0 10px rgba(99, 102, 241, 0.6), 0 0 20px rgba(99, 102, 241, 0.4)',
                                animation: 'neonPulse 2s infinite alternate'
                              }}
                            >
                              DESIGN
                            </div>
                            
                            <div 
                              className={`w-16 h-0.5 my-3 ${nightMode ? 'bg-blue-500' : 'bg-indigo-500'}`}
                              style={{
                                boxShadow: nightMode 
                                  ? '0 0 10px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.4)'
                                  : '0 0 10px rgba(99, 102, 241, 0.6)',
                                animation: 'neonPulse 3s infinite alternate'
                              }}
                            />
                            
                            <div 
                              className={`text-2xl font-light ${nightMode ? 'text-blue-300' : 'text-indigo-500'}`}
                              style={{
                                textShadow: nightMode 
                                  ? '0 0 8px rgba(96, 165, 250, 0.6), 0 0 15px rgba(96, 165, 250, 0.4)'
                                  : '0 0 8px rgba(99, 102, 241, 0.4)',
                                animation: 'neonPulse 2.5s infinite alternate'
                              }}
                            >
                              CREATE
                            </div>
                          </div>
                        </div>

                        {/* Top face - Loading Bars */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-pink-900/40' : 'bg-pink-100/80'} rounded-md border ${nightMode ? 'border-pink-600/40' : 'border-pink-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateY(-150px) rotateX(90deg)',
                            transformOrigin: 'center top',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(219, 39, 119, 0.3), inset 0 0 15px rgba(219, 39, 119, 0.2)' 
                              : '0 0 20px rgba(219, 39, 119, 0.1), inset 0 0 15px rgba(219, 39, 119, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
                            {/* Loading bars */}
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-full h-4 bg-pink-200/30 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${nightMode ? 'bg-pink-400' : 'bg-pink-500'} rounded-full`}
                                  style={{ 
                                    width: '100%',
                                    animation: `loadingBar ${4 + i}s infinite ease-in-out ${i * 0.5}s`,
                                    transformOrigin: 'left center'
                                  }}
                                ></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom face - Matrix Effect */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-pink-900/40' : 'bg-pink-100/80'} rounded-md border ${nightMode ? 'border-pink-600/40' : 'border-pink-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateY(150px) rotateX(-90deg)',
                            transformOrigin: 'center bottom',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(219, 39, 119, 0.3), inset 0 0 15px rgba(219, 39, 119, 0.2)' 
                              : '0 0 20px rgba(219, 39, 119, 0.1), inset 0 0 15px rgba(219, 39, 119, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9
                          }}
                        >
                          <div className="grid grid-cols-10 grid-rows-10 h-full">
                            {renderMatrixEffect.map((_, i) => (
                              <div 
                                key={i}
                                className={`flex items-center justify-center ${nightMode ? 'text-pink-300' : 'text-pink-600'} font-mono text-xs`}
                                style={{ 
                                  opacity: Math.random() > 0.7 ? 0.8 : 0.3,
                                  animation: `matrixFlicker ${Math.random() * 4 + 1}s infinite alternate ${Math.random() * 2}s`
                                }}
                              >
                                {Math.random() > 0.5 ? '1' : '0'}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Left face - Audio Equalizer */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-purple-900/40' : 'bg-purple-100/80'} rounded-md border ${nightMode ? 'border-purple-600/40' : 'border-purple-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateX(-150px) rotateY(-90deg)',
                            transformOrigin: 'left center',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(124, 58, 237, 0.3), inset 0 0 15px rgba(124, 58, 237, 0.2)' 
                              : '0 0 20px rgba(124, 58, 237, 0.1), inset 0 0 15px rgba(124, 58, 237, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9
                          }}
                        >
                          <div className="flex items-center justify-center h-full">
                            <div className="flex items-end gap-1 h-3/4 w-3/4">
                              {/* Audio visualizer bars */}
                              {audioVisualizerBars.map((bar, index) => (
                                <div 
                                  key={index}
                                  className={`w-2 rounded-t-lg ${nightMode ? 'bg-gradient-to-t from-purple-700 to-pink-400' : 'bg-gradient-to-t from-purple-500 to-pink-300'}`}
                                  style={{
                                    height: `${bar.height}%`,
                                    animation: `equalizer ${bar.duration}s ease-in-out infinite alternate ${index * 0.1}s`,
                                    transformOrigin: 'bottom'
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right face - Space Scene with Planets */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-purple-900/40' : 'bg-purple-100/80'} rounded-md border ${nightMode ? 'border-purple-600/40' : 'border-purple-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateX(150px) rotateY(90deg)',
                            transformOrigin: 'right center',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(124, 58, 237, 0.3), inset 0 0 15px rgba(124, 58, 237, 0.2)' 
                              : '0 0 20px rgba(124, 58, 237, 0.1), inset 0 0 15px rgba(124, 58, 237, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9,
                            overflow: 'hidden',
                            background: nightMode 
                              ? 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)' 
                              : 'linear-gradient(to bottom, #e0c3fc, #8ec5fc, #c3cfe2)'
                          }}
                        >
                          <div className="relative w-full h-full">
                            {/* Stars */}
                            {spaceStars.map((star, index) => (
                              <div
                                key={index}
                                className="absolute rounded-full bg-white"
                                style={{
                                  width: `${star.width}px`,
                                  height: `${star.height}px`,
                                  top: `${star.top}%`,
                                  left: `${star.left}%`,
                                  opacity: star.opacity,
                                  animation: `twinkle-bright ${star.duration}s ease-in-out infinite ${star.delay}s`
                                }}
                              ></div>
                            ))}
                            
                            {/* Sun/Large Planet */}
                            <div 
                              className="absolute rounded-full"
                              style={{
                                width: '80px',
                                height: '80px',
                                bottom: '30px',
                                right: '40px',
                                background: nightMode 
                                  ? 'radial-gradient(circle at 30% 30%, #f59e0b, #b45309)' 
                                  : 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706)',
                                boxShadow: nightMode 
                                  ? '0 0 40px rgba(245, 158, 11, 0.6)' 
                                  : '0 0 60px rgba(251, 191, 36, 0.8)',
                                animation: 'pulse-slow 4s ease-in-out infinite'
                              }}
                            ></div>
                            
                            {/* Orbiting Planets */}
                            {orbitingPlanets.map((planet, index) => {
                              const colors = [
                                ['from-blue-500 to-cyan-300', 'from-blue-600 to-cyan-400'],
                                ['from-emerald-500 to-teal-300', 'from-emerald-600 to-teal-400'],
                                ['from-rose-500 to-pink-300', 'from-rose-600 to-pink-400']
                              ];
                              return (
                                <div
                                  key={index}
                                  className={`absolute rounded-full bg-gradient-to-br ${nightMode ? colors[index][1] : colors[index][0]}`}
                                  style={{
                                    width: `${planet.size}px`,
                                    height: `${planet.size}px`,
                                    animation: `orbit-3d-dramatic ${10 + index * 5}s linear infinite ${index * 2}s`
                                  }}
                                ></div>
                              );
                            })}
                            
                            {/* Shooting Star */}
                            <div
                              className="absolute bg-white"
                              style={{
                                width: '2px',
                                height: '40px',
                                transformOrigin: 'center',
                                transform: 'rotate(-45deg)',
                                filter: 'blur(1px)',
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                                animation: 'shootingStar 6s linear infinite 2s'
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Bottom face - Interactive Game */}
                        <div 
                          className={`absolute w-full h-full ${nightMode ? 'bg-pink-900/40' : 'bg-pink-100/80'} rounded-md border ${nightMode ? 'border-pink-600/40' : 'border-pink-300/50'} backdrop-blur-sm`}
                          style={{
                            transform: 'translateY(150px) rotateX(-90deg)',
                            transformOrigin: 'center bottom',
                            boxShadow: nightMode 
                              ? '0 0 20px rgba(219, 39, 119, 0.3), inset 0 0 15px rgba(219, 39, 119, 0.2)' 
                              : '0 0 20px rgba(219, 39, 119, 0.1), inset 0 0 15px rgba(219, 39, 119, 0.1)',
                            transition: 'all 0.3s ease',
                            opacity: hoverElement === 'box' ? 1 : 0.9
                          }}
                        >
                          <div className="relative w-full h-full p-8">
                            {/* Maze Game */}
                            <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                              {/* Generate maze pattern */}
                              {mazeConfiguration.map((cell, index) => (
                                <div
                                  key={index}
                                  className={`rounded-sm ${cell.isPath ? (nightMode ? 'bg-pink-300/80' : 'bg-pink-200/80') : cell.isWall ? (nightMode ? 'bg-pink-800/60' : 'bg-pink-500/50') : (nightMode ? 'bg-pink-600/40' : 'bg-pink-300/40')}`}
                                  style={{
                                    animation: cell.isPulsing ? 'pulse 1.5s ease-in-out infinite' : 'none'
                                  }}
                                >
                                  {/* Player dot appears near start */}
                                  {cell.row === 0 && cell.col === 0 && (
                                    <div 
                                      className="w-3 h-3 rounded-full bg-white shadow-lg"
                                      style={{
                                        position: 'absolute',
                                        animation: 'mazePlayer 15s ease-in-out infinite',
                                        boxShadow: '0 0 10px white'
                                      }}
                                    ></div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Goal marker */}
                            <div 
                              className={`absolute bottom-10 right-10 w-5 h-5 rounded-full ${nightMode ? 'bg-yellow-300' : 'bg-yellow-400'}`}
                              style={{
                                boxShadow: '0 0 15px rgba(250, 204, 21, 0.7)',
                                animation: 'pulse 2s ease-in-out infinite'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom heading positioned absolutely for better placement - matching reference */}
          <div className="absolute bottom-12 left-0 w-full px-8 overflow-hidden z-10">
            <div className="flex items-center justify-between">
              <h1 
                className={`
                  text-7xl md:text-8xl xl:text-9xl 
                  font-extralight ${nightMode ? 'text-[#ffffff]' : 'text-[#121212]'}
                  leading-none tracking-wide
                  transform transition-all duration-1000 ease-out
                  ${isTextVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
                  font-sans ${nightMode ? 'cyberpunk-text-shadow' : ''}
                `}
                style={{ 
                  textShadow: nightMode ? '0 4px 12px rgba(0, 10, 30, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transform: isTextVisible ? `translateY(0) translateX(${parallaxOffset.x * -3}px)` : 'translateY(100%)'
                }}
              >
                <span className="inline-block animate-fadeInRight animate-float" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>flow</span>
                <span className="inline-block animate-fadeInRight" style={{ animationDelay: '400ms', animationFillMode: 'both' }}> Developer</span>
                <span className="inline-block animate-fadeInRight" style={{ animationDelay: '800ms', animationFillMode: 'both' }}> —</span>
                <span className="inline-block animate-fadeInRight" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}> UI/UX</span>
              </h1>
              
              {/* Greeting button positioned beside the heading */}
              <button 
                className={`h-16 w-16 md:h-20 md:w-20 transition-all duration-300 ease-out ${
                  nightMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700 neon-pulse' : 'bg-gradient-to-r from-rose-500 to-amber-500'
                } rounded-full flex items-center justify-center overflow-hidden shadow-xl hover:shadow-2xl btn-modern z-[50] ${
                  isHovered ? 'md:w-[190px] w-[170px] px-6' : ''
                } animate-fadeInRight accessibility-focus`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                  animationDelay: '1600ms', 
                  animationFillMode: 'both',
                  transform: `translateX(${parallaxOffset.x * 10}px)`
                }}
              >
                <span className="text-xl flex items-center transition-all duration-300">
                  <span className={`inline-block text-2xl transition-all duration-300 ${isHovered ? 'animate-wave' : 'animate-float'}`}>👋</span>
                  <span className={`text-white font-medium ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isHovered ? 'max-w-[120px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-4'
                  } ${nightMode ? 'text-blue-300 cyberpunk-text-shadow' : 'text-blue-600'}`}>
                    I'm Dendi
                  </span>
                </span>
                <div className={`absolute inset-0 opacity-20 animate-shimmer pointer-events-none ${isHovered ? 'opacity-50' : 'opacity-20'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* About Section with cyberpunk enhancements */}
        <div 
          id="about" 
          ref={aboutRef} 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden ${nightMode ? 'text-white' : ''} transition-colors duration-500`}
        >
          {nightMode && (
            <>
              <div className="absolute inset-0 night-mode-card rounded-xl opacity-40 pointer-events-none bg-[rgba(20,30,51,0.5)]"></div>
              <div className="absolute inset-0 cyberpunk-grid-overlay opacity-10 pointer-events-none"></div>
              <div className="absolute inset-0 scan-line pointer-events-none"></div>
            </>
          )}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 relative ${nightMode ? 'p-4 border-l-2 border-blue-400/30 border-flash' : ''}`}>
            <div className="transform transition-all duration-700 ease-out" style={{ 
              transform: isInViewport(aboutRef) ? 'translateY(0)' : 'translateY(50px)',
              opacity: isInViewport(aboutRef) ? 1 : 0,
            }}>
              <h2 className={`text-3xl font-medium ${nightMode ? 'text-white cyberpunk-text-shadow' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500'} relative transition-colors duration-500`}>
                About
                <div className={`absolute -bottom-3 left-0 w-16 h-1 ${nightMode ? 'bg-gradient-to-r from-blue-400 to-blue-600 neon-pulse' : 'bg-gradient-to-r from-indigo-500 to-rose-500'} transform scale-x-0 origin-left transition-transform duration-500`} style={{ 
                  transform: isInViewport(aboutRef) ? 'scaleX(1)' : 'scaleX(0)',
                  transitionDelay: '300ms'
                }}></div>
              </h2>
            </div>
            <div className={`md:col-span-2 transform transition-all duration-700 ease-out ${nightMode ? 'border-b border-blue-400/20 pb-8' : ''}`} style={{ 
              transform: isInViewport(aboutRef) ? 'translateY(0)' : 'translateY(50px)',
              opacity: isInViewport(aboutRef) ? 1 : 0,
              transitionDelay: '200ms'
            }}>
              <p className={`${nightMode ? 'text-gray-300 night-mode-text-glow leading-7' : 'text-gray-700 leading-relaxed'} transition-colors duration-500 text-lg mb-8`}>
                I'm Dendi Rivaldi, a passionate UI/UX designer and frontend developer with a keen eye for creating beautiful, functional digital experiences. My approach merges creativity with practical solutions, resulting in designs that not only look impressive but also deliver exceptional user experiences.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
                <div className={`rounded-xl p-6 transition-all duration-500 interactive-card ${
                  nightMode 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20' 
                    : 'bg-white shadow-xl shadow-indigo-100/30'
                }`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
                    nightMode ? 'bg-blue-500/20' : 'bg-indigo-50'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${nightMode ? 'text-blue-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${nightMode ? 'text-white' : 'text-gray-800'}`}>Design</h3>
                  <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>Creating visually stunning and intuitive user interfaces</p>
                </div>
                <div className={`rounded-xl p-6 transition-all duration-500 interactive-card ${
                  nightMode 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20' 
                    : 'bg-white shadow-xl shadow-indigo-100/30'
                }`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
                    nightMode ? 'bg-blue-500/20' : 'bg-indigo-50'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${nightMode ? 'text-blue-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${nightMode ? 'text-white' : 'text-gray-800'}`}>Development</h3>
                  <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>Building responsive and performant web applications</p>
                </div>
                <div className={`rounded-xl p-6 transition-all duration-500 interactive-card ${
                  nightMode 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20' 
                    : 'bg-white shadow-xl shadow-indigo-100/30'
                }`}>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
                    nightMode ? 'bg-blue-500/20' : 'bg-indigo-50'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${nightMode ? 'text-blue-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-medium mb-2 ${nightMode ? 'text-white' : 'text-gray-800'}`}>Innovation</h3>
                  <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'}`}>Pushing boundaries with creative solutions and new technologies</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Work Section with enhanced animations */}
        <div 
          id="work" 
          ref={workRef} 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative ${nightMode ? 'text-white' : ''} transition-colors duration-500`}
        >
          {nightMode && (
            <>
              <div className="absolute inset-0 night-mode-card rounded-xl opacity-40 pointer-events-none bg-[rgba(20,30,51,0.5)]"></div>
              <div className="absolute inset-0 cyberpunk-grid-overlay opacity-10 pointer-events-none"></div>
              <div className="absolute inset-0 scan-line pointer-events-none"></div>
            </>
          )}
          <div className="transform transition-all duration-700 ease-out relative mb-16" style={{ 
            transform: isInViewport(workRef) ? 'translateY(0)' : 'translateY(30px)',
            opacity: isInViewport(workRef) ? 1 : 0,
          }}>
            <h2 className={`text-3xl font-medium ${nightMode ? 'text-white cyberpunk-text-shadow' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500'} relative inline-block transition-colors duration-500`}>
              Recent Work
              <div className={`absolute -bottom-3 left-0 w-16 h-1 ${nightMode ? 'bg-gradient-to-r from-blue-400 to-blue-600 neon-pulse' : 'bg-gradient-to-r from-indigo-500 to-rose-500'} transform scale-x-0 origin-left transition-transform duration-500`} style={{ 
                transform: isInViewport(workRef) ? 'scaleX(1)' : 'scaleX(0)',
                transitionDelay: '300ms'
              }}></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className={`transform transition-all duration-500 ease-out ${
                  nightMode 
                    ? 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/10' 
                    : 'bg-white'
                } rounded-xl p-8 interactive-card group overflow-hidden relative shadow-lg ${
                  nightMode ? 'shadow-blue-900/5' : 'shadow-indigo-100/30'
                }`}
                style={{ 
                  transform: isInViewport(workRef) ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isInViewport(workRef) ? 1 : 0.5,
                  transitionDelay: `${200 + index * 100}ms`
                }}
              >
                {/* Background gradient that appears on hover */}
                <div className={`absolute inset-0 ${
                  nightMode 
                    ? 'bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10' 
                    : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className={`text-2xl font-medium ${
                      nightMode 
                        ? 'text-white group-hover:text-blue-300 cyberpunk-text-shadow' 
                        : 'text-gray-800 group-hover:text-indigo-600'
                      } transition-colors duration-300`}>
                      {project.name}
                    </h3>
                    <button className={`h-10 w-10 rounded-full ${
                      nightMode 
                        ? 'bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30' 
                        : 'bg-indigo-50 hover:bg-indigo-500 hover:text-white'
                      } flex items-center justify-center transition-all duration-300 group-hover:scale-110 transform`}>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className={`px-3 py-1 rounded-full text-sm ${
                          nightMode 
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-700/30' 
                            : 'bg-indigo-50 text-indigo-600'
                        } transition-all duration-300`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <p className={`${nightMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Innovative design solutions with a focus on user experience and modern aesthetics.
                  </p>
                  
                  <div className={`w-full h-40 rounded-lg mb-4 overflow-hidden ${
                    nightMode ? 'bg-blue-900/20' : 'bg-gray-100'
                  }`}>
                    <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" 
                      style={{ 
                        backgroundImage: index === 0 
                          ? 'url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)' // Code editor
                          : index === 1
                          ? 'url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)' // UI/UX design
                          : index === 2
                          ? 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)' // Data visualization
                          : 'url(https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)' // Mobile app design
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center transform transition-all duration-700 ease-out" style={{ 
            transform: isInViewport(workRef) ? 'translateY(0)' : 'translateY(30px)',
            opacity: isInViewport(workRef) ? 1 : 0,
            transitionDelay: '600ms'
          }}>
            <a 
              href="#portfolio" 
              className={`inline-block px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                nightMode 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-500/20'
              } fancy-border-gradient`}
            >
              View All Projects
            </a>
          </div>
        </div>

        {/* Add Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage; 