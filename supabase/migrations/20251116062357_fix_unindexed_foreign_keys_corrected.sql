/*
  # Fix Unindexed Foreign Keys (Corrected)

  This migration adds indexes to all foreign key columns that are missing them.
  Foreign key indexes improve join performance and prevent table lock issues.

  ## New Indexes Added
  
  1. comment_reactions - user_id
  2. dyno_images - setup_id
  3. fuel_logs - user_id
  4. gear_ratios - user_id
  5. lap_sessions - setup_id
  6. lap_times - track_id, user_id
  7. listing_likes - user_id
  8. listings - user_id
  9. maintenance_logs - user_id
  10. messages - receiver_id
  11. notifications - post_id, related_user_id
  12. photo_metadata - track_id, user_id
  13. post_bookmarks - post_id
  14. post_comments - parent_comment_id, user_id
  15. post_likes - user_id
  16. post_views - user_id
  17. profile_invites - accepted_by
  18. saved_calculations - setup_id, user_id
  19. saved_listings - listing_id
  20. setups - track_id
  21. team_chats - sender_id, team_id
  22. team_members - invited_by_user_id, user_id
  23. team_tasks - assigned_to_user_id, created_by_user_id, team_id
  24. teams - owner_id
  25. track_check_ins - track_id, user_id
  26. track_conditions - track_id
  27. track_notebooks - setup_id
  28. track_notes - track_id
  29. track_stats - track_id
  30. track_weather_history - track_id
  31. user_reports - reviewed_by
  32. voice_notes - user_id

  ## Performance Impact
  
  - Improves JOIN performance on all affected tables
  - Prevents lock contention during foreign key constraint checks
  - Enables more efficient query plans
*/

-- comment_reactions
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id 
  ON comment_reactions(user_id);

-- dyno_images
CREATE INDEX IF NOT EXISTS idx_dyno_images_setup_id 
  ON dyno_images(setup_id);

-- fuel_logs
CREATE INDEX IF NOT EXISTS idx_fuel_logs_user_id 
  ON fuel_logs(user_id);

-- gear_ratios
CREATE INDEX IF NOT EXISTS idx_gear_ratios_user_id 
  ON gear_ratios(user_id);

-- lap_sessions
CREATE INDEX IF NOT EXISTS idx_lap_sessions_setup_id 
  ON lap_sessions(setup_id);

-- lap_times (using correct column names)
CREATE INDEX IF NOT EXISTS idx_lap_times_track_id 
  ON lap_times(track_id);

CREATE INDEX IF NOT EXISTS idx_lap_times_user_id 
  ON lap_times(user_id);

-- listing_likes
CREATE INDEX IF NOT EXISTS idx_listing_likes_user_id 
  ON listing_likes(user_id);

-- listings
CREATE INDEX IF NOT EXISTS idx_listings_user_id 
  ON listings(user_id);

-- maintenance_logs
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_id 
  ON maintenance_logs(user_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id 
  ON messages(receiver_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_post_id 
  ON notifications(post_id);

CREATE INDEX IF NOT EXISTS idx_notifications_related_user_id 
  ON notifications(related_user_id);

-- photo_metadata (using correct column names)
CREATE INDEX IF NOT EXISTS idx_photo_metadata_track_id 
  ON photo_metadata(track_id);

CREATE INDEX IF NOT EXISTS idx_photo_metadata_user_id 
  ON photo_metadata(user_id);

-- post_bookmarks
CREATE INDEX IF NOT EXISTS idx_post_bookmarks_post_id 
  ON post_bookmarks(post_id);

-- post_comments
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id 
  ON post_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_post_comments_user_id 
  ON post_comments(user_id);

-- post_likes
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id 
  ON post_likes(user_id);

-- post_views
CREATE INDEX IF NOT EXISTS idx_post_views_user_id 
  ON post_views(user_id);

-- profile_invites
CREATE INDEX IF NOT EXISTS idx_profile_invites_accepted_by 
  ON profile_invites(accepted_by);

-- saved_calculations
CREATE INDEX IF NOT EXISTS idx_saved_calculations_setup_id 
  ON saved_calculations(setup_id);

CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id 
  ON saved_calculations(user_id);

-- saved_listings
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id 
  ON saved_listings(listing_id);

-- setups
CREATE INDEX IF NOT EXISTS idx_setups_track_id 
  ON setups(track_id);

-- team_chats
CREATE INDEX IF NOT EXISTS idx_team_chats_sender_id 
  ON team_chats(sender_id);

CREATE INDEX IF NOT EXISTS idx_team_chats_team_id 
  ON team_chats(team_id);

-- team_members
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by_user_id 
  ON team_members(invited_by_user_id);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id 
  ON team_members(user_id);

-- team_tasks
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to_user_id 
  ON team_tasks(assigned_to_user_id);

CREATE INDEX IF NOT EXISTS idx_team_tasks_created_by_user_id 
  ON team_tasks(created_by_user_id);

CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id 
  ON team_tasks(team_id);

-- teams
CREATE INDEX IF NOT EXISTS idx_teams_owner_id 
  ON teams(owner_id);

-- track_check_ins (using correct column names)
CREATE INDEX IF NOT EXISTS idx_track_check_ins_track_id 
  ON track_check_ins(track_id);

CREATE INDEX IF NOT EXISTS idx_track_check_ins_user_id 
  ON track_check_ins(user_id);

-- track_conditions (using correct column name)
CREATE INDEX IF NOT EXISTS idx_track_conditions_track_id 
  ON track_conditions(track_id);

-- track_notebooks
CREATE INDEX IF NOT EXISTS idx_track_notebooks_setup_id 
  ON track_notebooks(setup_id);

-- track_notes (using correct column name)
CREATE INDEX IF NOT EXISTS idx_track_notes_track_id 
  ON track_notes(track_id);

-- track_stats
CREATE INDEX IF NOT EXISTS idx_track_stats_track_id 
  ON track_stats(track_id);

-- track_weather_history (using correct column name)
CREATE INDEX IF NOT EXISTS idx_track_weather_history_track_id 
  ON track_weather_history(track_id);

-- user_reports
CREATE INDEX IF NOT EXISTS idx_user_reports_reviewed_by 
  ON user_reports(reviewed_by);

-- voice_notes (using correct column name)
CREATE INDEX IF NOT EXISTS idx_voice_notes_user_id 
  ON voice_notes(user_id);
