/*
  # Add phone field to profiles table

  1. Changes
    - Add phone field to profiles table
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add phone field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone text;