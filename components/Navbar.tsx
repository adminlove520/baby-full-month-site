'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: '首页', path: '/' },
    { name: '照片墙', path: '/gallery' },
    { name: '幻灯片', path: '/projection' },
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/40 backdrop-blur-2xl rounded-full px-2 py-2 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex gap-1 pointer-events-auto"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="relative px-6 py-2 rounded-full transition-all duration-300">
              <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-pink-600' : 'text-gray-500 hover:text-gray-800'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
