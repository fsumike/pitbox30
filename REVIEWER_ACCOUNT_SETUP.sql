-- ============================================
-- SETUP REVIEWER ACCOUNT WITH PREMIUM ACCESS
-- ============================================
--
-- STEP 1: Go to Supabase Dashboard > Authentication > Users
-- STEP 2: Click "Add user" > "Create new user"
-- STEP 3: Enter:
--    Email: reviewer@pitbox.app
--    Password: ReviewerPitBox2025!
--    Check "Auto Confirm User"
-- STEP 4: Copy the User ID that was created
-- STEP 5: Replace 'PASTE_USER_ID_HERE' below with that ID
-- STEP 6: Run this SQL in the SQL Editor
-- ============================================

-- Replace PASTE_USER_ID_HERE with the actual UUID from Step 4
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  has_premium,
  is_admin,
  created_at,
  updated_at
)
VALUES (
  'PASTE_USER_ID_HERE',
  'AppReviewer',
  'App Store Reviewer',
  true,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  has_premium = true,
  updated_at = NOW();

-- Verify it worked
SELECT id, username, full_name, has_premium FROM profiles WHERE username = 'AppReviewer';
