import React, { useRef, useEffect, useCallback } from 'react';

interface Vehicle {
  x: number;
  y: number;
  speed: number;
  color: string;
}

interface Hologram {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const CyberpunkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehicleRefs = useRef<Vehicle[]>([]);
  const hologramRefs = useRef<Hologram[]>([]);

  const updateAndDrawHolograms = useCallback((
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    deltaTime: number
  ) => {
    const holograms = hologramRefs.current;
    const newHolograms: Hologram[] = [];
    
    holograms.forEach(hologram => {
      hologram.y += hologram.speed * deltaTime;
      
      if (hologram.y < height + 50) {
        newHolograms.push(hologram);
        ctx.fillStyle = `rgba(0, 255, 255, ${hologram.opacity})`;
        ctx.beginPath();
        ctx.arc(hologram.x, hologram.y, hologram.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    hologramRefs.current = newHolograms;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
        drawNeonLines(ctx, canvas.width, canvas.height);
        drawStars(ctx, canvas.width);
        updateAndDrawVehicles(ctx, canvas.width, deltaTime);
        updateAndDrawHolograms(ctx, canvas.width, canvas.height, deltaTime);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateAndDrawHolograms]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawNeonLines = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
    ctx.lineWidth = 2;
    
    // Draw diagonal lines
    for (let i = 0; i < 10; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = Math.random() * width;
      const y2 = Math.random() * height;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawStars = (ctx: CanvasRenderingContext2D, width: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * width;
      const size = Math.random() * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawVehicle = (ctx: CanvasRenderingContext2D, vehicle: Vehicle) => {
    ctx.fillStyle = vehicle.color;
    ctx.beginPath();
    ctx.arc(vehicle.x, vehicle.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const updateAndDrawVehicles = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    deltaTime: number
  ) => {
    const vehicles = vehicleRefs.current;
    const newVehicles: Vehicle[] = [];

    vehicles.forEach(vehicle => {
      vehicle.x += vehicle.speed * deltaTime;
      vehicle.y += Math.sin(vehicle.x * 0.01) * 0.5;

      if (vehicle.x < width + 50) {
        newVehicles.push(vehicle);
        drawVehicle(ctx, vehicle);
      }
    });

    vehicleRefs.current = newVehicles;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ background: 'linear-gradient(to bottom, #000716, #001133)' }}
    />
  );
};

export default CyberpunkBackground; 