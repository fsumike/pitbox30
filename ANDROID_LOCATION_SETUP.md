# Android Location Permission Setup for Google Play Store

## Overview
The PitBox app uses location services for the **Distance Filter** feature in the Swap Meet marketplace. This allows users to find racing parts and equipment near them.

## Google Play Store Compliance ✅

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
- ✅ No persistent location tracking

### 3. Transparency
- ✅ Privacy notice displayed: "Your location is only used to filter listings and is not stored"
- ✅ Shield icon with clear explanation
- ✅ Purpose clearly stated: "Find parts near you"

### 4. Data Handling
- ✅ Location used only for real-time filtering
- ✅ NOT stored in database
- ✅ NOT sent to third parties
- ✅ NOT tracked or logged
- ✅ No location data in analytics

## Required Android Setup

### Step 1: Add Capacitor Android Platform

```bash
npm run cap:add:android
```

### Step 2: Android Manifest Permissions

When you run `cap add android`, the Capacitor Geolocation plugin will automatically add the required permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Fine location for precise location (GPS) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Coarse location for approximate location (Network-based) -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

**IMPORTANT:** We only use foreground location - NOT background!

### Step 3: Runtime Permission Handling

The Capacitor Geolocation plugin handles Android runtime permissions automatically:
- Requests permission when `getCurrentPosition()` is called
- Shows Android system permission dialog
- Handles user acceptance/denial gracefully

**No additional code needed** - it's already implemented in `useLocation` hook!

## Android Permission Flow

### Android 6.0+ (API 23+)

1. User clicks "Use My Location" button
2. Android shows permission dialog:
   ```
   Allow PitBox to access this device's location?

   [ ] While using the app
   [X] Only this time
   [ ] Don't allow
   ```
3. User grants or denies permission

### Android 10+ (API 29+)

