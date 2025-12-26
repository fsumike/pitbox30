/*
  # Add Location Tracking to Setups

  ## Overview
  Enables automatic track detection and GPS location capture when saving setups.
  This allows users to automatically know which track they're at and view all setups
  saved at specific tracks.

  ## Changes

  1. New Columns in `setups` table
    - `latitude` (double precision) - GPS latitude coordinate
    - `longitude` (double precision) - GPS longitude coordinate
    - `location_accuracy` (double precision) - GPS accuracy in meters
    - `detected_track_id` (uuid) - Foreign key to track_locations table
    - `location_captured_at` (timestamptz) - When location was captured

  2. Indexes
    - Index on `detected_track_id` for efficient track-based queries
    - Composite index on (user_id, detected_track_id) for user track history

  3. Foreign Key
    - Links setups to track_locations for automatic track name population

  ## Benefits
  - Automatic track detection when saving setups
  - Can filter/search setups by track
  - Track usage statistics and history
  - Offline-capable location capture
*/

-- Add location columns to setups table
DO $$
BEGIN
  -- Add latitude column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE setups ADD COLUMN latitude double precision;
  END IF;

  -- Add longitude column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE setups ADD COLUMN longitude double precision;
  END IF;

  -- Add location_accuracy column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'location_accuracy'
  ) THEN
    ALTER TABLE setups ADD COLUMN location_accuracy double precision;
  END IF;

  -- Add detected_track_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'detected_track_id'
  ) THEN
    ALTER TABLE setups ADD COLUMN detected_track_id uuid REFERENCES track_locations(id) ON DELETE SET NULL;
  END IF;

  -- Add location_captured_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'location_captured_at'
  ) THEN
    ALTER TABLE setups ADD COLUMN location_captured_at timestamptz;
  END IF;
END $$;

-- Create index on detected_track_id for efficient track-based queries
CREATE INDEX IF NOT EXISTS idx_setups_detected_track_id ON setups(detected_track_id);

-- Create composite index for user track history queries
CREATE INDEX IF NOT EXISTS idx_setups_user_track ON setups(user_id, detected_track_id) WHERE detected_track_id IS NOT NULL;

-- Create index for location-based queries (useful for future map features)
CREATE INDEX IF NOT EXISTS idx_setups_location ON setups(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Add comment explaining the detected_track_id relationship
COMMENT ON COLUMN setups.detected_track_id IS 'Automatically detected track based on GPS location at time of setup save. References track_locations table.';
COMMENT ON COLUMN setups.latitude IS 'GPS latitude coordinate where setup was saved. Used for automatic track detection.';
COMMENT ON COLUMN setups.longitude IS 'GPS longitude coordinate where setup was saved. Used for automatic track detection.';
COMMENT ON COLUMN setups.location_accuracy IS 'GPS accuracy in meters at time of location capture.';
COMMENT ON COLUMN setups.location_captured_at IS 'Timestamp when GPS location was captured, may differ from created_at if captured offline.';
