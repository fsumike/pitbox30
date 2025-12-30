# Fix PIN Code Authentication Error

## The Problem
You're seeing the error: `function gen_salt(unknown, integer) does not exist`

This happens because the `pgcrypto` extension (needed for secure PIN hashing) hasn't been enabled in your Supabase database yet.

## The Solution (Takes 2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your PitBox project
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Apply the Migration

1. Click **"New Query"** button
2. Open the file: `FIX_PIN_CODE_MIGRATION.sql` (in your project root)
3. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)

### Step 3: Verify Success

You should see: **"Success. No rows returned"**

If you see any of these, you're good:
- ✅ "Success. No rows returned"
- ✅ "extension pgcrypto already exists" (means it was already enabled)
- ✅ "function already exists" (means functions were already created)

## What This Migration Does

✅ Enables the `pgcrypto` extension (for secure password hashing)
✅ Adds `pin_code_hash` column to profiles table
✅ Adds `pin_code_enabled` column to profiles table
✅ Creates `set_user_pin_code()` function
✅ Creates `disable_user_pin_code()` function
✅ Creates `verify_user_pin_code()` function
✅ Sets proper security permissions

## After Running the Migration

1. Refresh your app
2. Go to your Profile page
3. Try setting up Quick PIN Sign-In
4. It should work without errors!

## Troubleshooting

**"Permission denied":**
- Make sure you're logged in as the project owner
- Try refreshing the Supabase dashboard

**"Already exists" errors:**
- This is fine! It means the migration was partially applied before
- The migration is safe to re-run

**Still getting errors?**
- Make sure you copied the ENTIRE SQL file
- Check that you clicked "Run" in the SQL editor
- Try refreshing your app after applying the migration
