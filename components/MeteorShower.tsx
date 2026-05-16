'use client';

import React, { useEffect, useRef } from 'react';

export default function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const stars: Star[] = [];
    const meteors: Meteor[] = [];

    class Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.size = Math.random() * 2;
        this.opacity = Math.random();
        this.speed = 0.005 + Math.random() * 0.01;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
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
        this.x = Math.random() * (canvas?.width || 0) + 200;
        this.y = -Math.random() * 300;
        this.len = Math.random() * 150 + 80;
        this.speed = Math.random() * 15 + 8;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = 1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y + this.len);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.1, `rgba(255, 200, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 200, 255, 0.5)";
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y + this.len);
        ctx.stroke();
        ctx.restore();
      }

      update() {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.y > (canvas?.height || 0) + 200 || this.x < -200) {
          this.init();
        }
        this.draw();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      stars.length = 0;
      meteors.length = 0;
      for (let i = 0; i < 120; i++) stars.push(new Star());
      for (let i = 0; i < 6; i++) meteors.push(new Meteor());
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
