import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { useTrackDetection } from '../hooks/useTrackDetection';
import { useTrackLocations } from '../hooks/useTrackLocations';
import MapComponent from './MapComponent';
import 'leaflet/dist/leaflet.css';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
  detectedTrackId?: string;
  detectedTrackName?: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData;
  showTrackDetection?: boolean;
  className?: string;
}

export function LocationSelector({
  onLocationChange,
  initialLocation,
  showTrackDetection = true,
  className = ''
}: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
    address: currentAddress,
    accuracy,
    getLocation
  } = useLocation({
    enableHighAccuracy: true,
    autoFetch: false,
    enableGeocoding: true
  });

  const {
    currentTrack,
    isAtTrack,
    distance,
    tracks
  } = useTrackDetection();

  const { getTrackLocations } = useTrackLocations();
  const [savedTracks, setSavedTracks] = useState<any[]>([]);

  useEffect(() => {
    if (showTrackDetection) {
      loadSavedTracks();
    }
  }, [showTrackDetection]);

  const loadSavedTracks = async () => {
    const tracks = await getTrackLocations();
    setSavedTracks(tracks);
  };

  useEffect(() => {
    if (latitude && longitude && currentAddress) {
      const locationData: LocationData = {
        latitude,
        longitude,
        address: currentAddress,
        accuracy: accuracy || undefined,
        detectedTrackId: currentTrack?.id,
        detectedTrackName: currentTrack?.name
      };
      setSelectedLocation(locationData);
      onLocationChange(locationData);
    }
  }, [latitude, longitude, currentAddress, accuracy, currentTrack]);

  const handleUseCurrentLocation = () => {
    getLocation();
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'PitBox.App/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const osmResults = await response.json();

      const combinedResults = [
        ...savedTracks
          .filter(track =>
            track.name.toLowerCase().includes(query.toLowerCase()) ||
            track.city?.toLowerCase().includes(query.toLowerCase()) ||
            track.state?.toLowerCase().includes(query.toLowerCase())
          )
          .map(track => ({
            ...track,
            isSavedTrack: true,
            display_name: `${track.name} - ${track.city}, ${track.state}`,
            lat: track.latitude.toString(),
            lon: track.longitude.toString()
          })),
        ...osmResults
      ];

      setSearchResults(combinedResults);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    const locationData: LocationData = {
      latitude: lat,
      longitude: lng,
      address: result.display_name,
      detectedTrackId: result.isSavedTrack ? result.id : undefined,
      detectedTrackName: result.isSavedTrack ? result.name : undefined
    };

    setSelectedLocation(locationData);
    setSearchQuery(result.display_name);
    setShowResults(false);
    onLocationChange(locationData);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'PitBox.App/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Reverse geocoding failed');

      const data = await response.json();

      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };

      setSelectedLocation(locationData);
      setSearchQuery(locationData.address);
      onLocationChange(locationData);
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      const locationData: LocationData = {
        latitude: lat,
        longitude: lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
      setSelectedLocation(locationData);
      setSearchQuery(locationData.address);
      onLocationChange(locationData);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Track Detection Banner */}
      {showTrackDetection && isAtTrack && currentTrack && (
        <div className="flex items-center gap-3 p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl">
          <CheckCircle2 className="w-6 h-6 text-brand-gold flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              At {currentTrack.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTrack.city}, {currentTrack.state} • {Math.round(distance || 0)}m away
            </p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search for track or address..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-gold focus:border-transparent"
        />
        {searchLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
        )}

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={`${result.place_id || result.osm_id || result.id}-${index}`}
                onClick={() => handleResultSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <MapPin className={`w-5 h-5 flex-shrink-0 ${
                  result.isSavedTrack ? 'text-brand-gold' : 'text-gray-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {result.isSavedTrack ? result.name : result.display_name}
                  </p>
                  {result.isSavedTrack && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Saved Track • {result.track_type}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        disabled={locationLoading}
        className="w-full bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-gray-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {locationLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Getting Location...
          </>
        ) : (
          <>
            <Navigation className="w-5 h-5" />
            Use Current Location
          </>
        )}
      </button>

      {/* Location Error */}
      {locationError && (
        <div className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-200">
              Location Error
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {locationError}
            </p>
          </div>
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Selected Location
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {selectedLocation.address}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </span>
                {selectedLocation.accuracy && (
                  <span>• ±{Math.round(selectedLocation.accuracy)}m</span>
                )}
              </div>
              {selectedLocation.detectedTrackName && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm font-medium text-brand-gold">
                    {selectedLocation.detectedTrackName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map */}
      {selectedLocation && (
        <div className="h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
          <MapComponent
            center={[selectedLocation.latitude, selectedLocation.longitude]}
            zoom={15}
            markers={[
              {
                position: [selectedLocation.latitude, selectedLocation.longitude],
                popup: selectedLocation.address,
                isSelected: true
              },
              ...tracks
                .filter(track =>
                  track.id !== selectedLocation.detectedTrackId &&
                  Math.abs(Number(track.latitude) - selectedLocation.latitude) < 0.1 &&
                  Math.abs(Number(track.longitude) - selectedLocation.longitude) < 0.1
                )
                .map(track => ({
                  position: [Number(track.latitude), Number(track.longitude)] as [number, number],
                  popup: `${track.name} - ${track.city}, ${track.state}`,
                  isSelected: false
                }))
            ]}
            height="100%"
            onMapClick={handleMapClick}
          />
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Click on the map to select a location, or use GPS to get your current position
      </p>
    </div>
  );
}
