/*
  # Add Track Locations Table

  1. New Tables
    - `track_locations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `website` (text)
      - `phone` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on track_locations table
    - Add policies for authenticated users
*/

-- Create track_locations table
CREATE TABLE IF NOT EXISTS track_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  website text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE track_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read track locations"
  ON track_locations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create track locations"
  ON track_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add track_id to setups table
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS track_id uuid REFERENCES track_locations(id);

-- Add track stats table
CREATE TABLE IF NOT EXISTS track_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  track_id uuid REFERENCES track_locations(id) ON DELETE CASCADE NOT NULL,
  best_lap_time numeric,
  average_speed numeric,
  setup_effectiveness numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on track_stats
ALTER TABLE track_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for track_stats
CREATE POLICY "Users can read own track stats"
  ON track_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own track stats"
  ON track_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own track stats"
  ON track_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger to track_stats
CREATE TRIGGER update_track_stats_updated_at
  BEFORE UPDATE ON track_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();