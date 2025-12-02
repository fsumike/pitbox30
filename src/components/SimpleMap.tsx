import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface SimpleMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
}

function SimpleMap({ 
  center = [37.7749, -122.4194], // Default: San Francisco
  zoom = 13,
  height = '400px',
  className = ''
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    // Create new map instance
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker at the center
    const marker = L.marker(center).addTo(map);
    marker.bindPopup("Location").openPopup();
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation: [number, number] = [latitude, longitude];
          
          // Update map view to user's location
          map.setView(userLocation, zoom);
          
          // Update marker position
          marker.setLatLng(userLocation);
          marker.bindPopup("Your Location").openPopup();
        },
        (error) => {
          }
      );
    }
    
    // Clean up on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]); // Re-initialize map when center or zoom changes

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    ></div>
  );
}

export default SimpleMap;