/*
  # Optimize RLS Policies - Part 4: Motors and Maintenance

  1. Performance Improvements
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth function for each row
    
  2. Tables Affected
    - motors
    - motor_events (via motors join)
    - maintenance_checklists
*/

-- Motors table
DROP POLICY IF EXISTS "Users can create own motors" ON public.motors;
CREATE POLICY "Users can create own motors" 
  ON public.motors FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own motors" ON public.motors;
CREATE POLICY "Users can read own motors" 
  ON public.motors FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own motors" ON public.motors;
CREATE POLICY "Users can update own motors" 
  ON public.motors FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own motors" ON public.motors;
CREATE POLICY "Users can delete own motors" 
  ON public.motors FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Motor events table (references motors which has user_id)
DROP POLICY IF EXISTS "Users can create own motor events" ON public.motor_events;
CREATE POLICY "Users can create own motor events" 
  ON public.motor_events FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.motors 
      WHERE motors.id = motor_events.motor_id 
      AND motors.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can read own motor events" ON public.motor_events;
CREATE POLICY "Users can read own motor events" 
  ON public.motor_events FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.motors 
      WHERE motors.id = motor_events.motor_id 
      AND motors.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own motor events" ON public.motor_events;
CREATE POLICY "Users can update own motor events" 
  ON public.motor_events FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.motors 
      WHERE motors.id = motor_events.motor_id 
      AND motors.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete own motor events" ON public.motor_events;
CREATE POLICY "Users can delete own motor events" 
  ON public.motor_events FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.motors 
      WHERE motors.id = motor_events.motor_id 
      AND motors.user_id = (select auth.uid())
    )
  );

-- Maintenance checklists table
DROP POLICY IF EXISTS "Users can create own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can create own checklists" 
  ON public.maintenance_checklists FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can read own checklists" 
  ON public.maintenance_checklists FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can update own checklists" 
  ON public.maintenance_checklists FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can delete own checklists" 
  ON public.maintenance_checklists FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);