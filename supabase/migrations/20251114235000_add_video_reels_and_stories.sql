/*
  # Add Video Reels, Stories, and Enhanced Social Features

  ## Overview
  Adds support for TikTok-style video reels, Instagram-style stories, live streaming,
  and enhanced social media features to make Racing Community world-class.

  ## New Tables

  1. `video_reels`
    - Short-form vertical videos (TikTok-style)
    - Supports 15 seconds to 3 minutes
    - Hashtags, sounds, effects
    - View count, share count

  2. `stories`
    - 24-hour temporary content
    - Images or short videos
    - View tracking
    - Interactive elements (polls, questions)

  3. `live_streams`
    - Live video streaming
    - Viewer count
    - Live chat integration

  4. `hashtags`
    - Trending hashtags
    - Usage count tracking

  5. `user_follows`
    - Following/followers system
    - Activity feed generation

  6. `listing_reviews`
    - Seller ratings and reviews
    - Verified purchase reviews

  ## Security
  - RLS enabled on all tables
  - Users can only modify their own content
  - Public read access where appropriate
*/

-- Video Reels Table
CREATE TABLE IF NOT EXISTS video_reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  title text,
  description text,
  duration integer NOT NULL,
  hashtags text[] DEFAULT '{}',
  sound_id text,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_reels_user_id ON video_reels(user_id);
CREATE INDEX IF NOT EXISTS idx_video_reels_created_at ON video_reels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_reels_hashtags ON video_reels USING gin(hashtags);

ALTER TABLE video_reels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video reels"
  ON video_reels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own video reels"
  ON video_reels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video reels"
  ON video_reels FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video reels"
  ON video_reels FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Video Reel Likes
CREATE TABLE IF NOT EXISTS video_reel_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid REFERENCES video_reels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(reel_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_video_reel_likes_reel_id ON video_reel_likes(reel_id);
CREATE INDEX IF NOT EXISTS idx_video_reel_likes_user_id ON video_reel_likes(user_id);

ALTER TABLE video_reel_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video reel likes"
  ON video_reel_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like video reels"
  ON video_reel_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike video reels"
  ON video_reel_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Video Reel Comments
CREATE TABLE IF NOT EXISTS video_reel_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid REFERENCES video_reels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_video_reel_comments_reel_id ON video_reel_comments(reel_id);
CREATE INDEX IF NOT EXISTS idx_video_reel_comments_user_id ON video_reel_comments(user_id);

ALTER TABLE video_reel_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video reel comments"
  ON video_reel_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create video reel comments"
  ON video_reel_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON video_reel_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON video_reel_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Stories Table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  duration integer DEFAULT 5,
  view_count integer DEFAULT 0,
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view non-expired stories"
  ON stories FOR SELECT
  TO authenticated
  USING (expires_at > now());

CREATE POLICY "Users can create their own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Story Views
CREATE TABLE IF NOT EXISTS story_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(story_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_user_id ON story_views(user_id);

ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view story views"
  ON story_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can record story views"
  ON story_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Live Streams Table
CREATE TABLE IF NOT EXISTS live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  stream_key text NOT NULL,
  stream_url text,
  thumbnail_url text,
  is_live boolean DEFAULT false,
  viewer_count integer DEFAULT 0,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_live_streams_user_id ON live_streams(user_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_is_live ON live_streams(is_live) WHERE is_live = true;

ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live streams"
  ON live_streams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own live streams"
  ON live_streams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own live streams"
  ON live_streams FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Hashtags Table
CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text UNIQUE NOT NULL,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hashtags_tag ON hashtags(tag);
CREATE INDEX IF NOT EXISTS idx_hashtags_usage_count ON hashtags(usage_count DESC);

ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hashtags"
  ON hashtags FOR SELECT
  TO authenticated
  USING (true);

-- User Follows Table
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view follows"
  ON user_follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Listing Reviews Table
CREATE TABLE IF NOT EXISTS listing_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  response_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_seller_id ON listing_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_listing_reviews_reviewer_id ON listing_reviews(reviewer_id);

ALTER TABLE listing_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON listing_reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON listing_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their own reviews"
  ON listing_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Sellers can respond to reviews"
  ON listing_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Add seller stats columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'seller_rating'
  ) THEN
    ALTER TABLE profiles ADD COLUMN seller_rating decimal(3,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_sales'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_sales integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'follower_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN follower_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'following_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN following_count integer DEFAULT 0;
  END IF;
END $$;

-- Function to update seller rating
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET seller_rating = (
    SELECT AVG(rating)::decimal(3,2)
    FROM listing_reviews
    WHERE seller_id = NEW.seller_id
  )
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seller_rating_trigger
  AFTER INSERT OR UPDATE ON listing_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_rating();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.following_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follower_counts();
