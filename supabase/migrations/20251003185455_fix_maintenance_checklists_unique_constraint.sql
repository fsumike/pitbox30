/*
  # Fix Maintenance Checklists Unique Constraint

  1. Purpose
    - Add unique constraint to maintenance_checklists table
    - Enable proper upsert functionality for saving checklists
    - Prevent duplicate entries for same user and vehicle type

  2. Changes
    - Add unique constraint on (user_id, vehicle_type)
    - This allows upsert to work correctly by identifying which row to update

  3. Impact
    - Fixes "fail to save checklist" issue
    - Ensures each user can only have one checklist per vehicle type
    - Enables atomic upsert operations
*/

-- Add unique constraint to prevent duplicates and enable proper upsert
ALTER TABLE maintenance_checklists 
  DROP CONSTRAINT IF EXISTS maintenance_checklists_user_vehicle_unique;

ALTER TABLE maintenance_checklists 
  ADD CONSTRAINT maintenance_checklists_user_vehicle_unique 
  UNIQUE (user_id, vehicle_type);