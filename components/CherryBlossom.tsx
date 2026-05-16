'use client';

import React, { useEffect, useRef } from 'react';

export default function CherryBlossom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const petals: Petal[] = [];
    const petalCount = 60; // Increased density

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
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0) - (canvas?.height || 0);
        this.w = 12 + Math.random() * 18;
        this.h = 10 + Math.random() * 12;
        this.opacity = 0.4 + Math.random() * 0.4;
        this.flip = Math.random();
        this.xSpeed = 0.5 + Math.random() * 1.5;
        this.ySpeed = 1 + Math.random() * 1.5;
        this.flipSpeed = 0.01 + Math.random() * 0.03;
        this.rotate = Math.random() * Math.PI;
        this.rotateSpeed = (Math.random() - 0.5) * 0.02;
      }

      draw() {
        if (!ctx || !canvas) return;
        if (this.y > canvas.height || this.x > canvas.width || this.x < -this.w) {
          this.x = Math.random() * canvas.width;
          this.y = -20;
          this.xSpeed = 0.5 + Math.random() * 1.5;
          this.ySpeed = 1 + Math.random() * 1.5;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate + (this.flip * Math.PI) / 4);
        
        ctx.beginPath();
        const fillGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.w);
        fillGradient.addColorStop(0, `rgba(255, 192, 203, ${this.opacity})`);
        fillGradient.addColorStop(1, `rgba(255, 182, 193, ${this.opacity * 0.5})`);
        
        ctx.fillStyle = fillGradient;
        
        // Draw a heart-like petal shape
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.w/2, -this.h/2, -this.w, this.h/3, 0, this.h);
        ctx.bezierCurveTo(this.w, this.h/3, this.w/2, -this.h/2, 0, 0);
        
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
