# Fix pgcrypto Error - PERMANENT SOLUTION

## The Problem
You're seeing this error:
```
function gen_salt(unknown, integer) does not exist
```

This happens because the `pgcrypto` extension is not enabled in your Supabase database. The PIN code authentication feature requires this extension for secure password hashing.

---

## 🎯 Quick Fix (Choose ONE method)

### ✅ Method 1: Visual Guide (EASIEST - 2 Minutes)
Open this page in your browser:
```
http://localhost:5173/fix-pgcrypto.html
```

Then follow the step-by-step visual guide with download buttons.

---

### ✅ Method 2: Supabase Dashboard (Manual)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy and Run SQL**
   - Open file: `FIX_PGCRYPTO_ONCE_AND_FOR_ALL.sql`
   - Copy the ENTIRE contents
   - Paste into the SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - The error is now fixed!

---

### ✅ Method 3: Command Line (Automatic)

Run this command from your project root:
```bash
node apply-pgcrypto-fix.mjs
```

**Note:** This requires your `.env` file to have:
- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 What Gets Fixed

When you run the SQL fix, it will:

✅ **Enable pgcrypto extension**
- Provides `gen_salt()` and `crypt()` functions
- Required for secure password hashing

✅ **Add PIN code columns to profiles table**
- `pin_code_hash` - Stores hashed PIN codes
- `pin_code_enabled` - Toggles PIN authentication

✅ **Create 3 secure functions**
- `set_user_pin_code(user_id, pin_code)` - Sets a user's PIN
- `disable_user_pin_code(user_id)` - Disables PIN auth
- `verify_user_pin_code(user_id, pin_code)` - Verifies PIN for login

✅ **Security Features**
- Uses bcrypt (blowfish) hashing with 8 rounds
- Timing-attack resistant verification
- Users can only manage their own PINs
- All functions use SECURITY DEFINER with proper search_path

---

## 🔒 Security Details

### Hashing Algorithm
- **Algorithm:** bcrypt (blowfish)
- **Rounds:** 8 (industry standard)
- **Salt:** Automatically generated per PIN
- **Irreversible:** Cannot be decrypted or reversed

### Function Security
- `SECURITY DEFINER` - Runs with creator's privileges
- `SET search_path = public` - Prevents injection attacks
- Authorization checks - Users can only modify their own PINs
- Input validation - PINs must be 4-10 digits

---

## ✅ Verification

After applying the fix, verify it worked:

### Check Extension
```sql
SELECT * FROM pg_extension WHERE extname = 'pgcrypto';
```
Should return 1 row.

### Check Columns
```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('pin_code_hash', 'pin_code_enabled');
```
Should return 2 rows.

### Check Functions
```sql
SELECT proname
FROM pg_proc
WHERE proname LIKE '%pin_code%';
```
Should return 3 rows.

---

## 🎉 After Fixing

Once fixed, you can:
- Use PIN code authentication in your app
- Set PINs from the Profile page
- Sign in with email + PIN (faster than password)
- All PINs are securely hashed with bcrypt

---

## ❓ Troubleshooting

### Still getting the error?
1. Make sure you ran the ENTIRE SQL file (not just part of it)
2. Verify pgcrypto is enabled: `SELECT * FROM pg_extension WHERE extname = 'pgcrypto';`
3. Try closing and reopening your app

### Functions not found?
1. Check you're in the correct Supabase project
2. Verify functions exist: `SELECT proname FROM pg_proc WHERE proname LIKE '%pin%';`
3. Make sure you clicked "Run" in the SQL Editor

### Permission errors?
1. Make sure you're using the SQL Editor in Supabase Dashboard
2. You need to be the project owner or have admin access
3. The service role key has full access (for CLI method)

---

## 📞 Files Created

- `FIX_PGCRYPTO_ONCE_AND_FOR_ALL.sql` - Complete SQL fix (run this)
- `apply-pgcrypto-fix.mjs` - Automatic CLI script
- `public/fix-pgcrypto.html` - Visual guide with download buttons
- `PGCRYPTO_FIX_README.md` - This file

---

## 🚀 That's It!

This fix is **permanent** and only needs to be applied **once**. After running it, you'll never see the `gen_salt` error again.

Choose whichever method is easiest for you and get it done in 2 minutes! 💪
