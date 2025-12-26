-- =====================================================
-- FIX DYNO SHEETS BUCKET - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- This will make the dyno-sheets bucket public so images can be displayed
-- You need to run this in your Supabase Dashboard > SQL Editor

-- Step 1: Make the bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'dyno-sheets';

-- Step 2: Drop the old restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own dyno sheets" ON storage.objects;

-- Step 3: Create new public SELECT policy so anyone can view the images
CREATE POLICY "Anyone can view dyno sheets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'dyno-sheets');

-- Step 4: Verify the changes (optional - just to confirm)
SELECT id, name, public FROM storage.buckets WHERE id = 'dyno-sheets';

-- =====================================================
-- HOW TO RUN THIS:
-- =====================================================
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click on "SQL Editor" in the left sidebar
-- 4. Click "New query"
-- 5. Copy and paste this entire SQL script
-- 6. Click "Run" button
-- 7. You should see "Success. No rows returned"
-- 8. Refresh your app and images should now load!
-- =====================================================
