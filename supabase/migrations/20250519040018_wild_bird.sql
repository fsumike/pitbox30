/*
  # Fix Profiles RLS Policy

  1. Changes
    - Update RLS policy for profiles table to allow proper updates
    - Fix issue with users not being able to update their own profiles
  
  2. Security
    - Maintain security by ensuring users can only update their own profiles
*/

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;

-- Create a more permissive update policy
CREATE POLICY "Enable update for own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);