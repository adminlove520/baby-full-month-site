'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Photo {
  download_url: string;
  name: string;
}

export default function Projection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.push('/');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white font-fancy text-2xl animate-pulse">时光机启动中...</div>;
  if (photos.length === 0) return <div className="h-screen flex items-center justify-center bg-black text-white">未找到照片</div>;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden group">
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
          <div className="absolute bottom-16 left-0 right-0 text-center text-white/60 font-fancy text-3xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            {photos[currentIndex].name.split('.')[0]}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-[110]"
      >
        <X size={32} />
      </button>

      <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <ChevronLeft size={40} />
        </button>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <ChevronRight size={40} />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }} className="p-5 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <Maximize2 size={32} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-pink-500/50 transition-all duration-[5000ms] linear" style={{ width: isPlaying ? '100%' : '0%' }} key={currentIndex} />
    </div>
  );
}
