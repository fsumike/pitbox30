/*
  # Add Hyper Racing 600 Micro Sprint Fields

  1. New Fields
    - Add specific fields for Hyper Racing 600 Micro Sprint setups
    - Set default values for numeric fields
    - Add validation constraints for track conditions
  
  2. Security
    - No changes to existing RLS policies
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

-- Add constraints - removing IF NOT EXISTS which is not supported for constraints
DO $$
BEGIN
    -- Drop constraints if they exist to avoid errors
    BEGIN
        ALTER TABLE setups DROP CONSTRAINT IF EXISTS track_grip_level_check;
    EXCEPTION
        WHEN undefined_object THEN
            -- Constraint doesn't exist, continue
    END;
    
    BEGIN
        ALTER TABLE setups DROP CONSTRAINT IF EXISTS track_surface_type_check;
    EXCEPTION
        WHEN undefined_object THEN
            -- Constraint doesn't exist, continue
    END;
    
    BEGIN
        ALTER TABLE setups DROP CONSTRAINT IF EXISTS setup_rating_check;
    EXCEPTION
        WHEN undefined_object THEN
            -- Constraint doesn't exist, continue
    END;
END $$;

-- Add constraints without IF NOT EXISTS
ALTER TABLE setups
ADD CONSTRAINT track_grip_level_check 
  CHECK (track_grip_level IN ('low', 'medium', 'high'));

ALTER TABLE setups
ADD CONSTRAINT track_surface_type_check
  CHECK (track_surface_type IN ('clay', 'dirt', 'limestone'));

ALTER TABLE setups
ADD CONSTRAINT setup_rating_check
  CHECK (setup_rating BETWEEN 0 AND 5);