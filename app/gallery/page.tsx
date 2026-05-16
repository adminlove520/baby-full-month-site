import { getPhotos } from '@/lib/github';
import GallerySection from '@/components/GallerySection';
import Footer from '@/components/Footer';

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <main className="relative min-h-screen pt-24 pb-12 px-4 bg-baby-blue/10 perspective-1000">
      <div className="relative z-10">
        <GallerySection photos={photos} />
      </div>

      
      {photos.length === 0 && (
        <div className="text-center p-20 bg-white/40 backdrop-blur-md rounded-3xl border border-blue-100 max-w-2xl mx-auto relative z-10">
          <p className="text-blue-400">未能找到照片...</p>
          <p className="text-sm mt-2 opacity-60">请检查 Photos/张景皓 目录下是否有图片文件（支持 JPG, PNG, WEBP）。系统已尝试递归扫描所有子文件夹。</p>
        </div>
      )}
      
      {photos.length > 0 && <Footer />}
    </main>
  );
}
