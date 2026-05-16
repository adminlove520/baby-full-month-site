'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GrowthClock() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Assuming birth date is April 16, 2026 (1 month before today)
    const birthDate = new Date('2026-04-16T08:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - birthDate;

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: '天', value: time.days },
    { label: '时', value: time.hours },
    { label: '分', value: time.minutes },
    { label: '秒', value: time.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl mx-auto">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl flex items-center justify-center mb-2">
            <span className="text-2xl md:text-4xl font-bold text-pink-500 tabular-nums">
              {item.value}
            </span>
          </div>
          <span className="text-baby-text text-sm font-medium">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
