/*
  # Fix uid() function error

  1. Changes
    - Replace uid() with auth.uid() in all RLS policies
    - Update maintenance_checklists policies to use correct function

  2. Security
    - Maintain same security model with correct function calls
    - Users can only access their own maintenance checklists
*/

-- Fix maintenance_checklists policies
DROP POLICY IF EXISTS "Users can create their own maintenance checklists" ON maintenance_checklists;
DROP POLICY IF EXISTS "Users can delete their own maintenance checklists" ON maintenance_checklists;
DROP POLICY IF EXISTS "Users can read their own maintenance checklists" ON maintenance_checklists;
DROP POLICY IF EXISTS "Users can update their own maintenance checklists" ON maintenance_checklists;

-- Create corrected policies using auth.uid()
CREATE POLICY "Users can create their own maintenance checklists"
  ON maintenance_checklists
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maintenance checklists"
  ON maintenance_checklists
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own maintenance checklists"
  ON maintenance_checklists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own maintenance checklists"
  ON maintenance_checklists
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);