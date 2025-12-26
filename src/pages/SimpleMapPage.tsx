import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, MapPin, Search, Loader2, ExternalLink, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

function SimpleMapPage() {
  const navigate = useNavigate();
  const [center, setCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default: San Francisco
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Try to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          }
      );
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    
    // Reverse geocode to get address
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        setSelectedLocation(data.display_name);
      })
      .catch(err => {
        console.error('Error reverse geocoding:', err);
        setSelectedLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setCenter([lat, lng]);
    setSelectedLocation(result.display_name);
    setShowResults(false);
    setSearchQuery(result.display_name);
  };

  const openInGoogleMaps = () => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try to open the Google Maps app
      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`;
    } else {
      // On desktop, open in a new tab
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`,
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Interactive Map</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Search locations and get directions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.place_id || result.osm_id}-${index}`}
                    onClick={() => handleResultSelect(result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span className="truncate">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-panel overflow-hidden">
        <MapComponent 
          center={center}
          height="500px"
          onMapClick={handleMapClick}
          markers={[{ position: center, popup: selectedLocation || "Selected Location" }]}
        />
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-2">Selected Location</h2>
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <p>{selectedLocation}</p>
          </div>
          
          <div className="flex items-start gap-3 mb-6">
            <Compass className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <p>
              Coordinates: {center[0].toFixed(6)}, {center[1].toFixed(6)}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={openInGoogleMaps}
              className="flex-1 py-2 px-4 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions in Google Maps
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4">Map Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Search for a location using the search bar</li>
          <li>Click on the map to select a location</li>
          <li>Click "Get Directions in Google Maps" to open Google Maps with directions</li>
          <li>Your current location will be used as the starting point for directions</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleMapPage;