# ✅ Build 121 - Ready for Next Upload

## 🎯 Current Configuration

| Platform | Version | Build Number | Status |
|----------|---------|--------------|--------|
| **iOS** | 3.0.0 | 121 | ✅ Ready |
| **Android** | 3.0.0 | 121 | ✅ Ready |

---

## 📚 Understanding the Version System

### Two Numbers, Two Purposes

#### 1. Marketing Version (3.0.0)
- **What it is:** The version users see in App/Play Store
- **When to change:** Only when releasing new features to public
- **Can stay the same:** Across multiple builds during testing
- **Example progression:** 3.0.0 → 3.0.1 → 3.1.0 → 4.0.0

#### 2. Build Number (121)
- **What it is:** Internal identifier for each upload
- **When to change:** EVERY SINGLE UPLOAD (critical!)
- **Must be unique:** Never reuse a number
- **Always increments:** 119 → 120 → 121 → 122 → 123...
- **Apple/Google requirement:** Duplicate = Silent rejection

---

## 🔄 How Capawesome Cloud Works

### What Capawesome Does For You

1. **Cloud Building**
   - Builds your iOS app on macOS servers
   - Builds your Android app on Linux servers
   - No need for local Xcode or Android Studio

2. **Automatic Signing**
   - Uses your certificates (configured in Capawesome dashboard)
   - Signs the app with proper provisioning profiles
   - Handles all code signing complexity

3. **Automatic Upload**
   - Uploads to TestFlight (iOS)
   - Uploads to Google Play (Android)
   - Uses App Store Connect API (no passwords needed!)

### The Build Process

```bash
npm run capawesome:build:ios
```

**What happens:**
1. Capawesome reads `capawesome.config.json`
2. Runs `webBuildCommand`: `npm run build:ci:all`
3. Syncs Capacitor to iOS/Android folders
4. Runs `buildCommand` (sets version in Info.plist/build.gradle)
5. Builds the app archive (.xcarchive for iOS)
6. Signs with your certificates
7. Exports IPA file
8. Uploads to App Store Connect via API
9. Shows up in TestFlight in 5-10 minutes

---

## 🍎 App Store Connect Integration

### How Versions Work in App Store Connect

**What Apple Sees:**
- **CFBundleShortVersionString** = Marketing Version (3.0.0)
- **CFBundleVersion** = Build Number (121)
- Displayed as: **Version 3.0.0 (121)**

### The Silent Rejection Problem

**If you upload build 121 twice:**
- First upload: ✅ Shows up in TestFlight
- Second upload: ✅ Capawesome says "Success"
- Second upload: ❌ Apple silently rejects (no error!)
- Result: Build never appears in App Store Connect

**Solution:** Always increment before uploading!

### Store Destination Configuration

Your `capawesome.config.json` has this:
```json
"destinationId": "5cea5914-4a94-4f14-82f8-15b65c9275b7"
```

This is your **App Store Connect API Key** configured in Capawesome.

**It includes:**
- Issuer ID (from App Store Connect)
- Key ID (from your API key)
- Private Key (.p8 file contents)
- Bundle ID: `com.pitbox.app`

This enables **automatic upload without passwords!**

---

## 📱 Where Things Are Configured

### Three Places Build Numbers Must Match

#### 1. Capawesome Config (Primary Source)
**File:** `capawesome.config.json`

```json
{
  "ios": {
    "buildNumber": "121",        ← Must increment here
    "buildCommand": "...Set :CFBundleVersion 121..."  ← And here
  },
  "android": {
    "versionCode": 121           ← And here
  }
}
```

#### 2. iOS Info.plist (Set by buildCommand)
**File:** `ios/App/App/Info.plist`

The `buildCommand` automatically sets:
```xml
<key>CFBundleVersion</key>
<string>121</string>
<key>CFBundleShortVersionString</key>
<string>3.0.0</string>
```

#### 3. Android build.gradle (Set by Capacitor sync)
**File:** `android/app/build.gradle`

Capacitor automatically sets:
```gradle
versionCode 121
versionName "3.0.0"
```

**Important:** The `buildCommand` in capawesome.config.json handles all of this automatically!

---

## 🚀 Your Next Build Workflow

### For Build 121 (Current - Ready Now)

```bash
# 1. Verify configuration (already done!)
npm run pre-build-check

# 2. Build for iOS
npm run capawesome:build:ios

# 3. Monitor at:
# https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/builds

# 4. Check App Store Connect in 10 minutes:
# https://appstoreconnect.apple.com
# TestFlight → Should see "Version 3.0.0 (121)"
```

### For Build 122 (Next Time)

**Before uploading:**

1. Open `capawesome.config.json`
2. Change line 15: `"buildNumber": "122",`
3. Change line 10: `...Set :CFBundleVersion 122...`
4. Change line 49: `"versionCode": 122`
5. Save file
6. Run: `npm run capawesome:build:ios`

---

## 📊 Build Number Strategy

### Testing Phase (Current)
```
Version 3.0.0, Build 121 - Initial TestFlight
Version 3.0.0, Build 122 - Bug fixes
Version 3.0.0, Build 123 - More testing
Version 3.0.0, Build 124 - Final TestFlight build
Version 3.0.0, Build 125 - SUBMIT TO APP STORE
```

