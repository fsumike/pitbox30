/*
  # Fix social media features migration

  This migration fixes the previous migration by:
  1. Using IF NOT EXISTS for all policy creations
  2. Ensuring no duplicate policies are created
*/

-- Update profiles table with additional fields (if not already done)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE profiles ADD COLUMN bio text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') THEN
    ALTER TABLE profiles ADD COLUMN website text;
  END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (idempotent)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
  -- Posts policies
  DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
  DROP POLICY IF EXISTS "Users can create their own posts" ON posts;
  DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
  DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
  
  -- Post likes policies
  DROP POLICY IF EXISTS "Anyone can read post likes" ON post_likes;
  DROP POLICY IF EXISTS "Users can create their own likes" ON post_likes;
  DROP POLICY IF EXISTS "Users can delete their own likes" ON post_likes;
  
  -- Post comments policies
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

-- Create trigger for posts updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_posts_updated_at
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;