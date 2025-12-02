/*
  # Enhance Track Locations Table
  
  Add missing columns to existing track_locations table for geofencing and better track data.
  
  ## New Columns
  - radius: Geofence radius in meters
  - track_type: dirt, asphalt, etc.
  - surface: clay, concrete, asphalt
  - city: City name
  - state: State abbreviation
  - country: Country name
  - description: Track description
  - updated_at: Last update timestamp
*/

DO $$
BEGIN
  -- Add radius column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'radius'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN radius integer DEFAULT 500;
  END IF;
  
  -- Add track_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'track_type'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN track_type text;
  END IF;
  
  -- Add surface column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'surface'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN surface text;
  END IF;
  
  -- Add city column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'city'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN city text;
  END IF;
  
  -- Add state column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'state'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN state text;
  END IF;
  
  -- Add country column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'country'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN country text DEFAULT 'USA';
  END IF;
  
  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'description'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN description text;
  END IF;
  
  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'track_locations' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE track_locations ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;