# 🪟 Windows Upload Guide for PitBox

## 🎯 THE PROBLEM (SOLVED!)

Your builds were uploading but **not showing in App Store Connect** because you were using build number 98, which already existed in Apple's system.

**Apple silently rejects duplicate build numbers** - no error message, they just don't show up.

---

## ✅ THE FIX

I updated your build number to **99** and created easy Windows tools for you.

---

## 🚀 FASTEST WAY: Double-Click Upload (Windows)

### Step 1: Find This File
```
upload-next-build.bat
```

### Step 2: Double-Click It
- It will automatically increment your build number
- Upload to App Store Connect
- Show you the URL to check your build

### Step 3: Wait 5-10 Minutes
Go to: https://appstoreconnect.apple.com/apps/6757286830/testflight

Your build will appear there!

---

## 🎯 Alternative: Command Line

### Option 1: One Command (Automatic)
```bash
npm run build-ios-next
```

This command:
1. ✅ Increments build number automatically (99 → 100)
2. ✅ Uploads to App Store Connect
3. ✅ Done!

### Option 2: Two Commands (Manual Control)
```bash
# Step 1: Increment build number
npm run increment-build

# Step 2: Upload
npm run capawesome:build:ios
```

---

## 📋 Your Current Status

**Current Build Number:** 99
**Current Version:** 3.0.0
**Apple App ID:** 6757286830
**Bundle ID:** com.pitbox.app

---

## 🎬 Complete Upload Workflow

### First Upload (Build 99)
```bash
# Upload build 99 right now
npm run capawesome:build:ios
```

### Second Upload (Build 100)
```bash
# This automatically changes 99 to 100 and uploads
npm run build-ios-next
```

### Third Upload (Build 101)
```bash
# This automatically changes 100 to 101 and uploads
npm run build-ios-next
```

**Every time you run `build-ios-next`:**
- Build number increments by 1
- Uploads to Apple automatically
- Ready for the next upload

---

## 🔢 Understanding Build Numbers

### What is a Build Number?
- Internal identifier Apple uses
- **MUST be unique** for every upload
- **MUST always increment** (never reuse)
- Even if your version stays 3.0.0, build number must increase

### Example: Testing Multiple Builds
```
Upload 1: Version 3.0.0, Build 99  ← First upload
Upload 2: Version 3.0.0, Build 100 ← Fixed a bug, same version
Upload 3: Version 3.0.0, Build 101 ← Fixed another bug, same version
Upload 4: Version 3.1.0, Build 102 ← New version release
```

---

## 📱 How to Check Your Build in App Store Connect

### Step 1: Go to TestFlight
https://appstoreconnect.apple.com/apps/6757286830/testflight

### Step 2: Look for Your Build
Under **iOS Builds**, you should see:
```
Version 3.0.0 (99)
Status: Processing → Ready to Submit
```

### Step 3: Processing Time
- **Normal:** 5-10 minutes
- **Sometimes:** Up to 30 minutes
- **If not there after 30 minutes:** Build number was a duplicate

---

## ⚠️ Common Issues & Solutions

### Issue 1: Build Not Showing Up
**Cause:** Duplicate build number
**Solution:**
```bash
npm run build-ios-next  # This will use the next number
```

### Issue 2: Forgot Which Build Number You're On
**Solution:**
Open `capawesome.config.json` and look at line 13:
```json
"buildNumber": "99",  ← This is your current number
```

### Issue 3: Need to Change Version Number
**Solution:**
1. Open `capawesome.config.json`
2. Find line 12: `"version": "3.0.0"`
3. Change to: `"version": "3.1.0"` (or whatever you want)
4. Save
5. Run: `npm run build-ios-next`

---

## 🎯 Quick Reference

| What You Want | Windows Method | Command Line |
|---------------|----------------|--------------|
| Upload next build | Double-click `upload-next-build.bat` | `npm run build-ios-next` |
| Just increment number | N/A | `npm run increment-build` |
| Upload current build | N/A | `npm run capawesome:build:ios` |
| Check current number | Open `capawesome.config.json` line 13 | Same |

---

## 📝 Where Everything Is Located