Additional privacy features:
- "Only this time" option (single-use permission)
- Background location requires separate permission (we don't use this)
- Location permission grouped with other sensitive permissions

### Android 12+ (API 31+)

Granular location permissions:
- **Approximate location** - City-level accuracy
- **Precise location** - GPS-level accuracy

Users can choose which level to grant. Both work with our distance filter!

## Permission Request Rationale

### Best Practice: Show Explanation First

Before requesting permission, we show a privacy notice:
```
"Your location is only used to filter listings and is not stored.
This helps you find parts near you."
```

This follows Google's guidelines for explaining why permission is needed.

## Google Play Store Data Safety Section

### Required Declarations:

**Location Data:**
- **Data Type:** Approximate location and/or Precise location
- **Why:** App functionality (filtering marketplace listings)
- **Collection:** Yes (temporarily, not stored)
- **Sharing:** No
- **Optional:** Yes (user can use ZIP code instead)
- **Ephemeral:** Yes (only used during active session)

**Data Safety Form Answers:**
```
Does your app collect or share user data?
→ YES (Location for filtering)

Is data collection optional?
→ YES (ZIP code alternative available)

Is the data encrypted in transit?
→ YES (HTTPS)

Can users request data deletion?
→ N/A (Not stored - used only in real-time)

Data types collected:
→ Location > Approximate location
→ Location > Precise location

Purpose:
→ App functionality

Is this data collected?
→ Yes

Is this data shared with third parties?
→ No

Is this data processed ephemerally?
→ Yes (only during active use, not persisted)
```

## Android-Specific Features

### 1. Location Accuracy

Android supports both:
- **Fine location** (GPS, ~5-50m accuracy)
- **Coarse location** (Network, ~100-1000m accuracy)

Our app requests fine location but works with coarse too!

### 2. Permission Rationale Dialog

If user denies permission once, Android recommends showing explanation:
```typescript
// Already handled in useLocation hook
case error.PERMISSION_DENIED:
  message = 'Please allow location access to use this feature';
```

### 3. Background Location

**We DO NOT use background location!**
- No `ACCESS_BACKGROUND_LOCATION` permission
- Only foreground access while app is open
- Location stops when user leaves the page

## Testing on Android

### Test Scenarios:

1. **Grant Permission:**
   - User clicks "Use My Location"
   - Android shows permission dialog
   - User taps "While using the app" or "Only this time"
   - Location detected successfully
   - Distance filter works

2. **Deny Permission:**
   - User clicks "Use My Location"
   - User taps "Don't allow"
   - Error message shown: "Please allow location access to use this feature"
   - ZIP code entry still available
   - App continues to work

3. **Revoke Permission:**
   - Go to Settings > Apps > PitBox > Permissions
   - Toggle Location OFF
   - Try to use distance filter
   - Shows permission denied message
   - ZIP code entry works

4. **Approximate vs Precise:**
   - On Android 12+, user can choose accuracy level
   - Both work with our distance calculations
   - Approximate location: City-level (~1-5km accuracy)
   - Precise location: GPS-level (~5-50m accuracy)

## Google Play Store Review Checklist

Before submitting:

- [ ] Manifest permissions added (auto by Capacitor)
- [ ] Location only requested when user action triggers it
- [ ] App works without granting permission
- [ ] Privacy notice visible to users
- [ ] Alternative (ZIP code) available
- [ ] No background location tracking
- [ ] Data Safety form completed in Play Console
- [ ] Privacy Policy updated (if needed)

## Common Android Issues & Solutions

### Issue 1: Permission Denied Automatically
**Problem:** Android denies permission without showing dialog

**Solution:** User may have previously denied with "Don't ask again"
- Direct user to app settings: Settings > Apps > PitBox > Permissions
- Or provide helpful message with intent to open settings

### Issue 2: Location Not Accurate
**Problem:** Shows wrong city or coordinates

**Solutions:**
- User granted "Approximate" instead of "Precise" - still works for distance filtering
- Device GPS may be disabled - prompt user to enable
- User is indoors - GPS signal weak, network location used

### Issue 3: Timeout Errors
**Problem:** Location request times out

**Solutions:**
- Increase timeout in hook (currently 10 seconds)
- User may be in area with poor GPS/network signal
- Suggest using ZIP code entry instead

## Capacitor Geolocation Plugin

### Auto-Configuration

The `@capacitor/geolocation` plugin automatically:
- ✅ Adds required permissions to AndroidManifest.xml
- ✅ Handles runtime permission requests
- ✅ Provides unified API for iOS and Android
- ✅ Supports both fine and coarse location
- ✅ Handles errors gracefully

### Version Used
```json
"@capacitor/geolocation": "^5.0.7"
```

This version supports:
- Android 5.0+ (API 21+)
- Android 12+ granular permissions
- Android 13+ permission updates

## Code Implementation Status

✅ **Fully Android-Compatible:**
- Capacitor Geolocation plugin used (cross-platform)
- Runtime permission handling built-in
- Works with both fine and coarse location
- Graceful degradation on permission denial
- ZIP code fallback (no permission needed)
- No background location usage
- Foreground-only location access

## Privacy Policy Requirements

Your privacy policy must state:

1. **What we collect:** Approximate or precise location
2. **Why we collect it:** To filter marketplace listings by distance
3. **How we use it:** Only for real-time filtering while using distance filter
4. **How long we keep it:** Not stored - used only during active session
5. **User control:** Optional feature, can be disabled anytime
6. **No third-party sharing:** Location not shared with anyone
7. **Android-specific:** May request precise or approximate location

## Important Notes

⚠️ **DO NOT:**
- Request `ACCESS_BACKGROUND_LOCATION` permission
- Track user location continuously
- Store location in database or analytics
- Use location for ads or marketing
- Request location on app startup
- Use location without user action

✅ **DO:**
- Make it optional
- Provide ZIP code alternative
- Show clear purpose
- Give user control
- Only use when actively filtering
- Support both precise and approximate location

## Google Play Policy Compliance

### Location Permissions Policy

✅ **Our Implementation Meets All Requirements:**

1. **Prominent Disclosure:**
   - Privacy notice shown before requesting permission
   - Clear explanation of purpose

2. **Runtime Permissions:**
   - Only requested when user triggers feature
   - Not requested on app startup

3. **User Expectation:**
   - Purpose is clear: "Find parts near you"
   - Directly related to visible feature

4. **Background Location:**
   - Not requested (N/A)
   - Not used

5. **Data Handling:**
   - Used only for stated purpose
   - Not shared with third parties
   - Ephemeral (not persisted)

## Testing Commands

### Build Android App:
```bash
npm run build:mobile
npm run cap:open:android
```

### Test on Emulator:
1. Open Android Studio
2. Start AVD (Android Virtual Device)
3. Run app from Android Studio
4. Go to Swap Meet > More Filters > Distance Filter
5. Test permission flow

### Test on Physical Device:
1. Enable USB Debugging on device
2. Connect via USB
3. Run from Android Studio
4. Test with actual GPS

## References

- [Android Location Permissions](https://developer.android.com/training/location/permissions)
- [Google Play Location Policy](https://support.google.com/googleplay/android-developer/answer/9799150)
- [Capacitor Geolocation Plugin](https://capacitorjs.com/docs/apis/geolocation)
- [Android 12+ Location](https://developer.android.com/about/versions/12/behavior-changes-12#approximate-location)
