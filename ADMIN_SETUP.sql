-- ============================================
-- ADMIN SETUP - Run this SQL in Supabase
-- ============================================

-- Step 1: Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Step 2: Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- Step 3: Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  ad_content text NOT NULL,
  image_url text,
  target_location geography(Point, 4326),
  target_radius_miles numeric DEFAULT 50,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  clicks integer DEFAULT 0,
  impressions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 4: Enable RLS on advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Step 5: Only admins can view all advertisements
CREATE POLICY "Admins can view all advertisements"
  ON advertisements
  FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Step 6: Only admins can create advertisements
CREATE POLICY "Admins can create advertisements"
  ON advertisements
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Step 7: Only admins can update advertisements
CREATE POLICY "Admins can update advertisements"
  ON advertisements
  FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true)
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Step 8: Only admins can delete advertisements
CREATE POLICY "Admins can delete advertisements"
  ON advertisements
  FOR DELETE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

-- Step 9: Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_advertisements_location ON advertisements USING GIST(target_location);

-- Step 10: Create index for active ads
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active, start_date, end_date) WHERE is_active = true;

-- Step 11: Make yourself an admin (replace with your email)
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

-- NOTE: To make a user an admin, run:
-- UPDATE profiles SET is_admin = true WHERE id = 'user-uuid-here';
-- OR
-- UPDATE profiles SET is_admin = true WHERE username = 'username-here';
