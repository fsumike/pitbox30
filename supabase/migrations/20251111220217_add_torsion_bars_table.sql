/*
  # Add Torsion Bars Table

  1. New Tables
    - `torsion_bars`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `diameter` (numeric) - Bar diameter in inches
      - `length` (numeric) - Bar length in inches
      - `rate` (integer) - Calculated wheel rate in lbs/in
      - `location` (text) - Corner position (LF, RF, LR, RR)
      - `brand` (text, optional) - Manufacturer brand
      - `notes` (text, optional) - Additional notes
      - `in_car` (boolean) - Whether bar is currently installed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `torsion_bars` table
    - Add policies for authenticated users to manage their own torsion bars
*/

-- Create torsion_bars table
CREATE TABLE IF NOT EXISTS torsion_bars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  diameter numeric(5,4) NOT NULL DEFAULT 1.0,
  length numeric(5,2) NOT NULL DEFAULT 36.0,
  rate integer NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT 'LF',
  brand text DEFAULT '',
  notes text DEFAULT '',
  in_car boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE torsion_bars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own torsion bars"
  ON torsion_bars
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own torsion bars"
  ON torsion_bars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own torsion bars"
  ON torsion_bars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own torsion bars"
  ON torsion_bars
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_torsion_bars_user_id ON torsion_bars(user_id);
CREATE INDEX IF NOT EXISTS idx_torsion_bars_location ON torsion_bars(location);
CREATE INDEX IF NOT EXISTS idx_torsion_bars_in_car ON torsion_bars(in_car);
