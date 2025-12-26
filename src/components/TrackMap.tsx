import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import MapComponent from './MapComponent';

interface TrackMapProps {
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  address: string;
  onNavigate?: () => void;
}

export function TrackMap({ location, name, address, onNavigate }: TrackMapProps) {
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      // Open in Google Maps by default
      openInGoogleMaps();
    }
  };

  const openInGoogleMaps = () => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try to open the Google Maps app
      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    } else {
      // On desktop, open in a new tab
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        '_blank'
      );
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="h-[300px] relative">
        <MapComponent 
          center={[location.lat, location.lng]}
          markers={[{ position: [location.lat, location.lng], popup: name }]}
          height="100%"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{address}</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleNavigate}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </button>
          
          <button
            onClick={openInGoogleMaps}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}