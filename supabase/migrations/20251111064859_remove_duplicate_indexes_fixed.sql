/*
  # Remove Duplicate Indexes

  1. Cleanup
    - Remove duplicate indexes that provide the same functionality
    - Keep the most appropriately named index
    
  2. Duplicates Removed
    - maintenance_checklists: Keep one unique constraint
    - posts: Keep posts_created_at_idx, drop idx_posts_created_at
    - profiles: Keep profiles_username_idx, drop idx_profiles_username
*/

-- For maintenance_checklists, drop one of the constraints (they're identical)
-- Keep the key constraint, drop the unique constraint
DROP INDEX IF EXISTS public.maintenance_checklists_user_id_vehicle_type_key;

-- Drop duplicate index on posts
DROP INDEX IF EXISTS public.idx_posts_created_at;

-- Drop duplicate index on profiles
DROP INDEX IF EXISTS public.idx_profiles_username;