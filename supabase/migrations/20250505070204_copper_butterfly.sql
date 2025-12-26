/*
  # Racing Community Enhancement

  1. New Fields
    - Add visibility field to posts table
    - Add bookmarks table for saved posts
  
  2. Security
    - Update RLS policies for posts
    - Add policies for bookmarks
*/

-- Add visibility field to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private'));

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS post_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Enable Row Level Security
ALTER TABLE post_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can see their own bookmarks"
  ON post_bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON post_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON post_bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update post visibility policies
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;

CREATE POLICY "Users can read public posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'public' OR
    user_id = auth.uid() OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM friendships
      WHERE (user_id1 = auth.uid() AND user_id2 = posts.user_id) OR
            (user_id1 = posts.user_id AND user_id2 = auth.uid())
    ))
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'friend_request', 'mention', 'system')),
  content text NOT NULL,
  related_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can see their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS post_bookmarks_user_id_idx ON post_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS post_bookmarks_post_id_idx ON post_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_read_idx ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS posts_visibility_idx ON posts(visibility);