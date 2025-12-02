import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="marker-pin ${isSelected ? 'selected' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="marker-icon">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
    isSelected?: boolean;
  }>;
  height?: string;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (lat: number, lng: number) => void;
}

function MapComponent({
  center,
  zoom = 13,
  markers = [],
  height = '400px',
  className = '',
  onMapClick,
  onMarkerClick
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    }

    try {
      // Create map instance
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        dragging: !L.Browser.mobile,
        tap: !L.Browser.mobile
      }).setView(center, zoom);
      
      mapInstanceRef.current = map;

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Add markers
      if (markers.length > 0) {
        markers.forEach(marker => {
          // Create custom icon
          const icon = createCustomIcon(marker.isSelected);
          
          // Create marker with custom icon
          const m = L.marker(marker.position, { icon }).addTo(map);
          
          // Add popup if provided
          if (marker.popup) {
            m.bindPopup(marker.popup);
            if (marker.isSelected) {
              m.openPopup();
            }
          }
          
          // Add click handler
          if (onMarkerClick) {
            m.on('click', () => onMarkerClick(marker.position[0], marker.position[1]));
          }
          
          markersRef.current.push(m);
        });
      } else {
        // Add default marker at center if no markers provided
        const defaultMarker = L.marker(center, { icon: createCustomIcon() }).addTo(map);
        if (onMarkerClick) {
          defaultMarker.on('click', () => onMarkerClick(center[0], center[1]));
        }
        markersRef.current.push(defaultMarker);
      }

      // Add map click handler
      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      // Add custom CSS for markers
      const style = document.createElement('style');
      style.textContent = `
        .marker-pin {
          width: 30px;
          height: 42px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #D4AF37;
        }
        .marker-pin.selected {
          color: #ff3e00;
          transform: scale(1.2);
        }
        .marker-icon {
          width: 30px;
          height: 42px;
        }
      `;
      document.head.appendChild(style);

      // Enable touch events for mobile
      if (L.Browser.touch) {
        L.DomEvent.disableClickPropagation(mapRef.current);
      }

    } catch (error) {
      console.error("Error initializing map:", error);
    }

    // Clean up on component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    try {
      mapInstanceRef.current.setView(center, zoom);
      
      // Update markers
      markersRef.current.forEach(marker => {
        marker.remove();
      });
      markersRef.current = [];
      
      if (markers.length > 0) {
        markers.forEach(marker => {
          const icon = createCustomIcon(marker.isSelected);
          const m = L.marker(marker.position, { icon }).addTo(mapInstanceRef.current!);
          
          if (marker.popup) {
            m.bindPopup(marker.popup);
            if (marker.isSelected) {
              m.openPopup();
            }
          }
          
          if (onMarkerClick) {
            m.on('click', () => onMarkerClick(marker.position[0], marker.position[1]));
          }
          
          markersRef.current.push(m);
        });
      }
    } catch (error) {
      console.error("Error updating map:", error);
    }
  }, [center, zoom, markers, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width: '100%' }}
    ></div>
  );
}

export default MapComponent;