import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { updateImageLikes } from '@/app/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { liked } = await request.json();

    await updateImageLikes(id, userId, liked);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
