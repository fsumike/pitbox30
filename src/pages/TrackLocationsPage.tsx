import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Plus, Search, Loader2, ArrowLeft, ExternalLink, Phone, 
  AlertCircle, Navigation, Star, StarOff, Filter, Map, List, 
  ChevronDown, ChevronUp, X, Info, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrackLocations } from '../hooks/useTrackLocations';
import { useAuth } from '../contexts/AuthContext';
import { SetupLocationPicker } from '../components/SetupLocationPicker';
import MapComponent from '../components/MapComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation as SwiperNavigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Track {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  phone?: string;
}

function TrackLocationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTrackLocations, saveTrackLocation, loading, error } = useTrackLocations();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrack, setNewTrack] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    website: '',
    phone: ''
  });
  const [addingTrack, setAddingTrack] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTracks();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteTracks');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const loadTracks = async () => {
    const trackData = await getTrackLocations();
    setTracks(trackData);
    
    // Select first track by default if available
    if (trackData.length > 0 && !selectedTrack) {
      setSelectedTrack(trackData[0]);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    
    // If in map view, scroll to the map
    if (viewMode === 'map' && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLocationSelect = (location: { address: string; coordinates?: { lat: number; lng: number } }) => {
    if (location.coordinates) {
      setNewTrack(prev => ({
        ...prev,
        address: location.address,
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng
      }));
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTrack(true);
    setAddError(null);

    try {
      if (!newTrack.name.trim()) {
        throw new Error('Track name is required');
      }

      if (!newTrack.address.trim()) {
        throw new Error('Track address is required');
      }

      if (!newTrack.latitude || !newTrack.longitude) {
        throw new Error('Please select a valid location');
      }

      const result = await saveTrackLocation({
        name: newTrack.name.trim(),
        address: newTrack.address.trim(),
        latitude: newTrack.latitude,
        longitude: newTrack.longitude,
        website: newTrack.website.trim(),
        phone: newTrack.phone.trim()
      });

      if (result) {
        await loadTracks();
        setSelectedTrack(result);
        setShowAddTrack(false);
        setNewTrack({
          name: '',
          address: '',
          latitude: 0,
          longitude: 0,
          website: '',
          phone: ''
        });
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add track');
    } finally {
      setAddingTrack(false);
    }
  };

  const toggleFavorite = (trackId: string) => {
    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTracks', JSON.stringify(newFavorites));
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterMode === 'favorites') {
      return matchesSearch && favorites.includes(track.id);
    }
    
    return matchesSearch;
  });

  const toggleExpandTrack = (trackId: string) => {
    setExpandedTrack(expandedTrack === trackId ? null : trackId);
  };

  const getDirections = (track: Track) => {
    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try to open the Google Maps app
      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${track.latitude},${track.longitude}`;
    } else {
      // On desktop, open in a new tab
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${track.latitude},${track.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Track Locations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and manage your favorite racing venues
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracks..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 flex items-center gap-1 ${
                  viewMode === 'list' 
                    ? 'bg-brand-gold text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 flex items-center gap-1 ${
                  viewMode === 'map' 
                    ? 'bg-brand-gold text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label="Map view"
              >
                <Map className="w-5 h-5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowAddTrack(!showAddTrack)}
              className="btn-primary flex items-center gap-2 px-3 py-2"
              aria-label="Add track"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Track</span>
            </button>
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filterMode === 'all'
                    ? 'bg-brand-gold text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
                All Tracks
              </button>
              <button
                onClick={() => setFilterMode('favorites')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  filterMode === 'favorites'
                    ? 'bg-brand-gold text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Star className="w-4 h-4" />
                Favorites
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Track Form */}
      {showAddTrack && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Add New Track</h2>
            <button
              onClick={() => setShowAddTrack(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {addError && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {addError}
            </div>
          )}
          
          <form onSubmit={handleAddTrack} className="space-y-4">
            <div>
              <label htmlFor="trackName" className="block text-sm font-medium mb-1">
                Track Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="trackName"
                value={newTrack.name}
                onChange={(e) => setNewTrack(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="Enter track name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <SetupLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={newTrack.address}
              />
            </div>
            
            <div>
              <label htmlFor="trackWebsite" className="block text-sm font-medium mb-1">
                Website
              </label>
              <input
                type="url"
                id="trackWebsite"
                value={newTrack.website}
                onChange={(e) => setNewTrack(prev => ({ ...prev, website: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <label htmlFor="trackPhone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="trackPhone"
                value={newTrack.phone}
                onChange={(e) => setNewTrack(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 rounded-lg"
                placeholder="(123) 456-7890"
              />
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowAddTrack(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingTrack}
                className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 flex items-center gap-2"
              >
                {addingTrack ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Save Track
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="glass-panel overflow-hidden" ref={mapRef}>
          <div className="h-[500px] relative">
            <MapComponent 
              center={selectedTrack ? [selectedTrack.latitude, selectedTrack.longitude] : [39.8283, -98.5795]} // US center if no track selected
              markers={filteredTracks.map(track => ({
                position: [track.latitude, track.longitude],
                popup: track.name,
                isSelected: selectedTrack?.id === track.id
              }))}
              height="100%"
              onMarkerClick={(lat, lng) => {
                const clickedTrack = filteredTracks.find(
                  t => t.latitude === lat && t.longitude === lng
                );
                if (clickedTrack) {
                  setSelectedTrack(clickedTrack);
                }
              }}
            />
          </div>
          
          {/* Track Info Overlay */}
          {selectedTrack && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedTrack.name}</h3>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{selectedTrack.address}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedTrack.id)}
                    className={`p-2 rounded-full ${
                      favorites.includes(selectedTrack.id)
                        ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                        : 'text-gray-400 hover:text-yellow-500 bg-gray-100 dark:bg-gray-700'
                    }`}
                    aria-label={favorites.includes(selectedTrack.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(selectedTrack.id) ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => getDirections(selectedTrack)}
                    className="p-2 text-blue-500 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                    aria-label="Get directions"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {selectedTrack.website && (
                  <a
                    href={selectedTrack.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-gold hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                {selectedTrack.phone && (
                  <a
                    href={`tel:${selectedTrack.phone}`}
                    className="flex items-center gap-2 text-sm text-brand-gold hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedTrack.phone}
                  </a>
                )}
                
                <button
                  onClick={() => getDirections(selectedTrack)}
                  className="flex items-center gap-2 text-sm text-brand-gold hover:underline ml-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <div className="glass-panel p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : error ? (
            <div className="glass-panel p-6 text-red-500 flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <p>{error}</p>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Tracks Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filterMode === 'favorites' 
                  ? "You haven't added any tracks to your favorites yet."
                  : "No tracks match your search criteria."}
              </p>
              <button
                onClick={() => setShowAddTrack(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Add New Track
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTracks.map(track => (
                <div 
                  key={track.id}
                  className={`glass-panel overflow-hidden transition-all duration-300 ${
                    selectedTrack?.id === track.id ? 'ring-2 ring-brand-gold' : ''
                  }`}
                >
                  <div 
                    className="h-40 relative cursor-pointer"
                    onClick={() => handleTrackSelect(track)}
                  >
                    <MapComponent 
                      center={[track.latitude, track.longitude]}
                      markers={[{ position: [track.latitude, track.longitude], popup: track.name }]}
                      height="100%"
                      zoom={12}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                        className={`p-1.5 rounded-full ${
                          favorites.includes(track.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-yellow-500 hover:text-white'
                        }`}
                        aria-label={favorites.includes(track.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {favorites.includes(track.id) ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 
                        className="font-semibold text-lg cursor-pointer hover:text-brand-gold transition-colors"
                        onClick={() => handleTrackSelect(track)}
                      >
                        {track.name}
                      </h3>
                      <button
                        onClick={() => toggleExpandTrack(track.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        {expandedTrack === track.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className={expandedTrack === track.id ? '' : 'line-clamp-2'}>
                        {track.address}
                      </span>
                    </div>
                    
                    {expandedTrack === track.id && (
                      <div className="mt-4 space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        {track.website && (
                          <a
                            href={track.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand-gold hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Website
                          </a>
                        )}
                        {track.phone && (
                          <a
                            href={`tel:${track.phone}`}
                            className="flex items-center gap-2 text-sm text-brand-gold hover:underline"
                          >
                            <Phone className="w-4 h-4" />
                            {track.phone}
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => getDirections(track)}
                        className="flex-1 py-2 px-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Directions</span>
                      </button>
                      <button
                        onClick={() => handleTrackSelect(track)}
                        className="flex-1 py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Info className="w-4 h-4" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Track Details (when in list view) */}
      {viewMode === 'list' && selectedTrack && (
        <div className="glass-panel overflow-hidden">
          <div className="h-[300px] relative">
            <MapComponent 
              center={[selectedTrack.latitude, selectedTrack.longitude]}
              markers={[{ 
                position: [selectedTrack.latitude, selectedTrack.longitude], 
                popup: selectedTrack.name,
                isSelected: true
              }]}
              height="100%"
              zoom={14}
            />
            <button
              onClick={() => setViewMode('map')}
              className="absolute bottom-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Map className="w-5 h-5" />
              <span>View Full Map</span>
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedTrack.name}</h2>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{selectedTrack.address}</span>
                </div>
              </div>
              
              <button
                onClick={() => toggleFavorite(selectedTrack.id)}
                className={`p-2 rounded-full ${
                  favorites.includes(selectedTrack.id)
                    ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                    : 'text-gray-400 hover:text-yellow-500 bg-gray-100 dark:bg-gray-700'
                }`}
                aria-label={favorites.includes(selectedTrack.id) ? "Remove from favorites" : "Add to favorites"}
              >
                {favorites.includes(selectedTrack.id) ? (
                  <Star className="w-6 h-6 fill-current" />
                ) : (
                  <Star className="w-6 h-6" />
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="space-y-3">
                  {selectedTrack.website && (
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                        <a 
                          href={selectedTrack.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-gold hover:underline"
                        >
                          {selectedTrack.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedTrack.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <a 
                          href={`tel:${selectedTrack.phone}`}
                          className="text-brand-gold hover:underline"
                        >
                          {selectedTrack.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <Compass className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Coordinates</p>
                      <p>
                        {selectedTrack.latitude.toFixed(6)}, {selectedTrack.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => getDirections(selectedTrack)}
                    className="flex-1 py-3 px-4 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </button>
                  
                  <button
                    onClick={() => window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedTrack.latitude},${selectedTrack.longitude}`,
                      '_blank'
                    )}
                    className="py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Placeholder for future features */}
                <div className="glass-panel p-4 bg-gradient-to-br from-brand-gold/5 to-brand-gold-dark/5">
                  <h3 className="text-lg font-semibold mb-2">Track Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    More details about this track will be available soon, including track length, surface type, and upcoming events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackLocationsPage;