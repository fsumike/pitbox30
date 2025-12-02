import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TrackLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
  created_at: string;
}

export function useTrackLocations() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTrackLocation = async (data: Omit<TrackLocation, 'id' | 'created_at'>) => {
    if (!user) {
      setError('You must be signed in to save track locations');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: result, error: saveError } = await supabase
        .from('track_locations')
        .insert([data])
        .select()
        .single();

      if (saveError) throw saveError;
      return result;
    } catch (err) {
      console.error('Error saving track location:', err);
      setError('Failed to save track location');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getTrackLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('track_locations')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      return data || [];
    } catch (err) {
      console.error('Error fetching track locations:', err);
      setError('Failed to fetch track locations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTrackById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('track_locations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching track:', err);
      setError('Failed to fetch track');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrackStats = async (
    trackId: string,
    stats: {
      best_lap_time?: number;
      average_speed?: number;
      setup_effectiveness?: number;
    }
  ) => {
    if (!user) {
      setError('You must be signed in to update track stats');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from('track_stats')
        .upsert(
          {
            track_id: trackId,
            user_id: user.id,
            ...stats,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,track_id',
            ignoreDuplicates: false
          }
        );

      if (upsertError) throw upsertError;
      return true;
    } catch (err) {
      console.error('Error updating track stats:', err);
      setError('Failed to update track stats');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveTrackLocation,
    getTrackLocations,
    getTrackById,
    updateTrackStats,
    loading,
    error
  };
}