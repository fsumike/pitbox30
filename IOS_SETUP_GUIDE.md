# iOS Setup & Build Guide for PitBox

## ✅ Step 1: Install Required Tools (Mac Only)

### 1.1 Install Xcode
```bash
# Download from Mac App Store (it's free, ~12GB)
# Or visit: https://developer.apple.com/xcode/

# After installation, accept the license:
sudo xcodebuild -license accept

# Install command line tools:
sudo xcode-select --install
```

### 1.2 Install CocoaPods
```bash
# Using Ruby (built into macOS):
sudo gem install cocoapods

# Or using Homebrew:
brew install cocoapods

# Verify installation:
pod --version
```

---

## ✅ Step 2: Initial Project Setup (Already Done)

The iOS platform has been added to your project. These files are ready:
- `ios/` folder created
- Capacitor configured
- Web assets built and synced

---

## Step 3: Install iOS Dependencies

```bash
cd /tmp/cc-agent/41299875/project/ios/App

# Install CocoaPods dependencies:
pod install

# This will create App.xcworkspace
```

**Important:** Always open `App.xcworkspace`, NOT `App.xcodeproj`

---

## Step 4: Open in Xcode

```bash
cd /tmp/cc-agent/41299875/project

# Open the workspace:
npm run cap:open:ios

# Or manually:
open ios/App/App.xcworkspace
```

---

## Step 5: Configure App in Xcode

### 5.1 Set Your Team
1. Select **App** in the project navigator (left sidebar)
2. Select **App** target (under TARGETS)
3. Go to **Signing & Capabilities** tab
4. Select your **Team** from dropdown
   - Sign in with Apple ID if needed
   - Free accounts work for testing
   - Paid Developer account ($99/year) needed for App Store

### 5.2 Update Bundle Identifier
1. Still in **Signing & Capabilities**
2. Change **Bundle Identifier** to something unique:
   - Example: `com.yourcompany.pitbox`
   - Must be unique across all apps
   - Reverse domain notation

### 5.3 Update App Info
1. Click **App** target → **General** tab
2. Set **Display Name**: `PitBox`
3. Set **Version**: `1.0.0`
4. Set **Build**: `1`
5. Set **Deployment Target**: `iOS 13.0` or higher

---

## Step 6: Add Required Permissions

Your app uses location, camera, and push notifications. Add these to `Info.plist`:

1. Select `App/App/Info.plist`
2. Add these keys (or verify they exist):

```xml
<key>NSCameraUsageDescription</key>
<string>PitBox needs camera access to capture dyno sheets, track conditions, and share race day moments.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>PitBox needs photo library access to save and share your racing photos.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>PitBox uses your location to find nearby tracks and tag your setups with track data.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>PitBox uses your location to automatically detect when you arrive at a track.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>PitBox uses your location to find tracks and auto-tag setups.</string>
```

Or use the visual editor:
1. Right-click in Info.plist
2. Select **Add Row**
3. Choose the permission keys from dropdown
4. Add the descriptions

---

## Step 7: Build & Run

### 7.1 Using Xcode
1. Select a target device:
   - Use **Simulator** for testing (free)
   - Use **Your iPhone** for real device testing (requires USB cable)
2. Click the **Play** button (▶️) or press `Cmd+R`
3. Wait for build to complete

### 7.2 Using Command Line
```bash
# Build for simulator:
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -configuration Debug \
           -destination 'platform=iOS Simulator,name=iPhone 15' \
           build

# Build for device (requires signing):
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -configuration Release \
           archive
```

---

## Step 8: Test on Real Device

### First Time Setup:
1. Connect iPhone via USB
2. Trust your Mac on iPhone
3. In Xcode: Window → Devices and Simulators
4. Select your device
5. Click **Use for Development**

### Building to Device:
1. Select your iPhone from device list (top of Xcode)
2. Click Run (▶️)
3. On your iPhone:
   - Settings → General → VPN & Device Management
   - Trust your developer certificate

---

## Step 9: Prepare for App Store

### 9.1 Create App Store Connect Listing
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: PitBox
   - Primary Language: English
   - Bundle ID: (select your bundle ID)
   - SKU: `pitbox-ios`

### 9.2 Create App Icons
You need icons in these sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone)
- 87x87 (iPhone notifications)
- 80x80 (iPad)
- 76x76 (iPad)
- 60x60 (iPhone)
- 58x58 (iPhone notifications)
- 40x40 (Spotlight)
- 29x29 (Settings)
- 20x20 (Notifications)

Place them in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### 9.3 Create Screenshots
Required sizes:
- **iPhone 6.7"** (1290 x 2796) - iPhone 15 Pro Max
- **iPhone 6.5"** (1284 x 2778) - iPhone 14 Pro Max
- **iPhone 5.5"** (1242 x 2208) - iPhone 8 Plus
- **iPad Pro 12.9"** (2048 x 2732)

You need 3-10 screenshots per size.

### 9.4 Build Release Version
```bash
# In Xcode:
1. Select "Any iOS Device" as target
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens
5. Click "Distribute App"
6. Select "App Store Connect"
7. Upload
```

### 9.5 TestFlight (Beta Testing)
1. After upload, go to App Store Connect
2. Click **TestFlight** tab
3. Add internal testers (up to 100)
4. Add external testers (requires App Review)
5. Share TestFlight link

---

## Common Issues & Solutions

### Issue: "No Matching Provisioning Profiles Found"
**Solution:**
1. Xcode → Settings → Accounts
2. Select your Apple ID
3. Click "Download Manual Profiles"
4. Or: Select "Automatically manage signing" in Signing & Capabilities

### Issue: "Untrusted Developer"
**Solution:**
On iPhone: Settings → General → VPN & Device Management → Trust developer

### Issue: CocoaPods Installation Fails
**Solution:**
```bash
# Update Ruby gems:
sudo gem update --system

# Reinstall CocoaPods:
sudo gem uninstall cocoapods
sudo gem install cocoapods

# Clear cache:
pod cache clean --all
```

### Issue: Build Fails with "Command PhaseScriptExecution failed"
**Solution:**
```bash
cd ios/App
rm -rf Pods
pod cache clean --all
pod install
```

---

## Quick Reference Commands

```bash
# Make changes to web app:
npm run build
npm run cap:sync

# Open in Xcode:
npm run cap:open:ios

# Reinstall dependencies:
cd ios/App && pod install

# Clean build:
# In Xcode: Product → Clean Build Folder (Shift+Cmd+K)
```

---

## App Store Submission Checklist

- [ ] App tested on real device
- [ ] All features working
- [ ] App icons created (all sizes)
- [ ] Screenshots captured (all required sizes)
- [ ] App Store listing complete:
  - [ ] App name
  - [ ] Description
  - [ ] Keywords
  - [ ] Support URL
  - [ ] Privacy policy URL
- [ ] Pricing set
- [ ] Age rating completed
- [ ] TestFlight testing done
- [ ] Build uploaded via Xcode
- [ ] Build submitted for review

---

## Next Steps

1. **Test thoroughly** on simulator and real device
2. **Fix any crashes** or issues
3. **Create TestFlight build** for beta testing
4. **Get feedback** from testers
5. **Submit to App Store** when ready

---

## Support & Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Portal](https://developer.apple.com)
- [App Store Connect](https://appstoreconnect.apple.com)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

**You're all set!** Your iOS project is configured and ready to build. 🎉
