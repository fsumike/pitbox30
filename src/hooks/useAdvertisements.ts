import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLocation } from './useLocation';

export interface Advertisement {
  id: string;
  advertiser_id: string;
  business_name: string;
  title: string;
  description: string | null;
  image_url: string | null;
  website_url: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  reach_type: 'local' | 'regional' | 'national';
  radius_miles: number;
  category: 'parts' | 'services' | 'tracks' | 'equipment' | 'other';
  distance_miles?: number;
  impressions: number;
  clicks: number;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdvertisements(maxResults: number = 10) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();

  useEffect(() => {
    if (location) {
      fetchAdvertisements();
    }
  }, [location, maxResults]);

  const fetchAdvertisements = async () => {
    if (!location) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_nearby_advertisements', {
        user_lat: location.latitude,
        user_lon: location.longitude,
        max_results: maxResults
      });

      if (fetchError) throw fetchError;

      setAdvertisements(data || []);
    } catch (err) {
      console.error('Error fetching advertisements:', err);
      setError('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      await supabase.rpc('increment_ad_impressions', { ad_id: adId });
    } catch (err) {
      console.error('Error tracking impression:', err);
    }
  };

  const trackClick = async (adId: string) => {
    try {
      await supabase.rpc('increment_ad_clicks', { ad_id: adId });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  return {
    advertisements,
    loading,
    error,
    trackImpression,
    trackClick,
    refetch: fetchAdvertisements
  };
}

export function useUserAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAdvertisements();
  }, []);

  const fetchUserAdvertisements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('advertisements')
        .select('*')
        .eq('advertiser_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setAdvertisements(data || []);
    } catch (err) {
      console.error('Error fetching user advertisements:', err);
      setError('Failed to load your advertisements');
    } finally {
      setLoading(false);
    }
  };

  const createAdvertisement = async (ad: Partial<Advertisement>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('advertisements')
        .insert([{ ...ad, advertiser_id: user.id }])
        .select()
        .single();

      if (createError) throw createError;

      await fetchUserAdvertisements();
      return data;
    } catch (err) {
      console.error('Error creating advertisement:', err);
      throw err;
    }
  };

  const updateAdvertisement = async (id: string, updates: Partial<Advertisement>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('advertisements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchUserAdvertisements();
      return data;
    } catch (err) {
      console.error('Error updating advertisement:', err);
      throw err;
    }
  };

  const deleteAdvertisement = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchUserAdvertisements();
    } catch (err) {
      console.error('Error deleting advertisement:', err);
      throw err;
    }
  };

  return {
    advertisements,
    loading,
    error,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    refetch: fetchUserAdvertisements
  };
}
