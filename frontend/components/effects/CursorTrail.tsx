"use client";

import { useEffect, useRef, useState } from "react";

class TrailParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    // Add slight scatter from the cursor center
    this.x = x + (Math.random() - 0.5) * 6;
    this.y = y + (Math.random() - 0.5) * 6;
    this.size = Math.random() * 2 + 1; // 1 to 3px
    this.color = '#ffffff'; // White to match HeroRibbon
    
    // Slow drift, mostly drifting downwards to simulate gravity or magic dust
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() * 0.5) + 0.2; 
    
    this.maxLife = Math.random() * 30 + 15; // 15 to 45 frames
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    this.size = Math.max(0, this.size - 0.05); // shrink over time
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life / this.maxLife})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasMouse, setHasMouse] = useState(false);

  // Only render on devices with a mouse (not touch-only)
  useEffect(() => {
    setHasMouse(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => {
    if (!hasMouse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: TrailParticle[] = [];
    let animationFrameId: number;
    let mouse = { x: -100, y: -100 };
    let timeoutId: NodeJS.Timeout;

    const resize = () => {
      // Use devicePixelRatio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => { }, 100);

      // Add particles when mouse moves
      for (let i = 0; i < 2; i++) {
        particles.push(new TrailParticle(mouse.x, mouse.y));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw trailing particles
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      ctx.globalCompositeOperation = 'source-over';

      // Keep only alive particles
      particles = particles.filter(p => p.life > 0 && p.size > 0.1);

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [hasMouse]);

  if (!hasMouse) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9999]"
      style={{ touchAction: 'none' }}
    />
  );
}
