/*
  # Fix infinite recursion in team_members policies
  
  ## Problem
  The team_members table has a SELECT policy that references itself, causing infinite recursion.
  The policy "Users can read team members for teams they belong to" queries team_members within team_members.
  
  ## Solution
  1. Drop the problematic policy
  2. Create security definer functions to break the recursion
  3. Recreate policies using these functions
  
  ## Changes
  - Create helper functions with SECURITY DEFINER to avoid recursion
  - Drop and recreate team_members SELECT policy
*/

-- Create a security definer function to check team membership without recursion
CREATE OR REPLACE FUNCTION is_team_member(team_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = team_uuid AND user_id = user_uuid
  );
$$;

-- Create a function to check if user is team owner or admin
CREATE OR REPLACE FUNCTION is_team_owner_or_admin(team_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members tm
    JOIN teams t ON t.id = tm.team_id
    WHERE tm.team_id = team_uuid 
    AND tm.user_id = user_uuid
    AND (t.owner_id = user_uuid OR tm.role IN ('owner', 'admin'))
  );
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can read team members for teams they belong to" ON team_members;

-- Recreate with a non-recursive approach using the security definer function
CREATE POLICY "Users can read team members for teams they belong to"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (is_team_member(team_id, auth.uid()));

-- Also fix the DELETE policy if it exists
DROP POLICY IF EXISTS "Team owners and admins can remove members" ON team_members;

CREATE POLICY "Team owners and admins can remove members"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (
    is_team_owner_or_admin(team_id, auth.uid())
    OR user_id = auth.uid()
  );
