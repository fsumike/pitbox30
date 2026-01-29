import React, { useState } from 'react';
import { MapPin, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LocationSelector } from '../components/LocationSelector';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
  detectedTrackId?: string;
  detectedTrackName?: string;
}

export default function LocationDemo() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [saved, setSaved] = useState(false);

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation);
    setSaved(false);
  };

  const handleSave = () => {
    if (!location) return;

    console.log('Saving location:', location);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <MapPin className="w-8 h-8 text-brand-gold" />
              Location Features Demo
            </h1>
            <p className="text-gray-400 mt-2">
              Test all FREE location features for iOS & Android
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">GPS Location</h3>
            <p className="text-sm text-gray-400">
              Uses Capacitor Geolocation for native iOS/Android GPS access
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Interactive Map</h3>
            <p className="text-sm text-gray-400">
              Leaflet with OpenStreetMap - completely FREE, no API keys needed
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Track Detection</h3>
            <p className="text-sm text-gray-400">
              Automatically detects when you're at a saved race track
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Address Search</h3>
            <p className="text-sm text-gray-400">
              Search any address worldwide using Nominatim (OpenStreetMap)
            </p>
          </div>
        </div>

        {/* Location Selector */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Select Location
          </h2>
          <LocationSelector
            onLocationChange={handleLocationChange}
            showTrackDetection={true}
          />
        </div>

        {/* Save Button */}
        {location && (
          <button
            onClick={handleSave}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-gray-900'
            }`}
          >
            <Save className="w-6 h-6" />
            {saved ? 'Location Saved!' : 'Save Location'}
          </button>
        )}

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            How to Use in Setup Pages
          </h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-brand-gold">1</span>
              </div>
              <div>
                <p className="font-medium">Import the component</p>
                <code className="text-xs bg-gray-900 px-2 py-1 rounded mt-1 block">
                  import {`{ LocationSelector }`} from '../components/LocationSelector';
                </code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-brand-gold">2</span>
              </div>
              <div>
                <p className="font-medium">Add to your setup form</p>
                <code className="text-xs bg-gray-900 px-2 py-1 rounded mt-1 block">
                  {`<LocationSelector onLocationChange={setLocation} />`}
                </code>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold text-brand-gold">3</span>
              </div>
              <div>
                <p className="font-medium">Save with setup data</p>
                <code className="text-xs bg-gray-900 px-2 py-1 rounded mt-1 block">
                  {`latitude: location.latitude, longitude: location.longitude`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {location && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Debug Info</h3>
            <pre className="text-xs text-gray-300 overflow-auto">
              {JSON.stringify(location, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
