/*
  # Initial Schema Setup for PitBox

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `username` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `setups`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References profiles
      - `car_type` (text) - Type of sprint car
      - `car_number` (text)
      - `track_name` (text)
      - `track_conditions` (jsonb)
      - `setup_data` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `dyno_images`
      - `id` (uuid, primary key)
      - `setup_id` (uuid) - References setups
      - `type` (text) - 'motor' or 'shock'
      - `url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create their own data
      - Update their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create setups table
CREATE TABLE IF NOT EXISTS setups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  car_type text NOT NULL,
  car_number text,
  track_name text,
  track_conditions jsonb DEFAULT '{}'::jsonb,
  setup_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE setups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own setups"
  ON setups
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own setups"
  ON setups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own setups"
  ON setups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create dyno_images table
CREATE TABLE IF NOT EXISTS dyno_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setup_id uuid REFERENCES setups(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('motor', 'shock')),
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dyno_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dyno images"
  ON dyno_images
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = dyno_images.setup_id
      AND setups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own dyno images"
  ON dyno_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = dyno_images.setup_id
      AND setups.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_setups_updated_at
  BEFORE UPDATE ON setups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();