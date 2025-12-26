/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes for all foreign keys without covering indexes
    - Improves JOIN performance and foreign key constraint checks
  
  2. Tables Updated
    - `maintenance_logs` - Add index on track_id
    - `push_notification_tokens` - Add index on user_id
    - `setup_comparisons` - Add index on user_id
    - `track_conditions` - Add index on user_id
    - `track_notes` - Add index on user_id
  
  3. Impact
    - Significantly improves query performance on foreign key lookups
    - Reduces table scan operations
    - Enhances JOIN operation efficiency
*/

-- Add index for maintenance_logs.track_id
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_track_id 
ON maintenance_logs(track_id);

-- Add index for push_notification_tokens.user_id
CREATE INDEX IF NOT EXISTS idx_push_notification_tokens_user_id 
ON push_notification_tokens(user_id);

-- Add index for setup_comparisons.user_id
CREATE INDEX IF NOT EXISTS idx_setup_comparisons_user_id 
ON setup_comparisons(user_id);

-- Add index for track_conditions.user_id
CREATE INDEX IF NOT EXISTS idx_track_conditions_user_id 
ON track_conditions(user_id);

-- Add index for track_notes.user_id (already exists as idx_track_notes_user but not on user_id)
CREATE INDEX IF NOT EXISTS idx_track_notes_user_id 
ON track_notes(user_id);
