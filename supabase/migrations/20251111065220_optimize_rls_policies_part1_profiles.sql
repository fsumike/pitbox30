/*
  # Optimize RLS Policies - Part 1: Profiles

  ## Changes
  Rewrites RLS policies to use (SELECT auth.uid()) instead of auth.uid() 
  to prevent re-evaluation on each row, significantly improving performance at scale.
  
  ## Tables Updated
  - profiles
*/

-- Profiles table policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
CREATE POLICY "Enable update for own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id);
