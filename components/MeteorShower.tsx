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
        this.size = Math.random() * 1.5;
        this.opacity = Math.random();
        this.speed = 0.01 + Math.random() * 0.02;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        this.opacity += this.speed;
        if (this.opacity > 1 || this.opacity < 0) this.speed = -this.speed;
        this.draw();
      }
    }

    class Meteor {
      x!: number;
      y!: number;
      len!: number;
      speed!: number;
      size!: number;

      constructor() {
        this.init();
      }

      init() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = -Math.random() * 200;
        this.len = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 5;
        this.size = Math.random() * 1.5 + 0.5;
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y + this.len);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y + this.len);
        ctx.stroke();
      }

      update() {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.y > (canvas?.height || 0) + 100 || this.x < -100) {
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
      for (let i = 0; i < 100; i++) stars.push(new Star());
      for (let i = 0; i < 8; i++) meteors.push(new Meteor());
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