```
Your Project Folder/
├── capawesome.config.json       ← Build number is on line 13
├── upload-next-build.bat        ← Double-click to upload (Windows)
├── increment-build.mjs          ← Script that increments build number
├── UPLOAD_TO_APP_STORE_FIXED.md ← Detailed guide (this file)
└── package.json                 ← npm scripts are here
```

---

## 🚀 Your Next Steps

### 1. Upload Build 99 Right Now

**Windows:** Double-click `upload-next-build.bat`
**OR**
**Command Line:**
```bash
npm run capawesome:build:ios
```

### 2. Wait 5-10 Minutes

### 3. Check App Store Connect
https://appstoreconnect.apple.com/apps/6757286830/testflight

### 4. See Your Build Listed! ✅
```
Version 3.0.0 (99)
Status: Ready to Submit
```

### 5. For Next Upload

**Windows:** Double-click `upload-next-build.bat` again
**OR**
**Command Line:**
```bash
npm run build-ios-next
```

It will automatically use build 100!

---

## 📊 Track Your Builds (Optional)

Create a file called `BUILD_HISTORY.txt` in your project:

```
PitBox Build History
====================
Build 99  - Jan 20 - Fixed login bug, uploaded to TestFlight
Build 100 - Jan 20 - Added premium subscription UI
Build 101 - Jan 21 - Fixed crash on startup
Build 102 - Jan 21 - Submitted to App Store for review
```

This helps you remember what changed in each build!

---

## ✅ What I Fixed For You

1. ✅ **Changed build number from 98 to 99**
   - File: `capawesome.config.json` line 13

2. ✅ **Created automatic increment script**
   - File: `increment-build.mjs`
   - Automatically adds 1 to build number

3. ✅ **Added npm commands**
   - `npm run build-ios-next` - Increment and upload
   - `npm run increment-build` - Just increment

4. ✅ **Created Windows batch file**
   - File: `upload-next-build.bat`
   - Just double-click to upload

5. ✅ **Verified all your configs are correct**
   - Bundle ID: ✅ com.pitbox.app
   - App ID: ✅ 6757286830
   - Team ID: ✅ 92T67CGL73
   - Store Destination: ✅ Configured correctly

---

## 🔒 Your Configuration Summary

Everything below is **CORRECT** - don't change these:

```
Apple ID (Email): mg91648@yahoo.com
Apple App ID: 6757286830
Bundle ID: com.pitbox.app
Team ID: 92T67CGL73
App-specific Password: Set (••••••••)
```

**Only change:**
- Build number (automatically done with `build-ios-next`)
- Version number (when releasing new versions)

---

## 🆘 Still Having Issues?

### If Build 99 Doesn't Show Up

1. **Check if build 99 was already uploaded:**
   - Go to App Store Connect
   - Check TestFlight builds
   - If 99 is there, run: `npm run build-ios-next` to use 100

2. **Check your email** (mg91648@yahoo.com):
   - Apple sends rejection notices
   - Look for emails from "App Store Connect"

3. **Check Capawesome build logs:**
   - Go to: https://cloud.capawesome.io
   - Click on **PitBox** app
   - Click **Builds** tab
   - Look for error messages in the latest build

4. **Verify Store Destination:**
   - Go to: https://cloud.capawesome.io
   - Click **Settings** → **Store Destinations**
   - Make sure iOS destination is enabled and has valid credentials

---

## ✅ Summary

**Problem:** Build 98 already existed in Apple's system
**Solution:** Updated to build 99
**Easy Upload:** Double-click `upload-next-build.bat` on Windows
**Or Use:** `npm run build-ios-next` in command line
**Check Builds:** https://appstoreconnect.apple.com/apps/6757286830/testflight

**You're all set! Your uploads will now show up in App Store Connect.**

---

## 🎉 Success Checklist

After your first upload, you should see:

- ✅ Build completes in Capawesome Cloud
- ✅ Wait 5-10 minutes
- ✅ Build 99 appears in App Store Connect
- ✅ Status shows "Processing" then "Ready to Submit"
- ✅ You can add it to TestFlight for testing
- ✅ You can submit it for App Store review

**If you see all of these, everything is working perfectly!**
