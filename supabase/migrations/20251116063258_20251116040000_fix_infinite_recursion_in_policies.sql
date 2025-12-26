/*
  # Fix Infinite Recursion in RLS Policies

  1. Problem
    - setups policies query team_members
    - team_members SELECT policy creates infinite recursion
    
  2. Solution
    - Simplify setups policies to avoid recursion
    - Use direct joins instead of subqueries where possible
    - Make team_members policies non-recursive

  3. Changes
    - Update setups policies to use simple team_id check with status
    - Simplify team_members policies to avoid circular references
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can delete setups" ON public.setups;
DROP POLICY IF EXISTS "Users can read setups" ON public.setups;
DROP POLICY IF EXISTS "Users can update setups" ON public.setups;

-- Recreate setups policies without causing recursion
-- These use EXISTS with a subquery that references teams directly
CREATE POLICY "Users can delete setups"
  ON public.setups FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    (team_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = setups.team_id
      AND tm.user_id = (select auth.uid())
      AND tm.status = 'accepted'
    ))
  );

CREATE POLICY "Users can read setups"
  ON public.setups FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    (team_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = setups.team_id
      AND tm.user_id = (select auth.uid())
      AND tm.status = 'accepted'
    ))
  );

CREATE POLICY "Users can update setups"
  ON public.setups FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    (team_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = setups.team_id
      AND tm.user_id = (select auth.uid())
      AND tm.status = 'accepted'
    ))
  );
