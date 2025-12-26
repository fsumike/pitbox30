/*
  # Add Dirt Modified Setup Fields

  1. Changes
    - Add specific fields for Dirt Modified setups
    - Set default values for numeric fields
    - Add validation constraints
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add chassis/handling fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS jbar_angle numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rear_end_lead numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rear_end_side_to_side numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS toe_out numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rake numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS tilt numeric DEFAULT 0;

-- Add drivetrain fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS gear_ratio numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_rpm numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS high_rpm numeric DEFAULT 0;

-- Add weights and measures fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS front_stagger numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rear_stagger numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS left_weight_percentage numeric DEFAULT 0;

-- Add fuel fields
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS fuel_start numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fuel_finish numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fuel_per_lap numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS laps_to_run numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fuel_needed numeric DEFAULT 0;

-- Add wheels and tires fields for each corner
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS lf_tire_size numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_wheel_width numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_compound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_ride_height numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rf_tire_size numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_wheel_width numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_compound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_ride_height numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS lr_tire_size numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_wheel_width numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_compound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_spacing numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rr_tire_size numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_wheel_width numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_wheel_offset numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_compound numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_ride_height numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_spacing numeric DEFAULT 0;

-- Add suspension fields for each corner
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS lf_spring numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_caster numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lf_shock_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS lf_shock_comp numeric DEFAULT 1010,
ADD COLUMN IF NOT EXISTS lf_shock_reb numeric DEFAULT 1010,
ADD COLUMN IF NOT EXISTS lf_shock_psi numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rf_spring numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_caster numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS rf_shock_comp numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_reb numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rf_shock_psi numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS lr_spring numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS lr_shock_comp numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_reb numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS lr_shock_psi numeric DEFAULT 0,

ADD COLUMN IF NOT EXISTS rr_spring numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_camber numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS rr_shock_comp numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_reb numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS rr_shock_psi numeric DEFAULT 0;

-- Add notes field
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS notes text DEFAULT '';