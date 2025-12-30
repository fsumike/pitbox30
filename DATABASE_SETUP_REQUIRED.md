# Database Setup Required for PIN Code Feature

## Overview
The PIN code quick sign-in feature requires adding two new columns to the `profiles` table and three helper functions.

## Database Changes Needed

### 1. Add Columns to Profiles Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Add pin_code_hash column to store hashed PIN codes
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS pin_code_hash text,
ADD COLUMN IF NOT EXISTS pin_code_enabled boolean DEFAULT false;

-- Add index for faster PIN lookups
CREATE INDEX IF NOT EXISTS idx_profiles_pin_enabled
ON profiles(pin_code_enabled)
WHERE pin_code_enabled = true;
```

### 2. Create Helper Functions

#### Function to Set PIN Code:

```sql
CREATE OR REPLACE FUNCTION set_user_pin_code(user_id uuid, pin_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate PIN is numeric and at least 4 digits
  IF pin_code !~ '^\d{4,}$' THEN
    RAISE EXCEPTION 'PIN must be at least 4 numeric digits';
  END IF;

  -- Update the user's PIN code hash
  UPDATE profiles
  SET
    pin_code_hash = crypt(pin_code, gen_salt('bf')),
    pin_code_enabled = true,
    updated_at = now()
  WHERE id = user_id;

  RETURN FOUND;
END;
$$;
```

#### Function to Verify PIN Code:

```sql
CREATE OR REPLACE FUNCTION verify_user_pin_code(user_email text, pin_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email with PIN enabled
  SELECT p.id, p.pin_code_hash, au.email
  INTO user_record
  FROM profiles p
  JOIN auth.users au ON au.id = p.id
  WHERE au.email = user_email
    AND p.pin_code_enabled = true
    AND p.pin_code_hash IS NOT NULL;

  -- Check if user found and PIN matches
  IF user_record.id IS NOT NULL AND
     user_record.pin_code_hash = crypt(pin_code, user_record.pin_code_hash) THEN
    RETURN user_record.id;
  END IF;

  RETURN NULL;
END;
$$;
```

#### Function to Disable PIN:

```sql
CREATE OR REPLACE FUNCTION disable_user_pin_code(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    pin_code_hash = NULL,
    pin_code_enabled = false,
    updated_at = now()
  WHERE id = user_id;

  RETURN FOUND;
END;
$$;
```

### 3. Ensure pgcrypto Extension is Enabled

The functions use `crypt()` from pgcrypto:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## How to Apply These Changes

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the SQL statements above
4. Run them in order:
   - Enable pgcrypto extension
   - Add columns to profiles table
   - Create the three helper functions

## Security Notes

- PIN codes are hashed using bcrypt (via pgcrypto)
- Never stored in plain text
- Functions use SECURITY DEFINER to ensure proper permissions
- PIN must be 4-10 numeric digits

## Testing

After running the SQL:
1. Sign in to your app
2. Go to Profile > Security tab
3. Set up a PIN code
4. Sign out
5. On sign-in page, click "Quick Sign In with PIN"
6. Enter your email and PIN to sign in
