import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const token = process.env.GITHUB_TOKEN;

  if (!path) {
    return new NextResponse('Path is required', { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/adminlove520/HaoPic/contents/${encodeURIComponent(path)}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.raw',
        },
      }
    );

    if (!response.ok) {
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
