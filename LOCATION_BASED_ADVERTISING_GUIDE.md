# Location-Based Advertising System

A complete location-based advertising system that allows businesses to advertise within specific geographic areas (local, regional, or national).

## Features

- **Location-Based Targeting**: Ads display to users based on their geographic location
- **Three Reach Types**:
  - **Local**: 50-mile radius (customizable)
  - **Regional**: 200-mile radius (customizable)
  - **National**: Displays everywhere in the US
- **Smart Ad Rotation**: Automatically rotates through multiple ads
- **Performance Tracking**: Tracks impressions (views) and clicks
- **Category Filtering**: Parts, Services, Tracks, Equipment, Other
- **Full Management Interface**: Create, edit, delete, and monitor ad performance

## Setup Instructions

### 1. Apply Database Migration

Run the SQL in `APPLY_THIS_MIGRATION.sql` in your Supabase SQL Editor. This creates:
- `advertisements` table with all necessary fields
- Row Level Security policies for safe data access
- Helper functions for distance calculations and ad fetching
- Performance indexes for fast queries

### 2. How It Works

**For Users:**
- Ads automatically display based on their current location
- Closer ads are prioritized
- National ads appear for all users
- Ads rotate every 15 seconds by default
- Users can close individual ads

**For Advertisers:**
- Navigate to `/my-advertisements` to manage ads
- Create ads with business info, images, and contact details
- Set location (latitude/longitude) and reach type
- Choose from three reach options:
  - Local (50 mi) - Perfect for local shops
  - Regional (200 mi) - Great for regional suppliers
  - National - For nationwide businesses
- Track views and clicks in real-time
- Set start/end dates for campaigns
- Turn ads on/off anytime

## Ad Display Locations

Currently, location-based ads display on:
- **Home Page** (after GeoSponsors section)

You can add them to other pages by importing and using:
```tsx
import LocationBasedAds from '../components/LocationBasedAds';

<LocationBasedAds
  maxAds={5}
  autoRotate={true}
  rotateInterval={15000}
/>
```

## Creating Your First Advertisement

1. Sign in to your account
2. Navigate to `/my-advertisements`
3. Click "Create Advertisement"
4. Fill in your business details:
   - Business Name
   - Ad Title
   - Description
   - Image URL (optional)
   - Website URL
   - Phone Number
   - Category
5. Set your location (latitude/longitude)
   - Use Google Maps to find your coordinates
   - Right-click on your location → "What's here?"
6. Choose your reach type:
   - Local (50 miles)
   - Regional (200 miles)
   - National (everywhere)
7. Customize radius if needed (for local/regional)
8. Set campaign dates (optional)
9. Click "Create Advertisement"

## Managing Advertisements

### View Your Ads
- All your ads are listed on the `/my-advertisements` page
- See impressions (views) and clicks for each ad
- View reach type and radius

### Edit Ads
- Click "Edit" on any ad
- Update any field
- Changes take effect immediately

### Pause/Resume Ads
- Toggle "Active" checkbox to pause/resume
- Paused ads don't show to users
- No impressions or clicks while paused

### Delete Ads
- Click "Delete" and confirm
- Permanently removes the ad

## How Location Targeting Works

The system uses the Haversine formula to calculate distances between the user's location and your business location:

1. User's location is detected automatically
2. System queries all active ads
3. Calculates distance from user to each ad location
4. Filters ads based on reach type and radius
5. Returns up to 10 ads, prioritizing closer ones
6. National ads always included

### Example Scenarios

**Scenario 1: Local Parts Shop in Northern California**
- Business Location: Sacramento, CA
- Reach Type: Local
- Radius: 100 miles
- Result: Only users within 100 miles of Sacramento see this ad

**Scenario 2: Regional Racing Service**
- Business Location: Charlotte, NC
- Reach Type: Regional
- Radius: 250 miles
- Result: Users in NC, SC, VA, TN, and GA see this ad

**Scenario 3: National Equipment Supplier**
- Business Location: Indianapolis, IN
- Reach Type: National
- Result: All users everywhere see this ad

## Pricing Recommendations

Since this is location-based, you might want to implement pricing tiers:
- **Local**: $25/month
- **Regional**: $50/month
- **National**: $100/month

This encourages local businesses while allowing national brands to participate.

## Performance Metrics

Each ad tracks:
- **Impressions**: Number of times ad was displayed
- **Clicks**: Number of times users clicked website/phone buttons
- **CTR (Click-Through Rate)**: Clicks ÷ Impressions × 100

Use these metrics to:
- Measure ad effectiveness
- Optimize ad content
- Justify advertising costs
- Improve targeting

## Best Practices

### For Advertisers
1. Use high-quality images (recommended: 800x600px)
2. Write clear, compelling titles
3. Include contact methods (website AND phone)
4. Set accurate business location
5. Choose appropriate reach type
6. Monitor performance regularly
7. Update ads seasonally

### For Platform
1. Review ads before activation (consider approval workflow)
2. Set content guidelines
3. Monitor for inappropriate content
4. Consider featured ad placements
5. Implement payment integration
6. Add email notifications for advertisers

## Future Enhancements

Consider adding:
- Ad approval workflow
- Payment processing integration
- Multiple ad placements per advertiser
- A/B testing for ad content
- Geographic heat maps
- Competitor analysis
- Scheduled campaigns
- Budget caps
- Featured/promoted ad slots
- Mobile app push notifications for nearby deals

## Technical Details

### Database Schema
- Table: `advertisements`
- Indexes on: location, advertiser, active status
- RLS policies for security
- Functions for distance calculation and ad fetching

### API Endpoints
- `get_nearby_advertisements(lat, lon, max_results)`: Fetch ads for user location
- `increment_ad_impressions(ad_id)`: Track view
- `increment_ad_clicks(ad_id)`: Track click

### Frontend Components
- `LocationBasedAds`: Display component with rotation
- `MyAdvertisements`: Management page for advertisers
- `useAdvertisements`: Hook for fetching ads
- `useUserAdvertisements`: Hook for managing ads

## Support

For issues or questions:
1. Check this guide first
2. Review SQL migration file
3. Inspect browser console for errors
4. Verify location permissions granted
5. Confirm database migration applied correctly
