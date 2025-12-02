/*
  # Add Social Features Migration Fix

  1. Changes
    - Add tables for posts, likes, and comments if they don't exist
    - Add policies safely by dropping existing ones first
    - Add storage bucket and policies for post images
    - Add trigger safely by checking existence first
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Safely create policies by dropping existing ones first
DO $$
BEGIN
    -- Drop existing policies for posts
    DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
    DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
    DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

    -- Drop existing policies for post_likes
    DROP POLICY IF EXISTS "Anyone can read post likes" ON post_likes;
    DROP POLICY IF EXISTS "Users can create their own likes" ON post_likes;
    DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;

    -- Drop existing policies for post_comments
    DROP POLICY IF EXISTS "Anyone can read comments" ON post_comments;
    DROP POLICY IF EXISTS "Users can create their own comments" ON post_comments;
    DROP POLICY IF EXISTS "Users can update their own comments" ON post_comments;
    DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
END $$;

-- Create policies for posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for post_likes
CREATE POLICY "Anyone can read post likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own likes"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for post_comments
CREATE POLICY "Anyone can read comments"
  ON post_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Safely add updated_at trigger
DO $$
BEGIN
  -- Drop trigger if it exists
  DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
  
  -- Create trigger
  CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
END $$;

-- Create storage bucket for post images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Post images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload post images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own post images" ON storage.objects;
END $$;

-- Create storage policies
CREATE POLICY "Post images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

CREATE POLICY "Users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = 'posts'
);

CREATE POLICY "Users can delete their own post images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND owner = auth.uid());