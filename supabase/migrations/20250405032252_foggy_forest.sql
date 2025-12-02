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

-- Add setup name and description fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS setup_name text DEFAULT '',
ADD COLUMN IF NOT EXISTS setup_description text DEFAULT '';

-- Add chassis/handling fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS wheelbase_left numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS wheelbase_right numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS steering_box_ratio numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS steering_arm_length numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS drag_link_angle numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS panhard_height_front numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS panhard_height_rear numeric DEFAULT 0;

-- Add engine/drivetrain fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS engine_timing numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS carb_size numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS main_jet numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS pilot_jet numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS needle_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS gear_ratio_primary numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS gear_ratio_secondary numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS chain_size text DEFAULT '',
ADD COLUMN IF NOT EXISTS sprocket_front numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS sprocket_rear numeric DEFAULT 0;

-- Add weights and measures fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS total_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS left_weight_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rear_weight_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS corner_weights jsonb DEFAULT '{}'::jsonb;

-- Add wheels and tires fields for each corner
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS lf_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_tire_pressure numeric DEFAULT 0;

-- Add suspension fields for each corner
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS lf_spring_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_spring_installed_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_shock_compression numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_shock_rebound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_shock_gas_pressure numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rf_spring_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_spring_installed_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_compression numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_rebound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_gas_pressure numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS lr_spring_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_spring_installed_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_compression numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_rebound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_gas_pressure numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rr_spring_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_spring_installed_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_compression numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_rebound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_gas_pressure numeric DEFAULT 0;

-- Add wing settings
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS top_wing_angle numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS top_wing_slider_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS front_wing_angle numeric DEFAULT 0;

-- Add track condition fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS track_banking numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS track_grip_level text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS track_surface_type text DEFAULT 'clay',
ADD COLUMN IF NOT EXISTS track_temperature numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS air_temperature numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS humidity numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS weather_conditions text DEFAULT '',
ADD COLUMN IF NOT EXISTS track_preparation text DEFAULT '';

-- Add performance data fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS qualifying_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS finish_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lap_times jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS setup_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS driver_feedback text DEFAULT '',
ADD COLUMN IF NOT EXISTS crew_notes text DEFAULT '';

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