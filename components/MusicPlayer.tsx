'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <audio
        ref={audioRef}
        loop
        src="https://www.bensound.com/bensound-music/bensound-love.mp3" // Placeholder royalty-free music
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`p-4 rounded-full shadow-2xl backdrop-blur-md border border-white/50 flex items-center justify-center transition-colors ${
          isPlaying ? 'bg-pink-400 text-white' : 'bg-white/30 text-pink-400'
        }`}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Music2 size={24} />
            </motion.div>
          ) : (
            <motion.div key="paused" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Music size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {isPlaying && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -20, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-pink-400 font-fancy text-xl"
          >
            ♫
          </motion.div>
        </div>
      )}
    </div>
  );
}
