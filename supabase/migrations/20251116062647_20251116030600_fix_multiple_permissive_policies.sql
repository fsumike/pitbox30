/*
  # Fix Multiple Permissive Policies

  1. Security Improvements
    - Remove duplicate policies that were already consolidated
    - Ensures only one policy per action per table

  2. Tables Fixed
    - listing_reviews: Remove old duplicate UPDATE policies
    - setups: Policies already consolidated, no changes needed
    - track_check_ins: Policies already consolidated, no changes needed
*/

-- listing_reviews: Remove the old individual policies, keep the consolidated one
DROP POLICY IF EXISTS "Reviewers can update their own reviews" ON public.listing_reviews;
DROP POLICY IF EXISTS "Sellers can respond to reviews" ON public.listing_reviews;

-- Note: "Users can update reviews" policy already exists and is correct
-- Note: setups policies already consolidated to "Users can delete/read/update setups"
-- Note: track_check_ins policies already consolidated to "Users can view check-ins"
