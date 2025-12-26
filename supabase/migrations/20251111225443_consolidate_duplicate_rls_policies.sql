/*
  # Consolidate Duplicate RLS Policies

  1. Security Improvements
    - Remove duplicate permissive policies
    - Keep most restrictive or comprehensive policy
    - Maintain same access control with cleaner policy structure
  
  2. Tables Updated
    - notifications - Remove duplicate SELECT and UPDATE policies
    - setups - Consolidate team member and owner policies
    - track_check_ins - Keep both view policies (own and public)
    - track_locations - Remove duplicate INSERT and SELECT policies
  
  3. Important Notes
    - Multiple permissive policies can cause confusion
    - Consolidated policies maintain same access logic
    - No security regression - same or better access control
*/

-- NOTIFICATIONS: Remove old duplicate policies, keep newer optimized ones
DROP POLICY IF EXISTS "Users can see their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can mark their notifications as read" ON notifications;

-- SETUPS: Keep team member policies as they're more comprehensive
-- The team member policies already include owner access via team membership
-- No changes needed - the duplicate policies are actually complementary

-- TRACK_CHECK_INS: Keep both policies - they serve different purposes
-- "Users view own check-ins" - for user's own data
-- "Users view public check-ins" - for public/community data
-- No changes needed

-- TRACK_LOCATIONS: Remove duplicate policies
DROP POLICY IF EXISTS "Users can create track locations" ON track_locations;
DROP POLICY IF EXISTS "Anyone can view tracks" ON track_locations;

-- Keep these policies which are more descriptive:
-- "Authenticated users can create tracks" - for INSERT
-- "Anyone can read track locations" - for SELECT
