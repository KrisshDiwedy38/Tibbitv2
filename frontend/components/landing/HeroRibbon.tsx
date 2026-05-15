"use client";

import { useEffect, useRef } from "react";

class RibbonParticle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  spring: number;
  nx: number;
  spreadY: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    // Generate position along the ribbon width
    // Weighted towards the center
    let t = (Math.random() + Math.random() + Math.random()) / 3;
    let nx = (t - 0.5) * 2; // Range roughly -1 to 1

    // Scatter some particles wider to fill the shape nicely
    if (Math.random() > 0.8) {
      nx = (Math.random() - 0.5) * 2.2;
    }

    this.nx = nx;

    // Sinuous wave: dips downward in the center
    let dip = (1 - nx * nx);

    // Thickness profile: thicker in middle-left
    let thickness = (canvasHeight * 0.12) * dip * (1 - 0.3 * nx);

    // Distance from medial axis (Gaussian-like spread)
    let spreadY = (Math.random() + Math.random() + Math.random() - 1.5) * thickness;
    this.spreadY = spreadY;

    this.baseX = canvasWidth / 2 + nx * (canvasWidth * 0.45);

    // Add a slight sine wave to make it sinuous/curled at edges
    let curl = Math.sin(nx * Math.PI) * canvasHeight * 0.05;
    let cy = canvasHeight * 0.55 + dip * (canvasHeight * 0.15) + curl;

    this.baseY = cy + spreadY;

    this.x = this.baseX;
    this.y = this.baseY;

    // Mix of small dots (1-2px) and large dots (3-6px)
    this.size = Math.random() > 0.85 ? Math.random() * 3 + 3 : Math.random() * 1.5 + 0.5;

    // Opacity: denser/brighter near the center axis (0.3 to 1.0)
    let distFromCenter = Math.abs(spreadY) / Math.max(thickness, 1);
    let baseOpacity = Math.max(0.3, 1 - distFromCenter);
    this.opacity = baseOpacity * (Math.random() * 0.7 + 0.3);

    // Idle drift parameters
    this.phaseX = Math.random() * Math.PI * 2;
    this.phaseY = Math.random() * Math.PI * 2;
    this.speedX = Math.random() * 0.015 + 0.005;
    this.speedY = Math.random() * 0.015 + 0.005;

    // Staggered organic return spring (0.02 to 0.06)
    this.spring = Math.random() * 0.04 + 0.02;
  }

  update(mouseX: number, mouseY: number, time: number, cw: number, ch: number, isDesktop: boolean = true) {
    let dip = (1 - this.nx * this.nx);

    // Wave calculations to make the ribbon wave and swirl
    let waveY = Math.sin(this.nx * 2.5 + time * 0.01) * (ch * 0.1);
    let rippleY = Math.cos(this.nx * 5.0 - time * 0.02) * (ch * 0.05);
    let waveX = Math.sin(this.nx * 2.0 - time * 0.015) * (cw * 0.05);

    // 3D twist effect
    let twist = Math.sin(this.nx * 3.0 + time * 0.015);

    let curl = Math.sin(this.nx * Math.PI) * ch * 0.05;
    let cy = ch * 0.55 + dip * (ch * 0.15) + curl + waveY + rippleY;
    let cx = cw / 2 + this.nx * (cw * 0.45) + waveX;

    // Idle gentle oscillation (±3–5px)
    let idleX = Math.sin(time * this.speedX + this.phaseX) * 4;
    let idleY = Math.cos(time * this.speedY + this.phaseY) * 4;

    let targetX = cx + idleX;
    let targetY = cy + (this.spreadY * twist) + idleY;

    if (isDesktop) {
      // Mouse repulsion
      let dx = this.x - mouseX;
      let dy = this.y - mouseY;
      let distSq = dx * dx + dy * dy;
      let maxDist = 180; // 180px radius

      if (distSq < maxDist * maxDist && mouseX !== -100) {
        let dist = Math.sqrt(distSq);
        // Inversely proportional force
        let force = Math.pow((maxDist - dist) / maxDist, 2);

        // Scatter outward naturally with slight randomness
        let angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
        let pushX = Math.cos(angle) * force * 100;
        let pushY = Math.sin(angle) * force * 100;

        targetX += pushX;
        targetY += pushY;
      }

      // Elastic return using spring/lerp easing
      this.x += (targetX - this.x) * this.spring;
      this.y += (targetY - this.y) * this.spring;
    } else {
      // Fixed instantly on mobile/tablet
      this.x = targetX;
      this.y = targetY;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

export default function HeroRibbon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: RibbonParticle[] = [];
    let animationFrameId: number;
    let mouse = { x: -100, y: -100 };
    let time = 0;

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 1500 : 3000;
      for (let i = 0; i < count; i++) {
        particles.push(new RibbonParticle(canvas.width, canvas.height));
      }
    };

    const drawFrame = () => {
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        time++;
      } else {
        time = 0; // Lock time for static rendering
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Subtle radial glow behind the ribbon center
      let cx = rect.width / 2;
      let cy = rect.height * 0.55 + (rect.height * 0.15); // aligned with deepest dip
      let gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, rect.width * 0.35);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      let currentMouseX = isDesktop ? mouse.x : -100;
      let currentMouseY = isDesktop ? mouse.y : -100;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(currentMouseX, currentMouseY, time, rect.width, rect.height, isDesktop);
        particles[i].draw(ctx);
      }

      return isDesktop;
    };

    const animate = () => {
      const shouldAnimate = drawFrame();
      if (shouldAnimate) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Replace the raw initParticles() in resize with a call to init then draw once
    const resize = () => {
      // Use devicePixelRatio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
      initParticles();

      // Cancel any ongoing animation and restart logic
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        animate(); // Starts the loop
      } else {
        drawFrame(); // Draw exactly once for mobile
      }
    };

    window.addEventListener("resize", resize);
    // Allow DOM to settle before calculating sizes
    setTimeout(resize, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -100;
      mouse.y = -100;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
