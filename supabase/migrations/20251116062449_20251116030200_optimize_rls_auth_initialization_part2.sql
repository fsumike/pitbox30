/*
  # Optimize RLS Policies - Auth Function Initialization (Part 2)

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in RLS policies

  2. Tables Updated (Second Batch)
    - video_reels
    - video_reel_likes
    - video_reel_comments
    - stories
    - story_views
    - live_streams
*/

-- video_reels
DROP POLICY IF EXISTS "Users can create their own video reels" ON public.video_reels;
DROP POLICY IF EXISTS "Users can delete their own video reels" ON public.video_reels;
DROP POLICY IF EXISTS "Users can update their own video reels" ON public.video_reels;

CREATE POLICY "Users can create their own video reels"
  ON public.video_reels FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own video reels"
  ON public.video_reels FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own video reels"
  ON public.video_reels FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- video_reel_likes
DROP POLICY IF EXISTS "Users can like video reels" ON public.video_reel_likes;
DROP POLICY IF EXISTS "Users can unlike video reels" ON public.video_reel_likes;

CREATE POLICY "Users can like video reels"
  ON public.video_reel_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can unlike video reels"
  ON public.video_reel_likes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- video_reel_comments
DROP POLICY IF EXISTS "Users can create video reel comments" ON public.video_reel_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.video_reel_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.video_reel_comments;

CREATE POLICY "Users can create video reel comments"
  ON public.video_reel_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own comments"
  ON public.video_reel_comments FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own comments"
  ON public.video_reel_comments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- stories
DROP POLICY IF EXISTS "Users can create their own stories" ON public.stories;
DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;

CREATE POLICY "Users can create their own stories"
  ON public.stories FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own stories"
  ON public.stories FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- story_views
DROP POLICY IF EXISTS "Users can record story views" ON public.story_views;

CREATE POLICY "Users can record story views"
  ON public.story_views FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- live_streams
DROP POLICY IF EXISTS "Users can create their own live streams" ON public.live_streams;
DROP POLICY IF EXISTS "Users can update their own live streams" ON public.live_streams;

CREATE POLICY "Users can create their own live streams"
  ON public.live_streams FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own live streams"
  ON public.live_streams FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));
