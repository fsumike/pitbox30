/*
  # Add RPC Functions for Social Features

  ## Overview
  Creates PostgreSQL functions for atomic operations on social features:
  - Increment/decrement counts for reels, stories, and posts
  - Efficient counter updates without race conditions

  ## Functions
  - increment_reel_likes / decrement_reel_likes
  - increment_reel_shares
  - increment_story_views
*/

-- Increment video reel likes
CREATE OR REPLACE FUNCTION increment_reel_likes(reel_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE video_reels
  SET like_count = like_count + 1
  WHERE id = reel_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement video reel likes
CREATE OR REPLACE FUNCTION decrement_reel_likes(reel_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE video_reels
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = reel_id;
END;
$$ LANGUAGE plpgsql;

-- Increment video reel shares
CREATE OR REPLACE FUNCTION increment_reel_shares(reel_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE video_reels
  SET share_count = share_count + 1
  WHERE id = reel_id;
END;
$$ LANGUAGE plpgsql;

-- Increment video reel views
CREATE OR REPLACE FUNCTION increment_reel_views(reel_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE video_reels
  SET view_count = view_count + 1
  WHERE id = reel_id;
END;
$$ LANGUAGE plpgsql;

-- Increment story views
CREATE OR REPLACE FUNCTION increment_story_views(story_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stories
  SET view_count = view_count + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired stories (can be called by cron job)
CREATE OR REPLACE FUNCTION delete_expired_stories()
RETURNS void AS $$
BEGIN
  DELETE FROM stories
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
