import React, { useEffect, useRef, useState } from 'react';
import { isIOS, isAndroid, isWeb } from '../utils/capacitor';
import { Loader2 } from 'lucide-react';

interface NativeMapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title?: string;
    isSelected?: boolean;
  }>;
  height?: string;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (lat: number, lng: number) => void;
  showDirections?: boolean;
  destination?: {
    lat: number;
    lng: number;
  };
}

declare global {
  interface Window {
    webkit?: any;
    Android?: any;
  }
}

function NativeMapComponent({
  center,
  zoom = 13,
  markers = [],
  height = '400px',
  className = '',
  onMapClick,
  onMarkerClick,
  showDirections = false,
  destination
}: NativeMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (isIOS()) {
          await initializeIOSMap();
        } else if (isAndroid()) {
          await initializeAndroidMap();
        } else {
          setError('Native maps only available on iOS and Android. Use MapComponent for web.');
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing native map:', err);
        setError('Failed to initialize map. Please try again.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [center, markers, showDirections, destination]);

  const initializeIOSMap = async () => {
    const mapConfig = {
      center: center,
      zoom: zoom,
      markers: markers,
      showDirections: showDirections,
      destination: destination
    };

    if (window.webkit?.messageHandlers?.mapHandler) {
      window.webkit.messageHandlers.mapHandler.postMessage({
        action: 'initialize',
        config: mapConfig
      });
    } else {
      throw new Error('iOS map handler not available');
    }
  };

  const initializeAndroidMap = async () => {
    const mapConfig = {
      center: center,
      zoom: zoom,
      markers: markers,
      showDirections: showDirections,
      destination: destination
    };

    if (window.Android?.initializeMap) {
      window.Android.initializeMap(JSON.stringify(mapConfig));
    } else {
      throw new Error('Android map interface not available');
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (onMapClick) {
      onMapClick(lat, lng);
    }
  };

  const handleMarkerClick = (lat: number, lng: number) => {
    if (onMarkerClick) {
      onMarkerClick(lat, lng);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-lg overflow-hidden relative ${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800`}
        style={{ height }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-lg overflow-hidden relative ${className} flex items-center justify-center bg-red-50 dark:bg-red-900/20`}
        style={{ height }}
      >
        <div className="p-4 text-center">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-2">Map Error</p>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden relative ${className}`}
      style={{ height }}
      id="native-map-container"
    >
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 dark:text-gray-400">Native Map View</p>
        </div>
      </div>
    </div>
  );
}

export default NativeMapComponent;
