'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GrowthClock() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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
    { label: 'Days', value: time.days, color: 'from-pink-400 to-pink-500' },
    { label: 'Hours', value: time.hours, color: 'from-blue-400 to-blue-500' },
    { label: 'Mins', value: time.minutes, color: 'from-purple-400 to-purple-500' },
    { label: 'Secs', value: time.seconds, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-6 py-6">
      {items.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, type: 'spring' }}
          className="relative group"
        >
          <div className="w-16 h-20 md:w-24 md:h-28 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[0_12px_40px_rgba(244,114,182,0.2)] group-hover:-translate-y-1">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-70`} />
            <span className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-700 to-gray-900 tabular-nums mb-1">
              {item.value}
            </span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">
              {item.label}
            </span>
          </div>
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}
