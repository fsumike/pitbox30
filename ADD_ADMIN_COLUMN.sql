-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Make your account an admin
UPDATE profiles
SET is_admin = true
WHERE username = 'Mg91648@yahoo.com';
