'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CherryBlossom() {
  const [petals, setPetals] = useState<{ id: number; left: string; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 10,
      size: Math.random() * 10 + 10,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-pink-200 opacity-60 rounded-full"
          initial={{ y: '-10%', x: p.left, rotate: 0 }}
          animate={{
            y: '110%',
            x: [`${parseFloat(p.left)}%`, `${parseFloat(p.left) + 10}%`, `${parseFloat(p.left) - 5}%`],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: p.size,
            height: p.size * 0.8,
            borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
          }}
        />
      ))}
    </div>
  );
}
