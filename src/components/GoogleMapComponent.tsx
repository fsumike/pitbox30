import React from 'react';
import UniversalMapComponent from './UniversalMapComponent';

interface GoogleMapComponentProps {
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

function GoogleMapComponent(props: GoogleMapComponentProps) {
  return <UniversalMapComponent {...props} />;
}

export default GoogleMapComponent;