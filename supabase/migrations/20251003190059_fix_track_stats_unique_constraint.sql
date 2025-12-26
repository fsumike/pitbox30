/*
  # Fix Track Stats Unique Constraint

  1. Purpose
    - Add unique constraint to track_stats table
    - Enable proper upsert functionality for track statistics
    - Ensure each user can only have one stats record per track

  2. Changes
    - Add unique constraint on (user_id, track_id)
    - This allows upsert to work correctly by identifying which row to update

  3. Impact
    - Fixes track stats save functionality
    - Prevents duplicate stats entries for same user/track combination
    - Enables atomic upsert operations
*/

-- Add unique constraint to prevent duplicates and enable proper upsert
ALTER TABLE track_stats 
  DROP CONSTRAINT IF EXISTS track_stats_user_track_unique;

ALTER TABLE track_stats 
  ADD CONSTRAINT track_stats_user_track_unique 
  UNIQUE (user_id, track_id);