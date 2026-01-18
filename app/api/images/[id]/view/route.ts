import { NextRequest, NextResponse } from 'next/server';
import { incrementView } from '@/app/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementView(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
