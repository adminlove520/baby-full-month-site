'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Music2, ListMusic, Upload, X, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicFile {
  name: string;
  download_url: string;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<MusicFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchPlaylist = async () => {
    try {
      const res = await fetch('/api/music');
      const data = await res.json();
      if (data.length > 0) {
        setPlaylist(data);
      } else {
        // Fallback music if none in GitHub
        setPlaylist([{
          name: "Bensound Love",
          download_url: "https://www.bensound.com/bensound-music/bensound-love.mp3"
        }]);
      }
    } catch (err) {
      console.error("Failed to fetch music", err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
    // Poll for new music every 2 minutes
    const interval = setInterval(fetchPlaylist, 120000);
    return () => clearInterval(interval);
  }, []);

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

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('上传成功！音乐将在几分钟内同步。');
        fetchPlaylist();
      }
    } catch (err) {
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-6 w-80 max-h-[400px] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-pink-500 font-bold flex items-center gap-2">
                  <ListMusic size={20} /> 播放列表
                </h3>
                <button onClick={() => setShowPlaylist(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {playlist.map((track, idx) => (
                  <button
                    key={track.download_url}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                      currentIndex === idx ? 'bg-pink-100 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-pink-400 opacity-60" />
                    <span className="truncate text-sm">{track.name.split('.')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <label className="cursor-pointer flex items-center gap-2 text-xs text-pink-400 hover:text-pink-600 transition-colors">
                  <Upload size={14} />
                  <span>{uploading ? '上传中...' : '上传音乐'}</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                <div className="flex items-center gap-2">
                  <button onClick={prevTrack} className="text-gray-400 hover:text-pink-400"><SkipBack size={18} /></button>
                  <button onClick={togglePlay} className="text-pink-500 hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={nextTrack} className="text-gray-400 hover:text-pink-400"><SkipForward size={18} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="p-4 rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-pink-400 shadow-xl"
          >
            <ListMusic size={24} />
          </motion.button>

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
        </div>
      </div>

      <audio
        ref={audioRef}
        src={playlist[currentIndex]?.download_url}
        autoPlay={isPlaying}
        onEnded={nextTrack}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {isPlaying && (
        <div className="fixed bottom-24 right-10 pointer-events-none">
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 1, 0], x: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-pink-400 font-fancy text-2xl"
          >
            ♫
          </motion.div>
        </div>
      )}
    </>
  );
}
