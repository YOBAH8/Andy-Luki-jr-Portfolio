import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getImages, createImage } from '@/app/lib/database';
import { Image } from '@/types';
import fs from 'fs';
import path from 'path';

export async function GET() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('yourusername') || process.env.MONGODB_URI.includes('yourcluster')) {
    return NextResponse.json({ error: 'Please configure MONGODB_URI in .env.local with your MongoDB connection string (Atlas or local)' }, { status: 500 });
  }

  try {
    const images = await getImages();
    return NextResponse.json(images);
} catch (error) {
  console.error('Error fetching images:', error);
  const errorMessage = process.env.NODE_ENV === 'development' ? (error as Error).message : 'Database connection failed';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const story = formData.get('story') as string;
    const colors = formData.get('colors') as string;
    const locked = formData.get('locked') === 'true';
    const file = formData.get('file') as File;

    if (!title || !file) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 });
    }

    // Save file
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${fileName}`;

    const imageData: Omit<Image, '_id'> = {
      title,
      description: description || '',
      story: story || '',
      colors: colors ? colors.split(',').map((c: string) => c.trim()) : [],
      url,
      likes: [],
      downloads: 0,
      views: 0,
      locked,
      uploadedBy: userId,
      createdAt: new Date(),
    };

    const id = await createImage(imageData);

    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
