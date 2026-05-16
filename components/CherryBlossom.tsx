'use client';

import React, { useEffect, useRef } from 'react';

export default function CherryBlossom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const petals: Petal[] = [];
    const petalCount = 40; // Reduced density for performance

    let width = window.innerWidth;
    let height = window.innerHeight;

    class Petal {
      x: number;
      y: number;
      w: number;
      h: number;
      opacity: number;
      flip: number;
      xSpeed: number;
      ySpeed: number;
      flipSpeed: number;
      rotate: number;
      rotateSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.w = 12 + Math.random() * 12;
        this.h = 10 + Math.random() * 10;
        this.opacity = 0.4 + Math.random() * 0.4;
        this.flip = Math.random();
        this.xSpeed = 0.5 + Math.random() * 1.2;
        this.ySpeed = 1 + Math.random() * 1.2;
        this.flipSpeed = 0.01 + Math.random() * 0.02;
        this.rotate = Math.random() * Math.PI;
        this.rotateSpeed = (Math.random() - 0.5) * 0.01;
      }

      draw() {
        if (!ctx || !canvas) return;
        if (this.y > height || this.x > width || this.x < -this.w) {
          this.x = Math.random() * width;
          this.y = -20;
          this.xSpeed = 0.5 + Math.random() * 1.2;
          this.ySpeed = 1 + Math.random() * 1.2;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate + (this.flip * Math.PI) / 4);
        
        ctx.beginPath();
        // Optimization: Pre-calculating opacity string
        ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity})`;
        
        // Simplified petal shape for performance (avoiding complex bezier if possible)
        ctx.moveTo(0, 0);
        ctx.arc(0, this.h / 2, this.w / 2, 0, Math.PI * 2);
        
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
        this.rotate += this.rotateSpeed;
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
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);
      petals.forEach((petal) => petal.update());
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
      style={{ background: 'transparent' }}
    />
  );
}
