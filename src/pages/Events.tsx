import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Plus, Check, X, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  event_type: 'race' | 'track_day' | 'meetup' | 'other';
  location: string;
  latitude: number | null;
  longitude: number | null;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  rsvp_count: number;
  is_public: boolean;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  user_rsvp?: {
    status: 'going' | 'interested' | 'not_going';
  } | null;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'going' | 'upcoming'>('upcoming');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user, filter]);

  const loadEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          profiles:creator_id (username, avatar_url)
        `)
        .eq('is_public', true)
        .order('start_date', { ascending: true });

      if (filter === 'upcoming') {
        query = query.gte('start_date', new Date().toISOString());
      }

      const { data: eventsData, error: eventsError } = await query;
      if (eventsError) throw eventsError;

      if (user && eventsData) {
        const eventIds = eventsData.map(e => e.id);
        const { data: rsvps } = await supabase
          .from('event_rsvps')
          .select('event_id, status')
          .eq('user_id', user.id)
          .in('event_id', eventIds);

        const rsvpMap = new Map(rsvps?.map(r => [r.event_id, r]) || []);

        let filteredEvents = eventsData.map(event => ({
          ...event,
          user_rsvp: rsvpMap.get(event.id) || null
        }));

        if (filter === 'going') {
          filteredEvents = filteredEvents.filter(e => e.user_rsvp?.status === 'going');
        }

        setEvents(filteredEvents);
      } else {
        setEvents(eventsData || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId: string, status: 'going' | 'interested' | 'not_going') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status
        });

      if (error) throw error;
      loadEvents();
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'race': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'track_day': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'meetup': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-brand-gold animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-brand-gold" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
            </div>
            <button
              onClick={() => navigate('/create-event')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-gold hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'upcoming'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('going')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'going'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              I'm Going
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Events
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Events Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'going'
                ? "You haven't RSVP'd to any events yet"
                : 'Be the first to create a racing event!'}
            </p>
            <button
              onClick={() => navigate('/create-event')}
              className="px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {event.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>

                  {event.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {format(new Date(event.start_date), 'MMM d, yyyy @ h:mm a')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      {event.rsvp_count} {event.rsvp_count === 1 ? 'person' : 'people'} going
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {event.user_rsvp?.status === 'going' ? (
                      <button
                        onClick={() => handleRSVP(event.id, 'not_going')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Going
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRSVP(event.id, 'going')}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        RSVP
                      </button>
                    )}
                    <button
                      onClick={() => handleRSVP(event.id, 'interested')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        event.user_rsvp?.status === 'interested'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
