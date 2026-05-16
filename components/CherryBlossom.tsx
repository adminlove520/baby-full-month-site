'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CherryBlossom() {
  const [petals, setPetals] = useState<{ id: number; left: string; delay: number; duration: number; size: number; startRotate: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 10,
      size: Math.random() * 10 + 10,
      startRotate: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <>
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-pink-200/40 shadow-[0_0_8px_rgba(255,192,203,0.2)]"
          initial={{ y: '-10%', x: p.left, rotate: p.startRotate, opacity: 0 }}
          animate={{
            y: '110vh',
            x: [`${parseFloat(p.left)}%`, `${parseFloat(p.left) + 12}%`, `${parseFloat(p.left) - 6}%`, `${parseFloat(p.left)}%`],
            rotate: p.startRotate + 1080,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: p.size,
            height: p.size * 0.7,
            borderRadius: '50% 10% 50% 10% / 10% 50% 10% 50%',
          }}
        />
      ))}
    </>
  );
}
