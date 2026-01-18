import { NextRequest, NextResponse } from 'next/server';
import { incrementDownload } from '@/app/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementDownload(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
