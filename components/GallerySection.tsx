'use client';

import { Photo } from '@/lib/github';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Lightbox from '@/components/Lightbox';

export default function GallerySection({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="w-full max-w-7xl mx-auto py-20 px-4">
      <h2 className="text-4xl md:text-6xl font-fancy text-center text-blue-500 mb-16 drop-shadow-sm">成长瞬间</h2>
      
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

      {selectedIndex !== null && (
        <Lightbox
          photos={photos}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  );
}
