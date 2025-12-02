/*
  # Optimize RLS Policies - Auth Function Initialization (Part 1)

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale

  2. Tables Updated (First Batch)
    - challenge_votes
    - groups
    - group_members
    - group_messages
    - shocks
    - setup_shocks
*/

-- challenge_votes
DROP POLICY IF EXISTS "Users can remove their votes" ON public.challenge_votes;
DROP POLICY IF EXISTS "Users can vote on entries" ON public.challenge_votes;

CREATE POLICY "Users can remove their votes"
  ON public.challenge_votes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can vote on entries"
  ON public.challenge_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- groups
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators and admins can update groups" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;

CREATE POLICY "Anyone can view public groups"
  ON public.groups FOR SELECT
  TO authenticated
  USING (
    is_private = false OR 
    creator_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = groups.id 
      AND group_members.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Group creators and admins can update groups"
  ON public.groups FOR UPDATE
  TO authenticated
  USING (
    creator_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = groups.id 
      AND group_members.user_id = (select auth.uid())
      AND group_members.role = 'admin'
    )
  );

CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (select auth.uid()));

-- group_members
DROP POLICY IF EXISTS "Group members can view members" ON public.group_members;
DROP POLICY IF EXISTS "Users can join public groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;

CREATE POLICY "Group members can view members"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM groups 
      WHERE groups.id = group_members.group_id 
      AND (groups.is_private = false OR groups.creator_id = (select auth.uid()))
    ) OR
    user_id = (select auth.uid())
  );

CREATE POLICY "Users can join public groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid()) AND
    EXISTS (SELECT 1 FROM groups WHERE groups.id = group_id AND groups.is_private = false)
  );

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- group_messages
DROP POLICY IF EXISTS "Group members can send messages" ON public.group_messages;
DROP POLICY IF EXISTS "Group members can view messages" ON public.group_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.group_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.group_messages;

CREATE POLICY "Group members can send messages"
  ON public.group_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_messages.group_id 
      AND group_members.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Group members can view messages"
  ON public.group_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members 
      WHERE group_members.group_id = group_messages.group_id 
      AND group_members.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete their own messages"
  ON public.group_messages FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own messages"
  ON public.group_messages FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- shocks
DROP POLICY IF EXISTS "Users can create own shocks" ON public.shocks;
DROP POLICY IF EXISTS "Users can delete own shocks" ON public.shocks;
DROP POLICY IF EXISTS "Users can update own shocks" ON public.shocks;
DROP POLICY IF EXISTS "Users can view own shocks" ON public.shocks;

CREATE POLICY "Users can create own shocks"
  ON public.shocks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own shocks"
  ON public.shocks FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update own shocks"
  ON public.shocks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can view own shocks"
  ON public.shocks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- setup_shocks
DROP POLICY IF EXISTS "Users can create setup shocks" ON public.setup_shocks;
DROP POLICY IF EXISTS "Users can delete setup shocks" ON public.setup_shocks;
DROP POLICY IF EXISTS "Users can update setup shocks" ON public.setup_shocks;
DROP POLICY IF EXISTS "Users can view own setup shocks" ON public.setup_shocks;

CREATE POLICY "Users can create setup shocks"
  ON public.setup_shocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setups 
      WHERE setups.id = setup_shocks.setup_id 
      AND setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete setup shocks"
  ON public.setup_shocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups 
      WHERE setups.id = setup_shocks.setup_id 
      AND setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update setup shocks"
  ON public.setup_shocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups 
      WHERE setups.id = setup_shocks.setup_id 
      AND setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can view own setup shocks"
  ON public.setup_shocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM setups 
      WHERE setups.id = setup_shocks.setup_id 
      AND setups.user_id = (select auth.uid())
    )
  );
