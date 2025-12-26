/*
  # Add location fields to posts table

  1. Changes
    - Add location, latitude, and longitude columns to posts table
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add location fields to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;