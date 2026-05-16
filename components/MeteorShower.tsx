'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MeteorShower() {
  const [meteors, setMeteors] = useState<{ id: number; left: string; top: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newMeteors = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 40}%`,
      delay: Math.random() * 20,
      duration: Math.random() * 3 + 2,
    }));
    setMeteors(newMeteors);
  }, []);

  return (
    <>
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute h-[2px] w-[180px] bg-gradient-to-r from-transparent via-white/90 to-transparent rotate-[-45deg] blur-[1px]"
          initial={{ x: '150%', y: '-150%', opacity: 0 }}
          animate={{
            x: '-400%',
            y: '400%',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{
            left: m.left,
            top: m.top,
          }}
        />
      ))}
    </>
  );
}
