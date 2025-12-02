/*
  # Add status column to posts table
  
  ## Problem
  The posts table is missing the status column which is referenced in the application code.
  This causes post creation to fail with error: "Could not find the 'status' column of 'posts' in the schema cache"
  
  ## Solution
  Add the status column to the posts table with appropriate values for different post types.
  Status values: 'published', 'processing', 'pending', 'failed'
  
  ## Changes
  - Add status text column with DEFAULT 'published' to posts table
  - Add CHECK constraint to ensure valid status values
  - Create index for efficient querying by status
*/

-- Add status column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'status'
  ) THEN
    ALTER TABLE posts ADD COLUMN status text DEFAULT 'published' NOT NULL
    CHECK (status IN ('published', 'processing', 'pending', 'failed'));
  END IF;
END $$;

-- Create index for efficient querying of posts by status
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);
