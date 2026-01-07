-- ==================================================
-- FRESH REVIEWER ACCOUNT SETUP (CORRECTED)
-- ==================================================
-- This script completely resets and creates the Apple Review account
--
-- Account Details:
-- Email: reviewer@pitbox-demo.com
-- Password: AppleReview2025!
-- Username: AppleReviewer
-- ==================================================

-- STEP 1: Delete any existing reviewer account
-- (This will cascade to profiles and subscriptions automatically)
DELETE FROM auth.users WHERE email = 'reviewer@pitbox-demo.com';

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
  full_name,
  car_number,
  created_at,
  updated_at
)
SELECT
  id,
  'AppleReviewer',
  'Apple Reviewer',
  '1',
  now(),
  now()
FROM auth.users
WHERE email = 'reviewer@pitbox-demo.com';

-- STEP 4: Create premium subscription
INSERT INTO user_subscriptions (
  user_id,
  subscription_id,
  status,
  tier,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
)
SELECT
  id,
  'demo_subscription_' || id,
  'active',
  'premium',
  now() + interval '1 year',
  false,
  now(),
  now()
FROM auth.users
WHERE email = 'reviewer@pitbox-demo.com';

-- STEP 5: Verify the account was created
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.full_name,
  p.car_number,
  s.status as subscription_status,
  s.tier as subscription_tier
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_subscriptions s ON u.id = s.user_id
WHERE u.email = 'reviewer@pitbox-demo.com';
