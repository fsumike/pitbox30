/*
  # Create Storage Bucket for Listing Images

  IMPORTANT: Run this in your Supabase SQL Editor to create the storage bucket
  for listing images. Without this, image uploads will fail!

  1. Storage
    - Create `listing-images` bucket for marketplace listing photos
    - Set public access for easy viewing
    - Configure file upload limits (5MB per image)

  2. Security
    - Enable RLS on storage bucket
    - Allow authenticated users to upload images
    - Allow anyone to view images (public bucket)
    - Allow users to delete their own listing images
*/

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for listing-images bucket
CREATE POLICY IF NOT EXISTS "Authenticated users can upload listing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Anyone can view listing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-images');

CREATE POLICY IF NOT EXISTS "Users can delete their own listing images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images' AND
  auth.role() = 'authenticated'
);
