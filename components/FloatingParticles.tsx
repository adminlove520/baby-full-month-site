'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30 blur-[2px]"
          initial={{ x: `${p.x}%`, y: '110%', opacity: 0 }}
          animate={{
            y: '-10%',
            x: [`${p.x}%`, `${p.x + (Math.random() * 15 - 7)}%`, `${p.x}%`],
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </>
  );
}
