import CherryBlossom from '@/components/CherryBlossom';
import MeteorShower from '@/components/MeteorShower';
import FloatingParticles from '@/components/FloatingParticles';
import GrowthClock from '@/components/GrowthClock';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      <CherryBlossom />
      <MeteorShower />
      <FloatingParticles />
      
      <div className="z-10 text-center space-y-8 max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-fancy text-pink-500 drop-shadow-md">
          景皓满月啦
        </h1>
        
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

      <div className="absolute bottom-10 animate-bounce">
        <p className="text-pink-400 opacity-60">向下滚动查看照片墙</p>
      </div>
    </main>
  );
}
