/*
  # Add is_pinned column to posts table
  
  ## Problem
  The posts table is missing the is_pinned column which is referenced in the application code.
  This causes post creation to fail with error: "Could not find the 'is_pinned' column of 'posts' in the schema cache"
  
  ## Solution
  Add the is_pinned column to the posts table with a default value of false.
  
  ## Changes
  - Add is_pinned boolean column with DEFAULT false to posts table
*/

-- Add is_pinned column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'is_pinned'
  ) THEN
    ALTER TABLE posts ADD COLUMN is_pinned boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for efficient querying of pinned posts
CREATE INDEX IF NOT EXISTS posts_is_pinned_idx ON posts(is_pinned) WHERE is_pinned = true;
