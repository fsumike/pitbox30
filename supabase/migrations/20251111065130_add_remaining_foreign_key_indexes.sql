/*
  # Add Remaining Foreign Key Indexes

  1. Performance Improvements
    - Add indexes on foreign key columns that are still missing them
    - Improves JOIN performance and foreign key constraint checking
    
  2. Tables Affected
    - listings: user_id
    - post_bookmarks: post_id
    - post_comments: user_id
    - post_likes: user_id
    - saved_listings: listing_id
*/

-- Listings user_id index
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);

-- Post bookmarks post_id index
CREATE INDEX IF NOT EXISTS idx_post_bookmarks_post_id ON public.post_bookmarks(post_id);

-- Post comments user_id index
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON public.post_comments(user_id);

-- Post likes user_id index
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- Saved listings listing_id index
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON public.saved_listings(listing_id);