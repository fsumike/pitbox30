# Admin Interface Setup Guide

## Overview

Your PitBox app now has a complete admin interface for managing location-based advertisements. The admin panel is **desktop-only** and will never appear on mobile apps (iOS/Android).

## Key Features

### Desktop-Only Access
- **Web Browser:** Admin features visible and functional
- **Mobile Apps:** Admin completely hidden, no navigation link, routes blocked
- Even if you're an admin, you can't access admin features from mobile

### Security Layers
1. **UI Protection:** Admin link hidden from non-admins
2. **Route Protection:** `/admin/advertisements` redirects non-admins
3. **Database Protection:** RLS policies block non-admin database access
4. **Platform Protection:** Mobile apps can never access admin routes

## Setup Instructions

### Step 1: Run the SQL Setup

Open your Supabase SQL Editor and run the `ADMIN_SETUP.sql` file:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the `ADMIN_SETUP.sql` file from your project root
4. Click "Run" to execute all the setup commands

This will:
- Add `is_admin` column to profiles table
- Create advertisements table
- Set up Row Level Security policies
- Create necessary indexes

### Step 2: Make Yourself an Admin

After running the SQL setup, make yourself an admin by running ONE of these commands:

**Option A - By User ID:**
```sql
UPDATE profiles
SET is_admin = true
WHERE id = 'your-user-id-here';
```

**Option B - By Username:**
```sql
UPDATE profiles
SET is_admin = true
WHERE username = 'your-username-here';
```

**Option C - By Email (if you have auth.users access):**
```sql
UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

### Step 3: Access the Admin Panel

1. Open your app in a **web browser** (not mobile app)
2. Sign in with your admin account
3. You'll see an "Admin" link in the navigation bar
4. Click it to access the admin panel at `/admin/advertisements`

## Admin Panel Features

### View Advertisements
- See all active and inactive ads
- View performance metrics (impressions, clicks)
- See ad details (business name, contact info, dates, radius)

### Create Advertisement
1. Click "New Advertisement" button
2. Fill in the form:
   - Business Name (required)
   - Contact Email (required)
   - Contact Phone (optional)
   - Ad Content (required)
   - Image URL (optional)
   - Target Radius in miles (default: 50)
   - Start Date (required)
   - End Date (required)
   - Active checkbox (default: checked)
3. Click "Create Advertisement"

### Edit Advertisement
1. Click the blue edit icon on any ad
2. Modify the fields you want to change
3. Click "Update Advertisement"

### Toggle Active/Inactive
- Click the eye icon to activate an ad
- Click the eye-off icon to deactivate an ad
- Inactive ads won't show to users but data is preserved

### Delete Advertisement
- Click the red trash icon
- Confirm deletion
- This is permanent and cannot be undone

### View Analytics
Each ad shows:
- **Impressions:** How many times the ad was shown
- **Clicks:** How many times users clicked the ad

## How Location-Based Ads Work

When a user is near a track or location:
1. The app gets their GPS coordinates
2. Queries ads within the target radius
3. Shows matching ads to the user
4. Tracks impressions and clicks automatically

### Target Radius
- Set in miles for each advertisement
- Default is 50 miles
- Ads show to users within this radius of their location

## Granting Admin Access to Others

To give someone else admin access:

```sql
UPDATE profiles
SET is_admin = true
WHERE username = 'their-username';
```

To remove admin access:

```sql
UPDATE profiles
SET is_admin = false
WHERE username = 'their-username';
```

## Security Best Practices

### ✅ What's Protected
- Only admins can view ads in the database
- Only admins can create/edit/delete ads
- Mobile apps cannot access admin routes
- All operations are logged and tracked

### ⚠️ Remember
- Grant admin access sparingly
- Review who has admin access regularly
- Monitor ad performance and remove underperforming ads
- Keep contact information up to date

## Troubleshooting

### "I don't see the Admin link"
1. Make sure you're on **web browser** (not mobile app)
2. Verify you're logged in
3. Check your `is_admin` flag in database:
   ```sql
   SELECT username, is_admin FROM profiles WHERE id = auth.uid();
   ```

### "I get redirected away from /admin/advertisements"
1. Check you're on desktop/web browser
2. Verify your admin status in database
3. Try logging out and back in

### "I can't create an advertisement"
1. Make sure all required fields are filled
2. Check that dates are valid (end date after start date)
3. Verify your admin status in database

### "Ads aren't showing to users"
1. Check that the ad is set to "Active"
2. Verify start/end dates are correct
3. Confirm the target radius is appropriate
4. Make sure users have location permissions enabled

## Database Schema

### profiles table
- Added `is_admin` boolean column (default: false)

### advertisements table
```
- id (uuid)
- business_name (text)
- contact_email (text)
- contact_phone (text, optional)
- ad_content (text)
- image_url (text, optional)
- target_location (geography point)
- target_radius_miles (numeric)
- start_date (timestamptz)
- end_date (timestamptz)
- is_active (boolean)
- clicks (integer)
- impressions (integer)
- created_at (timestamptz)
- updated_at (timestamptz)
```

## Next Steps

1. ✅ Run the SQL setup
2. ✅ Make yourself an admin
3. ✅ Access the admin panel from web browser
4. ✅ Create your first advertisement
5. ✅ Monitor performance and adjust as needed

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your database setup is complete
3. Ensure you're accessing from desktop/web only
4. Check your admin status in the database

---

**Important:** The admin interface is now live on your web app but completely invisible to mobile app users!
