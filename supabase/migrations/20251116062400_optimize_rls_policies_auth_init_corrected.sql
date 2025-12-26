/*
  # Optimize RLS Policies - Auth Initialization (Corrected)

  This migration optimizes RLS policies by wrapping auth function calls in SELECT subqueries.
  This prevents re-evaluation for each row and significantly improves query performance.

  ## Tables Updated
  
  Uses correct column names (is_private instead of is_public for groups).

  ## Performance Impact
  
  - Auth functions are evaluated once per query instead of per row
  - Reduces CPU usage significantly for large result sets
  - Improves query response times
*/

-- groups (corrected to use is_private)
DROP POLICY IF EXISTS "Anyone can view public groups" ON groups;
CREATE POLICY "Anyone can view public groups" ON groups
  FOR SELECT TO authenticated
  USING (
    is_private = false 
    OR creator_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = groups.id 
      AND group_members.user_id = (SELECT auth.uid())
    )
  );

-- group_members (corrected to use is_private)
DROP POLICY IF EXISTS "Group members can view members" ON group_members;
CREATE POLICY "Group members can view members" ON group_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = (SELECT auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.is_private = false
    )
  );

DROP POLICY IF EXISTS "Users can join public groups" ON group_members;
CREATE POLICY "Users can join public groups" ON group_members
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.is_private = false
    )
  );
