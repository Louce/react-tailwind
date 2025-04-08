import React, { useRef, useEffect } from 'react';

interface Building {
  x: number;
  width: number;
  height: number;
  windows: { x: number; y: number; width: number; height: number; color: string; lit: boolean }[];
  neonLine?: { color: string; height: number; pulse: number; pulseSpeed: number };
}

interface FlyingVehicle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  tailLength: number;
  tailOpacity: number;
  blinkRate: number;
  blinkState: boolean;
  blinkCounter: number;
}

interface Hologram {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  opacityDirection: number;
  type: 'circle' | 'square' | 'triangle' | 'data';
  dataPoints?: number[][];
  rotation: number;
  rotationSpeed: number;
}

const CyberpunkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // City generation parameters
  const buildingRefs = useRef<Building[]>([]);
  const vehicleRefs = useRef<FlyingVehicle[]>([]);
  const hologramRefs = useRef<Hologram[]>([]);
  const neonColorsRefs = useRef(['#ff00ff', '#00ffff', '#ff3377', '#33ffaa', '#3377ff']);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate city when resizing
      generateCity();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Generate the initial cityscape
    generateCity();
    
    // Animation frame
    let animationFrameId: number;
    let lastTime = 0;
    
    const render = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Clear canvas with a dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000716');
      gradient.addColorStop(1, '#001133');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some stars
      drawStars(ctx, canvas.width, canvas.height, time);
      
      // Draw distant city silhouette
      drawDistantCity(ctx, canvas.width, canvas.height);
      
      // Draw main buildings
      drawBuildings(ctx, canvas.height, deltaTime);
      
      // Draw fog/mist effect
      drawFog(ctx, canvas.width, canvas.height, time);
      
      // Draw flying vehicles
      updateAndDrawVehicles(ctx, canvas.width, canvas.height, deltaTime);
      
      // Draw holographic projections
      updateAndDrawHolograms(ctx, deltaTime);
      
      // Overlay a subtle scanlines effect
      drawScanlines(ctx, canvas.width, canvas.height);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  // Generate a cyberpunk city skyline
  const generateCity = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const canvasHeight = canvas.height;
    
    // Generate buildings
    const buildings: Building[] = [];
    let x = 0;
    
    while (x < width) {
      const buildingWidth = Math.random() * 100 + 50;
      const buildingHeight = Math.random() * (canvasHeight * 0.6) + canvasHeight * 0.2;
      
      // Windows for this building
      const windows = [];
      const windowWidth = 5;
      const windowHeight = 10;
      const windowsPerRow = Math.floor(buildingWidth / (windowWidth * 2));
      const windowRows = Math.floor(buildingHeight / (windowHeight * 2));
      
      for (let wx = 0; wx < windowsPerRow; wx++) {
        for (let wy = 0; wy < windowRows; wy++) {
          // Some windows are lit, some are not
          if (Math.random() > 0.4) {
            windows.push({
              x: wx * windowWidth * 2 + windowWidth / 2,
              y: wy * windowHeight * 2 + windowHeight / 2,
              width: windowWidth,
              height: windowHeight,
              color: Math.random() > 0.8 
                ? neonColorsRefs.current[Math.floor(Math.random() * neonColorsRefs.current.length)] 
                : '#ffcc88',
              lit: Math.random() > 0.3
            });
          }
        }
      }
      
      // Some buildings have neon outlines
      const hasNeonLine = Math.random() > 0.7;
      let neonLine;
      
      if (hasNeonLine) {
        neonLine = {
          color: neonColorsRefs.current[Math.floor(Math.random() * neonColorsRefs.current.length)],
          height: Math.random() * buildingHeight * 0.8,
          pulse: Math.random(),
          pulseSpeed: Math.random() * 0.005 + 0.001
        };
      }
      
      buildings.push({
        x,
        width: buildingWidth,
        height: buildingHeight,
        windows,
        neonLine
      });
      
      x += buildingWidth;
    }
    
    buildingRefs.current = buildings;
    
    // Generate flying vehicles
    const vehicles: FlyingVehicle[] = [];
    for (let i = 0; i < 15; i++) {
      vehicles.push({
        x: Math.random() * width,
        y: Math.random() * canvasHeight * 0.7 + canvasHeight * 0.1,
        size: Math.random() * 5 + 3,
        speed: (Math.random() * 50 + 20) * (Math.random() > 0.5 ? 1 : -1),
        color: neonColorsRefs.current[Math.floor(Math.random() * neonColorsRefs.current.length)],
        tailLength: Math.random() * 30 + 20,
        tailOpacity: Math.random() * 0.5 + 0.3,
        blinkRate: Math.random() * 40 + 10,
        blinkState: true,
        blinkCounter: 0
      });
    }
    
    vehicleRefs.current = vehicles;
    
    // Generate holographic projections
    const holograms: Hologram[] = [];
    for (let i = 0; i < 6; i++) {
      const isDataHologram = Math.random() > 0.5;
      
      let dataPoints;
      if (isDataHologram) {
        dataPoints = [];
        const pointCount = Math.floor(Math.random() * 20) + 10;
        for (let j = 0; j < pointCount; j++) {
          dataPoints.push([
            Math.random() * 2 - 1, // x between -1 and 1
            Math.random() * 2 - 1, // y between -1 and 1
            Math.random() // value for animation
          ]);
        }
      }
      
      holograms.push({
        x: Math.random() * width,
        y: canvasHeight - Math.random() * canvasHeight * 0.5 - 50,
        size: Math.random() * 60 + 40,
        color: neonColorsRefs.current[Math.floor(Math.random() * neonColorsRefs.current.length)],
        opacity: Math.random() * 0.3 + 0.1,
        opacityDirection: Math.random() > 0.5 ? 0.001 : -0.001,
        type: isDataHologram 
          ? 'data' 
          : ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as any,
        dataPoints,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
      });
    }
    
    hologramRefs.current = holograms;
  };
  
  // Draw stars with subtle twinkling
  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    // Use time to create twinkling effect
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
      const x = i * width / starCount;
      const y = (Math.sin(i * 0.1) + 1) * height * 0.4;
      const size = Math.sin(time * 0.001 + i * 0.1) * 0.5 + 0.5;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${size * 0.7})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  
  // Draw distant city silhouette
  const drawDistantCity = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#001a33';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    
    // Create jagged skyline pattern
    for (let x = 0; x < width; x += 20) {
      const buildingHeight = Math.sin(x * 0.01) * height * 0.1 + Math.random() * height * 0.1;
      ctx.lineTo(x, height * 0.7 - buildingHeight);
    }
    
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  };
  
  // Draw main city buildings
  const drawBuildings = (ctx: CanvasRenderingContext2D, canvasHeight: number, deltaTime: number) => {
    const buildings = buildingRefs.current;
    
    buildings.forEach(building => {
      // Draw building silhouette 
      ctx.fillStyle = '#002244';
      ctx.fillRect(building.x, canvasHeight - building.height, building.width, building.height);
      
      // Draw building base color
      ctx.fillStyle = '#001122';
      ctx.fillRect(building.x + 1, canvasHeight - building.height + 1, building.width - 2, building.height - 2);
      
      // Draw windows
      building.windows.forEach(window => {
        if (window.lit) {
          ctx.fillStyle = window.color;
          ctx.fillRect(
            building.x + window.x, 
            canvasHeight - building.height + window.y, 
            window.width, 
            window.height
          );
          
          // Add glow effect to some windows
          if (Math.random() > 0.99) {
            const glow = ctx.createRadialGradient(
              building.x + window.x + window.width / 2,
              canvasHeight - building.height + window.y + window.height / 2,
              0,
              building.x + window.x + window.width / 2,
              canvasHeight - building.height + window.y + window.height / 2,
              window.width * 4
            );
            glow.addColorStop(0, window.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = glow;
            ctx.fillRect(
              building.x + window.x - window.width * 1.5,
              canvasHeight - building.height + window.y - window.height * 1.5,
              window.width * 4,
              window.height * 4
            );
          }
        } else {
          // Unlit windows
          ctx.fillStyle = 'rgba(0, 10, 30, 0.8)';
          ctx.fillRect(
            building.x + window.x, 
            canvasHeight - building.height + window.y, 
            window.width, 
            window.height
          );
        }
      });
      
      // Draw neon line if present
      if (building.neonLine) {
        // Update pulse effect
        building.neonLine.pulse += building.neonLine.pulseSpeed * (deltaTime || 16);
        if (building.neonLine.pulse > 1) building.neonLine.pulse = 0;
        
        const pulseStrength = Math.sin(building.neonLine.pulse * Math.PI * 2) * 0.3 + 0.7;
        const neonColor = building.neonLine.color;
        
        // Neon glow effect
        const glow = ctx.createLinearGradient(
          building.x,
          canvasHeight - building.height,
          building.x + building.width,
          canvasHeight - building.height
        );
        
        glow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        glow.addColorStop(0.3, neonColor.replace(')', `, ${pulseStrength * 0.5})`).replace('rgb', 'rgba'));
        glow.addColorStop(0.7, neonColor.replace(')', `, ${pulseStrength * 0.5})`).replace('rgb', 'rgba'));
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.strokeStyle = neonColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(building.x, canvasHeight - building.neonLine.height);
        ctx.lineTo(building.x + building.width, canvasHeight - building.neonLine.height);
        ctx.stroke();
        
        // Glow effect
        ctx.fillStyle = glow;
        ctx.fillRect(
          building.x - 10,
          canvasHeight - building.neonLine.height - 10,
          building.width + 20,
          20
        );
      }
    });
  };
  
  // Draw fog/mist effect
  const drawFog = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    // Create a misty gradient
    const fogGradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
    fogGradient.addColorStop(0, 'rgba(0, 30, 60, 0)');
    fogGradient.addColorStop(0.7, 'rgba(0, 30, 60, 0.1)');
    fogGradient.addColorStop(1, 'rgba(0, 20, 40, 0.3)');
    
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);
    
    // Add animated mist patches
    for (let i = 0; i < 5; i++) {
      const x = ((time * 0.02) + i * width / 5) % (width * 1.2) - width * 0.1;
      const y = height * 0.7 + Math.sin(i * 0.5) * height * 0.1;
      const mistWidth = width * 0.3;
      const mistHeight = height * 0.2;
      
      const mistGradient = ctx.createRadialGradient(
        x + mistWidth / 2, y + mistHeight / 2, 0,
        x + mistWidth / 2, y + mistHeight / 2, mistWidth / 2
      );
      
      mistGradient.addColorStop(0, 'rgba(0, 40, 80, 0.2)');
      mistGradient.addColorStop(1, 'rgba(0, 40, 80, 0)');
      
      ctx.fillStyle = mistGradient;
      ctx.fillRect(x, y, mistWidth, mistHeight);
    }
  };
  
  // Update and draw flying vehicles
  const updateAndDrawVehicles = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    deltaTime: number
  ) => {
    const vehicles = vehicleRefs.current;
    
    vehicles.forEach(vehicle => {
      // Update position
      vehicle.x += vehicle.speed * (deltaTime || 16) / 1000;
      
      // Wrap around screen
      if (vehicle.x > width + 50 && vehicle.speed > 0) {
        vehicle.x = -50;
      } else if (vehicle.x < -50 && vehicle.speed < 0) {
        vehicle.x = width + 50;
      }
      
      // Update blink state
      vehicle.blinkCounter += 1;
      if (vehicle.blinkCounter >= vehicle.blinkRate) {
        vehicle.blinkState = !vehicle.blinkState;
        vehicle.blinkCounter = 0;
      }
      
      // Draw vehicle trail
      const gradient = ctx.createLinearGradient(
        vehicle.x - Math.sign(vehicle.speed) * vehicle.tailLength, 
        vehicle.y, 
        vehicle.x, 
        vehicle.y
      );
      
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, vehicle.color.replace(')', `, ${vehicle.tailOpacity})`).replace('rgb', 'rgba'));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(vehicle.x, vehicle.y);
      ctx.lineTo(
        vehicle.x - Math.sign(vehicle.speed) * vehicle.tailLength, 
        vehicle.y
      );
      ctx.lineTo(
        vehicle.x - Math.sign(vehicle.speed) * vehicle.tailLength, 
        vehicle.y + vehicle.size / 2
      );
      ctx.lineTo(vehicle.x, vehicle.y + vehicle.size / 2);
      ctx.closePath();
      ctx.fill();
      
      // Draw vehicle body
      if (vehicle.blinkState) {
        ctx.fillStyle = vehicle.color;
        ctx.beginPath();
        ctx.arc(vehicle.x, vehicle.y + vehicle.size / 4, vehicle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow
        const glow = ctx.createRadialGradient(
          vehicle.x, vehicle.y + vehicle.size / 4, 0,
          vehicle.x, vehicle.y + vehicle.size / 4, vehicle.size * 4
        );
        
        glow.addColorStop(0, vehicle.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(vehicle.x, vehicle.y + vehicle.size / 4, vehicle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };
  
  // Update and draw holographic projections
  const updateAndDrawHolograms = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
    const holograms = hologramRefs.current;
    
    holograms.forEach(hologram => {
      // Update hologram animation
      hologram.rotation += hologram.rotationSpeed * (deltaTime || 16) / 16;
      hologram.opacity += hologram.opacityDirection * (deltaTime || 16) / 16;
      
      // Reverse opacity direction if limits are reached
      if (hologram.opacity <= 0.05 || hologram.opacity >= 0.4) {
        hologram.opacityDirection *= -1;
      }
      
      // Draw hologram based on type
      ctx.save();
      ctx.translate(hologram.x, hologram.y);
      ctx.rotate(hologram.rotation);
      
      // Create scanline effect for holograms
      const scanlineCount = 10;
      for (let i = 0; i < scanlineCount; i++) {
        if (i % 2 === 0) continue;
        
        ctx.fillStyle = hologram.color.replace(')', `, ${hologram.opacity * 0.5})`).replace('rgb', 'rgba');
        ctx.fillRect(
          -hologram.size / 2,
          -hologram.size / 2 + i * (hologram.size / scanlineCount),
          hologram.size,
          hologram.size / scanlineCount
        );
      }
      
      if (hologram.type === 'circle') {
        ctx.strokeStyle = hologram.color.replace(')', `, ${hologram.opacity * 1.5})`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, hologram.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner circles
        ctx.beginPath();
        ctx.arc(0, 0, hologram.size / 3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, hologram.size / 6, 0, Math.PI * 2);
        ctx.stroke();
      } 
      else if (hologram.type === 'square') {
        ctx.strokeStyle = hologram.color.replace(')', `, ${hologram.opacity * 1.5})`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        
        // Outer square
        ctx.beginPath();
        ctx.rect(-hologram.size / 2, -hologram.size / 2, hologram.size, hologram.size);
        ctx.stroke();
        
        // Inner square
        ctx.beginPath();
        ctx.rect(-hologram.size / 4, -hologram.size / 4, hologram.size / 2, hologram.size / 2);
        ctx.stroke();
        
        // Cross lines
        ctx.beginPath();
        ctx.moveTo(-hologram.size / 2, 0);
        ctx.lineTo(hologram.size / 2, 0);
        ctx.moveTo(0, -hologram.size / 2);
        ctx.lineTo(0, hologram.size / 2);
        ctx.stroke();
      } 
      else if (hologram.type === 'triangle') {
        ctx.strokeStyle = hologram.color.replace(')', `, ${hologram.opacity * 1.5})`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        
        // Outer triangle
        ctx.beginPath();
        ctx.moveTo(0, -hologram.size / 2);
        ctx.lineTo(hologram.size / 2, hologram.size / 2);
        ctx.lineTo(-hologram.size / 2, hologram.size / 2);
        ctx.closePath();
        ctx.stroke();
        
        // Inner triangle
        ctx.beginPath();
        ctx.moveTo(0, -hologram.size / 4);
        ctx.lineTo(hologram.size / 4, hologram.size / 4);
        ctx.lineTo(-hologram.size / 4, hologram.size / 4);
        ctx.closePath();
        ctx.stroke();
      } 
      else if (hologram.type === 'data' && hologram.dataPoints) {
        // Draw data visualization hologram
        ctx.strokeStyle = hologram.color.replace(')', `, ${hologram.opacity * 1.5})`).replace('rgb', 'rgba');
        ctx.lineWidth = 1;
        
        // Draw grid
        ctx.beginPath();
        ctx.rect(-hologram.size / 2, -hologram.size / 2, hologram.size, hologram.size);
        ctx.stroke();
        
        // Draw grid lines
        for (let i = 1; i < 5; i++) {
          const pos = -hologram.size / 2 + (hologram.size / 5) * i;
          
          ctx.beginPath();
          ctx.moveTo(pos, -hologram.size / 2);
          ctx.lineTo(pos, hologram.size / 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-hologram.size / 2, pos);
          ctx.lineTo(hologram.size / 2, pos);
          ctx.stroke();
        }
        
        // Draw data points
        ctx.fillStyle = hologram.color.replace(')', `, ${hologram.opacity * 2})`).replace('rgb', 'rgba');
        
        // Using explicit array check to satisfy TypeScript
        const dataPoints = hologram.dataPoints || [];
        
        dataPoints.forEach(point => {
          const x = point[0] * (hologram.size / 2);
          const y = point[1] * (hologram.size / 2);
          
          // Animate the points
          const animValue = (Math.sin(hologram.rotation * 5 + point[2] * 10) + 1) / 2;
          const pointSize = 1 + animValue * 3;
          
          ctx.beginPath();
          ctx.arc(x, y, pointSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Connect some points
          if (Math.random() > 0.7) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            
            // Find a nearby point to connect to
            for (const otherPoint of dataPoints) {
              const otherX = otherPoint[0] * (hologram.size / 2);
              const otherY = otherPoint[1] * (hologram.size / 2);
              
              const dist = Math.sqrt((x - otherX) ** 2 + (y - otherY) ** 2);
              if (dist < hologram.size / 4 && dist > 0) {
                ctx.lineTo(otherX, otherY);
                break;
              }
            }
            
            ctx.stroke();
          }
        });
        
        // Add scrolling text/data for futuristic feel
        ctx.font = `${hologram.size / 20}px monospace`;
        for (let i = 0; i < 10; i++) {
          const textY = -hologram.size / 2 + hologram.size * (i / 10) + (hologram.rotation * 50) % (hologram.size / 10);
          if (textY > hologram.size / 2) continue;
          
          ctx.fillText(
            generateRandomHexCode(8),
            -hologram.size / 2 + 5,
            textY
          );
        }
      }
      
      ctx.restore();
      
      // Draw hologram projector base
      ctx.fillStyle = '#002244';
      ctx.beginPath();
      ctx.arc(hologram.x, hologram.y + hologram.size / 2 + 5, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw projection beam
      const beamGradient = ctx.createLinearGradient(
        hologram.x, hologram.y + hologram.size / 2 + 5,
        hologram.x, hologram.y
      );
      
      beamGradient.addColorStop(0, hologram.color.replace(')', `, ${hologram.opacity * 1.5})`).replace('rgb', 'rgba'));
      beamGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = beamGradient;
      ctx.beginPath();
      ctx.moveTo(hologram.x - 5, hologram.y + hologram.size / 2 + 5);
      ctx.lineTo(hologram.x + 5, hologram.y + hologram.size / 2 + 5);
      ctx.lineTo(hologram.x + hologram.size / 3, hologram.y);
      ctx.lineTo(hologram.x - hologram.size / 3, hologram.y);
      ctx.closePath();
      ctx.fill();
    });
  };
  
  // Draw scanlines overlay
  const drawScanlines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    
    for (let i = 0; i < height; i += 4) {
      ctx.fillRect(0, i, width, 1);
    }
    
    ctx.globalAlpha = 1;
  };
  
  // Utility function to generate random hex code for data displays
  const generateRandomHexCode = (length: number) => {
    const chars = '0123456789ABCDEF';
    let result = '0x';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default CyberpunkBackground; 