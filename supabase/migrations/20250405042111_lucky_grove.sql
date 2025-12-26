/*
  # Remove Wing-Related Fields from Setups Table

  1. Changes
    - Remove wing-related columns from setups table
    - Clean up wing-specific fields that aren't needed for non-wing cars
  
  2. Security
    - No changes to existing RLS policies
*/

-- Drop wing-related columns if they exist
DO $$
BEGIN
  -- Remove top wing fields
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'top_wing_angle') THEN
    ALTER TABLE setups DROP COLUMN top_wing_angle;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'top_wing_slider_position') THEN
    ALTER TABLE setups DROP COLUMN top_wing_slider_position;
  END IF;

  -- Remove front wing fields
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'front_wing_angle') THEN
    ALTER TABLE setups DROP COLUMN front_wing_angle;
  END IF;
END $$;