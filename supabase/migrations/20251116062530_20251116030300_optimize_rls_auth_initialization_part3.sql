/*
  # Optimize RLS Policies - Auth Function Initialization (Part 3)

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies

  2. Tables Updated (Third Batch)
    - user_follows
    - listing_reviews
    - events
    - event_rsvps
    - challenges
    - challenge_entries
*/

-- user_follows
DROP POLICY IF EXISTS "Users can follow others" ON public.user_follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.user_follows;

CREATE POLICY "Users can follow others"
  ON public.user_follows FOR INSERT
  TO authenticated
  WITH CHECK (follower_id = (select auth.uid()));

CREATE POLICY "Users can unfollow others"
  ON public.user_follows FOR DELETE
  TO authenticated
  USING (follower_id = (select auth.uid()));

-- listing_reviews
DROP POLICY IF EXISTS "Reviewers can update their own reviews" ON public.listing_reviews;
DROP POLICY IF EXISTS "Sellers can respond to reviews" ON public.listing_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.listing_reviews;

CREATE POLICY "Reviewers can update their own reviews"
  ON public.listing_reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = (select auth.uid()))
  WITH CHECK (reviewer_id = (select auth.uid()));

CREATE POLICY "Sellers can respond to reviews"
  ON public.listing_reviews FOR UPDATE
  TO authenticated
  USING (
    seller_id = (select auth.uid()) AND 
    response_text IS NULL
  )
  WITH CHECK (seller_id = (select auth.uid()));

CREATE POLICY "Users can create reviews"
  ON public.listing_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = (select auth.uid()));

-- events
DROP POLICY IF EXISTS "Event creators can delete their events" ON public.events;
DROP POLICY IF EXISTS "Event creators can update their events" ON public.events;
DROP POLICY IF EXISTS "Users can create events" ON public.events;

CREATE POLICY "Event creators can delete their events"
  ON public.events FOR DELETE
  TO authenticated
  USING (creator_id = (select auth.uid()));

CREATE POLICY "Event creators can update their events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (creator_id = (select auth.uid()));

CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (select auth.uid()));

-- event_rsvps
DROP POLICY IF EXISTS "Users can RSVP to events" ON public.event_rsvps;
DROP POLICY IF EXISTS "Users can delete their own RSVPs" ON public.event_rsvps;
DROP POLICY IF EXISTS "Users can update their own RSVPs" ON public.event_rsvps;

CREATE POLICY "Users can RSVP to events"
  ON public.event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own RSVPs"
  ON public.event_rsvps FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own RSVPs"
  ON public.event_rsvps FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- challenges
DROP POLICY IF EXISTS "Challenge creators can update their challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can create challenges" ON public.challenges;

CREATE POLICY "Challenge creators can update their challenges"
  ON public.challenges FOR UPDATE
  TO authenticated
  USING (creator_id = (select auth.uid()));

CREATE POLICY "Users can create challenges"
  ON public.challenges FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (select auth.uid()));

-- challenge_entries
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.challenge_entries;
DROP POLICY IF EXISTS "Users can submit challenge entries" ON public.challenge_entries;

CREATE POLICY "Users can delete their own entries"
  ON public.challenge_entries FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can submit challenge entries"
  ON public.challenge_entries FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
