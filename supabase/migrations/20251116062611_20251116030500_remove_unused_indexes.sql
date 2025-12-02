/*
  # Remove Unused Indexes

  1. Performance Improvements
    - Remove indexes that have never been used
    - Reduces storage overhead
    - Improves write performance (INSERT/UPDATE/DELETE)
    - Reduces maintenance overhead

  2. Indexes Removed (64 unused indexes)
    - Shock tracking indexes
    - Maintenance log indexes
    - Setup indexes
    - Social feature indexes (events, challenges, video reels, stories, groups)
    - Track-related indexes
    - Profile and subscription indexes
    - Push notification indexes
*/

-- Shock tracking
DROP INDEX IF EXISTS idx_shocks_user_id;
DROP INDEX IF EXISTS idx_setup_shocks_setup_id;
DROP INDEX IF EXISTS idx_setup_shocks_shock_id;

-- Maintenance logs
DROP INDEX IF EXISTS idx_maintenance_logs_track_id;

-- Push notifications
DROP INDEX IF EXISTS idx_push_notification_tokens_user_id;

-- Setup comparisons
DROP INDEX IF EXISTS idx_setup_comparisons_user_id;

-- Setups
DROP INDEX IF EXISTS idx_setups_detected_track_id;
DROP INDEX IF EXISTS idx_setups_user_track;
DROP INDEX IF EXISTS idx_setups_location;

-- Events
DROP INDEX IF EXISTS idx_events_creator_id;
DROP INDEX IF EXISTS idx_events_start_date;
DROP INDEX IF EXISTS idx_events_location;
DROP INDEX IF EXISTS idx_event_rsvps_event_id;
DROP INDEX IF EXISTS idx_event_rsvps_user_id;

-- Challenges
DROP INDEX IF EXISTS idx_challenges_creator_id;
DROP INDEX IF EXISTS idx_challenges_hashtag;
DROP INDEX IF EXISTS idx_challenges_is_active;
DROP INDEX IF EXISTS idx_challenge_entries_challenge_id;
DROP INDEX IF EXISTS idx_challenge_entries_user_id;
DROP INDEX IF EXISTS idx_challenge_entries_vote_count;
DROP INDEX IF EXISTS idx_challenge_votes_entry_id;
DROP INDEX IF EXISTS idx_challenge_votes_user_id;

-- Video reels
DROP INDEX IF EXISTS idx_video_reels_user_id;
DROP INDEX IF EXISTS idx_video_reels_created_at;
DROP INDEX IF EXISTS idx_video_reels_hashtags;
DROP INDEX IF EXISTS idx_video_reel_likes_reel_id;
DROP INDEX IF EXISTS idx_video_reel_likes_user_id;
DROP INDEX IF EXISTS idx_video_reel_comments_reel_id;
DROP INDEX IF EXISTS idx_video_reel_comments_user_id;

-- Stories
DROP INDEX IF EXISTS idx_stories_user_id;
DROP INDEX IF EXISTS idx_stories_created_at;
DROP INDEX IF EXISTS idx_story_views_story_id;
DROP INDEX IF EXISTS idx_story_views_user_id;

-- Live streams
DROP INDEX IF EXISTS idx_live_streams_user_id;
DROP INDEX IF EXISTS idx_live_streams_is_live;

-- Hashtags
DROP INDEX IF EXISTS idx_hashtags_tag;
DROP INDEX IF EXISTS idx_hashtags_usage_count;

-- User follows
DROP INDEX IF EXISTS idx_user_follows_follower_id;
DROP INDEX IF EXISTS idx_user_follows_following_id;

-- Track notes and conditions
DROP INDEX IF EXISTS idx_track_notes_user_id;
DROP INDEX IF EXISTS idx_track_conditions_user_id;

-- Groups
DROP INDEX IF EXISTS idx_groups_creator_id;
DROP INDEX IF EXISTS idx_groups_group_type;
DROP INDEX IF EXISTS idx_group_members_group_id;
DROP INDEX IF EXISTS idx_group_members_user_id;
DROP INDEX IF EXISTS idx_group_messages_group_id;
DROP INDEX IF EXISTS idx_group_messages_user_id;

-- Listing reviews
DROP INDEX IF EXISTS idx_listing_reviews_listing_id;
DROP INDEX IF EXISTS idx_listing_reviews_seller_id;
DROP INDEX IF EXISTS idx_listing_reviews_reviewer_id;

-- User subscriptions
DROP INDEX IF EXISTS idx_user_subscriptions_google_token;
DROP INDEX IF EXISTS idx_user_subscriptions_provider_status;
DROP INDEX IF EXISTS idx_user_subscriptions_apple_transaction;

-- Blocked users and reports
DROP INDEX IF EXISTS idx_blocked_users_blocked;
DROP INDEX IF EXISTS idx_user_reports_reporter;
DROP INDEX IF EXISTS idx_user_reports_reported;
DROP INDEX IF EXISTS idx_user_reports_status;

-- Profile invites and views
DROP INDEX IF EXISTS idx_profile_invites_inviter;
DROP INDEX IF EXISTS idx_profile_invites_code;
DROP INDEX IF EXISTS idx_profile_views_viewer;
DROP INDEX IF EXISTS idx_profile_views_viewed;

-- Profiles
DROP INDEX IF EXISTS idx_profiles_car_number;
DROP INDEX IF EXISTS idx_profiles_primary_racing_class;
DROP INDEX IF EXISTS idx_profiles_last_active;
