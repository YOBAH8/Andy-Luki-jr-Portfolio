import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent, deleteEvent, updateEvent } from '@/app/lib/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// GET /api/events - Fetch all upcoming events (public) or all events (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allEvents = searchParams.get('all') === 'true';
    
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user;
    
    // Only fetch all events (including past) if user is admin
    const events = await getEvents(!isAdmin || !allEvents);
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { title, description, location, date, time, eventType } = body;
    
    if (!title || !description || !location || !date || !time || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventData = {
      title,
      description,
      location,
      date: new Date(date),
      time,
      eventType,
      imageUrl: body.imageUrl || '',
      registrationLink: body.registrationLink || '',
      isPublic: body.isPublic !== undefined ? body.isPublic : true,
      createdBy: (session.user as { id?: string })?.id || '',
      createdAt: new Date(),
    };

    const eventId = await createEvent(eventData);
    
    return NextResponse.json({ 
      message: 'Event created successfully',
      id: eventId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events - Delete an event (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    await deleteEvent(id);
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

// PUT /api/events - Update an event (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in as admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Convert date if present
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    await updateEvent(id, updates);
    
    return NextResponse.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}