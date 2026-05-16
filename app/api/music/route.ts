import { getMusic, uploadToGithub } from '@/lib/github';
import { NextResponse } from 'next/server';

export async function GET() {
  const music = await getMusic();
  return NextResponse.json(music);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const success = await uploadToGithub(file.name, base64, 'Music');
    
    if (success) {
      return NextResponse.json({ message: 'Upload successful' });
    } else {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
