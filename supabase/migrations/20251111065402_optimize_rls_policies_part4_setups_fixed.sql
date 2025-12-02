/*
  # Optimize RLS Policies - Part 4: Setups & Related

  ## Changes
  Optimizes RLS policies for setups, setup_customizations, dyno_images, motors, and track_stats tables.
  Note: motor_events policies already use optimized format via motors table join.
*/

-- Setup customizations policies
DROP POLICY IF EXISTS "Users can create own customizations" ON public.setup_customizations;
CREATE POLICY "Users can create own customizations"
  ON public.setup_customizations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own customizations" ON public.setup_customizations;
CREATE POLICY "Users can delete own customizations"
  ON public.setup_customizations FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own customizations" ON public.setup_customizations;
CREATE POLICY "Users can read own customizations"
  ON public.setup_customizations FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own customizations" ON public.setup_customizations;
CREATE POLICY "Users can update own customizations"
  ON public.setup_customizations FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Dyno images policies
DROP POLICY IF EXISTS "Users can create own dyno images" ON public.dyno_images;
CREATE POLICY "Users can create own dyno images"
  ON public.dyno_images FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own dyno images" ON public.dyno_images;
CREATE POLICY "Users can delete own dyno images"
  ON public.dyno_images FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own dyno images" ON public.dyno_images;
CREATE POLICY "Users can read own dyno images"
  ON public.dyno_images FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Motors policies
DROP POLICY IF EXISTS "Users can create own motors" ON public.motors;
CREATE POLICY "Users can create own motors"
  ON public.motors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own motors" ON public.motors;
CREATE POLICY "Users can delete own motors"
  ON public.motors FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own motors" ON public.motors;
CREATE POLICY "Users can read own motors"
  ON public.motors FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own motors" ON public.motors;
CREATE POLICY "Users can update own motors"
  ON public.motors FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Setups policies
DROP POLICY IF EXISTS "Users can create own setups" ON public.setups;
CREATE POLICY "Users can create own setups"
  ON public.setups FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own setups" ON public.setups;
CREATE POLICY "Users can delete own setups"
  ON public.setups FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own setups" ON public.setups;
CREATE POLICY "Users can read own setups"
  ON public.setups FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own setups" ON public.setups;
CREATE POLICY "Users can update own setups"
  ON public.setups FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Team members can read shared setups" ON public.setups;
CREATE POLICY "Team members can read shared setups"
  ON public.setups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = setups.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can update shared setups" ON public.setups;
CREATE POLICY "Team members can update shared setups"
  ON public.setups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = setups.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

DROP POLICY IF EXISTS "Team members can delete shared setups" ON public.setups;
CREATE POLICY "Team members can delete shared setups"
  ON public.setups FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = setups.team_id
      AND team_members.user_id = (select auth.uid())
      AND team_members.status = 'accepted'
    )
  );

-- Track stats policies
DROP POLICY IF EXISTS "Users can create own track stats" ON public.track_stats;
CREATE POLICY "Users can create own track stats"
  ON public.track_stats FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own track stats" ON public.track_stats;
CREATE POLICY "Users can read own track stats"
  ON public.track_stats FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own track stats" ON public.track_stats;
CREATE POLICY "Users can update own track stats"
  ON public.track_stats FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));
