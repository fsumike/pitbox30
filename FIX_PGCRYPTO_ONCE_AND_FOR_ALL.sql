/*
  ============================================================================
  PERMANENT FIX FOR PGCRYPTO ERROR
  ============================================================================

  This SQL script fixes the "gen_salt(unknown, integer) does not exist" error
  once and for all by enabling pgcrypto and setting up PIN code functionality.

  INSTRUCTIONS:
  1. Go to your Supabase Dashboard: https://supabase.com/dashboard
  2. Click on your project
  3. Go to "SQL Editor" in the left sidebar
  4. Click "New Query"
  5. Copy and paste this ENTIRE file
  6. Click "Run" (or press Cmd/Ctrl + Enter)
  7. You should see "Success. No rows returned"

  This migration:
  - Enables the pgcrypto extension (required for gen_salt function)
  - Adds PIN code columns to profiles table
  - Creates secure PIN code functions with proper hashing

  ============================================================================
*/

-- Step 1: Enable pgcrypto extension
-- This provides the gen_salt() and crypt() functions for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Add PIN code columns to profiles table (if they don't exist)
DO $$
BEGIN
  -- Add pin_code_hash column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'pin_code_hash'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN pin_code_hash text;
    RAISE NOTICE 'Added pin_code_hash column to profiles';
  ELSE
    RAISE NOTICE 'pin_code_hash column already exists';
  END IF;

  -- Add pin_code_enabled column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'pin_code_enabled'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN pin_code_enabled boolean DEFAULT false;
    RAISE NOTICE 'Added pin_code_enabled column to profiles';
  ELSE
    RAISE NOTICE 'pin_code_enabled column already exists';
  END IF;
END $$;

-- Step 3: Drop existing functions (if they exist) to recreate them properly
DROP FUNCTION IF EXISTS set_user_pin_code(uuid, text);
DROP FUNCTION IF EXISTS disable_user_pin_code(uuid);
DROP FUNCTION IF EXISTS verify_user_pin_code(uuid, text);

-- Step 4: Create function to set user PIN code
CREATE FUNCTION set_user_pin_code(
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

  -- Validate PIN code format (4-10 digits only)
  IF pin_code !~ '^\d{4,10}$' THEN
    RAISE EXCEPTION 'Invalid PIN: Must be 4-10 digits';
  END IF;

  -- Hash the PIN code using bcrypt and enable it
  UPDATE public.profiles
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

-- Step 5: Create function to disable user PIN code
CREATE FUNCTION disable_user_pin_code(
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

  -- Clear PIN code and disable it
  UPDATE public.profiles
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

-- Step 6: Create function to verify user PIN code
CREATE FUNCTION verify_user_pin_code(
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
  FROM public.profiles
  WHERE id = user_id;

  -- Return false if user not found, PIN not enabled, or no hash stored
  IF NOT FOUND OR NOT is_enabled OR stored_hash IS NULL THEN
    RETURN false;
  END IF;

  -- Verify the PIN code against the stored hash
  -- The crypt function is timing-attack resistant
  RETURN (stored_hash = crypt(pin_code, stored_hash));
END;
$$;

-- Step 7: Grant permissions to authenticated users
GRANT EXECUTE ON FUNCTION set_user_pin_code(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_user_pin_code(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_user_pin_code(uuid, text) TO authenticated;

-- Step 8: Add helpful documentation comments
COMMENT ON FUNCTION set_user_pin_code IS 'Securely sets a hashed PIN code for quick track-side authentication';
COMMENT ON FUNCTION disable_user_pin_code IS 'Disables PIN code authentication and clears stored hash';
COMMENT ON FUNCTION verify_user_pin_code IS 'Verifies a PIN code for authentication (returns true/false)';

-- Step 9: Verify everything is set up correctly
DO $$
DECLARE
  ext_exists boolean;
  func_count integer;
BEGIN
  -- Check if pgcrypto is enabled
  SELECT EXISTS(
    SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto'
  ) INTO ext_exists;

  IF ext_exists THEN
    RAISE NOTICE '✓ pgcrypto extension is enabled';
  ELSE
    RAISE WARNING '✗ pgcrypto extension is NOT enabled';
  END IF;

  -- Check if functions exist
  SELECT COUNT(*) INTO func_count
  FROM pg_proc
  WHERE proname IN ('set_user_pin_code', 'disable_user_pin_code', 'verify_user_pin_code');

  RAISE NOTICE '✓ Created % PIN code functions', func_count;

  -- Final success message
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PIN CODE SETUP COMPLETE!';
  RAISE NOTICE '========================================';
END $$;
