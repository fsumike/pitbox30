/*
  # Optimize RLS Policies - Part 3: Setups and Related Tables

  1. Performance Improvements
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth function for each row
    
  2. Tables Affected
    - setups
    - setup_customizations
    - dyno_images
    - track_stats
*/

-- Setups table
DROP POLICY IF EXISTS "Users can create own setups" ON public.setups;
CREATE POLICY "Users can create own setups" 
  ON public.setups FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own setups" ON public.setups;
CREATE POLICY "Users can read own setups" 
  ON public.setups FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own setups" ON public.setups;
CREATE POLICY "Users can update own setups" 
  ON public.setups FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own setups" ON public.setups;
CREATE POLICY "Users can delete own setups" 
  ON public.setups FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Team members can read shared setups" ON public.setups;
CREATE POLICY "Team members can read shared setups" 
  ON public.setups FOR SELECT 
  TO authenticated 
  USING (
    team_id IS NOT NULL AND EXISTS (
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
    team_id IS NOT NULL AND EXISTS (
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
    team_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = setups.team_id 
      AND team_members.user_id = (select auth.uid()) 
      AND team_members.status = 'accepted'
    )
  );

-- Setup customizations table
DROP POLICY IF EXISTS "Users can create own customizations" ON public.setup_customizations;
CREATE POLICY "Users can create own customizations" 
  ON public.setup_customizations FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own customizations" ON public.setup_customizations;
CREATE POLICY "Users can read own customizations" 
  ON public.setup_customizations FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own customizations" ON public.setup_customizations;
CREATE POLICY "Users can update own customizations" 
  ON public.setup_customizations FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own customizations" ON public.setup_customizations;
CREATE POLICY "Users can delete own customizations" 
  ON public.setup_customizations FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Dyno images table
DROP POLICY IF EXISTS "Users can create own dyno images" ON public.dyno_images;
CREATE POLICY "Users can create own dyno images" 
  ON public.dyno_images FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own dyno images" ON public.dyno_images;
CREATE POLICY "Users can read own dyno images" 
  ON public.dyno_images FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own dyno images" ON public.dyno_images;
CREATE POLICY "Users can delete own dyno images" 
  ON public.dyno_images FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Track stats table
DROP POLICY IF EXISTS "Users can create own track stats" ON public.track_stats;
CREATE POLICY "Users can create own track stats" 
  ON public.track_stats FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own track stats" ON public.track_stats;
CREATE POLICY "Users can read own track stats" 
  ON public.track_stats FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own track stats" ON public.track_stats;
CREATE POLICY "Users can update own track stats" 
  ON public.track_stats FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);