'use client';

import { Photo } from '@/lib/github';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import Lightbox from '@/components/Lightbox';

function PhotoCard({ photo, index, onClick }: { photo: Photo, index: number, onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative h-auto w-full break-inside-avoid group cursor-pointer rounded-2xl bg-white/40 p-2 shadow-xl hover:shadow-[0_20px_50px_rgba(244,114,182,0.3)] transition-all duration-500 border border-white/50"
    >
      <div
        style={{
          transform: "translateZ(60px)",
          transformStyle: "preserve-3d",
        }}
        className="relative overflow-hidden rounded-xl shadow-inner"
      >
        <img
          src={photo.download_url}
          alt={photo.name}
          className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div 
          style={{ transform: "translateZ(80px)" }}
          className="absolute inset-0 bg-gradient-to-t from-pink-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
        >
          <p className="text-white text-base font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-fancy">
            {photo.name.split('.')[0]}
          </p>
        </div>
      </div>
      {/* 3D background shadow effect */}
      <div className="absolute inset-0 bg-pink-200/20 rounded-2xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'translateZ(-20px)' }} />
    </motion.div>
  );
}

export default function GallerySection({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <section id="gallery" className="w-full max-w-7xl mx-auto py-24 px-4 perspective-1000">
      <h2 className="text-4xl md:text-7xl font-fancy text-center text-blue-500/80 mb-20 drop-shadow-lg tracking-wider">
        3D 成长之旅
      </h2>
      
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        {photos.map((photo, index) => (
          <PhotoCard 
            key={photo.path} 
            photo={photo} 
            index={index} 
            onClick={() => setSelectedIndex(index)} 
          />
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
