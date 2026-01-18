import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getImage, deleteImage } from '@/app/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const image = await getImage(id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if image exists
    const image = await getImage(id);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Check if the user owns the image
    if (image.uploadedBy !== (session.user as any)?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteImage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
