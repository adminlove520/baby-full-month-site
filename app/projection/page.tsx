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

  const [direction, setDirection] = useState(0);

  const variants = {
    initial: (direction: number) => ({
      opacity: 0,
      scale: 1.2,
      x: direction > 0 ? 1500 : direction < 0 ? -1500 : 0,
      rotate: direction > 0 ? 10 : -10,
      filter: "blur(20px)",
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 1 },
        scale: { duration: 1.5, ease: "easeOut" },
        rotate: { type: "spring", stiffness: 100, damping: 20 },
        filter: { duration: 0.8 }
      }
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 0.8,
      x: direction < 0 ? 1500 : direction > 0 ? -1500 : 0,
      rotate: direction < 0 ? 10 : -10,
      filter: "blur(20px)",
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.8 },
        scale: { duration: 1 }
      }
    })
  };

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
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, photos]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + photos.length) % photos.length);
  };

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
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={photos[currentIndex].download_url}
            alt={photos[currentIndex].name}
            className="max-h-full max-w-full object-contain shadow-[0_0_50px_rgba(244,114,182,0.2)]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-16 left-0 right-0 text-center text-white/70 font-fancy text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-widest"
          >
            {photos[currentIndex].name.split('.')[0]}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Close Button */}
      <button 
        onClick={handleClose}
        className="absolute top-8 right-8 p-4 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-xl border border-white/40 shadow-2xl transition-all opacity-0 group-hover:opacity-100 z-[110] active:scale-95"
      >
        <X size={28} />
      </button>

      <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => paginate(-1)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
          <ChevronLeft size={40} />
        </button>
      </div>

      <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => paginate(1)} className="p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
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
