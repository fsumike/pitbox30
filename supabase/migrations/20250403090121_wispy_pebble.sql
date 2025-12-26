/*
  # Fix Video Upload Configuration

  1. Changes
    - Configure storage buckets with proper MIME types and size limits
    - Update storage policies to allow video uploads
    - Ensure video_url column exists in posts table
  
  2. Security
    - Enable proper RLS policies for video uploads
    - Set appropriate file size limits
    - Restrict allowed MIME types
*/

-- Configure posts bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,
  5242880, -- 5MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
) ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Configure videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'video/mp4',
    'video/quicktime',
    'video/x-m4v',
    'video/webm'
  ]
) ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop all existing storage policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Posts are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload posts" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own posts" ON storage.objects;
    DROP POLICY IF EXISTS "Videos are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload videos" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
END $$;

-- Create storage policies for posts bucket
CREATE POLICY "Posts are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

CREATE POLICY "Users can upload posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'posts');

CREATE POLICY "Users can delete their own posts"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'posts' AND owner = auth.uid());

-- Create storage policies for videos bucket
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND owner = auth.uid());

-- Ensure posts table has video_url column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS video_url text;