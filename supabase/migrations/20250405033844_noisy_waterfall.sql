/*
  # Add Hyper Racing 600 Micro Sprint specific fields

  1. Changes
    - Add specific fields for Hyper Racing 600 Micro Sprint
    - Add ride height fields for each corner
    - Add king pin angle and toe settings
    - Add Jacob's ladder height
    - Add engine and fuel system fields
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add Hyper Racing 600 specific fields if they don't exist yet
DO $$
BEGIN
  -- Check if columns exist before adding them
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'king_pin_angle') THEN
    ALTER TABLE setups ADD COLUMN king_pin_angle numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'toe') THEN
    ALTER TABLE setups ADD COLUMN toe numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'jacobs_ladder_height') THEN
    ALTER TABLE setups ADD COLUMN jacobs_ladder_height numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'engine_type') THEN
    ALTER TABLE setups ADD COLUMN engine_type text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'gearing') THEN
    ALTER TABLE setups ADD COLUMN gearing text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'exhaust') THEN
    ALTER TABLE setups ADD COLUMN exhaust text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'injection') THEN
    ALTER TABLE setups ADD COLUMN injection text DEFAULT '';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'fuel_pressure') THEN
    ALTER TABLE setups ADD COLUMN fuel_pressure numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'fuel_map') THEN
    ALTER TABLE setups ADD COLUMN fuel_map text DEFAULT '';
  END IF;
  
  -- Make sure ride height fields exist for each corner
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lf_ride_height') THEN
    ALTER TABLE setups ADD COLUMN lf_ride_height numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rf_ride_height') THEN
    ALTER TABLE setups ADD COLUMN rf_ride_height numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'lr_ride_height') THEN
    ALTER TABLE setups ADD COLUMN lr_ride_height numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'rr_ride_height') THEN
    ALTER TABLE setups ADD COLUMN rr_ride_height numeric DEFAULT 0;
  END IF;
  
  -- Make sure panhard bar height fields exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'panhard_height_front') THEN
    ALTER TABLE setups ADD COLUMN panhard_height_front numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'setups' AND column_name = 'panhard_height_rear') THEN
    ALTER TABLE setups ADD COLUMN panhard_height_rear numeric DEFAULT 0;
  END IF;
END $$;