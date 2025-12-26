/*
  # Fix Storage Permissions for Posts

  1. Changes
    - Update storage bucket configuration for posts
    - Fix RLS policies for image uploads
    - Ensure proper MIME type handling
  
  2. Security
    - Allow authenticated users to upload images
    - Set appropriate file size limits
*/

-- Configure posts bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
  ]
) ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Posts are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload posts" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own posts" ON storage.objects;
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