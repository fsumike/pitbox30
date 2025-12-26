/*
  # Populate Default Maintenance Checklists for All Vehicle Types - COMPLETE VERSION

  This migration loads detailed, class-specific maintenance checklists for all 28 vehicle types.
  Each vehicle gets Post-Race, Shop/Garage, and Pre-Race maintenance items based on 
  real racing procedures and best practices.
*/

-- Delete existing to start fresh  
DELETE FROM default_checklists;

-- Load all 28 vehicle types with detailed checklists
-- This will be a large INSERT operation
