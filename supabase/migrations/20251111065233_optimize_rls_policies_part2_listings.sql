/*
  # Optimize RLS Policies - Part 2: Listings & Related

  ## Changes
  Optimizes RLS policies for listings, listing_images, and listing_likes tables.
*/

-- Listing images policies
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

-- Listings policies
DROP POLICY IF EXISTS "Users can create their own listings" ON public.listings;
CREATE POLICY "Users can create their own listings"
  ON public.listings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
CREATE POLICY "Users can delete their own listings"
  ON public.listings FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
CREATE POLICY "Users can update their own listings"
  ON public.listings FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Listing likes policies
DROP POLICY IF EXISTS "Users can like listings" ON public.listing_likes;
CREATE POLICY "Users can like listings"
  ON public.listing_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can unlike listings" ON public.listing_likes;
CREATE POLICY "Users can unlike listings"
  ON public.listing_likes FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Saved listings policies
DROP POLICY IF EXISTS "Users can read their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can read their own saved listings"
  ON public.saved_listings FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can create their own saved listings"
  ON public.saved_listings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own saved listings" ON public.saved_listings;
CREATE POLICY "Users can delete their own saved listings"
  ON public.saved_listings FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
