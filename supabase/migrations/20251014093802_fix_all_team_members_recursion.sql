/*
  # Fix ALL infinite recursion in team_members policies
  
  ## Problem
  Multiple policies on team_members reference the table itself, causing infinite recursion.
  
  ## Solution
  1. Drop ALL existing policies on team_members
  2. Create clean, non-recursive policies using security definer functions
  
  ## Changes
  - Drop all team_members policies
  - Recreate with simple, non-recursive logic
*/

-- Drop ALL existing policies on team_members
DROP POLICY IF EXISTS "Team members can read their own team memberships and other memb" ON team_members;
DROP POLICY IF EXISTS "Team owners/admins can invite members" ON team_members;
DROP POLICY IF EXISTS "Team owners/admins can remove members" ON team_members;
DROP POLICY IF EXISTS "Users can accept/decline their own invitations" ON team_members;
DROP POLICY IF EXISTS "Users can read team members for teams they belong to" ON team_members;
DROP POLICY IF EXISTS "Team owners and admins can remove members" ON team_members;

-- Create simple, non-recursive policies

-- SELECT: Users can read team members if they're part of the team
CREATE POLICY "team_members_select"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (is_team_member(team_id, auth.uid()));

-- INSERT: Only team owners can add members
CREATE POLICY "team_members_insert"
  ON team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
  );

-- UPDATE: Users can update their own membership status
CREATE POLICY "team_members_update"
  ON team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Team owners can remove members OR users can remove themselves
CREATE POLICY "team_members_delete"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
    )
  );
