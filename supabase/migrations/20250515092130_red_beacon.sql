/*
  # Add Post Visibility and Bookmarks

  1. Changes
    - Add visibility field to posts table if it doesn't exist
    - Create post_bookmarks table if it doesn't exist
    - Create notifications table if it doesn't exist
    - Add indexes for better performance
  
  2. Security
    - Update RLS policies for posts
    - Add policies for bookmarks and notifications
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

-- Create policies for bookmarks with safety checks
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_bookmarks' AND policyname = 'Users can see their own bookmarks'
  ) THEN
    CREATE POLICY "Users can see their own bookmarks"
      ON post_bookmarks
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_bookmarks' AND policyname = 'Users can create their own bookmarks'
  ) THEN
    CREATE POLICY "Users can create their own bookmarks"
      ON post_bookmarks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_bookmarks' AND policyname = 'Users can delete their own bookmarks'
  ) THEN
    CREATE POLICY "Users can delete their own bookmarks"
      ON post_bookmarks
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Update post visibility policies
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;

-- Check if policy exists before creating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Users can read public posts'
  ) THEN
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
  END IF;
END $$;

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

-- Create policies for notifications with safety checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can see their own notifications'
  ) THEN
    CREATE POLICY "Users can see their own notifications"
      ON notifications
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can mark their notifications as read'
  ) THEN
    CREATE POLICY "Users can mark their notifications as read"
      ON notifications
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS post_bookmarks_user_id_idx ON post_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS post_bookmarks_post_id_idx ON post_bookmarks(post_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_read_idx ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS posts_visibility_idx ON posts(visibility);