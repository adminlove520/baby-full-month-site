'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { memo } from 'react';

const NavItem = memo(({ item, isActive }: { item: { name: string, path: string }, isActive: boolean }) => (
  <Link 
    href={item.path} 
    className="relative px-6 py-2 rounded-full transition-all duration-300 group"
  >
    <span className={`relative z-10 text-sm font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-pink-600' : 'text-gray-500 hover:text-gray-800'}`}>
      {item.name}
    </span>
    {isActive && (
      <motion.div
        layoutId="active-pill"
        className="absolute inset-0 bg-white rounded-full shadow-sm"
        // Simplified transition to reduce computation during route change
        transition={{ duration: 0.3 }}
      />
    )}
    {/* Subtle hover effect that doesn't use heavy layoutId */}
    {!isActive && (
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/40 rounded-full transition-colors duration-300" />
    )}
  </Link>
));

NavItem.displayName = 'NavItem';

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
        // Optimization: Use will-change to inform browser of transform
        style={{ willChange: 'transform, opacity' }}
        className="bg-white/40 backdrop-blur-2xl rounded-full px-2 py-2 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex gap-1 pointer-events-auto"
      >
        {navItems.map((item) => (
          <NavItem 
            key={item.path} 
            item={item} 
            isActive={pathname === item.path} 
          />
        ))}
      </motion.div>
    </nav>
  );
}
