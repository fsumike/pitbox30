/*
  # Optimize RLS Policies - Auth Function Initialization (Part 4)

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies

  2. Tables Updated (Fourth Batch)
    - blocked_users
    - user_reports
    - profile_invites
    - profile_views
*/

-- blocked_users
DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can unblock others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can view their blocked list" ON public.blocked_users;

CREATE POLICY "Users can block others"
  ON public.blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (blocker_id = (select auth.uid()));

CREATE POLICY "Users can unblock others"
  ON public.blocked_users FOR DELETE
  TO authenticated
  USING (blocker_id = (select auth.uid()));

CREATE POLICY "Users can view their blocked list"
  ON public.blocked_users FOR SELECT
  TO authenticated
  USING (blocker_id = (select auth.uid()));

-- user_reports
DROP POLICY IF EXISTS "Users can submit reports" ON public.user_reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.user_reports;

CREATE POLICY "Users can submit reports"
  ON public.user_reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = (select auth.uid()));

CREATE POLICY "Users can view their own reports"
  ON public.user_reports FOR SELECT
  TO authenticated
  USING (reporter_id = (select auth.uid()));

-- profile_invites
DROP POLICY IF EXISTS "Users can create invites" ON public.profile_invites;
DROP POLICY IF EXISTS "Users can update invite status" ON public.profile_invites;
DROP POLICY IF EXISTS "Users can view their invites" ON public.profile_invites;

CREATE POLICY "Users can create invites"
  ON public.profile_invites FOR INSERT
  TO authenticated
  WITH CHECK (inviter_id = (select auth.uid()));

CREATE POLICY "Users can update invite status"
  ON public.profile_invites FOR UPDATE
  TO authenticated
  USING (inviter_id = (select auth.uid()) OR accepted_by = (select auth.uid()));

CREATE POLICY "Users can view their invites"
  ON public.profile_invites FOR SELECT
  TO authenticated
  USING (inviter_id = (select auth.uid()) OR accepted_by = (select auth.uid()));

-- profile_views
DROP POLICY IF EXISTS "Authenticated users can track views" ON public.profile_views;
DROP POLICY IF EXISTS "Users can view their profile views" ON public.profile_views;

CREATE POLICY "Authenticated users can track views"
  ON public.profile_views FOR INSERT
  TO authenticated
  WITH CHECK (viewer_id = (select auth.uid()));

CREATE POLICY "Users can view their profile views"
  ON public.profile_views FOR SELECT
  TO authenticated
  USING (viewed_profile_id = (select auth.uid()));
