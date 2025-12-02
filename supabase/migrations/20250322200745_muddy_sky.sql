/*
  # Add Video Support to Posts

  1. Changes
    - Add video_url column to posts table
    - Update storage policies to allow video uploads
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add video_url column to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS video_url text;

-- Create storage bucket for videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to videos
CREATE POLICY "Videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = 'videos'
);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND owner = auth.uid());