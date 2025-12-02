/*
  # Add Delete Policy for Setups

  1. Changes
    - Add policy to allow users to delete their own setups
    
  2. Security
    - Users can only delete setups where they are the owner (user_id matches auth.uid())
*/

-- Add delete policy for setups table
CREATE POLICY "Users can delete own setups"
  ON setups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);