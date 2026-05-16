'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Download } from 'lucide-react';

interface Photo {
  download_url: string;
  name: string;
}

export default function Lightbox({ photos, initialIndex, onClose }: { photos: Photo[], initialIndex: number, onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % photos.length);
    setIsZoomed(false);
  };
  
  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsZoomed(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/10 backdrop-blur-2xl"
    >
      {/* Background overlay with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-blue-500/10 pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110] bg-gradient-to-b from-black/20 to-transparent">
        <div className="text-white/90 font-fancy text-2xl drop-shadow-md">
          {photos[index].name.split('.')[0]}
          <span className="ml-4 text-sm font-sans opacity-60">({index + 1} / {photos.length})</span>
        </div>
        <div className="flex gap-4">
          <a 
            href={photos[index].download_url} 
            download 
            onClick={(e) => e.stopPropagation()}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
            title="下载图片"
          >
            <Download size={24} />
          </a>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
            title="关闭"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prev} 
        className="absolute left-6 top-1/2 -translate-y-1/2 p-5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white backdrop-blur-sm transition-all z-[110]"
      >
        <ChevronLeft size={48} />
      </button>

      <button 
        onClick={next} 
        className="absolute right-6 top-1/2 -translate-y-1/2 p-5 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white backdrop-blur-sm transition-all z-[110]"
      >
        <ChevronRight size={48} />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-[95vw] max-h-[90vh] flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -45 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[index].download_url}
              alt={photos[index].name}
              className={`max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-4 border-white/80 transition-transform duration-500 cursor-zoom-in ${isZoomed ? 'scale-150' : 'scale-100'}`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            
            {/* Reflection Effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-white/10 via-transparent to-transparent mix-blend-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails list at bottom (Optional) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-10 py-2 no-scrollbar">
        {photos.map((p, i) => (
          <button 
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); setIsZoomed(false); }}
            className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${index === i ? 'border-pink-500 scale-110 shadow-lg' : 'border-white/20 opacity-40 hover:opacity-100'}`}
          >
            <img src={p.download_url} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
