import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useGeoLocation } from './useGeoLocation';

export interface Advertisement {
  id: string;
  advertiser_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  click_url: string;
  regions: string[];
  states: string[];
  ad_type: 'banner' | 'sponsored_post' | 'featured_listing' | 'sidebar';
  priority: number;
  impressions: number;
  clicks: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

interface UseAdvertisementsOptions {
  adType?: string;
  limit?: number;
  autoFetch?: boolean;
}

export function useAdvertisements(options: UseAdvertisementsOptions = {}) {
  const { adType, limit = 5, autoFetch = true } = options;
  const { user } = useAuth();
  const { state, region, latitude, longitude, loading: locationLoading } = useGeoLocation();

  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.rpc('get_ads_by_location', {
        user_state: state,
        user_region: region,
        ad_type_filter: adType || null,
        limit_count: limit,
      });

      if (fetchError) {
        let query = supabase
          .from('advertisements')
          .select('*')
          .eq('is_active', true)
          .order('priority', { ascending: false })
          .limit(limit);

        if (adType) {
          query = query.eq('ad_type', adType);
        }

        const { data: fallbackData, error: fallbackError } = await query;

        if (fallbackError) throw fallbackError;

        const filteredAds = (fallbackData || []).filter((ad: Advertisement) => {
          const hasStates = ad.states && ad.states.length > 0;
          const hasRegions = ad.regions && ad.regions.length > 0;

          if (!hasStates && !hasRegions) return true;
          if (state && hasStates && ad.states.includes(state)) return true;
          if (region && hasRegions && ad.regions.includes(region)) return true;

          return false;
        });

        setAds(filteredAds);
      } else {
        setAds(data || []);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load advertisements');
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, [state, region, adType, limit]);

  const recordImpression = useCallback(async (adId: string) => {
    try {
      const deviceType = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'web';

      await supabase.rpc('record_ad_impression', {
        p_ad_id: adId,
        p_user_id: user?.id || null,
        p_latitude: latitude,
        p_longitude: longitude,
        p_state: state,
        p_region: region,
        p_device: deviceType,
      });
    } catch (err) {
      console.error('Error recording impression:', err);
    }
  }, [user?.id, latitude, longitude, state, region]);

  const recordClick = useCallback(async (adId: string) => {
    try {
      const deviceType = /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'web';

      await supabase.rpc('record_ad_click', {
        p_ad_id: adId,
        p_user_id: user?.id || null,
        p_latitude: latitude,
        p_longitude: longitude,
        p_state: state,
        p_region: region,
        p_device: deviceType,
      });
    } catch (err) {
      console.error('Error recording click:', err);
    }
  }, [user?.id, latitude, longitude, state, region]);

  useEffect(() => {
    if (autoFetch && !locationLoading) {
      fetchAds();
    }
  }, [autoFetch, locationLoading, fetchAds]);

  return {
    ads,
    loading: loading || locationLoading,
    error,
    userState: state,
    userRegion: region,
    fetchAds,
    recordImpression,
    recordClick,
  };
}

export default useAdvertisements;
