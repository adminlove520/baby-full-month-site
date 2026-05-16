'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-4 border-t border-white/20 bg-white/10 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-baby-text/60 font-medium">
          <span>Made with</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Heart size={18} className="text-pink-500 fill-pink-500" />
          </motion.div>
          <span>for Jinghao</span>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-baby-text/40 font-fancy text-xl">
            愿所有的美好都如期而至，愿你被这世界温柔以待。
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-baby-text/30 mt-4">
            © 2026 张景皓的成长时光机 · All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
