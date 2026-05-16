'use client';

import React, { useEffect, useRef } from 'react';

export default function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const stars: Star[] = [];
    const meteors: Meteor[] = [];

    // Performance Optimization: Cache dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.opacity = Math.random();
        this.speed = 0.005 + Math.random() * 0.01;
      }

      draw() {
        if (!ctx) return;
        // Optimization: Removed shadowBlur (extremely expensive)
        // Using simple fillStyle instead
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0.2) this.speed = -this.speed;
        this.draw();
      }
    }

    class Meteor {
      x!: number;
      y!: number;
      len!: number;
      speed!: number;
      size!: number;
      opacity!: number;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * width + 200;
        this.y = -Math.random() * 300;
        this.len = Math.random() * 150 + 80;
        this.speed = Math.random() * 12 + 6; // Optimized speed
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = 1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y + this.len);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.1, `rgba(255, 210, 255, ${this.opacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y + this.len);
        ctx.stroke();
        ctx.restore();
      }

      update() {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.y > height + 200 || this.x < -200) {
          this.init();
        }
        this.draw();
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const init = () => {
      resize();
      stars.length = 0;
      meteors.length = 0;
      // Reduced counts for performance
      for (let i = 0; i < 80; i++) stars.push(new Star());
      for (let i = 0; i < 4; i++) meteors.push(new Meteor());
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => s.update());
      meteors.forEach(m => m.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
