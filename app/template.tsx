'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Use simpler animation and transition to avoid blocking UI during route changes
      transition={{ duration: 0.4, ease: "linear" }}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  );
}
