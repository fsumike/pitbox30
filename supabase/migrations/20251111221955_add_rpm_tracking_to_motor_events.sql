/*
  # Add RPM Tracking to Motor Events

  1. Changes
    - Add `average_rpm` column to motor_events table
    - Add `max_rpm` column to motor_events table
    - These columns track RPM data for each racing session

  2. Notes
    - RPM tracking helps identify motor stress and predict life
    - Optional fields (nullable) to maintain backward compatibility
*/

-- Add RPM tracking columns to motor_events table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'motor_events' AND column_name = 'average_rpm'
  ) THEN
    ALTER TABLE motor_events ADD COLUMN average_rpm integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'motor_events' AND column_name = 'max_rpm'
  ) THEN
    ALTER TABLE motor_events ADD COLUMN max_rpm integer DEFAULT 0;
  END IF;
END $$;
