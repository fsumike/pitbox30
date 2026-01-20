# Fix App Store Connect Permission Issue

## What Was Fixed

Apple rejected the build because the `Info.plist` was missing required permission strings:
- ✅ **FIXED**: `NSPhotoLibraryUsageDescription` (REQUIRED)
- ✅ **FIXED**: `NSLocationWhenInUseUsageDescription` (WARNING)
- ✅ **ADDED**: All other permission strings from capacitor.config.ts

## Changes Made

1. **Updated Bundle ID**: Changed from `com.pitbox.racing` to `com.pitbox.app`
2. **Added All Permissions**: Directly added all permission strings to `ios/App/App/Info.plist`
3. **Fixed Deploy Script**: Removed deprecated `--private-key-path` parameter from Capawesome CLI

## What You Need to Do Now

### Step 1: Verify the Info.plist
The file `ios/App/App/Info.plist` now contains all required permissions. You can check it to make sure all the descriptions make sense for your app.

### Step 2: Rebuild and Deploy

On your local machine (where you're logged into Capawesome), run:

```bash
# Make sure you're logged in
npm run capawesome:login

# Deploy the updated bundle
npm run deploy:bundle

# Build iOS with Capawesome
npm run capawesome:build:ios
```

### Step 3: Upload to App Store Connect

1. Wait for Capawesome to complete the iOS build
2. Download the `.ipa` file from Capawesome dashboard
3. Upload to App Store Connect using:
   - **Transporter app** (Mac)
   - **Xcode Organizer**
   - **Capawesome auto-submit** (if enabled)

### Step 4: Select Correct Bundle ID

When submitting to App Store Connect, make sure you select:
- **PIT-BOX Racing app - com.pitbox.app** ✅

(NOT "PitBox Racing setup app - com.pitbox.racing")

## Expected Result

Apple should now accept the build because:
- ✅ All required permission strings are present
- ✅ Bundle ID matches App Store Connect (`com.pitbox.app`)
- ✅ Permission descriptions clearly explain why each permission is needed

## If You Still Get Errors

If Apple still rejects for missing permissions:
1. Check that Capawesome is building with the latest code
2. Verify the bundle version number is incrementing
3. Make sure you're uploading the correct `.ipa` file

---

**The iOS project is now ready for a successful App Store submission!** 🎉
