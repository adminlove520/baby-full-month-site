'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2 } from 'lucide-react';

interface Photo {
  download_url: string;
  name: string;
}

export default function Projection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/photos');
        const data = await res.json();
        setPhotos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && photos.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, photos]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">加载中...</div>;
  if (photos.length === 0) return <div className="h-screen flex items-center justify-center bg-black text-white">未找到照片</div>;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.2, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -20 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={photos[currentIndex].download_url}
            alt={photos[currentIndex].name}
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute bottom-10 left-0 right-0 text-center text-white/50 font-fancy text-2xl drop-shadow-lg">
            {photos[currentIndex].name.split('.')[0]}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <ChevronLeft size={32} />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button onClick={() => document.documentElement.requestFullscreen()} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <Maximize2 size={28} />
        </button>
      </div>
    </div>
  );
}
