import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Geolocation } from '@capacitor/geolocation';
import { isNative } from '../utils/capacitor';

interface Track {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  track_type: string;
  surface: string;
  city: string;
  state: string;
  description: string;
}

interface TrackDetectionResult {
  currentTrack: Track | null;
  isAtTrack: boolean;
  distance: number | null;
  checkInId: string | null;
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

export const useTrackDetection = () => {
  const [result, setResult] = useState<TrackDetectionResult>({
    currentTrack: null,
    isAtTrack: false,
    distance: null,
    checkInId: null,
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const watchId = useRef<string | null>(null);
  const lastCheckInTrackId = useRef<string | null>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('track_locations')
        .select('*');

      if (error) throw error;
      if (data) setTracks(data);
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  };

  const createCheckIn = async (trackId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      let weatherConditions = {
        timestamp: new Date().toISOString(),
        latitude: 0,
        longitude: 0,
      };

      if (isNative) {
        const position = await Geolocation.getCurrentPosition();
        weatherConditions = {
          timestamp: new Date().toISOString(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      const { data, error } = await supabase
        .from('track_check_ins')
        .insert({
          user_id: user.id,
          track_id: trackId,
          check_in_time: new Date().toISOString(),
          is_public: true,
          weather_conditions: weatherConditions,
        })
        .select()
        .single();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error creating check-in:', error);
      return null;
    }
  };

  const updateCheckOut = async (checkInId: string) => {
    try {
      const { error } = await supabase
        .from('track_check_ins')
        .update({ check_out_time: new Date().toISOString() })
        .eq('id', checkInId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating check-out:', error);
    }
  };

  const checkPosition = useCallback(async (latitude: number, longitude: number) => {
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
        nearestTrack = track;
      }
    });

    const isAtTrack = nearestTrack && minDistance <= (nearestTrack.radius || 500);

    if (isAtTrack && nearestTrack) {
      if (lastCheckInTrackId.current !== nearestTrack.id) {
        const checkInId = await createCheckIn(nearestTrack.id);
        lastCheckInTrackId.current = nearestTrack.id;

        setResult({
          currentTrack: nearestTrack,
          isAtTrack: true,
          distance: minDistance,
          checkInId,
        });

        if (checkInId) {
          await supabase.from('notifications').insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            type: 'track_arrival',
            title: `Welcome to ${nearestTrack.name}!`,
            body: `You've arrived at ${nearestTrack.name} in ${nearestTrack.city}, ${nearestTrack.state}`,
            data: { track_id: nearestTrack.id, check_in_id: checkInId },
          });
        }
      }
    } else {
      if (lastCheckInTrackId.current && result.checkInId) {
        await updateCheckOut(result.checkInId);
        lastCheckInTrackId.current = null;
      }

      setResult({
        currentTrack: nearestTrack,
        isAtTrack: false,
        distance: minDistance,
        checkInId: null,
      });
    }
  }, [tracks, result.checkInId]);

  const startMonitoring = async () => {
    if (!isNative) {
      console.log('Track monitoring is only available on mobile devices');
      return;
    }

    try {
      const permission = await Geolocation.checkPermissions();

      if (permission.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        },
        (position) => {
          if (position) {
            checkPosition(position.coords.latitude, position.coords.longitude);
          }
        }
      );

      watchId.current = id;
      setIsMonitoring(true);
    } catch (error) {
      console.error('Error starting track monitoring:', error);
    }
  };

  const stopMonitoring = async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }

    if (result.checkInId) {
      await updateCheckOut(result.checkInId);
    }

    setIsMonitoring(false);
  };

  const manualCheckIn = async (trackId: string) => {
    try {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return;

      const checkInId = await createCheckIn(trackId);
      lastCheckInTrackId.current = trackId;

      setResult({
        currentTrack: track,
        isAtTrack: true,
        distance: 0,
        checkInId,
      });

      await supabase.from('notifications').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        type: 'track_arrival',
        title: `Checked in at ${track.name}`,
        body: `Manual check-in at ${track.name}`,
        data: { track_id: trackId, check_in_id: checkInId },
      });
    } catch (error) {
      console.error('Error with manual check-in:', error);
    }
  };

  return {
    ...result,
    isMonitoring,
    tracks,
    startMonitoring,
    stopMonitoring,
    manualCheckIn,
    refreshTracks: loadTracks,
  };
};
