/*
  # Fix Missing Foreign Key Indexes

  1. Performance Improvements
    - Add indexes on all foreign key columns that are missing them
    - Improves JOIN performance and foreign key constraint checking
    
  2. Tables Affected
    - dyno_images: setup_id, user_id
    - listing_likes: user_id
    - messages: receiver_id
    - notifications: post_id, related_user_id
    - setups: track_id
    - team_chats: sender_id, team_id
    - team_members: invited_by_user_id, user_id
    - team_tasks: assigned_to_user_id, created_by_user_id, team_id
    - teams: owner_id
    - track_stats: track_id
*/

-- Dyno images indexes
CREATE INDEX IF NOT EXISTS idx_dyno_images_setup_id ON public.dyno_images(setup_id);
CREATE INDEX IF NOT EXISTS idx_dyno_images_user_id ON public.dyno_images(user_id);

-- Listing likes indexes
CREATE INDEX IF NOT EXISTS idx_listing_likes_user_id ON public.listing_likes(user_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_post_id ON public.notifications(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_related_user_id ON public.notifications(related_user_id);

-- Setups indexes
CREATE INDEX IF NOT EXISTS idx_setups_track_id ON public.setups(track_id);

-- Team chats indexes
CREATE INDEX IF NOT EXISTS idx_team_chats_sender_id ON public.team_chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_team_chats_team_id ON public.team_chats(team_id);

-- Team members indexes
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by_user_id ON public.team_members(invited_by_user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);

-- Team tasks indexes
CREATE INDEX IF NOT EXISTS idx_team_tasks_assigned_to_user_id ON public.team_tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_created_by_user_id ON public.team_tasks(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_team_tasks_team_id ON public.team_tasks(team_id);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);

-- Track stats indexes
CREATE INDEX IF NOT EXISTS idx_track_stats_track_id ON public.track_stats(track_id);