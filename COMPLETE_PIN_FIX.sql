/*
  # Complete PIN Code Authentication System Fix

  IMPORTANT: Run this SQL in your Supabase SQL Editor
  (Dashboard > SQL Editor > New Query > Paste this > Run)

  This fixes the PIN code authentication by:
  1. Adding PIN columns to profiles table
  2. Creating functions to set, disable, and verify PINs
  3. Adding the MISSING function to verify PIN by email (for sign-in)

  The key fix: Your SignIn page calls verify_user_pin_code(email, pin)
  but the old migration only had verify_user_pin_code(user_id, pin).
  This adds BOTH versions using PostgreSQL function overloading.
*/

-- ============================================
-- Step 1: Enable pgcrypto extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- Step 2: Add PIN columns to profiles table
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pin_code_hash'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pin_code_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'pin_code_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN pin_code_enabled boolean DEFAULT false;
  END IF;
END $$;

-- ============================================
-- Step 3: Function to set user PIN code
-- ============================================
CREATE OR REPLACE FUNCTION set_user_pin_code(
  user_id uuid,
  pin_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the user is setting their own PIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only set your own PIN code';
  END IF;

  -- Validate PIN code format (4-10 digits)
  IF pin_code !~ '^\d{4,10}$' THEN
    RAISE EXCEPTION 'Invalid PIN: Must be 4-10 digits';
  END IF;

  -- Update the user's PIN code (hashed) and enable it
  UPDATE profiles
  SET
    pin_code_hash = crypt(pin_code, gen_salt('bf', 8)),
    pin_code_enabled = true,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- ============================================
-- Step 4: Function to disable user PIN code
-- ============================================
CREATE OR REPLACE FUNCTION disable_user_pin_code(
  user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the user is disabling their own PIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only disable your own PIN code';
  END IF;

  -- Disable PIN code and clear the hash
  UPDATE profiles
  SET
    pin_code_hash = NULL,
    pin_code_enabled = false,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- ============================================
-- Step 5: Verify PIN by user_id (for settings)
-- ============================================
CREATE OR REPLACE FUNCTION verify_user_pin_code(
  user_id uuid,
  pin_code text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash text;
  is_enabled boolean;
BEGIN
  -- Get the stored hash and enabled status
  SELECT pin_code_hash, pin_code_enabled
  INTO stored_hash, is_enabled
  FROM profiles
  WHERE id = user_id;

  -- Return false if user not found or PIN not enabled
  IF NOT FOUND OR NOT is_enabled OR stored_hash IS NULL THEN
    RETURN false;
  END IF;

  -- Verify the PIN code against the stored hash
  RETURN (stored_hash = crypt(pin_code, stored_hash));
END;
$$;

-- ============================================
-- Step 6: Verify PIN by email (for sign-in) - THE KEY FIX!
-- ============================================
CREATE OR REPLACE FUNCTION verify_user_pin_code(
  user_email text,
  pin_code text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Look up the user by email from auth.users and join with profiles
  SELECT p.id, p.pin_code_hash, p.pin_code_enabled
  INTO user_record
  FROM auth.users u
  INNER JOIN profiles p ON u.id = p.id
  WHERE u.email = user_email;

  -- Return NULL if user not found or PIN not enabled
  IF NOT FOUND OR NOT user_record.pin_code_enabled OR user_record.pin_code_hash IS NULL THEN
    RETURN NULL;
  END IF;

  -- Verify the PIN code against the stored hash
  IF user_record.pin_code_hash = crypt(pin_code, user_record.pin_code_hash) THEN
    RETURN user_record.id;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- ============================================
-- Step 7: Grant permissions
-- ============================================
GRANT EXECUTE ON FUNCTION set_user_pin_code(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_user_pin_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_pin_code(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_pin_code(text, text) TO anon;

-- ============================================
-- Step 8: Add documentation comments
-- ============================================
COMMENT ON FUNCTION set_user_pin_code(uuid, text) IS 'Sets a hashed PIN code for quick authentication';
COMMENT ON FUNCTION disable_user_pin_code(uuid) IS 'Disables PIN code authentication for a user';
COMMENT ON FUNCTION verify_user_pin_code(uuid, text) IS 'Verifies a PIN code by user ID (returns boolean)';
COMMENT ON FUNCTION verify_user_pin_code(text, text) IS 'Verifies a PIN code by email for sign-in (returns user_id or NULL)';

-- ============================================
-- DONE!
-- ============================================
-- After running this:
-- 1. Users can set up PIN codes in Profile > Settings
-- 2. Users can sign in with email + PIN on the sign-in page
-- 3. All PIN codes are securely hashed with bcrypt
-- ============================================
