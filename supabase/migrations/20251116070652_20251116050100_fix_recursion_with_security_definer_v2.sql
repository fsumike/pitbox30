/*
  # Fix Infinite Recursion with Security Definer Function

  1. Problem
    - setups policies query team_members
    - team_members SELECT policy creates infinite recursion
    
  2. Solution
    - Create a SECURITY DEFINER function to bypass RLS
    - Use this function in setups policies to avoid recursion
    
  3. Changes
    - Drop existing function
    - Create helper function to check team membership
    - Update setups policies to use the helper function
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.is_team_member(uuid, uuid);

-- Create a security definer function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(
  p_team_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM team_members
    WHERE team_id = p_team_id
    AND user_id = p_user_id
    AND status = 'accepted'
  );
END;
$$;

-- Drop and recreate setups policies using the helper function
DROP POLICY IF EXISTS "Users can delete setups" ON public.setups;
DROP POLICY IF EXISTS "Users can read setups" ON public.setups;
DROP POLICY IF EXISTS "Users can update setups" ON public.setups;

CREATE POLICY "Users can delete setups"
  ON public.setups FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );

CREATE POLICY "Users can read setups"
  ON public.setups FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );

CREATE POLICY "Users can update setups"
  ON public.setups FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR
    (team_id IS NOT NULL AND is_team_member(team_id, auth.uid()))
  );
