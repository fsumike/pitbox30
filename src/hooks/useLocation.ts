import { useState, useEffect, useCallback } from 'react';
import { Geolocation, Position } from '@capacitor/geolocation';
import { isNative, getCurrentPosition } from '../utils/capacitor';
import { geocodeZipCode } from '../utils/distance';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  isManual: boolean;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
  enableGeocoding?: boolean;
  autoFetch?: boolean;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, initialDelay = 1000) {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Unknown error occurred');
      
      if (attempt < maxRetries - 1) {
        await wait(delay);
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError || new Error('Failed to fetch after multiple retries');
}

export function useLocation(options: UseLocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
    enableGeocoding = true,
    autoFetch = true
  } = options;

  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: autoFetch,
    address: null,
    city: null,
    state: null,
    country: null,
    isManual: false
  });

  const [isWatching, setIsWatching] = useState(watch);

  // Function to handle successful location retrieval
  const handleSuccess = useCallback(async (position: GeolocationPosition | Position) => {
    // Handle both web and Capacitor position formats
    const coords = 'coords' in position 
      ? position.coords 
      : { 
          latitude: position.latitude, 
          longitude: position.longitude, 
          accuracy: position.accuracy || null 
        };
    
    const { latitude, longitude, accuracy } = coords;
    
    setState(prev => ({
      ...prev,
      latitude,
      longitude,
      accuracy,
      error: null,
      loading: enableGeocoding // Keep loading if we need to geocode
    }));

    // Perform reverse geocoding if enabled
    if (enableGeocoding) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const data = await fetchWithRetry(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            signal: controller.signal,
            headers: {
              'User-Agent': 'PitBox.App/1.0',
              'Accept-Language': 'en'
            }
          }
        );
        
        clearTimeout(timeoutId);

        // Extract city and state from address components
        const addressData = data.address || {};
        const city = addressData.city || addressData.town || addressData.village || addressData.hamlet || '';
        const state = addressData.state || '';
        const country = addressData.country || '';

        // Create a city/state display format
        let cityStateDisplay = '';
        if (city && state) {
          cityStateDisplay = `${city}, ${state}`;
        } else if (city) {
          cityStateDisplay = city;
        } else if (state) {
          cityStateDisplay = state;
        }

        setState(prev => ({
          ...prev,
          address: data.display_name || 'Address not found',
          city: city,
          state: state,
          country: country,
          loading: false,
          error: null
        }));
      } catch (err) {
        console.error('Geocoding error:', err);
        setState(prev => ({
          ...prev,
          loading: false,
          address: 'Geocoding failed',
          error: err instanceof Error ? err.message : 'Failed to get address',
          // Keep the coordinates even if geocoding fails
          latitude: prev.latitude,
          longitude: prev.longitude,
          accuracy: prev.accuracy
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  }, [enableGeocoding]);

  // Function to handle location errors
  const handleError = useCallback((error: GeolocationPositionError | any) => {
    let message = 'Failed to get location';
    
    if ('code' in error) {
      // Web Geolocation API error
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Please allow location access to use this feature';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out';
          break;
      }
    } else if (error.message) {
      // Capacitor or other error with message
      message = error.message;
    }
    
    setState(prev => ({
      ...prev,
      error: message,
      loading: false
    }));
  }, []);

  // Function to manually trigger a location update
  const getLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (isNative) {
      // Use Capacitor Geolocation
      getCurrentPosition()
        .then(position => {
          if (position) {
            handleSuccess(position);
          } else {
            handleError({ message: 'Failed to get location' });
          }
        })
        .catch(handleError);
    } else if (navigator.geolocation) {
      // Use Web Geolocation API
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        { enableHighAccuracy, timeout, maximumAge }
      );
    } else {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your device',
        loading: false
      }));
    }
  }, [enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  // Toggle watching state
  const toggleWatch = useCallback(() => {
    setIsWatching(prev => !prev);
  }, []);

  // Effect to handle location watching
  useEffect(() => {
    // Check if geolocation is available
    if (isNative) {
      // Get initial position if autoFetch is enabled
      if (autoFetch) {
        getLocation();
      }

      let watchId: string | null = null;
      
      if (isWatching) {
        // Use Capacitor Geolocation for watching
        Geolocation.watchPosition(
          { enableHighAccuracy },
          (position, err) => {
            if (err) {
              handleError(err);
              return;
            }
            if (position) {
              handleSuccess(position);
            }
          }
        ).then(id => {
          watchId = id;
        });
        
        return () => {
          if (watchId) {
            Geolocation.clearWatch({ id: watchId });
          }
        };
      }
    } else if (navigator.geolocation) {
      // Get initial position if autoFetch is enabled
      if (autoFetch) {
        getLocation();
      }

      let watchId: number | null = null;
      
      if (isWatching) {
        watchId = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          { enableHighAccuracy, timeout, maximumAge }
        );
      }
      
      return () => {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    } else {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your device',
        loading: false
      }));
    }
  }, [
    isWatching,
    enableHighAccuracy,
    timeout,
    maximumAge,
    autoFetch,
    handleSuccess,
    handleError,
    getLocation
  ]);

  const setManualLocation = useCallback(async (zipCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const coords = await geocodeZipCode(zipCode);

    if (coords) {
      setState({
        latitude: coords.lat,
        longitude: coords.lng,
        accuracy: null,
        error: null,
        loading: false,
        address: `ZIP Code: ${zipCode}`,
        city: null,
        state: null,
        country: 'US',
        isManual: true
      });
    } else {
      setState(prev => ({
        ...prev,
        error: 'Invalid ZIP code or location not found',
        loading: false
      }));
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: null,
      loading: false,
      address: null,
      city: null,
      state: null,
      country: null,
      isManual: false
    });
  }, []);

  return {
    ...state,
    getLocation,
    setManualLocation,
    clearLocation,
    isWatching,
    toggleWatch
  };
}