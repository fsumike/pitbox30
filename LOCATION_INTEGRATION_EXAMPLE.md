# How to Add Location to Setup Pages

## Quick Integration Guide

### 1. Import the LocationSelector

Add this to the top of any setup page (e.g., Sprint410.tsx):

```tsx
import { LocationSelector } from '../components/LocationSelector';
```

### 2. Add State for Location Data

In your component, add:

```tsx
const [locationData, setLocationData] = useState<{
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
  detectedTrackId?: string;
  detectedTrackName?: string;
} | null>(null);
```

### 3. Add the LocationSelector Component

Add this UI component where you want location selection (after the car number/date inputs is a good spot):

```tsx
{/* Location Section */}
<div className="glass-panel p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
    <MapPin className="w-6 h-6 text-brand-gold" />
    Track Location
  </h2>
  <LocationSelector
    onLocationChange={setLocationData}
    showTrackDetection={true}
  />
</div>
```

### 4. Include Location When Saving Setup

When you save the setup, include the location data:

```tsx
const setupToSave = {
  ...yourSetupData,
  latitude: locationData?.latitude,
  longitude: locationData?.longitude,
  location_accuracy: locationData?.accuracy,
  detected_track_id: locationData?.detectedTrackId,
  // ... rest of your setup fields
};
```

## Complete Example

Here's a minimal working example:

```tsx
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { LocationSelector } from '../components/LocationSelector';
import SetupSheet from '../components/SetupSheet';

function Sprint410WithLocation() {
  const [locationData, setLocationData] = useState(null);

  return (
    <div className="space-y-6">
      {/* Your existing car number and date inputs */}

      {/* NEW: Location Section */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-brand-gold" />
          Track Location
        </h2>
        <LocationSelector
          onLocationChange={setLocationData}
          showTrackDetection={true}
        />
      </div>

      {/* Your existing SetupSheet component */}
      <SetupSheet
        carType="410"
        initialSetupData={initialSetupData}
        // Add location data to save
        additionalData={{
          latitude: locationData?.latitude,
          longitude: locationData?.longitude,
          detected_track_id: locationData?.detectedTrackId
        }}
      />
    </div>
  );
}
```

## What Users Get

1. **GPS Button** - One tap to get current location (iOS/Android)
2. **Interactive Map** - Click anywhere to select location
3. **Track Search** - Search for tracks in your database
4. **Address Search** - Search any address worldwide
5. **Track Detection** - Auto-detects when you're at a saved track
6. **Visual Feedback** - Shows accuracy, distance to tracks

## Database Schema

The `setups` table already has these columns ready:
- `latitude` (float)
- `longitude` (float)
- `location_accuracy` (float)
- `detected_track_id` (uuid)
- `location_captured_at` (timestamp)

## Features Used

All **100% FREE** - no API keys needed:
- **Capacitor Geolocation** - Native iOS/Android GPS
- **OpenStreetMap** - Free maps worldwide
- **Leaflet** - Free map library
- **Nominatim** - Free geocoding/reverse geocoding

## Try It Out

Visit `/location-demo` in your app to see all features in action!
