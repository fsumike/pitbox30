/*
  # Remove Duplicate Indexes

  ## Changes
  Drops duplicate indexes while keeping the better-named versions:
  - maintenance_checklists: Keep maintenance_checklists_user_vehicle_unique
  - posts: Keep posts_created_at_idx  
  - profiles: Keep profiles_username_idx
*/

-- Drop duplicate index on maintenance_checklists
DROP INDEX IF EXISTS public.maintenance_checklists_user_id_vehicle_type_key;

-- Drop duplicate index on posts
DROP INDEX IF EXISTS public.idx_posts_created_at;

-- Drop duplicate index on profiles
DROP INDEX IF EXISTS public.idx_profiles_username;
