/*
  # Add media support to comments

  1. Changes
    - Add media_url and media_type columns to post_comments table
    - Add storage policies for comment media
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add media columns to post_comments table
ALTER TABLE post_comments
ADD COLUMN IF NOT EXISTS media_url text,
ADD COLUMN IF NOT EXISTS media_type text CHECK (media_type IN ('image', 'gif'));

-- Create storage bucket for comment media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('comments', 'comments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to comment media
CREATE POLICY "Comment media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'comments');

-- Allow authenticated users to upload comment media
CREATE POLICY "Users can upload comment media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'comments' AND
  (storage.foldername(name))[1] = 'comments'
);

-- Allow users to delete their own comment media
CREATE POLICY "Users can delete their own comment media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'comments' AND owner = auth.uid());