/*
  # Optimize RLS Policies - Part 3: Posts & Related

  ## Changes
  Optimizes RLS policies for posts, post_comments, post_likes, and post_bookmarks tables.
*/

-- Posts policies
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read public posts" ON public.posts;
CREATE POLICY "Users can read public posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    visibility = 'public' OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM public.friendships
      WHERE (user_id1 = posts.user_id AND user_id2 = (select auth.uid()))
      OR (user_id2 = posts.user_id AND user_id1 = (select auth.uid()))
    ))
  );

-- Post comments policies
DROP POLICY IF EXISTS "Users can create their own comments" ON public.post_comments;
CREATE POLICY "Users can create their own comments"
  ON public.post_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.post_comments;
CREATE POLICY "Users can delete their own comments"
  ON public.post_comments FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own comments" ON public.post_comments;
CREATE POLICY "Users can update their own comments"
  ON public.post_comments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Post likes policies
DROP POLICY IF EXISTS "Users can create their own likes" ON public.post_likes;
CREATE POLICY "Users can create their own likes"
  ON public.post_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.post_likes;
CREATE POLICY "Users can delete their own likes"
  ON public.post_likes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Post bookmarks policies
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can create their own bookmarks"
  ON public.post_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.post_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can see their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can see their own bookmarks"
  ON public.post_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));
