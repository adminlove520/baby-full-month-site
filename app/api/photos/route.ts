import { getPhotos } from '@/lib/github';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const photos = await getPhotos();
  return NextResponse.json(photos);
}
