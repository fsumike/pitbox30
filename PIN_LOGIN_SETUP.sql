-- Run this SQL in your Supabase SQL Editor to enable PIN-only login
-- Go to: https://supabase.com/dashboard > Your Project > SQL Editor

-- Add column to store encrypted refresh token for PIN login
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pin_refresh_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pin_refresh_token text;
  END IF;
END $$;

COMMENT ON COLUMN profiles.pin_refresh_token IS 'Encrypted refresh token for PIN-based authentication';
