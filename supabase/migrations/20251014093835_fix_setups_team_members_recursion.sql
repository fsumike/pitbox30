/*
  # Fix setups policies that trigger team_members recursion
  
  ## Problem
  The setups table policies query team_members directly, which triggers the recursive policies.
  Policies like "Team members can read shared setups" have SELECT FROM team_members.
  
  ## Solution
  Replace the direct team_members queries with the security definer function is_team_member()
  
  ## Changes
  - Drop problematic setups policies that query team_members
  - Recreate using is_team_member() function
*/

-- Drop the problematic policies that query team_members directly
DROP POLICY IF EXISTS "Team members can read shared setups" ON setups;
DROP POLICY IF EXISTS "Team members can update shared setups" ON setups;
DROP POLICY IF EXISTS "Team members can delete shared setups" ON setups;

-- Recreate using the security definer function to avoid recursion

-- SELECT: Users can read their own setups OR team setups they're a member of
CREATE POLICY "Team members can read shared setups"
  ON setups
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );

-- UPDATE: Users can update their own setups OR team setups they're a member of
CREATE POLICY "Team members can update shared setups"
  ON setups
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  )
  WITH CHECK (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );

-- DELETE: Users can delete their own setups OR team setups they're a member of
CREATE POLICY "Team members can delete shared setups"
  ON setups
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );
