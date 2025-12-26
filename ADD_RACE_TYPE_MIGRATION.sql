/*
  # Add Race Type to Setups

  RUN THIS IN YOUR SUPABASE SQL EDITOR:
  1. Go to https://supabase.com/dashboard
  2. Select your project
  3. Click "SQL Editor"
  4. Click "New query"
  5. Copy and paste this entire file
  6. Click "Run"

  This adds the ability to categorize setups by race type:
  - Hot Laps
  - Qualifying
  - Heat Race
  - D Main
  - C Main
  - B Main
  - A Main
*/

-- Add race_type column to setups table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'race_type'
  ) THEN
    ALTER TABLE setups
    ADD COLUMN race_type text CHECK (
      race_type IS NULL OR
      race_type IN ('hot_laps', 'qualifying', 'heat_race', 'd_main', 'c_main', 'b_main', 'a_main')
    );
  END IF;
END $$;

-- Add index for efficient filtering by race type
CREATE INDEX IF NOT EXISTS idx_setups_race_type ON setups(race_type) WHERE race_type IS NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN setups.race_type IS 'Type of race session: hot_laps, qualifying, heat_race, d_main, c_main, b_main, or a_main';
