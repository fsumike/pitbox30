-- Create videos bucket if it doesn't exist
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

-- Drop existing policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Videos are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload videos" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;
END $$;

-- Create storage policies
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND owner = auth.uid());

-- Ensure posts table has video_url column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS video_url text;