'use client';

import { getPhotos, Photo } from '@/lib/github';
import CherryBlossom from '@/components/CherryBlossom';
import MeteorShower from '@/components/MeteorShower';
import { useEffect, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import { motion } from 'framer-motion';

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        const data = await res.json();
        setPhotos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  return (
    <main className="relative min-h-screen pt-24 pb-12 px-4 bg-baby-blue/30">
      <CherryBlossom />
      <MeteorShower />
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <h2 className="text-4xl md:text-6xl font-fancy text-center text-blue-500 mb-16 drop-shadow-sm">成长瞬间</h2>
        
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center p-20 bg-white/40 backdrop-blur-md rounded-3xl border border-blue-100 shadow-xl">
            <p className="text-blue-400">正在同步 GitHub 仓库的照片...</p>
            <p className="text-sm mt-2 opacity-60">请确保配置了有效的 GITHUB_TOKEN 环境变量</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.path}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedIndex(index)}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-white bg-white/50"
              >
                <img
                  src={photo.download_url}
                  alt={photo.name}
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium tracking-wide">{photo.name.split('.')[0]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </main>
  );
}
