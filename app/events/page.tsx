'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Event } from '@/types';

interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  eventType: string;
  imageUrl: string;
  registrationLink: string;
  isPublic: boolean;
}

const eventTypes = [
  'Wedding',
  'Portrait Session',
  'Exhibition',
  'Workshop',
  'Commercial Shoot',
  'Fashion Show',
  'Corporate Event',
  'Private Session',
  'Other',
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { data: session } = useSession();
  const isAdmin = !!session?.user;

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    eventType: 'Wedding',
    imageUrl: '',
    registrationLink: '',
    isPublic: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const url = isAdmin ? '/api/events?all=true' : '/api/events';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          location: '',
          date: '',
          time: '',
          eventType: 'Wedding',
          imageUrl: '',
          registrationLink: '',
          isPublic: true,
        });
        setShowForm(false);
        fetchEvents();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      
      if (response.ok) {
        setSuccessMessage('Event deleted successfully!');
        fetchEvents();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPastEvent = (dateString: string | Date) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-[#0C2340]/80 backdrop-blur-sm border-b border-[#0C2340]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-great-vibes text-4xl text-white hover:text-gray-300 transition-colors">
              AndyLukiJr
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors">
              Portfolio
            </Link>
            {isAdmin && (
              <Link href="/upload" className="text-white hover:text-gray-300 transition-colors">
                Upload
              </Link>
            )}
            {isAdmin && (
              <Link href="/edit" className="text-white hover:text-gray-300 transition-colors">
                Edit
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-light mb-4">Upcoming Events</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with my latest photography events, exhibitions, workshops, and where I'll be next.
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-600/20 border border-green-600 rounded-lg text-green-400 text-center">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <div className="max-w-2xl mx-auto mb-12">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-linear-to-r from-[#0C2340] to-[#1a3a5c] rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-[#0C2340]"
                >
                  + Add New Event
                </button>
              ) : (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Create New Event</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Event Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Summer Wedding Exhibition"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                        required
                      />
                    </div>

                    {/* Event Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Event Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                      >
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe what attendees can expect at this event..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors resize-none"
                        required
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Location <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Lusaka Exhibition Centre, Zambia"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                        required
                      />
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Time <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Event Image URL (optional)
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/event-image.jpg"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                      />
                    </div>

                    {/* Registration Link */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Registration/Ticket Link (optional)
                      </label>
                      <input
                        type="url"
                        name="registrationLink"
                        value={formData.registrationLink}
                        onChange={handleInputChange}
                        placeholder="https://tickets.example.com/event"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0C2340] focus:ring-1 focus:ring-[#0C2340] transition-colors"
                      />
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPublic"
                        id="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-600 text-[#0C2340] focus:ring-[#0C2340] bg-gray-800"
                      />
                      <label htmlFor="isPublic" className="text-sm font-medium text-gray-300">
                        Make this event visible to the public
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-linear-to-r from-[#0C2340] to-[#1a3a5c] rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Create Event
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-gray-400">
                {isAdmin 
                  ? 'Use the form above to add your next event.' 
                  : 'Check back soon for upcoming events and exhibitions.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id?.toString()}
                  className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                    isPastEvent(event.date)
                      ? 'bg-gray-900/30 border-gray-700 opacity-60'
                      : 'bg-gray-900/50 border-gray-600 hover:border-[#0C2340] hover:shadow-xl hover:shadow-[#0C2340]/20'
                  }`}
                >
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-[#0C2340]/90 text-white text-sm rounded-full">
                          {event.eventType}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[#0C2340] text-xl">📅</span>
                      <span className={`text-sm font-medium ${
                        isPastEvent(event.date) ? 'text-gray-500' : 'text-[#0C2340]'
                      }`}>
                        {isPastEvent(event.date) ? 'Past Event' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>🕐</span>
                        <span>{formatDate(event.date)} at {event.time}</span>
                      </div>
                    </div>

                    {/* Registration Link */}
                    {event.registrationLink && !isPastEvent(event.date) && (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2 text-center bg-[#0C2340] hover:bg-[#1a3a5c] rounded-lg text-white font-medium transition-colors"
                      >
                        Register / Get Tickets
                      </a>
                    )}

                    {/* Admin Delete Button */}
                    {isAdmin && (
                      <button
                        onClick={() => event._id && handleDelete(event._id.toString())}
                        className="mt-3 w-full py-2 text-center bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg text-red-400 font-medium transition-colors"
                      >
                        Delete Event
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Andy Luki Jr Photography. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}