### After Public Release
```
Version 3.0.0, Build 125 - Live in App Store
Version 3.0.1, Build 126 - Bug fix update
Version 3.1.0, Build 127 - New features
Version 3.1.0, Build 128 - Hot fix
Version 4.0.0, Build 129 - Major update
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T DO THIS

**Mistake 1: Reusing build number**
```json
Upload 1: "buildNumber": "121"
Upload 2: "buildNumber": "121"  ← Won't show in App Store Connect
```

**Mistake 2: Forgetting buildCommand**
```json
"buildNumber": "122",
"buildCommand": "...Set :CFBundleVersion 121..."  ← Mismatch!
```

**Mistake 3: Going backwards**
```json
Before: "buildNumber": "125"
After:  "buildNumber": "124"  ← Apple will reject
```

### ✅ DO THIS

**Always increment both places:**
```json
"buildNumber": "122",
"buildCommand": "...Set :CFBundleVersion 122..."
```

**Always go forward:**
```json
121 → 122 → 123 → 124 → 125...
```

**Keep a log:**
```
Build 121 - 2026-01-23 - Initial TestFlight
Build 122 - 2026-01-24 - Fixed login bug
Build 123 - 2026-01-25 - Ready for review
```

---

## 🎯 App Store Connect Workflow

### After Capawesome Uploads

**Timeline:**
- 0 min: Build uploaded to Apple
- 2-5 min: Processing
- 5-10 min: Appears in TestFlight
- Ready to add to test groups or submit for review

**Where to Check:**
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "PitBox"
3. Click "TestFlight" tab
4. Look for build **3.0.0 (121)**

**Status meanings:**
- **Processing:** Apple is verifying the build
- **Missing Compliance:** Need to answer export compliance
- **Ready to Submit:** Build is ready!
- **In Review:** Submitted to Apple for review
- **Rejected:** Apple found an issue (rare)
- **Ready for Sale:** Approved and live!

---

## 🔍 Troubleshooting

### Build not showing in App Store Connect?

**Check these:**
1. ✅ Wait 15 minutes (processing takes time)
2. ✅ Check build number is unique (never used before)
3. ✅ Verify store destination ID matches config
4. ✅ Check Apple Developer email for notices
5. ✅ Verify certificates haven't expired
6. ✅ Check Capawesome build logs for errors

**Still not there?**
- Increment to build 122 and try again
- Check that destinationId is correct
- Verify App Store Connect API key is valid

### Capawesome build fails?

**Common causes:**
1. Web build failed (check build logs)
2. Certificate expired (update in Capawesome)
3. Provisioning profile invalid (regenerate)
4. Bundle ID mismatch (must be com.pitbox.app)

### "Invalid build" in App Store Connect?

**Usually means:**
- Missing required device capabilities
- Missing privacy descriptions (already added!)
- Invalid entitlements
- Code signing issue

---

## 📱 Android Notes

Android uses the same concept but different terminology:

**Android equivalent:**
- `version` (3.0.0) = `versionName` in build.gradle
- `versionCode` (121) = Build number in build.gradle

**Google Play:**
- Also requires unique, incrementing version codes
- Rejects duplicates (but shows an error unlike Apple)
- Displayed as: **Version 3.0.0 (121)**

---

## ✅ Pre-Flight Checklist

Before running `npm run capawesome:build:ios`:

- [ ] Build number incremented (121 for this build)
- [ ] Build number matches in buildCommand (121)
- [ ] Android versionCode incremented (121)
- [ ] Version is correct (3.0.0)
- [ ] Bundle ID is com.pitbox.app
- [ ] Destination ID: 5cea5914-4a94-4f14-82f8-15b65c9275b7
- [ ] Logged into Capawesome CLI (`npm run capawesome:whoami`)
- [ ] App Store Connect API key configured in Capawesome

---

## 🎉 Summary

**Current Status:**
- ✅ Build 120 completed and uploaded
- ✅ Build 121 configured and ready
- ✅ All version numbers synchronized
- ✅ Build command properly set
- ✅ Understanding of version system

**What's Different From Build 120:**
- Build number: 120 → 121
- Build command CFBundleVersion: 120 → 121
- Android versionCode: 120 → 121
- Marketing version stays: 3.0.0 (unchanged)

**Ready to Upload Build 121:**
```bash
npm run capawesome:build:ios
```

**Next Build (122):**
- Increment all three places in capawesome.config.json
- Always increment before building
- Never reuse a build number

---

## 📞 Quick Reference

**Capawesome Dashboard:**
https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8

**App Store Connect:**
https://appstoreconnect.apple.com/apps/6757286830

**Your App Details:**
- App Name: PitBox
- Bundle ID: com.pitbox.app
- Current Version: 3.0.0
- Current Build: 121 (ready)
- Next Build: 122 (increment when needed)

**Build Commands:**
```bash
npm run capawesome:whoami           # Check login
npm run pre-build-check             # Verify config
npm run capawesome:build:ios        # Build & upload iOS
npm run capawesome:build:android    # Build & upload Android
```

---

You're all set! Build 121 is ready to go. The versioning system is properly configured for both Capawesome Cloud and App Store Connect. 🚀
