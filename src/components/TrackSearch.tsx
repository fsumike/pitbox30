import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { supabase } from '../lib/supabase';

interface TrackSearchProps {
  onTrackSelect: (track: {
    id?: string;
    name: string;
    location: { lat: number; lng: number };
    address: string;
  }) => void;
  className?: string;
}

export function TrackSearch({ onTrackSelect, className = '' }: TrackSearchProps) {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [savedTracks, setSavedTracks] = useState<any[]>([]);
  const { latitude, longitude, loading: locationLoading } = useLocation({
    enableHighAccuracy: true
  });

  useEffect(() => {
    loadSavedTracks();
  }, []);

  const loadSavedTracks = async () => {
    try {
      const { data } = await supabase
        .from('track_locations')
        .select('*')
        .order('name');
      
      if (data) {
        setSavedTracks(data);
      }
    } catch (err) {
      console.error('Error loading tracks:', err);
    }
  };

  useEffect(() => {
    const loadPredictions = async () => {
      if (input.trim()) {
        // First, filter saved tracks
        const matchingTracks = savedTracks.filter(track =>
          track.name.toLowerCase().includes(input.toLowerCase()) ||
          track.address.toLowerCase().includes(input.toLowerCase())
        );

        setPredictions(
          matchingTracks.map(track => ({
            description: `${track.name} - ${track.address}`,
            placeId: track.id,
            isSaved: true
          }))
        );
        setShowPredictions(true);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    };

    const timeoutId = setTimeout(loadPredictions, 300);
    return () => clearTimeout(timeoutId);
  }, [input, savedTracks]);

  const handlePredictionSelect = async (prediction: any) => {
    if (prediction.isSaved) {
      // Handle saved track selection
      const track = savedTracks.find(t => t.id === prediction.placeId);
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
    }
    setInput(prediction.description);
    setShowPredictions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a track..."
          className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-gold"
        />
        {input && (
          <button
            onClick={() => {
              setInput('');
              setPredictions([]);
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <button
          onClick={() => setShowPredictions(true)}
          disabled={locationLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-gold hover:bg-brand-gold/10 rounded-full disabled:opacity-50"
        >
          {locationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Predictions dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
          {predictions.map((prediction, index) => (
            <button
              key={`${prediction.placeId}-${index}`}
              onClick={() => handlePredictionSelect(prediction)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${
                prediction.isSaved ? 'text-brand-gold' : 'text-gray-400'
              }`} />
              <span className="truncate">{prediction.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}