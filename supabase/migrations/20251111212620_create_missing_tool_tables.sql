/*
  # Create Missing Racing Tools Tables
  
  1. New Tables
    - `lap_sessions` - Group lap times into organized sessions
      - Links to existing lap_times table
      - Provides context for practice/race sessions
      
    - `track_notebooks` - Detailed notes per track/event
      - Track performance observations
      - Link to setups and sessions
      
    - `saved_calculations` - Store calculator results
      - Gear ratios, weight distribution, spring rates, stagger
      - Optional link to setups
      
  2. Security
    - Enable RLS on all new tables
    - Restrictive policies for authenticated users only
    
  3. Notes
    - lap_times and fuel_logs tables already exist
    - This migration only creates missing tables
*/

-- Lap Sessions Table (groups existing lap_times)
CREATE TABLE IF NOT EXISTS lap_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  setup_id uuid REFERENCES setups(id) ON DELETE SET NULL,
  track_name text NOT NULL,
  session_date timestamptz DEFAULT now(),
  session_type text DEFAULT 'practice' CHECK (session_type IN ('practice', 'qualifying', 'heat', 'feature', 'other')),
  weather_conditions text,
  track_conditions text,
  average_lap_time numeric(10, 3),
  best_lap_time numeric(10, 3),
  total_laps integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Track Notebooks Table
CREATE TABLE IF NOT EXISTS track_notebooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  setup_id uuid REFERENCES setups(id) ON DELETE SET NULL,
  track_name text NOT NULL,
  date timestamptz DEFAULT now(),
  title text NOT NULL,
  content text,
  weather text,
  track_surface text,
  what_worked text,
  what_didnt_work text,
  changes_made text,
  results text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Saved Calculations Table
CREATE TABLE IF NOT EXISTS saved_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  setup_id uuid REFERENCES setups(id) ON DELETE SET NULL,
  calculation_type text NOT NULL CHECK (calculation_type IN ('gear_ratio', 'weight_distribution', 'spring_rate', 'stagger')),
  name text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}',
  results jsonb NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lap_sessions
CREATE POLICY "Users can view own lap sessions"
  ON lap_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lap sessions"
  ON lap_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lap sessions"
  ON lap_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lap sessions"
  ON lap_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for track_notebooks
CREATE POLICY "Users can view own track notebooks"
  ON track_notebooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own track notebooks"
  ON track_notebooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own track notebooks"
  ON track_notebooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own track notebooks"
  ON track_notebooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for saved_calculations
CREATE POLICY "Users can view own calculations"
  ON saved_calculations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calculations"
  ON saved_calculations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
  ON saved_calculations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON saved_calculations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lap_sessions_user_id ON lap_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lap_sessions_setup_id ON lap_sessions(setup_id);
CREATE INDEX IF NOT EXISTS idx_lap_sessions_track_name ON lap_sessions(track_name);
CREATE INDEX IF NOT EXISTS idx_lap_sessions_date ON lap_sessions(session_date DESC);

CREATE INDEX IF NOT EXISTS idx_track_notebooks_user_id ON track_notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_track_notebooks_setup_id ON track_notebooks(setup_id);
CREATE INDEX IF NOT EXISTS idx_track_notebooks_track_name ON track_notebooks(track_name);
CREATE INDEX IF NOT EXISTS idx_track_notebooks_date ON track_notebooks(date DESC);

CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id ON saved_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_setup_id ON saved_calculations(setup_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_type ON saved_calculations(calculation_type);