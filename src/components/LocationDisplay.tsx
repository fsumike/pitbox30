import React from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { isNative } from '../utils/capacitor';

interface LocationDisplayProps {
  onLocationUpdate?: (lat: number, lon: number, address?: string) => void;
  className?: string;
  enableGeocoding?: boolean;
}

function LocationDisplay({ onLocationUpdate, className = '', enableGeocoding = true }: LocationDisplayProps) {
  const { latitude, longitude, address, loading, error, getLocation } = useLocation({
    enableHighAccuracy: true,
    watch: false,
    enableGeocoding
  });

  // Call onLocationUpdate when coordinates change
  React.useEffect(() => {
    if (latitude && longitude && onLocationUpdate) {
      onLocationUpdate(latitude, longitude, address || undefined);
    }
  }, [latitude, longitude, address, onLocationUpdate]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{address ? 'Getting address...' : 'Getting location...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span>{error}</span>
        <button 
          onClick={getLocation}
          className="ml-2 px-2 py-1 text-sm bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <MapPin className="w-4 h-4" />
        <span>Location unavailable</span>
        <button 
          onClick={getLocation}
          className="ml-2 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isNative ? "Get Location" : "Allow Location"}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <MapPin className="w-4 h-4" />
        <span>
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
        <button 
          onClick={getLocation}
          className="ml-2 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Update
        </button>
      </div>
      {address && (
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
          {address}
        </p>
      )}
    </div>
  );
}

export default LocationDisplay;