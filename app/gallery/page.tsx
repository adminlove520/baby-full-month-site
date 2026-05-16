import { getPhotos } from '@/lib/github';
import CherryBlossom from '@/components/CherryBlossom';
import MeteorShower from '@/components/MeteorShower';

export default async function Gallery() {
  const photos = await getPhotos();

  return (
    <main className="relative min-h-screen pt-24 pb-12 px-4 bg-baby-blue/30">
      <CherryBlossom />
      <MeteorShower />
      
      <div className="max-w-7xl mx-auto z-10 relative">
        <h2 className="text-4xl font-fancy text-center text-blue-500 mb-12">成长瞬间</h2>
        
        {photos.length === 0 ? (
          <div className="text-center p-20 bg-white/40 backdrop-blur-md rounded-3xl border border-blue-100">
            <p className="text-blue-400">正在同步 GitHub 仓库的照片...</p>
            <p className="text-sm mt-2">请确保配置了有效的 GITHUB_TOKEN 环境变量</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <div key={photo.path} className="break-inside-avoid group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-4 border-white">
                <img
                  src={photo.download_url}
                  alt={photo.name}
                  className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{photo.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
