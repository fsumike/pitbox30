-- ============================================
-- APPLE APP STORE REVIEW ACCOUNT SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create tables for storing review information
CREATE TABLE IF NOT EXISTS app_review_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  username text,
  account_type text DEFAULT 'premium',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_review_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  contact_first_name text NOT NULL,
  contact_last_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  reviewer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Enable Row Level Security
ALTER TABLE app_review_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_review_info ENABLE ROW LEVEL SECURITY;

-- Step 3: Create admin-only policies
DROP POLICY IF EXISTS "Only admins can view review accounts" ON app_review_accounts;
CREATE POLICY "Only admins can view review accounts"
  ON app_review_accounts FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Only admins can view review info" ON app_review_info;
CREATE POLICY "Only admins can view review info"
  ON app_review_info FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Step 4: Insert iOS review account credentials
INSERT INTO app_review_accounts (platform, email, password, username, account_type, notes)
VALUES (
  'ios',
  'reviewer@pitbox-demo.com',
  'AppleReview2025!',
  'AppleReviewer',
  'premium',
  'Premium test account with full access to all features. Account includes saved setups, sample data, and premium features enabled.'
)
ON CONFLICT DO NOTHING;

-- Step 5: Insert iOS contact information
INSERT INTO app_review_info (
  platform,
  contact_first_name,
  contact_last_name,
  contact_phone,
  contact_email,
  reviewer_notes
)
VALUES (
  'ios',
  'PitBox',
  'Support',
  '+1-555-0123',
  'support@pit-box.com',
  'Complete reviewer notes stored in APP_STORE_REVIEW_INFO.md'
)
ON CONFLICT DO NOTHING;

-- Step 6: Verify data was inserted
SELECT 'Review Accounts:' as info;
SELECT * FROM app_review_accounts;

SELECT 'Review Contact Info:' as info;
SELECT * FROM app_review_info;

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Create the actual user account in your app
--    Email: reviewer@pitbox-demo.com
--    Password: AppleReview2025!
--
-- 2. Grant premium access to this user
--    UPDATE profiles
--    SET subscription_status = 'active',
--        subscription_tier = 'premium'
--    WHERE email = 'reviewer@pitbox-demo.com';
--
-- 3. Add sample data for the reviewer to test
-- ============================================
