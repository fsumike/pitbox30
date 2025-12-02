/*
  # Add Story Enhancements

  Adds text overlay and filter columns to stories table for Instagram-style story features
*/

-- Add text_overlay column for story captions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'text_overlay'
  ) THEN
    ALTER TABLE stories ADD COLUMN text_overlay text;
  END IF;
END $$;

-- Add filter column for image filters
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'filter'
  ) THEN
    ALTER TABLE stories ADD COLUMN filter text;
  END IF;
END $$;

-- Create storage bucket for stories if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for stories bucket
DROP POLICY IF EXISTS "Users can upload their own stories" ON storage.objects;
CREATE POLICY "Users can upload their own stories"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'stories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Stories are publicly accessible" ON storage.objects;
CREATE POLICY "Stories are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'stories');

DROP POLICY IF EXISTS "Users can delete their own stories" ON storage.objects;
CREATE POLICY "Users can delete their own stories"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'stories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
