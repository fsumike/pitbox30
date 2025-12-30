# Fix PIN Code Functionality - Quick Guide

## Problem
The PIN code setup feature is missing the required database functions, causing the error:
```
Could not find the function public.set_user_pin_code(pin_code, user_id) in the schema cache
```

## Solution
You need to run a SQL script to add the missing database functions.

---

## Steps to Fix

### 1. Open Supabase Dashboard
1. Go to your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Select your PitBox project

### 2. Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar (icon looks like a terminal/code window)
2. Click **"New query"** button (top right)

### 3. Copy and Run the SQL
1. Open the file **`ADD_PIN_CODE_FUNCTIONS.sql`** from your project folder
2. **Copy all the contents** of that file
3. **Paste** it into the SQL Editor in Supabase
4. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

### 4. Verify Success
You should see a success message like:
```
Success. No rows returned
```

If you see any errors, double-check that you copied the entire SQL file.

---

## What This Does

This SQL script adds:

1. **New columns** to your `profiles` table:
   - `pin_code_hash` - Securely stores the hashed PIN (not the actual PIN)
   - `pin_code_enabled` - Tracks whether PIN login is enabled

2. **Three database functions**:
   - `set_user_pin_code()` - Creates or updates a user's PIN code
   - `disable_user_pin_code()` - Disables PIN code login
   - `verify_user_pin_code()` - Checks if a PIN code is correct

3. **Security features**:
   - PIN codes are hashed (encrypted) using bcrypt
   - Users can only manage their own PIN codes
   - Protection against unauthorized access

---

## After Running the SQL

Once you've run the SQL script:

1. **Refresh your PitBox app** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. Go to your **Profile page**
3. Look for the **"Quick PIN Sign-In"** section
4. Click **"Set Up PIN Code"**
5. Enter your PIN (4-10 digits)
6. Confirm your PIN
7. Done!

---

## Testing Your PIN

To test that it works:

1. Sign out of PitBox
2. On the sign-in page, look for **"Quick Sign In with PIN"** option
3. Enter your PIN code
4. You should be signed in instantly

---

## Security Notes

- Your PIN is **never stored in plain text** - only a secure hash is saved
- The PIN is stored locally in your profile, not in any external system
- PIN codes work alongside your email/password - you can still use either method
- You can change or disable your PIN anytime from your Profile page

---

## Troubleshooting

### "Function already exists" error
This is fine! It means the functions were already created. You can ignore this.

### Still getting the error after running SQL
1. Try a hard refresh of your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear your browser cache
3. Sign out and sign back in
4. Check that the SQL ran successfully in Supabase (no red error messages)

### Can't access SQL Editor in Supabase
Make sure you're the project owner or have admin access to the Supabase project.

---

## Questions?

If you continue to have issues:
1. Check the browser console for errors (F12 key, then look at Console tab)
2. Verify your Supabase connection is working (other features load correctly)
3. Make sure you're signed in to the correct account

---

**That's it!** Once you run that SQL file in Supabase, your PIN code feature will work perfectly.
