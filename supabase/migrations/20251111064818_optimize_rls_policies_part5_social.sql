/*
  # Optimize RLS Policies - Part 5: Social Features

  1. Performance Improvements
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth function for each row
    
  2. Tables Affected
    - friendships
    - friend_requests
    - messages
    - notifications
    - terms_acceptance
    - user_subscriptions
*/

-- Friendships table
DROP POLICY IF EXISTS "Users can see their friendships" ON public.friendships;
CREATE POLICY "Users can see their friendships" 
  ON public.friendships FOR SELECT 
  TO authenticated 
  USING (user_id1 = (select auth.uid()) OR user_id2 = (select auth.uid()));

-- Friend requests table
DROP POLICY IF EXISTS "Users can send friend requests" ON public.friend_requests;
CREATE POLICY "Users can send friend requests" 
  ON public.friend_requests FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = sender_id);

DROP POLICY IF EXISTS "Users can see requests they're involved in" ON public.friend_requests;
CREATE POLICY "Users can see requests they're involved in" 
  ON public.friend_requests FOR SELECT 
  TO authenticated 
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their received requests" ON public.friend_requests;
CREATE POLICY "Users can update their received requests" 
  ON public.friend_requests FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = receiver_id);

-- Messages table
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = sender_id);

DROP POLICY IF EXISTS "Users can read their own messages" ON public.messages;
CREATE POLICY "Users can read their own messages" 
  ON public.messages FOR SELECT 
  TO authenticated 
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Notifications table
DROP POLICY IF EXISTS "Users can see their own notifications" ON public.notifications;
CREATE POLICY "Users can see their own notifications" 
  ON public.notifications FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can mark their notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their notifications as read" 
  ON public.notifications FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Terms acceptance table
DROP POLICY IF EXISTS "Users can create their own terms acceptance" ON public.terms_acceptance;
CREATE POLICY "Users can create their own terms acceptance" 
  ON public.terms_acceptance FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read their own terms acceptance" ON public.terms_acceptance;
CREATE POLICY "Users can read their own terms acceptance" 
  ON public.terms_acceptance FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- User subscriptions table
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can read their own subscriptions" 
  ON public.user_subscriptions FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);