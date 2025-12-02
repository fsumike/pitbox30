/*
  # Fix Profiles RLS Policy

  1. Changes
    - Drop existing update policy for profiles table
    - Create new policy that properly allows users to update their own profiles
  
  2. Security
    - Ensure users can only update their own profiles
    - Maintain existing read permissions
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Create new update policy with proper permissions
CREATE POLICY "Enable update for own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);