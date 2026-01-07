-- ============================================
-- FIX APP STORE REVIEWER ACCOUNT
-- This adds/updates the username for the reviewer account
-- ============================================

-- First, let's check if a profile exists for reviewer@pitbox-demo.com
-- and update it with a username if it does

-- Option 1: If the auth user exists, update their profile
DO $$
DECLARE
  reviewer_id uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO reviewer_id
  FROM auth.users
  WHERE email = 'reviewer@pitbox-demo.com';

  IF reviewer_id IS NOT NULL THEN
    -- Update the profile with username
    UPDATE profiles
    SET
      username = 'AppleReviewer',
      full_name = 'Apple Reviewer',
      subscription_status = 'active',
      subscription_tier = 'premium',
      updated_at = now()
    WHERE id = reviewer_id;

    RAISE NOTICE 'Updated profile for reviewer@pitbox-demo.com with username AppleReviewer';
  ELSE
    RAISE NOTICE 'No auth user found for reviewer@pitbox-demo.com - you need to sign up through the app first';
  END IF;
END $$;

-- Verify the update
SELECT
  p.id,
  p.username,
  p.full_name,
  p.email,
  p.subscription_status,
  p.subscription_tier,
  au.email as auth_email
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE p.email = 'reviewer@pitbox-demo.com'
   OR au.email = 'reviewer@pitbox-demo.com';
