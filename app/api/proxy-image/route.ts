import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const branch = searchParams.get('branch') || 'Nutri-baby'; // 默认使用 Nutri-baby，因为照片多在这里
  const token = process.env.GITHUB_TOKEN;

  if (!path) {
    return new NextResponse('Path is required', { status: 400 });
  }

  try {
    // 对路径进行编码，但保留斜杠 / 不编码，以符合 GitHub API 的 contents/{path} 要求
    const encodedPath = path.split('/').map(p => encodeURIComponent(decodeURIComponent(p))).join('/');
    
    const response = await fetch(
      `https://api.github.com/repos/adminlove520/HaoPic/contents/${encodedPath}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch image from branch ${branch}: ${response.status} ${response.statusText}`);
      // 如果 Nutri-baby 没找到，尝试在 main 分支找
      if (branch === 'Nutri-baby') {
          const retryResponse = await fetch(
            `https://api.github.com/repos/adminlove520/HaoPic/contents/${encodedPath}?ref=main`,
            {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3.raw',
                },
            }
          );
          if (retryResponse.ok) {
              const contentType = retryResponse.headers.get('content-type') || 'image/jpeg';
              const blob = await retryResponse.blob();
              return new NextResponse(blob, {
                headers: {
                  'Content-Type': contentType,
                  'Cache-Control': 'public, max-age=3600',
                },
              });
          }
      }
      return new NextResponse('Failed to fetch image', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
