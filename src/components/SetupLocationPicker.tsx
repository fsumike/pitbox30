import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import MapComponent from './MapComponent';
import 'leaflet/dist/leaflet.css';

interface SetupLocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
  initialLocation?: string;
  className?: string;
}

export function SetupLocationPicker({ 
  onLocationSelect, 
  initialLocation,
  className = ''
}: SetupLocationPickerProps) {
  const [manualAddress, setManualAddress] = useState(initialLocation || '');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  
  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
    address: currentAddress,
    getLocation
  } = useLocation({
    enableHighAccuracy: true,
    watch: false,
    enableGeocoding: true
  });

  // Forward geocoding function
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  };

  // Handle manual address input
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualAddress(value);
    
    // Debounce search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  // Handle search result selection
  const handleResultSelect = async (prediction: any) => {
    if (prediction.isSaved) {
      // Handle saved track selection
      const track = searchResults.find(t => t.id === prediction.placeId);
      if (track) {
        onTrackSelect({
          id: track.id,
          name: track.name,
          location: {
            lat: parseFloat(track.latitude),
            lng: parseFloat(track.longitude)
          },
          address: track.address
        });
      }
    } else {
      const location = {
        address: prediction.display_name,
        coordinates: {
          lat: parseFloat(prediction.lat),
          lng: parseFloat(prediction.lon)
        }
      };
      setSelectedLocation(location);
      onLocationSelect(location);
    }
    setManualAddress(prediction.display_name);
    setShowResults(false);
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    // Reverse geocode the clicked location
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const location = {
          address: data.display_name,
          coordinates: { lat, lng }
        };
        setSelectedLocation(location);
        setManualAddress(data.display_name);
        onLocationSelect(location);
      })
      .catch(err => {
        console.error('Error reverse geocoding:', err);
        // Still update with coordinates even if geocoding fails
        const location = {
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          coordinates: { lat, lng }
        };
        setSelectedLocation(location);
        setManualAddress(location.address);
        onLocationSelect(location);
      });
  };

  // Handle current location button
  const handleUseCurrentLocation = () => {
    getLocation();
  };

  // Update when current location is obtained
  useEffect(() => {
    if (latitude && longitude && currentAddress) {
      const location = {
        address: currentAddress,
        coordinates: { lat: latitude, lng: longitude }
      };
      setSelectedLocation(location);
      setManualAddress(currentAddress);
      onLocationSelect(location);
    }
  }, [latitude, longitude, currentAddress, onLocationSelect]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={manualAddress}
          onChange={handleAddressChange}
          placeholder="Enter location or use current position..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-gold"
        />
        
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            {searchResults.map((prediction, index) => (
              <button
                key={`${prediction.place_id || prediction.osm_id}-${index}`}
                onClick={() => handleResultSelect(prediction)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 ${
                  prediction.isSaved ? 'text-brand-gold' : 'text-gray-400'
                }`} />
                <span className="truncate">{prediction.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        disabled={locationLoading}
        className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
      >
        {locationLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
        Use Current Location
      </button>

      {/* Location Error */}
      {locationError && (
        <div className="flex items-center gap-2 text-red-500 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{locationError}</p>
        </div>
      )}

      {/* Map Display */}
      {selectedLocation?.coordinates && (
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapComponent 
            center={[selectedLocation.coordinates.lat, selectedLocation.coordinates.lng]}
            markers={[{ 
              position: [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
              popup: selectedLocation.address
            }]}
            height="100%"
            onMapClick={handleMapClick}
          />
        </div>
      )}
    </div>
  );
}