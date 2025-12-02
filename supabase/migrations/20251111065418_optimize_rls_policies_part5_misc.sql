/*
  # Optimize RLS Policies - Part 5: Miscellaneous Tables

  ## Changes
  Optimizes RLS policies for terms_acceptance, notifications, messages, user_subscriptions, 
  friend_requests, friendships, and maintenance_checklists tables.
*/

-- Terms acceptance policies
DROP POLICY IF EXISTS "Users can create their own terms acceptance" ON public.terms_acceptance;
CREATE POLICY "Users can create their own terms acceptance"
  ON public.terms_acceptance FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read their own terms acceptance" ON public.terms_acceptance;
CREATE POLICY "Users can read their own terms acceptance"
  ON public.terms_acceptance FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Notifications policies
DROP POLICY IF EXISTS "Users can mark their notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their notifications as read"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can see their own notifications" ON public.notifications;
CREATE POLICY "Users can see their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Messages policies
DROP POLICY IF EXISTS "Users can read their own messages" ON public.messages;
CREATE POLICY "Users can read their own messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

-- User subscriptions policies
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can read their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Friend requests policies
DROP POLICY IF EXISTS "Users can see requests they're involved in" ON public.friend_requests;
CREATE POLICY "Users can see requests they're involved in"
  ON public.friend_requests FOR SELECT
  TO authenticated
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can send friend requests" ON public.friend_requests;
CREATE POLICY "Users can send friend requests"
  ON public.friend_requests FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their received requests" ON public.friend_requests;
CREATE POLICY "Users can update their received requests"
  ON public.friend_requests FOR UPDATE
  TO authenticated
  USING (receiver_id = (select auth.uid()));

-- Friendships policies
DROP POLICY IF EXISTS "Users can see their friendships" ON public.friendships;
CREATE POLICY "Users can see their friendships"
  ON public.friendships FOR SELECT
  TO authenticated
  USING (user_id1 = (select auth.uid()) OR user_id2 = (select auth.uid()));

-- Maintenance checklists policies
DROP POLICY IF EXISTS "Users can create own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can create own checklists"
  ON public.maintenance_checklists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can read own checklists"
  ON public.maintenance_checklists FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can update own checklists"
  ON public.maintenance_checklists FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own checklists" ON public.maintenance_checklists;
CREATE POLICY "Users can delete own checklists"
  ON public.maintenance_checklists FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
