'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MeteorShower() {
  const [meteors, setMeteors] = useState<{ id: number; left: string; top: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const newMeteors = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 1,
    }));
    setMeteors(newMeteors);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {meteors.map((m) => (
        <motion.div
          key={m.id}
          className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[-45deg]"
          initial={{ x: '100%', y: '-100%', opacity: 0 }}
          animate={{
            x: '-200%',
            y: '200%',
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: m.left,
            top: m.top,
          }}
        />
      ))}
    </div>
  );
}
