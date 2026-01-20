/*
  CRITICAL: Run this SQL in Supabase SQL Editor to fix signup

  Go to: Supabase Dashboard > SQL Editor > New Query
  Paste this entire file and click "Run"
*/

-- Step 1: Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create helper function for unique usernames
CREATE OR REPLACE FUNCTION public.generate_unique_username(base_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_username text;
  counter integer := 0;
BEGIN
  new_username := base_username;

  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
    counter := counter + 1;
    new_username := base_username || counter::text;
  END LOOP;

  RETURN new_username;
END;
$$;

-- Step 3: Create new handle_new_user function with robust error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  base_username text;
  final_username text;
  user_full_name text;
BEGIN
  -- Extract username from metadata or email
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  -- Clean the username
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
  base_username := substring(base_username from 1 for 20);

  -- Ensure base_username is not empty
  IF base_username = '' OR base_username IS NULL THEN
    base_username := 'user';
  END IF;

  -- Generate unique username if needed
  final_username := public.generate_unique_username(base_username);

  -- Extract full name from metadata
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  -- Insert profile with ON CONFLICT handling
  INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    final_username,
    user_full_name,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, profiles.username),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle remaining unique constraint violations
    final_username := public.generate_unique_username(base_username || '_' || substring(NEW.id::text from 1 for 8));

    INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      final_username,
      user_full_name,
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      updated_at = now();

    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_unique_username(text) TO service_role;

-- Verify: Run this to confirm the trigger exists
SELECT tgname, tgrelid::regclass, tgtype, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
