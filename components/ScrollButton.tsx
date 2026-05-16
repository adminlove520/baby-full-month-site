'use client';

import { ChevronDown } from 'lucide-react';

export default function ScrollButton({ targetId }: { targetId: string }) {
  const scrollTo = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="absolute bottom-10 animate-bounce cursor-pointer flex flex-col items-center gap-2 group" 
      onClick={scrollTo}
    >
      <p className="text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity">向下滚动查看照片墙</p>
      <ChevronDown className="text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
