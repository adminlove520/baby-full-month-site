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
    const petalCount = 40;

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

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0) - (canvas?.height || 0);
        this.w = 10 + Math.random() * 15;
        this.h = 10 + Math.random() * 10;
        this.opacity = this.w / 25;
        this.flip = Math.random();
        this.xSpeed = 1.5 + Math.random() * 2;
        this.ySpeed = 1 + Math.random() * 1.5;
        this.flipSpeed = 0.01 + Math.random() * 0.03;
      }

      draw() {
        if (!ctx || !canvas) return;
        if (this.y > canvas.height || this.x > canvas.width) {
          this.x = -this.w;
          this.y = Math.random() * canvas.height;
          this.xSpeed = 1.5 + Math.random() * 2;
          this.ySpeed = 1 + Math.random() * 1.5;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity})`;
        ctx.ellipse(
          this.x,
          this.y,
          this.w * Math.abs(Math.cos(this.flip)),
          this.h,
          (this.flip * Math.PI) / 4,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      update() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
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
