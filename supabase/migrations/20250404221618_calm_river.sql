-- Add location fields to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;