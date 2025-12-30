# Location-Based Advertising - Quick Start

## What Was Built

A complete location-based advertising system where businesses can advertise based on their location and reach radius.

### Key Features:
- Local (50 mi), Regional (200 mi), and National reach options
- Automatic ad rotation every 15 seconds
- Real-time impression and click tracking
- Full advertiser management interface
- Smart distance-based targeting

## What You Need To Do

### 1. Apply the Database Migration (REQUIRED)

**Open your Supabase SQL Editor and run the file:**
```
APPLY_THIS_MIGRATION.sql
```

This creates the advertisements table, functions, and security policies.

### 2. Test the System

1. Sign in to your app
2. Go to `/my-advertisements`
3. Click "Create Advertisement"
4. Fill in details:
   - Business Name: "Test Auto Parts"
   - Title: "20% Off All Sprint Car Parts"
   - Description: "Local racing parts supplier"
   - Latitude: Your current latitude (find on Google Maps)
   - Longitude: Your current longitude
   - Reach Type: Local
   - Category: Parts
5. Save and view on home page

### 3. How Users See Ads

- Ads automatically appear on the Home page
- Display is based on user's current location
- Closer ads show first
- Ads rotate automatically
- Users can click to visit website or call

## Files Created

### Database
- `APPLY_THIS_MIGRATION.sql` - Database schema and functions

### React Hooks
- `src/hooks/useAdvertisements.ts` - Fetch and track ads

### Components
- `src/components/LocationBasedAds.tsx` - Ad display with rotation

### Pages
- `src/pages/MyAdvertisements.tsx` - Advertiser management

### Documentation
- `LOCATION_BASED_ADVERTISING_GUIDE.md` - Complete guide

## Example Use Cases

### Local Racing Parts Shop
```
Location: Sacramento, CA
Reach: Local (100 miles)
Result: Only racers near Sacramento see your ad
```

### Regional Track
```
Location: Charlotte, NC
Reach: Regional (250 miles)
Result: Racers in NC, SC, VA, TN, GA see your ad
```

### National Equipment Brand
```
Location: Indianapolis, IN
Reach: National
Result: All users nationwide see your ad
```

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Create test advertisement
- [ ] Visit home page and see ad
- [ ] Click "Visit Website" button (checks tracking)
- [ ] Wait 15 seconds (checks rotation)
- [ ] Edit advertisement
- [ ] View impression/click stats
- [ ] Delete test advertisement

## Pricing Ideas

Consider these pricing tiers:
- **Local** (50 mi): $25/month
- **Regional** (200 mi): $50/month
- **National**: $100/month

## Next Steps

1. Run the migration SQL
2. Create a test ad
3. See it on the home page
4. Add ads to other pages if desired
5. Consider adding payment integration
6. Set advertising guidelines

## Need Help?

See `LOCATION_BASED_ADVERTISING_GUIDE.md` for complete documentation.
