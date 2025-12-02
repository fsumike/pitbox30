/*
  # Optimize RLS Policies - Part 1: Profiles and Listings

  1. Performance Improvements
    - Replace auth.uid() with (select auth.uid()) in RLS policies
    - Prevents re-evaluation of auth function for each row
    - Dramatically improves query performance at scale
    
  2. Tables Affected
    - profiles
    - listings
    - listing_images
    - listing_likes
    - saved_listings
*/

-- Profiles table
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

-- Listings table
DROP POLICY IF EXISTS "Users can create their own listings" ON public.listings;
CREATE POLICY "Users can create their own listings" 
  ON public.listings FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
CREATE POLICY "Users can update their own listings" 
  ON public.listings FOR UPDATE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
CREATE POLICY "Users can delete their own listings" 
  ON public.listings FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Listing images table
DROP POLICY IF EXISTS "Users can add images to their listings" ON public.listing_images;
CREATE POLICY "Users can add images to their listings" 
  ON public.listing_images FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE listings.id = listing_images.listing_id 
      AND listings.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can delete images from their listings" ON public.listing_images;
CREATE POLICY "Users can delete images from their listings" 
  ON public.listing_images FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.listings 
      WHERE listings.id = listing_images.listing_id 
      AND listings.user_id = (select auth.uid())
    )
  );

-- Listing likes table
DROP POLICY IF EXISTS "Users can like listings" ON public.listing_likes;
CREATE POLICY "Users can like listings" 
  ON public.listing_likes FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can unlike listings" ON public.listing_likes;
CREATE POLICY "Users can unlike listings" 
  ON public.listing_likes FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

-- Saved listings table
DROP POLICY IF EXISTS "Users can read their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can read their own saved listings" 
  ON public.saved_listings FOR SELECT 
  TO authenticated 
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can create their own saved listings" 
  ON public.saved_listings FOR INSERT 
  TO authenticated 
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can delete their own saved listings" 
  ON public.saved_listings FOR DELETE 
  TO authenticated 
  USING ((select auth.uid()) = user_id);