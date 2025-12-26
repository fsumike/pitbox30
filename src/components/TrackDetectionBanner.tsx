import React, { useEffect, useState } from 'react';
import { useTrackDetection } from '../hooks/useTrackDetection';
import { MapPin, X, Navigation, Clock, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrackDetectionBanner: React.FC = () => {
  const {
    currentTrack,
    isAtTrack,
    distance,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
  } = useTrackDetection();
  const [isDismissed, setIsDismissed] = useState(false);
  const [setupCount, setSetupCount] = useState(0);

  useEffect(() => {
    startMonitoring();
    return () => {
      stopMonitoring();
    };
  }, []);

  useEffect(() => {
    if (isAtTrack && currentTrack) {
      setIsDismissed(false);
      loadSetupCount();
    }
  }, [isAtTrack, currentTrack]);

  const loadSetupCount = async () => {
    if (!currentTrack) return;

    const { supabase } = await import('../lib/supabase');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from('setups')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('location', currentTrack.name);

    setSetupCount(count || 0);
  };

  if (!isMonitoring || isDismissed || !currentTrack) {
    return null;
  }

  if (isAtTrack) {
    return (
      <div className="fixed top-20 left-0 right-0 z-50 mx-4 animate-slide-down">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-2xl p-4 max-w-2xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-6 h-6" />
                <h3 className="text-lg font-bold">Welcome to {currentTrack.name}!</h3>
              </div>

              <p className="text-sm text-green-50 mb-3">
                {currentTrack.city}, {currentTrack.state} • {currentTrack.track_type} • {currentTrack.surface}
              </p>

              {setupCount > 0 && (
                <div className="bg-white/20 rounded-lg p-3 mb-3">
                  <p className="text-sm font-medium">
                    You have {setupCount} saved {setupCount === 1 ? 'setup' : 'setups'} for this track
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/saved-setups"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  View Setups
                </Link>
                <Link
                  to={`/${currentTrack.track_type === 'dirt' ? 'sprint-410' : 'late-model'}`}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  New Setup
                </Link>
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (distance && distance < 5000) {
    return (
      <div className="fixed bottom-24 left-0 right-0 z-50 mx-4">
        <div className="bg-blue-500 text-white rounded-lg shadow-xl p-3 max-w-md mx-auto flex items-center gap-3">
          <Navigation className="w-5 h-5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{currentTrack.name}</p>
            <p className="text-xs text-blue-100">
              {(distance / 1000).toFixed(1)} km away
            </p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
