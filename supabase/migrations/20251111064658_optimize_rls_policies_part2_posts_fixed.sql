/*
  # Optimize RLS Policies - Part 2: Posts and Related Tables

  1. Performance Improvements
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth function for each row
    
  2. Tables Affected
    - posts
    - post_comments
    - post_likes
    - post_bookmarks
*/

-- Posts table
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
CREATE POLICY "Users can create their own posts" 
  ON public.posts FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" 
  ON public.posts FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" 
  ON public.posts FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can read public posts" ON public.posts;
CREATE POLICY "Users can read public posts" 
  ON public.posts FOR SELECT 
  TO authenticated 
  USING (
    user_id = (select auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE (
        (user_id1 = (select auth.uid()) AND user_id2 = posts.user_id) OR 
        (user_id2 = (select auth.uid()) AND user_id1 = posts.user_id)
      )
    )
  );

-- Post comments table
DROP POLICY IF EXISTS "Users can create their own comments" ON public.post_comments;
CREATE POLICY "Users can create their own comments" 
  ON public.post_comments FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.post_comments;
CREATE POLICY "Users can update their own comments" 
  ON public.post_comments FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.post_comments;
CREATE POLICY "Users can delete their own comments" 
  ON public.post_comments FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Post likes table
DROP POLICY IF EXISTS "Users can create their own likes" ON public.post_likes;
CREATE POLICY "Users can create their own likes" 
  ON public.post_likes FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.post_likes;
CREATE POLICY "Users can delete their own likes" 
  ON public.post_likes FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Post bookmarks table
DROP POLICY IF EXISTS "Users can see their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can see their own bookmarks" 
  ON public.post_bookmarks FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can create their own bookmarks" 
  ON public.post_bookmarks FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.post_bookmarks;
CREATE POLICY "Users can delete their own bookmarks" 
  ON public.post_bookmarks FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);