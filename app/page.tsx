import CherryBlossom from '@/components/CherryBlossom';
import MeteorShower from '@/components/MeteorShower';
import FloatingParticles from '@/components/FloatingParticles';
import GrowthClock from '@/components/GrowthClock';
import GallerySection from '@/components/GallerySection';
import ScrollButton from '@/components/ScrollButton';
import { getPhotos } from '@/lib/github';

export default async function Home() {
  const photos = await getPhotos();

  return (
    <div className="bg-baby-pink">
      {/* Hero Section */}
      <main className="relative h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
        <CherryBlossom />
        <MeteorShower />
        <FloatingParticles />
        
        <div className="z-10 text-center space-y-8 max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-fancy text-pink-500 drop-shadow-md">
            景皓满月啦
          </h1>
          
          <GrowthClock />
          
          <p className="text-xl md:text-2xl text-baby-text leading-relaxed">
            亲爱的小景皓，欢迎来到这个色彩斑斓的世界。<br/>
            愿你眼里有星辰，心中有山海，<br/>
            愿你岁岁平安，满心欢喜，<br/>
            在爱与阳光中自由自在地成长。
          </p>

          <div className="pt-8">
            <div className="inline-block px-8 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-pink-200 shadow-xl text-pink-600 font-bold animate-pulse">
              2026.05.16 · 满月之喜
            </div>
          </div>
        </div>

        <ScrollButton targetId="gallery" />
      </main>

      {/* Gallery Section */}
      <div id="gallery">
        <GallerySection photos={photos} />
      </div>
      
      {/* Footer / Empty State placeholder */}
      {photos.length === 0 && (
        <div className="text-center py-20 px-4">
          <div className="max-w-md mx-auto p-10 bg-white/30 backdrop-blur-md rounded-3xl border border-pink-100">
            <p className="text-pink-400">正在努力加载照片中...</p>
            <p className="text-xs mt-4 text-baby-text opacity-50 text-left">
              提示：程序正在递归检索 Photos/张景皓 目录下的所有子文件夹。
              请确保 Vercel 环境变量 GITHUB_TOKEN 已正确配置。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
