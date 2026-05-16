'use client';

import { useState, useRef, useEffect } from 'react';
import { Music, Music2, ListMusic, Upload, X, Play, Pause, SkipForward, SkipBack, Link as LinkIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicFile {
  name: string;
  download_url: string;
  type?: 'local' | 'remote';
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState<MusicFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchPlaylist = async () => {
    try {
      const res = await fetch('/api/music');
      const data = await res.json();
      
      // Load saved remote URLs from localStorage for persistence on this browser
      const savedRemotes = JSON.parse(localStorage.getItem('baby_site_remote_music') || '[]');
      
      const combined = [...data, ...savedRemotes];
      
      if (combined.length > 0) {
        setPlaylist(combined);
      } else {
        setPlaylist([{
          name: "Bensound Love",
          download_url: "https://www.bensound.com/bensound-music/bensound-love.mp3",
          type: 'remote'
        }]);
      }
    } catch (err) {
      console.error("Failed to fetch music", err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
    const interval = setInterval(fetchPlaylist, 120000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play blocked", e));
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

    if (file.size > 4.5 * 1024 * 1024) {
      alert('文件太大（超过 4.5MB），受 Vercel 限制无法直接上传。请手动上传到 GitHub 仓库的 Music 文件夹，或使用较小的 MP3 文件。');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('上传成功！音乐正在同步中，请刷新页面查看。');
        fetchPlaylist();
      } else if (res.status === 413) {
        alert('上传失败：文件太大（413 Payload Too Large）。受 Vercel 限制，上传文件不能超过 4.5MB。');
      } else {
        const errData = await res.json();
        alert(`上传失败: ${errData.error || '未知错误'}`);
      }
    } catch (err) {
      console.error(err);
      alert('上传过程中发生网络错误');
    } finally {
      setUploading(false);
    }
  };


  const handleAddUrl = () => {
    if (!musicUrl) return;
    if (!musicUrl.startsWith('http')) {
      alert('请输入有效的音乐分享链接（网易云/QQ音乐）或 MP3 URL');
      return;
    }
    
    let finalUrl = musicUrl;
    let trackName = musicUrl.split('/').pop()?.split('?')[0] || '远程音乐';

    // 1. 网易云音乐解析
    const neteaseMatch = musicUrl.match(/(?:music\.163\.com|y\.music\.163\.com)\/.*id=(\d+)/);
    if (neteaseMatch) {
      const id = neteaseMatch[1];
      finalUrl = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      trackName = `网易云音乐 - ${id}`;
    }

    // 2. QQ 音乐解析 (部分链接支持)
    const qqMatch = musicUrl.match(/y\.qq\.com\/n\/ryqq\/songDetail\/([a-zA-Z0-9]+)/);
    if (qqMatch) {
      const mid = qqMatch[1];
      // 注意：QQ音乐直链通常有时效性或需要特殊参数，这里使用一个通用的解析接口作为尝试
      finalUrl = `https://api.uomg.com/api/rand.music?mid=${mid}&format=mp3`;
      trackName = `QQ音乐 - ${mid}`;
    }
    
    const newTrack: MusicFile = {
      name: trackName,
      download_url: finalUrl,
      type: 'remote'
    };
    
    const newPlaylist = [...playlist, newTrack];
    setPlaylist(newPlaylist);
    
    // Persist to localStorage
    const savedRemotes = JSON.parse(localStorage.getItem('baby_site_remote_music') || '[]');
    localStorage.setItem('baby_site_remote_music', JSON.stringify([...savedRemotes, newTrack]));
    
    setMusicUrl('');
    setShowUrlInput(false);
    setCurrentIndex(newPlaylist.length - 1);
    setIsPlaying(true);
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
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-6 w-80 max-h-[500px] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-pink-500 font-bold flex items-center gap-2">
                  <ListMusic size={20} /> 音乐中心
                </h3>
                <button onClick={() => setShowPlaylist(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {showUrlInput ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 space-y-2">
                  <input 
                    type="text" 
                    placeholder="粘贴 MP3 URL" 
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    className="w-full p-2 text-sm border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleAddUrl} className="flex-1 py-2 bg-pink-500 text-white rounded-lg text-xs font-bold">添加链接</button>
                    <button onClick={() => setShowUrlInput(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs">取消</button>
                  </div>
                </motion.div>
              ) : null}

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {playlist.map((track, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                      currentIndex === idx ? 'bg-pink-100 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${track.type === 'remote' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                    <span className="truncate text-sm flex-1">{track.name.split('.')[0]}</span>
                    {currentIndex === idx && isPlaying && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-pink-500"
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex gap-3">
                    <label className="cursor-pointer text-pink-400 hover:text-pink-600 transition-colors" title="本地上传">
                      <Upload size={18} />
                      <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <button onClick={() => setShowUrlInput(!showUrlInput)} className="text-blue-400 hover:text-blue-600" title="添加URL">
                      <LinkIcon size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={prevTrack} className="text-gray-400 hover:text-pink-400"><SkipBack size={18} /></button>
                    <button onClick={togglePlay} className="text-pink-500 hover:scale-110 transition-transform">
                      {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                    </button>
                    <button onClick={nextTrack} className="text-gray-400 hover:text-pink-400"><SkipForward size={18} /></button>
                  </div>
                </div>
                {uploading && <div className="text-[10px] text-pink-400 animate-pulse text-center">正在同步到云端仓库...</div>}
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
        crossOrigin="anonymous"
      />

      {isPlaying && (
        <div className="fixed bottom-24 right-10 pointer-events-none">
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 1, 0], x: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-pink-400 font-fancy text-3xl"
          >
            ♫
          </motion.div>
        </div>
      )}
    </>
  );
}
