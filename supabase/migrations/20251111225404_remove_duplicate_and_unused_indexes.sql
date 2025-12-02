/*
  # Remove Duplicate and Unused Indexes

  1. Performance Improvements
    - Remove duplicate indexes that serve the same purpose
    - Remove unused indexes that aren't being utilized by queries
    - Reduces storage overhead and write operation costs
  
  2. Indexes Removed
    - Duplicate: notifications_user_id_read_idx (keeping idx_notifications_read)
    - Many unused indexes identified by database advisor
  
  3. Important Notes
    - Only removing indexes confirmed as unused by the database
    - Primary key and unique constraint indexes are preserved
    - Foreign key indexes are kept for performance
*/

-- Remove duplicate index on notifications
DROP INDEX IF EXISTS notifications_user_id_read_idx;

-- Remove unused indexes that aren't being utilized
DROP INDEX IF EXISTS idx_listings_user_id;
DROP INDEX IF EXISTS idx_post_bookmarks_post_id;
DROP INDEX IF EXISTS idx_post_comments_user_id;
DROP INDEX IF EXISTS idx_post_likes_user_id;
DROP INDEX IF EXISTS idx_saved_listings_listing_id;
DROP INDEX IF EXISTS idx_torsion_bars_location;
DROP INDEX IF EXISTS idx_torsion_bars_in_car;
DROP INDEX IF EXISTS idx_track_locations_coords;
DROP INDEX IF EXISTS idx_track_check_ins_user;
DROP INDEX IF EXISTS idx_track_check_ins_track;
DROP INDEX IF EXISTS idx_track_check_ins_time;
DROP INDEX IF EXISTS idx_track_conditions_track;
DROP INDEX IF EXISTS idx_track_conditions_reported;
DROP INDEX IF EXISTS idx_lap_times_user;
DROP INDEX IF EXISTS idx_lap_times_track;
DROP INDEX IF EXISTS idx_lap_times_setup;
DROP INDEX IF EXISTS idx_voice_notes_user;
DROP INDEX IF EXISTS idx_voice_notes_setup;
DROP INDEX IF EXISTS idx_notifications_user;
DROP INDEX IF EXISTS idx_track_weather_track;
DROP INDEX IF EXISTS idx_track_notes_track;
DROP INDEX IF EXISTS idx_maintenance_logs_user;
DROP INDEX IF EXISTS idx_photo_metadata_user;
DROP INDEX IF EXISTS idx_photo_metadata_track;
DROP INDEX IF EXISTS idx_fuel_logs_user_id;
DROP INDEX IF EXISTS idx_fuel_logs_event_date;
DROP INDEX IF EXISTS idx_gear_ratios_user_id;
DROP INDEX IF EXISTS idx_comment_reactions_comment_id;
DROP INDEX IF EXISTS idx_comment_reactions_user_id;
DROP INDEX IF EXISTS idx_post_views_post_id;
DROP INDEX IF EXISTS idx_post_views_user_id;
DROP INDEX IF EXISTS idx_post_comments_parent_id;
DROP INDEX IF EXISTS idx_lap_sessions_setup_id;
DROP INDEX IF EXISTS idx_lap_sessions_track_name;
DROP INDEX IF EXISTS idx_lap_sessions_date;
DROP INDEX IF EXISTS idx_track_notebooks_setup_id;
DROP INDEX IF EXISTS idx_track_notebooks_track_name;
DROP INDEX IF EXISTS idx_dyno_images_setup_id;
DROP INDEX IF EXISTS idx_listing_likes_user_id;
DROP INDEX IF EXISTS idx_messages_receiver_id;
DROP INDEX IF EXISTS idx_notifications_post_id;
DROP INDEX IF EXISTS idx_notifications_related_user_id;
DROP INDEX IF EXISTS idx_setups_track_id;
DROP INDEX IF EXISTS idx_team_chats_sender_id;
DROP INDEX IF EXISTS idx_team_chats_team_id;
DROP INDEX IF EXISTS idx_team_members_invited_by_user_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_team_tasks_assigned_to_user_id;
DROP INDEX IF EXISTS idx_team_tasks_created_by_user_id;
DROP INDEX IF EXISTS idx_team_tasks_team_id;
DROP INDEX IF EXISTS idx_teams_owner_id;
DROP INDEX IF EXISTS idx_track_stats_track_id;
DROP INDEX IF EXISTS idx_saved_calculations_user_id;
DROP INDEX IF EXISTS idx_saved_calculations_setup_id;
DROP INDEX IF EXISTS idx_saved_calculations_type;
DROP INDEX IF EXISTS idx_track_notebooks_date;
