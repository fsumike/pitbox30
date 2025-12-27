import { useState, useEffect, useCallback } from 'react';

interface GeoLocationState {
  latitude: number | null;
  longitude: number | null;
  state: string | null;
  region: string | null;
  city: string | null;
  loading: boolean;
  error: string | null;
}

const STATE_TO_REGION: Record<string, string> = {
  WA: 'west', OR: 'west', CA: 'west', NV: 'west', ID: 'west',
  MT: 'west', WY: 'west', UT: 'west', CO: 'west', AK: 'west', HI: 'west',
  AZ: 'southwest', NM: 'southwest', TX: 'southwest', OK: 'southwest',
  ND: 'midwest', SD: 'midwest', NE: 'midwest', KS: 'midwest',
  MN: 'midwest', IA: 'midwest', MO: 'midwest', WI: 'midwest',
  IL: 'midwest', IN: 'midwest', MI: 'midwest', OH: 'midwest',
  AR: 'southeast', LA: 'southeast', MS: 'southeast', AL: 'southeast',
  TN: 'southeast', KY: 'southeast', WV: 'southeast', VA: 'southeast',
  NC: 'southeast', SC: 'southeast', GA: 'southeast', FL: 'southeast',
  ME: 'northeast', NH: 'northeast', VT: 'northeast', MA: 'northeast',
  RI: 'northeast', CT: 'northeast', NY: 'northeast', NJ: 'northeast',
  PA: 'northeast', DE: 'northeast', MD: 'northeast', DC: 'northeast',
};

const REGION_NAMES: Record<string, string> = {
  west: 'West Coast & Mountain',
  southwest: 'Southwest',
  midwest: 'Midwest',
  southeast: 'Southeast',
  northeast: 'Northeast',
};

export function useGeoLocation() {
  const [location, setLocation] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
    state: null,
    region: null,
    city: null,
    loading: true,
    error: null,
  });

  const getStateFromCoordinates = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
      );
      const data = await response.json();

      if (data.address) {
        const stateCode = data.address.state ?
          getStateCode(data.address.state) :
          data.address['ISO3166-2-lvl4']?.split('-')[1];

        return {
          state: stateCode || null,
          city: data.address.city || data.address.town || data.address.village || null,
        };
      }
      return { state: null, city: null };
    } catch {
      return { state: null, city: null };
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported',
      }));
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const { state, city } = await getStateFromCoordinates(latitude, longitude);
      const region = state ? STATE_TO_REGION[state] || null : null;

      setLocation({
        latitude,
        longitude,
        state,
        region,
        city,
        loading: false,
        error: null,
      });
    } catch (err) {
      const error = err as GeolocationPositionError;
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to get location',
      }));
    }
  }, [getStateFromCoordinates]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    ...location,
    regionName: location.region ? REGION_NAMES[location.region] : null,
    refreshLocation,
    STATE_TO_REGION,
    REGION_NAMES,
  };
}

function getStateCode(stateName: string): string | null {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC',
  };
  return stateMap[stateName] || null;
}

export default useGeoLocation;
