'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: '首页', path: '/' },
    { name: '相册墙', path: '/gallery' },
    { name: '幻灯片', path: '/projection' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="bg-white/30 backdrop-blur-md rounded-full px-6 py-2 border border-white/50 shadow-lg flex gap-8">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} className="relative group">
            <span className={`text-baby-text font-medium ${pathname === item.path ? 'opacity-100' : 'opacity-60'} group-hover:opacity-100 transition-opacity`}>
              {item.name}
            </span>
            {pathname === item.path && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-400 rounded-full"
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
