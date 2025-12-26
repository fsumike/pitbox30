/*
  # Enhance Community Features - Part 1
  
  ## New Tables
  1. `comment_reactions` - Track likes/reactions on comments
    - `id` (uuid, primary key)
    - `comment_id` (uuid, foreign key to post_comments)
    - `user_id` (uuid, foreign key to profiles)
    - `reaction_type` (text, e.g., 'like', 'love', 'helpful')
    - `created_at` (timestamptz)
  
  2. `post_views` - Track post view analytics
    - `id` (uuid, primary key)
    - `post_id` (uuid, foreign key to posts)
    - `user_id` (uuid, foreign key to profiles, nullable for anonymous)
    - `viewed_at` (timestamptz)
    - `view_duration` (integer, seconds)
  
  ## Modified Tables
  1. `post_comments` - Add support for nested replies
    - Add `parent_comment_id` (uuid, nullable, self-referencing foreign key)
    - Add `reply_count` (integer, default 0)
    - Add `reaction_count` (integer, default 0)
  
  2. `posts` - Add engagement metrics
    - Add `view_count` (integer, default 0)
    - Add `share_count` (integer, default 0)
    - Add `is_edited` (boolean, default false)
    - Add `edited_at` (timestamptz, nullable)
  
  ## Security
  - Enable RLS on all new tables
  - Add policies for authenticated users to manage their reactions and views
  - Add indexes for performance optimization
*/

-- Add columns to post_comments for nested replies and reactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'post_comments' AND column_name = 'parent_comment_id'
  ) THEN
    ALTER TABLE post_comments ADD COLUMN parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'post_comments' AND column_name = 'reply_count'
  ) THEN
    ALTER TABLE post_comments ADD COLUMN reply_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'post_comments' AND column_name = 'reaction_count'
  ) THEN
    ALTER TABLE post_comments ADD COLUMN reaction_count integer DEFAULT 0;
  END IF;
END $$;

-- Add columns to posts for analytics
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'view_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN view_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'share_count'
  ) THEN
    ALTER TABLE posts ADD COLUMN share_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'is_edited'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_edited boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'posts' AND column_name = 'edited_at'
  ) THEN
    ALTER TABLE posts ADD COLUMN edited_at timestamptz;
  END IF;
END $$;

-- Create comment_reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'like',
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Create post_views table
CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  view_duration integer DEFAULT 0,
  UNIQUE(post_id, user_id, viewed_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON comment_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON post_views(post_id);
CREATE INDEX IF NOT EXISTS idx_post_views_user_id ON post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id ON post_comments(parent_comment_id);

-- Enable RLS
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comment_reactions
CREATE POLICY "Users can view all comment reactions"
  ON comment_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own comment reactions"
  ON comment_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment reactions"
  ON comment_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for post_views
CREATE POLICY "Users can view all post views"
  ON post_views FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create post views"
  ON post_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Function to update comment reaction count
CREATE OR REPLACE FUNCTION update_comment_reaction_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments
    SET reaction_count = reaction_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments
    SET reaction_count = reaction_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update reply count
CREATE OR REPLACE FUNCTION update_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE post_comments
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_comment_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE post_comments
    SET reply_count = reply_count - 1
    WHERE id = OLD.parent_comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update post view count
CREATE OR REPLACE FUNCTION update_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_comment_reaction_change ON comment_reactions;
CREATE TRIGGER on_comment_reaction_change
  AFTER INSERT OR DELETE ON comment_reactions
  FOR EACH ROW EXECUTE FUNCTION update_comment_reaction_count();

DROP TRIGGER IF EXISTS on_reply_change ON post_comments;
CREATE TRIGGER on_reply_change
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_reply_count();

DROP TRIGGER IF EXISTS on_post_view ON post_views;
CREATE TRIGGER on_post_view
  AFTER INSERT ON post_views
  FOR EACH ROW EXECUTE FUNCTION update_post_view_count();
