# PitBox Admin User Guide

## Welcome, Admin!

This guide will walk you through everything you need to know about managing the PitBox admin panel. As an admin, you have special access to manage location-based advertisements that appear to users throughout the app.

---

## Table of Contents

1. [Signing In](#signing-in)
2. [Accessing the Admin Panel](#accessing-the-admin-panel)
3. [Admin Dashboard Overview](#admin-dashboard-overview)
4. [Managing Advertisements](#managing-advertisements)
5. [Understanding Advertisement Metrics](#understanding-advertisement-metrics)
6. [Best Practices](#best-practices)
7. [Making Other Users Admins](#making-other-users-admins)
8. [Troubleshooting](#troubleshooting)

---

## Signing In

### For Desktop Site Users

1. **Open PitBox in your web browser**
   - Navigate to your PitBox website URL
   - Use any modern web browser (Chrome, Firefox, Safari, Edge)

2. **Sign in with your email**
   - Click the "Sign In" button in the top navigation
   - Enter your email address and password
   - You must use the SAME email address that was set as an admin in the database

3. **Important**: Your account needs to have `is_admin = true` in the database (this has already been set up for your account)

---

## Accessing the Admin Panel

Once you're signed in as an admin:

### From Desktop
1. Look for the **Admin** link in your navigation bar (usually top or side navigation)
2. Click on **"Admin Advertisements"** or **"Manage Ads"**
3. You'll be taken to the Advertisement Management dashboard

### Direct URL
- You can also navigate directly to: `your-site-url/admin/advertisements`
- Only accounts with admin privileges can access this page
- Non-admin users will be redirected away from this page

---

## Admin Dashboard Overview

When you first access the admin panel, you'll see:

### Top Section
- **Page Title**: "Advertisement Management"
- **Description**: "Manage location-based advertisements"
- **"New Advertisement" Button**: Click this to create a new ad

### Main Content Area
- A list of all existing advertisements
- Each ad shows as a card with all its details and controls

---

## Managing Advertisements

### Creating a New Advertisement

1. **Click the "+ New Advertisement" button** (top right of the page)

2. **Fill out the advertisement form**:

   **Business Information**:
   - **Business Name** (Required): The name of the business being advertised
   - **Contact Email** (Required): Email for the advertiser
   - **Contact Phone** (Optional): Phone number for contact

   **Advertisement Content**:
   - **Ad Content** (Required): The text that users will see in the ad
     - Keep it clear and compelling
     - Include a call-to-action (e.g., "Visit us today!")
     - Character limit is generous, but shorter is usually better

   - **Image URL** (Optional): Direct link to an image for the ad
     - Must be a valid image URL
     - Recommended: Use hosted images (Supabase storage, Imgur, etc.)
     - Good image dimensions: 1200x628px or similar

   **Targeting & Schedule**:
   - **Target Radius** (Required): How many miles around a location to show this ad
     - Default: 50 miles
     - Example: If set to 25 miles, users within 25 miles of the track/location will see this ad
     - Choose based on the advertiser's service area

   - **Start Date** (Required): When the ad campaign begins
   - **End Date** (Required): When the ad campaign ends
   - **Active Checkbox**: Check this to make the ad live immediately

3. **Click "Create Advertisement"**
   - The ad will be saved and appear in your list
   - If "Active" was checked, it will start showing to users immediately

### Editing an Advertisement

1. **Find the ad you want to edit** in the list
2. **Click the blue "Edit" button** (pencil icon) on the right side of the ad card
3. The form will open with all current information pre-filled
4. Make your changes
5. **Click "Update Advertisement"** to save
6. **Click "Cancel"** if you change your mind

### Activating/Deactivating an Advertisement

Instead of deleting ads, you can turn them on and off:

1. **Find the ad** in your list
2. **Click the eye icon** (toggle button)
   - **Eye icon**: Click to deactivate an active ad
   - **Eye with slash icon**: Click to activate an inactive ad

3. **When deactivated**:
   - The ad card will appear dimmed (lower opacity)
   - Status badge shows "Inactive" (gray)
   - Users will NOT see this ad in the app
   - All data and metrics are preserved

4. **When activated**:
   - Status badge shows "Active" (green)
   - Users will see this ad based on their location

### Deleting an Advertisement

**Warning**: This permanently removes the ad and all its metrics!

1. **Find the ad** you want to delete
2. **Click the red "Delete" button** (trash icon)
3. **Confirm the deletion** in the popup dialog
4. The ad is permanently removed

**Recommendation**: Instead of deleting, consider deactivating ads you might want to use again later.

---

## Understanding Advertisement Metrics

Each advertisement card shows real-time performance metrics:

### Impressions
- **Icon**: Bar chart icon (blue)
- **What it means**: How many times users have SEEN the ad
- **Example**: "1,247 impressions" means 1,247 users saw this ad

### Clicks
- **Icon**: Eye icon (green)
- **What it means**: How many times users CLICKED on the ad
- **Example**: "87 clicks" means 87 users clicked to learn more

### Click-Through Rate (CTR)
- Calculate manually: (Clicks ÷ Impressions) × 100
- Example: 87 clicks ÷ 1,247 impressions = 6.97% CTR
- Industry average for mobile ads: 2-5% CTR
- Anything above 5% is considered good performance

### Using Metrics to Improve Performance
- **Low impressions?** Check the target radius or date range
- **Low clicks but high impressions?** The ad content or image may need improvement
- **High CTR?** Great! This ad is performing well
- Share metrics reports with advertisers monthly

---

## Best Practices

### Creating Effective Ads

1. **Keep it Local**: Use local language, landmarks, or references
   - "Right off Exit 45" or "Near Bristol Motor Speedway"

2. **Clear Call-to-Action**:
   - "Visit our shop today!"
   - "Call now for race day specials"
   - "Order online for pickup"

3. **Race-Specific Timing**:
   - Schedule ads around major race weekends
   - Adjust target radius for traveling racers

4. **Image Best Practices**:
   - Use high-quality, clear images
   - Show products or services clearly
   - Include branding (logo)
   - Mobile-friendly dimensions

### Managing Multiple Ads

1. **Naming Convention**: Use clear business names
2. **Stagger End Dates**: Avoid all ads ending at once
3. **Regular Check-ins**: Review active ads weekly
4. **Performance Reviews**: Check metrics monthly
5. **Archive Old Ads**: Deactivate expired ads rather than deleting

### Location-Based Targeting Tips

- **Parts Suppliers**: 50-100 mile radius (racers travel far for parts)
- **Local Shops**: 25-50 mile radius
- **Race Tracks**: 100+ mile radius (regional draw)
- **Food/Lodging**: 10-25 mile radius (local to venue)

---

## Making Other Users Admins

You can promote other trusted users to admin status:

### Prerequisites
- You need their exact email address as it appears in their PitBox account
- They must already have a PitBox account

### Steps

1. **Get their email address**: Ask them what email they used to sign up

2. **Run this SQL in Supabase**:
   ```sql
   UPDATE profiles
   SET is_admin = true
   WHERE email = 'their-email@example.com';
   ```

3. **Replace** `their-email@example.com` with their actual email

4. **They need to sign out and sign back in** to see admin features

### To Remove Admin Access

```sql
UPDATE profiles
SET is_admin = false
WHERE email = 'their-email@example.com';
```

### Security Tips
- Only give admin access to trusted team members
- Don't share admin access with advertisers
- Keep a list of who has admin access
- Review admin list quarterly

---

## Troubleshooting

### "I can't see the Admin link"

**Solution**:
1. Make sure you're signed in
2. Check that `is_admin = true` for your email in the database
3. Try signing out and back in
4. Clear your browser cache and refresh

### "I'm logged in but can't access /admin/advertisements"

**Solution**:
1. Verify your email in the database matches exactly
2. Run this query to check:
   ```sql
   SELECT email, is_admin FROM profiles WHERE email = 'your-email@example.com';
   ```
3. Should return `is_admin: true`

### "Advertisements aren't showing to users"

**Check**:
1. Is the ad marked as "Active"? (green badge)
2. Are you within the date range? (Start date past, end date future)
3. Is the user's location within the target radius?
4. Refresh the app on the user's device

### "Images aren't loading"

**Solution**:
1. Check that the image URL is valid (paste it in a new browser tab)
2. Make sure the image is publicly accessible
3. Try using a different image host
4. Check for HTTPS (not HTTP) URLs

### "Form won't submit"

**Check**:
1. All required fields are filled (marked with red asterisk)
2. Email is in valid format
3. Dates are in correct format
4. Start date is before end date
5. Target radius is a positive number

### "Can't delete an advertisement"

**Possible reasons**:
1. Browser permissions issue - try refreshing
2. Database connection problem - check your internet
3. Try deactivating instead of deleting first

---

## Support & Questions

### Getting Help

If you encounter issues not covered in this guide:

1. **Check browser console** for error messages (F12 key)
2. **Contact your developer** with:
   - What you were trying to do
   - What happened instead
   - Any error messages
   - Screenshots if helpful

### Feature Requests

Want new admin features? Common requests:
- Bulk editing multiple ads
- Advanced analytics dashboard
- Scheduled activation/deactivation
- A/B testing for ad content
- Advertiser portal access

Document what you need and discuss with your development team.

---

## Quick Reference Card

### Common Tasks

| Task | Button/Action |
|------|---------------|
| Create new ad | Click "+ New Advertisement" |
| Edit existing ad | Click blue pencil icon |
| Delete ad | Click red trash icon (confirm popup) |
| Activate/Deactivate | Click eye icon |
| Cancel editing | Click gray "Cancel" button |
| View metrics | Check impressions & clicks in ad card |

### Ad Status Colors

| Color | Meaning |
|-------|---------|
| 🟢 Green "Active" | Ad is live and showing to users |
| ⚫ Gray "Inactive" | Ad is paused/hidden from users |
| Dimmed card | Ad is currently inactive |

---

## Tips for Success

1. **Test your ads**: Create a test ad with a small radius and verify it appears correctly
2. **Keep records**: Track which advertisers are active and when contracts expire
3. **Communication**: Email advertisers monthly with their metrics
4. **Stay organized**: Use consistent naming and scheduling practices
5. **Monitor regularly**: Check the dashboard weekly to ensure everything's running smoothly

---

**You're all set!** The admin panel is designed to be intuitive and powerful. Start by creating a test advertisement to familiarize yourself with the interface, then you're ready to manage real campaigns.

Happy advertising! 🏁
