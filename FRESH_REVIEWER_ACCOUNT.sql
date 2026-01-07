-- ==================================================
-- FRESH REVIEWER ACCOUNT SETUP
-- ==================================================
-- This script completely resets and creates the Apple Review account
--
-- Account Details:
-- Email: reviewer@pitbox-demo.com
-- Password: AppleReview2025!
-- Username: AppleReviewer
-- ==================================================

-- STEP 1: Delete any existing reviewer account
DELETE FROM auth.users WHERE email = 'reviewer@pitbox-demo.com';
DELETE FROM profiles WHERE email = 'reviewer@pitbox-demo.com';

-- STEP 2: Create new auth user with proper password
-- Note: The password will be hashed by Supabase
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'reviewer@pitbox-demo.com',
  crypt('AppleReview2025!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"username":"AppleReviewer","full_name":"Apple Reviewer"}',
  'authenticated',
  'authenticated'
);

-- STEP 3: Create profile entry
INSERT INTO profiles (
  id,
  username,
  email,
  full_name,
  car_number,
  subscription_status,
  subscription_tier,
  created_at,
  updated_at
)
SELECT
  id,
  'AppleReviewer',
  'reviewer@pitbox-demo.com',
  'Apple Reviewer',
  '1',
  'active',
  'premium',
  now(),
  now()
FROM auth.users
WHERE email = 'reviewer@pitbox-demo.com';

-- STEP 4: Verify the account was created
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.full_name,
  p.subscription_status,
  p.subscription_tier
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'reviewer@pitbox-demo.com';
