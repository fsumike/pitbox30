/*
  # Add Multiple Images Support to Posts

  1. Changes
    - Add `image_urls` column to posts table to store array of image URLs
    - Keep existing `image_url` column for backwards compatibility
    - Posts can have either multiple images OR one video (not both)

  2. Notes
    - Maximum 4 images per post (enforced in application layer)
    - Images are stored as text array in PostgreSQL
    - Existing posts with single images remain unchanged
*/

-- Add image_urls column to posts table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE posts ADD COLUMN image_urls text[];
  END IF;
END $$;

-- Add comment to describe the column
COMMENT ON COLUMN posts.image_urls IS 'Array of image URLs (max 4 images per post)';
