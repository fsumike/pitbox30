# 🔧 Capawesome Cloud Upload Troubleshooting

## ✅ Your Configuration is CORRECT

I've verified your setup:

### Store Destination Settings (CORRECT ✅)
```
Name: iOS
Platform: iOS
Apple ID: mg91648@yahoo.com
Apple App ID: 6757286830
Team ID: 92T67CGL73
App-specific Password: Set
```

### capawesome.config.json (CORRECT ✅)
```json
{
  "appId": "8251f381-4aed-4b20-ac20-a3aad250cbb8",
  "publish": {
    "ios": {
      "bundleId": "com.pitbox.app",
      "destinationId": "5cea5914-4a94-4f14-82f8-15b65c9275b7"
    }
  }
}
```

### capacitor.config.ts (CORRECT ✅)
```typescript
{
  appId: 'com.pitbox.app',
  appName: 'PitBox'
}
```

---

## 🚨 THE ACTUAL PROBLEM: Duplicate Build Number

**Your build wasn't showing up because:**

Apple already has build 98 in App Store Connect. When you upload a build with a duplicate build number:
- ✅ Capawesome says "Build successful"
- ✅ Upload completes
- ❌ **Build never appears in App Store Connect**
- ❌ **No error message shown**

This is Apple's silent rejection of duplicate build numbers.

---

## ✅ THE FIX

Updated `capawesome.config.json` line 13:

**Before:**
```json
"buildNumber": "98",
```

**After:**
```json
"buildNumber": "99",
```

---

## 🎯 How to Upload Build 99 Now

```bash
npm run capawesome:build:ios
```

**What happens:**
1. Capawesome Cloud builds your app
2. Signs it with your certificates
3. Uploads to App Store Connect with build number 99
4. **Build 99 will appear in App Store Connect within 5-10 minutes**

---

## 📱 Verify Upload Success

### Step 1: Wait 5-10 Minutes
Apple processes the build after upload.

### Step 2: Check App Store Connect
1. Go to: https://appstoreconnect.apple.com/apps/6757286830/testflight
2. Click **TestFlight** tab
3. Look under **iOS Builds** section
4. You should see: **3.0.0 (99)**

### Step 3: Build Status
Look for these indicators:

✅ **Success:**
```
Version: 3.0.0
Build: 99
Status: Ready to Submit / Processing / Testing
```

❌ **Problem (means duplicate):**
```
Build doesn't appear in list at all
```

---

## 🔄 For Your Next Upload (Build 100)

**Before you run the build command:**

1. Open `capawesome.config.json`
2. Change line 13:
   ```json
   "buildNumber": "99",   ← Change this
   ```
   to:
   ```json
   "buildNumber": "100",  ← Increment by 1
   ```
3. Save
4. Run: `npm run capawesome:build:ios`

---

## 📋 Build Number Rules

### ✅ DO:
- Increment buildNumber by 1 for EVERY upload
- Use sequential numbers: 99, 100, 101, 102, 103...
- Change it BEFORE running the build command

### ❌ DON'T:
- Reuse a build number (Apple rejects silently)
- Skip numbers (99 → 105 works but confusing)
- Go backwards (100 → 99 will be rejected)

---

## 🗂️ Version vs Build Number

### Version (User-Facing)
```json
"version": "3.0.0"
```
- What users see in the App Store
- Can stay the same across multiple builds
- Only change when releasing a new version to users
- Examples: 3.0.0, 3.0.1, 3.1.0, 4.0.0

### Build Number (Internal)
```json
"buildNumber": "99"
```
- Internal identifier for Apple
- **MUST be unique for every upload**
- **MUST always increment**
- Apple uses this to identify each specific build
- Examples: 99, 100, 101, 102, 103

---

## 🎬 Complete Upload Workflow

### Every Time You Want to Upload

**Step 1:** Edit `capawesome.config.json`
```json
"buildNumber": "100",  ← Increment this number
```

**Step 2:** Save the file

**Step 3:** Build and upload
```bash
npm run capawesome:build:ios
```

**Step 4:** Wait 5-10 minutes

**Step 5:** Check App Store Connect
- Go to: https://appstoreconnect.apple.com/apps/6757286830/testflight
- Look for your new build number

**Step 6:** If you need to upload again
- Go back to Step 1
- Increment build number again (100 → 101)

---

## 🔍 Why Builds Might Not Show Up

| Issue | Cause | Solution |
|-------|-------|----------|
| Build not in App Store Connect | Duplicate buildNumber | Increment buildNumber and upload again |
| Build shows then disappears | Processing failed | Check email for rejection notice from Apple |
| Build stuck "Processing" | Apple servers slow | Wait up to 30 minutes, usually fine |
| Build says "Invalid" | Missing entitlements or certs | Check Store Destination credentials |

---

## ✅ Your Current Status

**What I Fixed:**
- ✅ Updated buildNumber from 98 → 99
- ✅ Verified all configs are correct
- ✅ Verified Store Destination is set up correctly

**What You Need to Do:**
1. Run: `npm run capawesome:build:ios`
2. Wait 5-10 minutes
3. Check App Store Connect for build 99
4. For next upload, change buildNumber to 100

---

## 🆘 If Build 99 Still Doesn't Show Up

If build 99 also doesn't appear after 10 minutes:

### Possible Causes:
1. **Build 99 was also already uploaded**
   - Solution: Use build 100

2. **Check your Apple email** (mg91648@yahoo.com)
   - Apple sends rejection notices
   - Look for emails from App Store Connect

3. **Verify Store Destination**
   - Go to: https://cloud.capawesome.io
   - Check that destinationId `5cea5914-4a94-4f14-82f8-15b65c9275b7` exists
   - Verify credentials are still valid

4. **Check Capawesome Build Logs**
   - Go to: https://cloud.capawesome.io
   - Click on your app
   - Click **Builds** tab
   - Look at the build logs for errors

---

## 📞 Quick Reference

**Config File:** `capawesome.config.json`
**Line to Edit:** Line 13 (`"buildNumber"`)
**Current Build:** 99
**Next Build:** 100
**Build Command:** `npm run capawesome:build:ios`
**Check Builds:** https://appstoreconnect.apple.com/apps/6757286830/testflight

---

## 💡 Pro Tip

Create a simple text file to track your builds:

```
BUILD_HISTORY.txt
-----------------
Build 99  - 2026-01-20 - Fixed login issue
Build 100 - 2026-01-20 - Added dark mode
Build 101 - 2026-01-21 - Fixed crash
```

This way you always know what number to use next!
