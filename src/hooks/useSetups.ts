import { useState } from 'react';
import { supabase, Setup } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentPosition, isNative } from '../utils/capacitor';

interface Track {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export function useSetups() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectTrackFromLocation = async (latitude: number, longitude: number): Promise<Track | null> => {
    try {
      const { data: tracks, error: tracksError } = await supabase
        .from('track_locations')
        .select('id, name, latitude, longitude, radius');

      if (tracksError || !tracks) return null;

      let nearestTrack: Track | null = null;
      let minDistance = Infinity;

      tracks.forEach((track) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          Number(track.latitude),
          Number(track.longitude)
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestTrack = track as Track;
        }
      });

      if (nearestTrack && minDistance <= (nearestTrack.radius || 500)) {
        return nearestTrack;
      }

      return null;
    } catch (err) {
      console.error('Error detecting track:', err);
      return null;
    }
  };

  const captureLocation = async () => {
    try {
      let position;

      if (isNative) {
        position = await getCurrentPosition();
      } else if (navigator.geolocation) {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
      }

      if (!position) return null;

      const coords = 'coords' in position ? position.coords : position;

      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || null,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error capturing location:', err);
      return null;
    }
  };

  const saveSetup = async (
    carType: string,
    setupData: Record<string, any>,
    customFields: Record<string, any> = {},
    bestLapTime: number | null = null,
    raceType: string | null = null
  ) => {
    if (!user) {
      setError('You must be signed in to save setups');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username: user.email }]);

        if (createProfileError) throw createProfileError;
      }

      const locationData = await captureLocation();
      let detectedTrack: Track | null = null;
      let trackName = setupData.general?.track_track?.feature || null;

      if (locationData) {
        detectedTrack = await detectTrackFromLocation(
          locationData.latitude,
          locationData.longitude
        );

        if (detectedTrack && !trackName) {
          trackName = detectedTrack.name;
        }
      }

      const setupToSave = {
        user_id: user.id,
        car_type: carType,
        car_number: setupData.general?.car_number?.feature || null,
        track_name: trackName,
        track_conditions: {},
        setup_data: setupData,
        custom_fields: customFields,
        best_lap_time: bestLapTime,
        race_type: raceType || null,
        latitude: locationData?.latitude || null,
        longitude: locationData?.longitude || null,
        location_accuracy: locationData?.accuracy || null,
        detected_track_id: detectedTrack?.id || null,
        location_captured_at: locationData?.timestamp || null
      };

      const { data, error } = await supabase
        .from('setups')
        .insert([setupToSave])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError('Failed to save setup');
      console.error('Error saving setup:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadSetups = async (carType: string) => {
    if (!user) {
      setError('You must be signed in to load setups');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('setups')
        .select('*')
        .eq('user_id', user.id)
        .eq('car_type', carType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError('Failed to load setups');
      console.error('Error loading setups:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteSetup = async (setupId: string) => {
    if (!user) {
      setError('You must be signed in to delete setups');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('setups')
        .delete()
        .eq('id', setupId)
        .eq('user_id', user.id); // Ensure user can only delete their own setups

      if (error) throw error;
      return true;
    } catch (err) {
      setError('Failed to delete setup');
      console.error('Error deleting setup:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveSetup,
    loadSetups,
    deleteSetup,
    loading,
    error
  };
}