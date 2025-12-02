/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes for all unindexed foreign keys
    - Improves JOIN performance and query optimization
    - Helps database planner make better decisions

  2. Indexes Added (43 total)
    - comment_reactions, dyno_images, fuel_logs, gear_ratios
    - lap_sessions, lap_times, listing_likes, listings
    - maintenance_logs, messages, notifications, photo_metadata
    - post_bookmarks, post_comments, post_likes, post_views
    - profile_invites, saved_calculations, saved_listings
    - setups, team_chats, team_members, team_tasks, teams
    - track_check_ins, track_conditions, track_notebooks
    - track_notes, track_stats, track_weather_history
    - user_reports, voice_notes
*/

-- comment_reactions
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON public.comment_reactions(user_id);

-- dyno_images
CREATE INDEX IF NOT EXISTS idx_dyno_images_setup_id ON public.dyno_images(setup_id);

-- fuel_logs
CREATE INDEX IF NOT EXISTS idx_fuel_logs_user_id ON public.fuel_logs(user_id);

-- gear_ratios
CREATE INDEX IF NOT EXISTS idx_gear_ratios_user_id ON public.gear_ratios(user_id);

-- lap_sessions
CREATE INDEX IF NOT EXISTS idx_lap_sessions_setup_id ON public.lap_sessions(setup_id);

-- lap_times
CREATE INDEX IF NOT EXISTS idx_lap_times_track_id ON public.lap_times(track_id);
CREATE INDEX IF NOT EXISTS idx_lap_times_user_id ON public.lap_times(user_id);

-- listing_likes
CREATE INDEX IF NOT EXISTS idx_listing_likes_user_id ON public.listing_likes(user_id);

-- listings
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);

-- maintenance_logs
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_id ON public.maintenance_logs(user_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_post_id ON public.notifications(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_related_user_id ON public.notifications(related_user_id);

-- photo_metadata
CREATE INDEX IF NOT EXISTS idx_photo_metadata_track_id ON public.photo_metadata(track_id);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_user_id ON public.photo_metadata(user_id);

-- post_bookmarks
CREATE INDEX IF NOT EXISTS idx_post_bookmarks_post_id ON public.post_bookmarks(post_id);

-- post_comments
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id ON public.post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON public.post_comments(user_id);

-- post_likes
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);

-- post_views
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON public.post_views(user_id);

-- profile_invites
CREATE INDEX IF NOT EXISTS idx_profile_invites_accepted_by ON public.profile_invites(accepted_by);

-- saved_calculations
CREATE INDEX IF NOT EXISTS idx_saved_calculations_setup_id ON public.saved_calculations(setup_id);
CREATE INDEX IF NOT EXISTS idx_saved_calculations_user_id ON public.saved_calculations(user_id);

-- saved_listings
CREATE INDEX IF NOT EXISTS idx_saved_listings_listing_id ON public.saved_listings(listing_id);

-- setups
CREATE INDEX IF NOT EXISTS idx_setups_track_id ON public.setups(track_id);

-- team_chats
CREATE INDEX IF NOT EXISTS idx_team_chats_sender_id ON public.team_chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_team_chats_team_id ON public.team_chats(team_id);

-- team_members
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by_user_id ON public.team_members(invited_by_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- team_tasks
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to_user_id ON public.team_tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_created_by_user_id ON public.team_tasks(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON public.team_tasks(team_id);

-- teams
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);

-- track_check_ins
CREATE INDEX IF NOT EXISTS idx_track_check_ins_track_id ON public.track_check_ins(track_id);
CREATE INDEX IF NOT EXISTS idx_track_check_ins_user_id ON public.track_check_ins(user_id);

-- track_conditions
CREATE INDEX IF NOT EXISTS idx_track_conditions_track_id ON public.track_conditions(track_id);

-- track_notebooks
CREATE INDEX IF NOT EXISTS idx_track_notebooks_setup_id ON public.track_notebooks(setup_id);

-- track_notes
CREATE INDEX IF NOT EXISTS idx_track_notes_track_id ON public.track_notes(track_id);

-- track_stats (already has idx_track_stats_user_id_track_id, adding single column index)
CREATE INDEX IF NOT EXISTS idx_track_stats_track_id_single ON public.track_stats(track_id);

-- track_weather_history
CREATE INDEX IF NOT EXISTS idx_track_weather_history_track_id ON public.track_weather_history(track_id);

-- user_reports
CREATE INDEX IF NOT EXISTS idx_user_reports_reviewed_by ON public.user_reports(reviewed_by);

-- voice_notes
CREATE INDEX IF NOT EXISTS idx_voice_notes_user_id ON public.voice_notes(user_id);
