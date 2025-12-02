/*
  # Clean Up Unused Indexes

  1. Performance Improvements
    - Remove indexes that are not being used by queries
    - Reduces storage overhead and write performance impact
    - Can be recreated later if query patterns change
    
  2. Indexes Removed
    - posts: status_idx, is_pinned_idx
    - listings: vehicle_type_idx, condition_idx, is_negotiable_idx, category, location indexes
    - saved_listings: user_id_idx, listing_id_idx
    - messages: created_at_idx
    - motor_events: date_idx
    - post_bookmarks: post_id_idx
    - post_comments: user_id_idx
    - post_likes: user_id_idx
    - profiles: full_name_idx, promo_code_idx
    - friendships: user1, user2 indexes
    - setups: track index
    
  Note: Foreign key indexes added earlier are kept for performance
*/

-- Posts indexes
DROP INDEX IF EXISTS public.posts_status_idx;
DROP INDEX IF EXISTS public.posts_is_pinned_idx;

-- Listings indexes
DROP INDEX IF EXISTS public.listings_vehicle_type_idx;
DROP INDEX IF EXISTS public.listings_condition_idx;
DROP INDEX IF EXISTS public.listings_is_negotiable_idx;
DROP INDEX IF EXISTS public.idx_listings_category;
DROP INDEX IF EXISTS public.idx_listings_location;
DROP INDEX IF EXISTS public.idx_listings_user_status;
DROP INDEX IF EXISTS public.idx_listings_created_status;

-- Saved listings indexes
DROP INDEX IF EXISTS public.saved_listings_user_id_idx;
DROP INDEX IF EXISTS public.saved_listings_listing_id_idx;

-- Messages indexes
DROP INDEX IF EXISTS public.messages_created_at_idx;

-- Motor events indexes
DROP INDEX IF EXISTS public.motor_events_date_idx;

-- Post bookmarks indexes
DROP INDEX IF EXISTS public.post_bookmarks_post_id_idx;

-- Post comments indexes
DROP INDEX IF EXISTS public.post_comments_user_id_idx;

-- Post likes indexes
DROP INDEX IF EXISTS public.post_likes_user_id_idx;

-- Profiles indexes
DROP INDEX IF EXISTS public.profiles_full_name_idx;
DROP INDEX IF EXISTS public.idx_profiles_promo_code;

-- Friendships indexes
DROP INDEX IF EXISTS public.idx_friendships_user1;
DROP INDEX IF EXISTS public.idx_friendships_user2;

-- Setups indexes
DROP INDEX IF EXISTS public.idx_setups_track;

-- Posts location index
DROP INDEX IF EXISTS public.idx_posts_location;