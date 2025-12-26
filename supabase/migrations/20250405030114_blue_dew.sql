/*
  # Add Hyper Racing 600 Micro Sprint Fields

  1. Changes
    - Add specific fields for Hyper Racing 600 Micro Sprint setups
    - Set default values for numeric fields
    - Add validation constraints
  
  2. Security
    - No changes to existing RLS policies
*/

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
ADD COLUMN IF NOT EXISTS lf_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_caster numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rf_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_caster numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS lr_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_camber numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rr_tire_circumference numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_tire_pressure numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_camber numeric DEFAULT 0;

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
ADD COLUMN IF NOT EXISTS humidity numeric DEFAULT 0;

-- Add notes and metadata
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS setup_name text DEFAULT '',
ADD COLUMN IF NOT EXISTS setup_description text DEFAULT '',
ADD COLUMN IF NOT EXISTS weather_conditions text DEFAULT '',
ADD COLUMN IF NOT EXISTS track_preparation text DEFAULT '',
ADD COLUMN IF NOT EXISTS qualifying_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS finish_position numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lap_times jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS setup_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS driver_feedback text DEFAULT '',
ADD COLUMN IF NOT EXISTS crew_notes text DEFAULT '';

-- Add constraints
ALTER TABLE setups
ADD CONSTRAINT track_grip_level_check 
  CHECK (track_grip_level IN ('low', 'medium', 'high')),
ADD CONSTRAINT track_surface_type_check
  CHECK (track_surface_type IN ('clay', 'dirt', 'limestone')),
ADD CONSTRAINT setup_rating_check
  CHECK (setup_rating BETWEEN 0 AND 5);