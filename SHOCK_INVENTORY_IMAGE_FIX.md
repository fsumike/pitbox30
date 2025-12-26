# Shock Inventory Image Loading Fix

## The Problem
Images are being uploaded successfully to Supabase storage, but they fail to load in the app. The error shows:
```
Failed to load image: https://pbfdzlkdlxbwijwwysaf.supabase.co/storage/v1/object/public/dyno-sheets/...
```

## The Cause
The `dyno-sheets` storage bucket is set to **private**, which means even though the code is trying to access the "public" URL, the bucket's privacy settings are blocking access.

## The Solution
You need to make the storage bucket public. This is **safe** because:
- Only authenticated users can upload images
- Only authenticated users can delete their own images
- Everyone can view images (needed for display)

## Steps to Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Fix Script**
   - Open the file `FIX_DYNO_SHEETS_BUCKET.sql` in this project
   - Copy all the SQL commands
   - Paste into the SQL Editor
   - Click "Run"

4. **Verify Success**
   - You should see "Success. No rows returned"
   - The bucket is now public!

5. **Test Your App**
   - Refresh your application
   - Add a new shock with a photo
   - The image should now display correctly

### Option 2: Using Supabase Storage Settings

1. **Go to Storage**
   - In Supabase Dashboard, click "Storage" in the left sidebar

2. **Find dyno-sheets bucket**
   - Click on the "dyno-sheets" bucket

3. **Make it Public**
   - Look for bucket settings (gear icon or three dots menu)
   - Find "Public bucket" toggle
   - Turn it ON
   - Save changes

4. **Update Policies**
   - Go to "Policies" tab in Storage
   - Make sure there's a SELECT policy that allows public access
   - If not, use the SQL script from Option 1

## What the Fix Does

The SQL script does three things:

1. **Makes the bucket public**
   ```sql
   UPDATE storage.buckets SET public = true WHERE id = 'dyno-sheets';
   ```

2. **Removes the old restrictive policy**
   ```sql
   DROP POLICY IF EXISTS "Users can view their own dyno sheets" ON storage.objects;
   ```

3. **Adds a new public viewing policy**
   ```sql
   CREATE POLICY "Anyone can view dyno sheets"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'dyno-sheets');
   ```

## Security Notes

This is secure because:
- ✅ Upload policy still requires authentication and checks user ID
- ✅ Delete policy still requires authentication and ownership
- ✅ Update policy still requires authentication and ownership
- ✅ Only SELECT (viewing) is made public
- ✅ Images are organized by user ID in folders
- ✅ This is standard practice for user-uploaded images

## After the Fix

Once you've run the SQL script:
1. All existing images will become visible
2. All new images will be visible immediately after upload
3. The "Failed to load" message will disappear
4. Images will load normally in the shock inventory

## Need Help?

If images still don't load after running the fix:
1. Check browser console (F12) for new error messages
2. Verify the SQL script ran successfully (no errors in Supabase)
3. Try hard-refreshing your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check that you're using the correct Supabase project URL in your `.env` file
