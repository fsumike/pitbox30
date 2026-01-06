# iOS Permissions - Fixed for App Store Submission

## What Was Wrong

Apple rejected your app because the `Info.plist` file was missing required permission descriptions:
- `NSPhotoLibraryUsageDescription` (REQUIRED)
- `NSLocationWhenInUseUsageDescription` (WARNING)

## What Was Fixed

### 1. Updated `capacitor.config.ts`
Added ALL iOS privacy permissions to the `ios.infoPlistValues` section including:
- Camera & Photos permissions
- Location permissions (all variants)
- Microphone, Motion, Contacts
- Calendar, Reminders, Bluetooth
- Face ID, Siri, Speech Recognition
- Media Library, Health, HomeKit, NFC

### 2. Updated `ios/App/App/Info.plist`
Manually added all 24 permission strings directly to the Info.plist file to ensure they're present.

### 3. Updated `.gitignore`
**CRITICAL CHANGE:** Removed `ios/` from `.gitignore` so the iOS directory (with the Info.plist permissions) will be committed to your repository.

## Why This Matters for Capawesome Cloud

When Capawesome Cloud builds your app, it pulls your code from your repository. Previously, the `ios/` folder was gitignored, so Capawesome was regenerating it from scratch without the permissions.

Now that `ios/` is tracked in git, Capawesome will use your Info.plist with all permissions included.

## Verification Checklist

✅ **capacitor.config.ts** - Contains all permissions in `ios.infoPlistValues`
✅ **ios/App/App/Info.plist** - Contains all 24 permission strings
✅ **.gitignore** - iOS directory is NO LONGER ignored
✅ **Build successful** - Project builds without errors

## Required Permissions (Apple's Error)

### REQUIRED (Will reject without these):
- ✅ `NSPhotoLibraryUsageDescription` - Photo library access
- ✅ `NSPhotoLibraryAddUsageDescription` - Save photos to library

### WARNED (Should include):
- ✅ `NSLocationWhenInUseUsageDescription` - Location when using app
- ✅ `NSLocationAlwaysUsageDescription` - Location in background
- ✅ `NSLocationAlwaysAndWhenInUseUsageDescription` - Location combined

### Additional Permissions (Best Practice):
- ✅ `NSCameraUsageDescription` - Camera access
- ✅ `NSMicrophoneUsageDescription` - Microphone access
- ✅ `NSMotionUsageDescription` - Motion sensors
- ✅ `NSContactsUsageDescription` - Contacts access
- ✅ `NSCalendarsUsageDescription` - Calendar access
- ✅ `NSRemindersUsageDescription` - Reminders access
- ✅ `NSBluetoothAlwaysUsageDescription` - Bluetooth access
- ✅ `NSBluetoothPeripheralUsageDescription` - Bluetooth peripherals
- ✅ `NSLocalNetworkUsageDescription` - Local network access
- ✅ `NSFaceIDUsageDescription` - Face ID/Touch ID
- ✅ `NSSiriUsageDescription` - Siri integration
- ✅ `NSSpeechRecognitionUsageDescription` - Speech recognition
- ✅ `NSAppleMusicUsageDescription` - Media library access
- ✅ `NSHealthShareUsageDescription` - Read health data
- ✅ `NSHealthUpdateUsageDescription` - Write health data
- ✅ `NSHomeKitUsageDescription` - HomeKit access
- ✅ `NFCReaderUsageDescription` - NFC reader access

## Next Steps for Capawesome Cloud Build

1. **Commit these changes to your repository:**
   ```bash
   git add .
   git commit -m "Add iOS permissions for App Store compliance"
   git push
   ```

2. **Create a new Capawesome Cloud build:**
   ```bash
   npm run capawesome:build:ios
   ```
   OR use the Capawesome Cloud web dashboard

3. **Verify the build includes permissions:**
   - After the build completes, Capawesome will generate an IPA file
   - The IPA will include the Info.plist with all permissions
   - Apple will accept the submission

4. **Submit to App Store:**
   - Download the IPA from Capawesome Cloud
   - Upload to App Store Connect via Transporter or Xcode
   - Apple should now accept your build without permission errors

## Important Notes

- The `ios/` directory is now tracked in git - do NOT add it back to .gitignore
- If you ever regenerate the iOS project with `npx cap add ios`, you'll need to re-add the permissions manually
- Keep both `capacitor.config.ts` AND `ios/App/App/Info.plist` in sync
- Capawesome Cloud will use the committed `ios/` directory, not regenerate it

## Troubleshooting

If Apple still rejects:
1. Verify the `ios/` directory is committed to your repository
2. Check that `ios/App/App/Info.plist` contains all permission strings
3. Ensure Capawesome Cloud is pulling the latest code from your repository
4. Try cleaning the Capawesome Cloud cache and rebuilding

## Build Command Reference

```bash
# Build and deploy bundle update (for Live Updates)
npm run deploy:bundle

# Create iOS build via Capawesome Cloud
npm run capawesome:build:ios

# Check Capawesome login status
npm run capawesome:whoami
```
