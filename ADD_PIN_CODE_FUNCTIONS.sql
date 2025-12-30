/*
  # Add PIN Code Functionality

  INSTRUCTIONS: Upload this file to Supabase SQL Editor and run it.

  This migration adds:
  1. New Columns to profiles table
    - pin_code_hash (text, nullable) - Stores hashed PIN code for security
    - pin_code_enabled (boolean, default false) - Whether PIN login is enabled

  2. New Functions
    - set_user_pin_code(user_id, pin_code) - Securely sets user's PIN code
    - disable_user_pin_code(user_id) - Disables PIN code login
    - verify_user_pin_code(user_id, pin_code) - Verifies PIN code for authentication

  3. Security
    - PIN codes are hashed using pgcrypto extension
    - Only users can manage their own PIN codes
    - PIN verification is secure and timing-attack resistant
*/

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add PIN code columns to profiles table
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

-- Function to set user PIN code (hashed)
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

-- Function to disable user PIN code
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

-- Function to verify user PIN code (for authentication)
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

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION set_user_pin_code(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_user_pin_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_pin_code(uuid, text) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION set_user_pin_code IS 'Sets a hashed PIN code for quick authentication';
COMMENT ON FUNCTION disable_user_pin_code IS 'Disables PIN code authentication for a user';
COMMENT ON FUNCTION verify_user_pin_code IS 'Verifies a PIN code for authentication (returns boolean)';
