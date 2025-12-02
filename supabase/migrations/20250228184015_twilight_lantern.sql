/*
  # Add dyno images storage functionality

  1. New Tables
    - `dyno_images` table updated with user_id field for direct user association
    - Add setup_id as nullable to allow standalone dyno images
  
  2. Security
    - Update RLS policies for dyno_images table
    - Add policies for authenticated users to manage their own dyno images
*/

-- Modify dyno_images table to add user_id and make setup_id nullable
ALTER TABLE dyno_images 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ALTER COLUMN setup_id DROP NOT NULL;

-- Update existing records to set user_id based on setup's user_id
DO $$
BEGIN
  UPDATE dyno_images
  SET user_id = setups.user_id
  FROM setups
  WHERE dyno_images.setup_id = setups.id
  AND dyno_images.user_id IS NULL;
END $$;

-- Add NOT NULL constraint after migration
ALTER TABLE dyno_images
  ALTER COLUMN user_id SET NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own dyno images" ON dyno_images;
DROP POLICY IF EXISTS "Users can create own dyno images" ON dyno_images;

-- Create new RLS policies
CREATE POLICY "Users can read own dyno images"
  ON dyno_images
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own dyno images"
  ON dyno_images
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own dyno images"
  ON dyno_images
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());