/*
  # Shock Tracking System

  1. New Tables
    - `shocks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `serial_number` (text) - Custom shock identifier (any format)
      - `dyno_photo_url` (text) - URL to dyno sheet photo in storage
      - `notes` (text) - Optional notes about the shock
      - `last_refurbished` (timestamptz) - Date of last refurbishment
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `setup_shocks`
      - `id` (uuid, primary key)
      - `setup_id` (uuid, references setups)
      - `shock_id` (uuid, references shocks)
      - `position` (text) - LF, RF, LR, or RR
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only manage their own shocks
    - Users can only link shocks to their own setups

  3. Storage
    - Create storage bucket for dyno sheet photos
*/

-- Create shocks table
CREATE TABLE IF NOT EXISTS shocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  serial_number text NOT NULL,
  dyno_photo_url text,
  notes text,
  last_refurbished timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create setup_shocks junction table
CREATE TABLE IF NOT EXISTS setup_shocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setup_id uuid REFERENCES setups(id) ON DELETE CASCADE NOT NULL,
  shock_id uuid REFERENCES shocks(id) ON DELETE CASCADE NOT NULL,
  position text NOT NULL CHECK (position IN ('LF', 'RF', 'LR', 'RR')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(setup_id, position)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shocks_user_id ON shocks(user_id);
CREATE INDEX IF NOT EXISTS idx_shocks_serial_number ON shocks(user_id, serial_number);
CREATE INDEX IF NOT EXISTS idx_setup_shocks_setup_id ON setup_shocks(setup_id);
CREATE INDEX IF NOT EXISTS idx_setup_shocks_shock_id ON setup_shocks(shock_id);

-- Enable RLS
ALTER TABLE shocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_shocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shocks table
CREATE POLICY "Users can view own shocks"
  ON shocks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shocks"
  ON shocks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shocks"
  ON shocks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own shocks"
  ON shocks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for setup_shocks table
CREATE POLICY "Users can view own setup shocks"
  ON setup_shocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = setup_shocks.setup_id
      AND setups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create setup shocks"
  ON setup_shocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = setup_shocks.setup_id
      AND setups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update setup shocks"
  ON setup_shocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = setup_shocks.setup_id
      AND setups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete setup shocks"
  ON setup_shocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups
      WHERE setups.id = setup_shocks.setup_id
      AND setups.user_id = auth.uid()
    )
  );

-- Create storage bucket for dyno sheet photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('dyno-sheets', 'dyno-sheets', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for dyno sheets
CREATE POLICY "Users can upload their own dyno sheets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'dyno-sheets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own dyno sheets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'dyno-sheets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own dyno sheets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'dyno-sheets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own dyno sheets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'dyno-sheets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_shocks_updated_at
  BEFORE UPDATE ON shocks
  FOR EACH ROW
  EXECUTE FUNCTION update_shocks_updated_at();