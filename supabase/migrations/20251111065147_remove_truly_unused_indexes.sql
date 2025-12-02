/*
  # Remove Truly Unused Indexes

  1. Cleanup
    - Remove indexes that have existed for a while but are not being used
    - Keep newly created foreign key indexes (they need time to show usage)
    
  2. Indexes Removed
    - posts_created_at_idx: Not being used by queries
    - profiles_username_idx: Not being used by queries
    
  Note: The foreign key indexes we just created (idx_dyno_images_*, idx_listing_likes_user_id, 
  idx_messages_receiver_id, etc.) are kept because they're new and will be used for JOINs.
  They show as "unused" only because they were just created.
*/

-- Remove truly unused indexes that have been around
DROP INDEX IF EXISTS public.posts_created_at_idx;
DROP INDEX IF EXISTS public.profiles_username_idx;