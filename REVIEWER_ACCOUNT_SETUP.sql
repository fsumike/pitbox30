-- ============================================
-- SETUP REVIEWER ACCOUNT WITH PREMIUM ACCESS
-- ============================================
-- This script finds the user by email automatically
-- No need to copy/paste any UUIDs!
--
-- STEP 1: Create the user first in Supabase Dashboard:
--    Go to Authentication > Users > Add user > Create new user
--    Email: reviewer@pitbox.app
--    Password: ReviewerPitBox2025!
--    Check "Auto Confirm User"
--
-- STEP 2: Run this entire SQL script
-- ============================================

-- Create or update the profile for the reviewer account
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  has_premium,
  is_admin,
  created_at,
  updated_at
)
SELECT
  au.id,
  'AppReviewer',
  'App Store Reviewer',
  true,
  false,
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'reviewer@pitbox.app'
ON CONFLICT (id) DO UPDATE SET
  username = 'AppReviewer',
  full_name = 'App Store Reviewer',
  has_premium = true,
  updated_at = NOW();

-- Verify it worked
SELECT
  p.id,
  p.username,
  p.full_name,
  p.has_premium,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email = 'reviewer@pitbox.app';
