# iOS Quick Start - PitBox

## You Are Here ✅

Your iOS project is **built and synced**. Next: Open in Xcode.

---

## Immediate Next Steps (Mac Required)

### 1️⃣ Install CocoaPods (If Not Installed)
```bash
sudo gem install cocoapods
pod --version
```

### 2️⃣ Install iOS Dependencies
```bash
cd /tmp/cc-agent/41299875/project/ios/App
pod install
```

### 3️⃣ Open Project in Xcode
```bash
cd /tmp/cc-agent/41299875/project
open ios/App/App.xcworkspace
```

**Important:** Open `.xcworkspace` NOT `.xcodeproj`

---

## In Xcode (5 Minutes Setup)

### Step 1: Set Your Team
1. Click **App** (top of left sidebar)
2. Select **App** under TARGETS
3. Click **Signing & Capabilities** tab
4. Under **Team**, select your Apple ID
   - No Apple ID? Click "Add Account"
   - Free accounts work for testing

### Step 2: Change Bundle ID
Still in **Signing & Capabilities**:
1. Change **Bundle Identifier** to:
   ```
   com.yourname.pitbox
   ```
   (Make it unique to you)

### Step 3: Build & Run
1. Select **iPhone Simulator** from device dropdown (top)
2. Click **Play** button (▶️) or press `Cmd+R`
3. Wait ~2 minutes for first build

**Done!** Your app should launch in simulator.

---

## When You Make Changes to Web Code

```bash
# 1. Build web app
npm run build

# 2. Sync to iOS
npm run cap:sync

# 3. Build in Xcode again (or it auto-reloads)
```

---

## Common First-Time Issues

### "No Matching Provisioning Profiles"
✅ Solution: Check "Automatically manage signing" in Signing & Capabilities

### "Untrusted Developer" on Real Device
✅ Solution: iPhone → Settings → General → VPN & Device Management → Trust

### Build Fails with Pods Error
```bash
cd ios/App
pod cache clean --all
pod install
```

---

## Testing on Your iPhone

1. Connect iPhone via USB
2. Trust Mac on your phone
3. In Xcode, select your iPhone from device list
4. Click Run
5. On iPhone: Settings → General → Trust your developer certificate

---

## App Store Requirements (Later)

Before submitting to App Store, you'll need:
- [ ] App Icons (all sizes) - See full guide
- [ ] Screenshots (4 required sizes) - See full guide
- [ ] Privacy Policy URL
- [ ] Apple Developer Account ($99/year)

See `IOS_SETUP_GUIDE.md` for complete details.

---

## Quick Command Reference

```bash
# Build web + sync to iOS:
npm run build:mobile

# Open in Xcode:
npm run cap:open:ios

# Reinstall pods:
cd ios/App && pod install && cd ../..
```

---

## Get Help

If you're stuck:
1. Check Console in Xcode (View → Debug Area → Activate Console)
2. Read error messages carefully
3. Most issues are signing-related (Team/Bundle ID)

---

**Ready to go!** Open Xcode and hit Run. 🚀
