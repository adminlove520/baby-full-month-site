'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  download_url: string;
  name: string;
}

export default function Lightbox({ photos, initialIndex, onClose }: { photos: Photo[], initialIndex: number, onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);

  const next = () => setIndex((prev) => (prev + 1) % photos.length);
  const prev = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]">
        <X size={32} />
      </button>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors">
        <ChevronLeft size={48} />
      </button>

      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors">
        <ChevronRight size={48} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center p-4"
        >
          <img
            src={photos[index].download_url}
            alt={photos[index].name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute -bottom-12 left-0 right-0 text-center text-white/80 font-medium">
            {photos[index].name.split('.')[0]}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
