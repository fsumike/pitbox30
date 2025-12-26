/*
  # Optimize RLS Policies - Part 6: Teams

  ## Changes
  Optimizes RLS policies for team_members, teams, team_chats, and team_tasks tables.
*/

-- Team members policies
DROP POLICY IF EXISTS "team_members_select" ON public.team_members;
CREATE POLICY "team_members_select"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "team_members_insert" ON public.team_members;
CREATE POLICY "team_members_insert"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "team_members_update" ON public.team_members;
CREATE POLICY "team_members_update"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "team_members_delete" ON public.team_members;
CREATE POLICY "team_members_delete"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = (select auth.uid())
    )
  );

-- Teams policies
DROP POLICY IF EXISTS "Owners can create teams" ON public.teams;
CREATE POLICY "Owners can create teams"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Team members can read team info" ON public.teams;
CREATE POLICY "Team members can read team info"
  ON public.teams FOR SELECT
  TO authenticated
  USING (
    owner_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Owners can update their teams" ON public.teams;
CREATE POLICY "Owners can update their teams"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Owners can delete their teams" ON public.teams;
CREATE POLICY "Owners can delete their teams"
  ON public.teams FOR DELETE
  TO authenticated
  USING (owner_id = (select auth.uid()));

-- Team chats policies
DROP POLICY IF EXISTS "Team members can send messages" ON public.team_chats;
CREATE POLICY "Team members can send messages"
  ON public.team_chats FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_chats.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can read messages" ON public.team_chats;
CREATE POLICY "Team members can read messages"
  ON public.team_chats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_chats.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

-- Team tasks policies
DROP POLICY IF EXISTS "Team members can create tasks" ON public.team_tasks;
CREATE POLICY "Team members can create tasks"
  ON public.team_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by_user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_tasks.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can read tasks" ON public.team_tasks;
CREATE POLICY "Team members can read tasks"
  ON public.team_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_tasks.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can update tasks" ON public.team_tasks;
CREATE POLICY "Team members can update tasks"
  ON public.team_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_tasks.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can delete tasks" ON public.team_tasks;
CREATE POLICY "Team members can delete tasks"
  ON public.team_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_tasks.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );
