# iOS Location Permission Setup for App Store

## Overview
The PitBox app uses location services for the **Distance Filter** feature in the Swap Meet marketplace. This allows users to find parts and equipment near them.

## App Store Compliance ✅

### 1. Optional Location Access
- ✅ Location is **NOT** requested automatically
- ✅ Only requested when user explicitly clicks "Use My Location" button
- ✅ App works fully without location permission (shows all listings)
- ✅ Alternative method provided: Manual ZIP code entry (no permission needed)

### 2. User Control
- ✅ Clear toggle to enable/disable distance filter
- ✅ "Clear Filter" button to remove location-based filtering
- ✅ User can clear location at any time
- ✅ No background location access

### 3. Transparency
- ✅ Privacy notice displayed: "Your location is only used to filter listings and is not stored"
- ✅ Shield icon with clear explanation
- ✅ Purpose clearly stated: "Find parts near you"

### 4. Data Handling
- ✅ Location used only for real-time filtering
- ✅ NOT stored in database
- ✅ NOT sent to server (except for query filtering)
- ✅ NOT tracked or logged
- ✅ No location data in analytics

## Required iOS Setup

### Step 1: Add Capacitor iOS Platform

```bash
npm run cap:add:ios
```

### Step 2: Add Location Permission Keys to Info.plist

When you run `cap add ios`, you'll need to add these keys to `ios/App/App/Info.plist`:

```xml
<!-- Location Permission Descriptions -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>PitBox uses your location to show you racing parts and equipment for sale near you in the Swap Meet marketplace. Your location is only used to filter listings and is never stored or tracked.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>PitBox uses your location to show you racing parts and equipment for sale near you in the Swap Meet marketplace. Your location is only used to filter listings and is never stored or tracked.</string>
```

**IMPORTANT:** We only use `WhenInUse` permission - NOT background location!

### Step 3: Verify Capacitor Geolocation Plugin

The plugin should already be installed in `package.json`:
```json
"@capacitor/geolocation": "^5.0.7"
```

## Permission Flow

### User Journey:
1. User opens Swap Meet page
2. User clicks "More Filters"
3. User toggles on "Distance Filter"
4. User clicks "Use My Location" button
5. **iOS shows permission dialog** with our custom message
6. User grants or denies permission

### If Permission Granted:
- Location detected
- Distance range buttons appear
- User selects range (e.g., 100 miles)
- Listings filter automatically
- Distance shown on each listing card

### If Permission Denied:
- Error message: "Please allow location access to use this feature"
- User can still use manual ZIP code entry
- No permission needed for ZIP code method

## App Store Review Notes

### What to tell Apple:
**Feature Description:**
"Optional location-based filtering in our marketplace. Users can find racing parts near them by allowing location access OR by entering their ZIP code manually. Location is only used for real-time filtering and is never stored."

**Permission Usage:**
- Purpose: "Show nearby marketplace listings"
- Type: "When In Use" only
- User can opt-out: Yes (toggle off or use ZIP code)
- Works without permission: Yes (shows all listings)
- Background location: NO
- Always permission: NO

### App Privacy Details (App Store Connect):

**Location:**
- ✅ Coarse Location
- Usage: "App Functionality"
- Purpose: "Product personalization"
- Linked to user: NO
- Used for tracking: NO

## Testing Checklist

Before App Store submission:

- [ ] Location permission dialog shows our custom message
- [ ] Permission only requested when user clicks button
- [ ] App works without granting permission
- [ ] ZIP code entry works without permission
- [ ] Location not requested in background
- [ ] Location not stored in database
- [ ] Privacy notice visible to users
- [ ] Clear filter removes location
- [ ] No location tracking or analytics

## Privacy Policy Requirements

Your privacy policy must state:

1. **What we collect:** Approximate location (city/state level)
2. **Why we collect it:** To filter marketplace listings by distance
3. **How we use it:** Only for real-time filtering, never stored
4. **User control:** Optional feature, can be disabled anytime
5. **No background tracking:** Only when actively using distance filter

## Important Notes

⚠️ **DO NOT:**
- Request `NSLocationAlwaysUsageDescription` (background location)
- Track user location
- Store location in database
- Use location for analytics
- Request location on app launch
- Use location for ads

✅ **DO:**
- Make it optional
- Provide alternative (ZIP code)
- Show clear purpose
- Give user control
- Only use when actively filtering

## Code Implementation Status

✅ **Fully Implemented:**
- Optional location access with `autoFetch: false`
- Manual ZIP code entry
- Clear privacy messaging
- User control and clear button
- No background location
- No data storage
- Graceful permission denial handling
- Works on iOS via Capacitor Geolocation

## References

- [Apple Location Permission Guidelines](https://developer.apple.com/documentation/corelocation/requesting_authorization_to_use_location_services)
- [Capacitor Geolocation Plugin](https://capacitorjs.com/docs/apis/geolocation)
- [App Store Review Guidelines - Location](https://developer.apple.com/app-store/review/guidelines/#location-services)
