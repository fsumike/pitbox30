import React from 'react';
import { isIOS, isAndroid, isWeb } from '../utils/capacitor';
import MapComponent from './MapComponent';
import NativeMapComponent from './NativeMapComponent';

interface UniversalMapComponentProps {
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
    popup?: string;
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

function UniversalMapComponent(props: UniversalMapComponentProps) {
  const {
    center,
    zoom = 13,
    markers = [],
    height = '400px',
    className = '',
    onMapClick,
    onMarkerClick,
    showDirections = false,
    destination
  } = props;

  if (isWeb()) {
    const leafletMarkers = markers.map(m => ({
      position: [m.position.lat, m.position.lng] as [number, number],
      popup: m.popup || m.title,
      isSelected: m.isSelected
    }));

    return (
      <MapComponent
        center={[center.lat, center.lng]}
        zoom={zoom}
        markers={leafletMarkers}
        height={height}
        className={className}
        onMapClick={onMapClick}
        onMarkerClick={onMarkerClick}
      />
    );
  }

  if (isIOS() || isAndroid()) {
    return (
      <NativeMapComponent
        center={center}
        zoom={zoom}
        markers={markers}
        height={height}
        className={className}
        onMapClick={onMapClick}
        onMarkerClick={onMarkerClick}
        showDirections={showDirections}
        destination={destination}
      />
    );
  }

  return (
    <div
      className={`rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}
      style={{ height }}
    >
      <p className="text-gray-600 dark:text-gray-400">Map not available</p>
    </div>
  );
}

export default UniversalMapComponent;
