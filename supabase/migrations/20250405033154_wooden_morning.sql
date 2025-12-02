/*
  # Add Hyper Racing 600 Micro Sprint Setup Fields

  1. New Fields
    - Setup name and description fields
    - Chassis/handling fields (wheelbase, steering, etc.)
    - Engine/drivetrain fields (timing, carb size, etc.)
    - Weights and measures fields
    - Wheels and tires fields for each corner
    - Suspension fields for each corner
    - Wing settings
    - Track condition fields
    - Performance data fields
    - Hyper Racing 600 specific fields
  
  2. Constraints
    - Track grip level check (low, medium, high)
    - Track surface type check (clay, dirt, limestone)
    - Setup rating check (0-5)
*/

-- Add Hyper Racing 600 specific fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS lf_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS king_pin_angle numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS toe numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS jacobs_ladder_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS engine_type text DEFAULT '',
ADD COLUMN IF NOT EXISTS gearing text DEFAULT '',
ADD COLUMN IF NOT EXISTS exhaust text DEFAULT '',
ADD COLUMN IF NOT EXISTS injection text DEFAULT '',
ADD COLUMN IF NOT EXISTS fuel_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fuel_map text DEFAULT '';

-- Add constraints safely by checking if they exist first
DO $$
BEGIN
  -- Check if track_grip_level_check constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'track_grip_level_check' AND conrelid = 'setups'::regclass
  ) THEN
    ALTER TABLE setups
    ADD CONSTRAINT track_grip_level_check 
      CHECK (track_grip_level IN ('low', 'medium', 'high'));
  END IF;

  -- Check if track_surface_type_check constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'track_surface_type_check' AND conrelid = 'setups'::regclass
  ) THEN
    ALTER TABLE setups
    ADD CONSTRAINT track_surface_type_check
      CHECK (track_surface_type IN ('clay', 'dirt', 'limestone'));
  END IF;

  -- Check if setup_rating_check constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'setup_rating_check' AND conrelid = 'setups'::regclass
  ) THEN
    ALTER TABLE setups
    ADD CONSTRAINT setup_rating_check
      CHECK (setup_rating BETWEEN 0 AND 5);
  END IF;
END $$;