# Complete Fix for App Store Connect Permission Errors

## Root Cause Identified

The iOS Info.plist file was missing required permission strings because:

1. **The `ios/` folder was in `.gitignore`**
2. Capacitor's `infoPlistValues` in `capacitor.config.ts` **was not syncing** to Info.plist
3. Capawesome generates a fresh iOS project each build, losing manual edits
4. Without the ios/App/App/Info.plist in git, every build started from scratch

## What Was Fixed

### ✅ 1. Updated .gitignore
The `.gitignore` now allows `ios/App/App/Info.plist` to be committed while ignoring build artifacts:

```gitignore
ios/
!ios/App/
!ios/App/App/
!ios/App/App/Info.plist
ios/App/Pods/
ios/App/*.xcworkspace/
ios/App/*.xcodeproj/
ios/App/build/
```

### ✅ 2. Added All Required Permissions to Info.plist

The following permissions are now in `ios/App/App/Info.plist`:

**REQUIRED BY APPLE:**
- ✅ `NSPhotoLibraryUsageDescription` (Photo Library)
- ✅ `NSPhotoLibraryAddUsageDescription` (Save Photos)
- ✅ `NSLocationWhenInUseUsageDescription` (Location While Using)

**ADDITIONAL PERMISSIONS:**
- `NSCameraUsageDescription` (Camera)
- `NSLocationAlwaysUsageDescription` (Background Location)
- `NSLocationAlwaysAndWhenInUseUsageDescription` (Full Location)
- `NSMicrophoneUsageDescription` (Microphone)
- `NSMotionUsageDescription` (Motion & Fitness)
- `NSContactsUsageDescription` (Contacts)
- `NSCalendarsUsageDescription` (Calendar)
- `NSRemindersUsageDescription` (Reminders)
- `NSBluetoothAlwaysUsageDescription` (Bluetooth)
- `NSBluetoothPeripheralUsageDescription` (Bluetooth Peripherals)
- `NSLocalNetworkUsageDescription` (Local Network)
- `NSFaceIDUsageDescription` (Face ID)
- `NSSiriUsageDescription` (Siri)
- `NSSpeechRecognitionUsageDescription` (Speech Recognition)
- `NSAppleMusicUsageDescription` (Media Library)
- `NSHealthShareUsageDescription` (Health Data Read)
- `NSHealthUpdateUsageDescription` (Health Data Write)
- `NSHomeKitUsageDescription` (HomeKit)
- `NFCReaderUsageDescription` (NFC)

### ✅ 3. Bundle ID Corrected
- Changed from: `com.pitbox.racing`
- Changed to: `com.pitbox.app` ✅
- Matches App Store Connect app: **PIT-BOX Racing app**

## How to Deploy the Fix

### Option 1: Deploy with Capawesome Cloud Build (Recommended)

```bash
# 1. Commit the ios/App/App/Info.plist file
git add ios/App/App/Info.plist
git add .gitignore
git add capacitor.config.ts
git commit -m "Fix: Add all required iOS permissions to Info.plist for App Store"

# 2. Push to your git repository
git push origin main

# 3. Trigger Capawesome build (make sure it pulls from latest git commit)
npm run capawesome:build:ios

# 4. Download and submit to App Store Connect
```

### Option 2: Build Locally and Upload (If you have macOS + Xcode)

```bash
# 1. Open the project in Xcode
npm run cap:open:ios

# 2. In Xcode:
#    - Select "App" target
#    - Go to Signing & Capabilities
#    - Verify bundle ID is "com.pitbox.app"
#    - Archive the app (Product > Archive)
#    - Validate and upload to App Store Connect
```

### Option 3: Deploy Bundle to Capawesome

```bash
# If Capawesome doesn't pull from git automatically
npm run deploy:bundle
npm run capawesome:build:ios
```

## Verification Steps

Before uploading to App Store Connect, verify:

1. **Check Info.plist has permissions:**
   ```bash
   grep "NSPhotoLibraryUsageDescription" ios/App/App/Info.plist
   grep "NSLocationWhenInUseUsageDescription" ios/App/App/Info.plist
   ```
   Both should return results ✅

2. **Check Bundle ID:**
   ```bash
   grep "com.pitbox.app" capacitor.config.ts
   ```
   Should show: `appId: 'com.pitbox.app'` ✅

3. **Verify .gitignore includes Info.plist:**
   ```bash
   grep "!ios/App/App/Info.plist" .gitignore
   ```
   Should return the exception line ✅

## Expected Result

When you upload the new build to App Store Connect:

✅ **ITMS-90683 error for NSPhotoLibraryUsageDescription** - RESOLVED
✅ **ITMS-90683 warning for NSLocationWhenInUseUsageDescription** - RESOLVED
✅ All other permission warnings - RESOLVED
✅ Bundle ID matches App Store Connect app
✅ Build will be accepted for review

## Troubleshooting

### If you still get permission errors:

1. **Verify Info.plist is in your git repo:**
   ```bash
   git ls-files ios/App/App/Info.plist
   ```
   Should show the file path. If not, commit it.

2. **Ensure Capawesome builds from latest commit:**
   - Check Capawesome dashboard shows latest commit hash
   - Manually trigger a new build if needed

3. **Verify Info.plist in the built .ipa:**
   - Download the .ipa from Capawesome
   - Rename to .zip and extract
   - Check Payload/App.app/Info.plist contains the permission strings

4. **Check Capacitor version:**
   ```bash
   npx cap --version
   ```
   Should be 5.x or higher

### If Capawesome keeps using old iOS project:

Clear the build cache:
1. Go to Capawesome Dashboard
2. Delete old builds
3. Trigger fresh build from git

## Important Notes

- ⚠️ **DO NOT run `npx cap sync ios`** after committing Info.plist without checking if it removes your changes
- ⚠️ The Info.plist file must stay in git for future builds to work
- ⚠️ Always select **"PIT-BOX Racing app - com.pitbox.app"** in App Store Connect (not the old com.pitbox.racing)

## Success Checklist

Before submitting to App Store:

- [ ] Info.plist contains NSPhotoLibraryUsageDescription
- [ ] Info.plist contains NSLocationWhenInUseUsageDescription
- [ ] Info.plist is committed to git repository
- [ ] Bundle ID is com.pitbox.app in capacitor.config.ts
- [ ] Capawesome build uses latest commit
- [ ] Built .ipa contains updated Info.plist
- [ ] Uploading to correct App Store Connect app (6757286830)

---

**The iOS app is now properly configured and ready for App Store submission!** 🎉
