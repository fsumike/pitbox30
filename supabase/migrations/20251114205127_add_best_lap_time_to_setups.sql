/*
  # Add Best Lap Time Field to Setups

  1. Changes
    - Add `best_lap_time` numeric field to setups table
    - This field is optional (nullable) to allow setups without lap times
    - Stores lap time in seconds with decimal precision (e.g., 15.234)

  2. Security
    - No changes to existing RLS policies
    - Field inherits existing setup table permissions
*/

-- Add best lap time field to setups table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'setups' AND column_name = 'best_lap_time'
  ) THEN
    ALTER TABLE setups ADD COLUMN best_lap_time numeric;
  END IF;
END $$;