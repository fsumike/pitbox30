# How to Upload the Advertisement Migration SQL

## Method 1: Supabase Dashboard (RECOMMENDED - Takes 2 minutes)

This is the easiest and most reliable way:

### Step-by-Step:

1. **Open your Supabase project**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - OR go directly to: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`

3. **Create new query**
   - Click "New Query" button

4. **Copy the SQL**
   - Open `APPLY_THIS_MIGRATION.sql` from your project
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

5. **Paste and Run**
   - Paste into the SQL editor
   - Click "Run" (or press Ctrl+Enter)

6. **Verify Success**
   - You should see "Success. No rows returned"
   - Check the "Tables" section - you should see `advertisements` table

### Troubleshooting:

**If you see "permission denied":**
- Make sure you're logged in as the project owner
- Try refreshing the page

**If you see "table already exists":**
- The migration was already applied
- You're good to go!

**If you see "function already exists":**
- That's okay, it means it's already there
- Continue to the next step

---

## Method 2: Direct Link (FASTEST)

1. **Find your Supabase Project ID**
   - It's in your project URL: `https://supabase.com/dashboard/project/[PROJECT_ID]`
   - Or check your `.env` file: `VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co`

2. **Click this link (replace YOUR_PROJECT_ID):**
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
   ```

3. **Paste and run the SQL from `APPLY_THIS_MIGRATION.sql`**

---

## After Upload - Test It:

1. Visit your app at `/my-advertisements`
2. Create a test advertisement
3. Go to home page - you should see it!

---

## What the Migration Creates:

✅ `advertisements` table with all fields
✅ Row Level Security policies
✅ `calculate_distance()` function
✅ `get_nearby_advertisements()` function
✅ `increment_ad_impressions()` function
✅ `increment_ad_clicks()` function
✅ Performance indexes

---

## Need Your Project ID?

Run this command in your project folder:
```bash
grep VITE_SUPABASE_URL .env | cut -d'/' -f3 | cut -d'.' -f1
```

Or just look at your `.env` file - it's the subdomain in `VITE_SUPABASE_URL`.
