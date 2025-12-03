# Android Studio Build Guide for PIT-BOX

## Table of Contents
1. [First Time Setup](#first-time-setup)
2. [Fix Gradle Warning](#fix-gradle-warning)
3. [Build Process](#build-process)
4. [Creating Release Build](#creating-release-build)
5. [File Locations](#file-locations)
6. [Common Issues](#common-issues)
7. [Testing Checklist](#testing-checklist)

---

## First Time Setup

### Step 1: Build Your Web App
Open Terminal/Command Prompt in your project root folder and run:

```bash
npm run build
```

**What this does:** Compiles your React app into optimized files in the `dist/` folder.
**Time:** 30-60 seconds
**You should see:** "✓ built in X seconds" message

---

### Step 2: Add Android Platform (ONLY DO THIS ONCE)
In the same terminal, run:

```bash
npx cap add android
```

**What this does:** Creates the `android/` folder with your complete Android Studio project.
**Time:** 10-30 seconds
**You should see:** "✓ Adding native android project in android/" message

**Expected result:** You'll now have an `android` folder in your project root.

---

### Step 3: Sync Web App to Android
Every time you make changes to your React app, run:

```bash
npx cap sync android
```

**What this does:** Copies your built web app from `dist/` into the Android project.
**Time:** 5-10 seconds
**Run this:** Every time you change your code

---

### Step 4: Open in Android Studio
Run this command:

```bash
npx cap open android
```

**OR manually:**
1. Open Android Studio
2. Click "Open"
3. Navigate to your project folder
4. Select the `android` folder
5. Click "OK"

**First time:** Android Studio will take 5-10 minutes to:
- Index files
- Download Gradle dependencies
- Sync project
- Set up build tools

**Let it finish completely before proceeding!**

---

## Fix Gradle Warning

You're seeing this warning:
```
We recommend upgrading to Gradle version 9.0-milestone-1.
The minimum compatible Gradle version is 8.5.
```

### Solution: Update Gradle to 8.5 (Stable Version)

#### Step 1: Locate the Gradle Wrapper File
In Android Studio's Project view (left side):
1. Switch to "Project" view (dropdown at top)
2. Navigate to: `android/gradle/wrapper/gradle-wrapper.properties`
3. Double-click to open

**OR** manually open this file in any text editor:
```
android/gradle/wrapper/gradle-wrapper.properties
```

#### Step 2: Update the Gradle Version
Find this line:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-X.X-bin.zip
```

Change it to:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
```

#### Step 3: Sync Project
In Android Studio:
1. Click the "Sync Now" banner at the top
   **OR**
2. File → Sync Project with Gradle Files

**Wait for sync to complete** (2-5 minutes first time)

#### Step 4: Verify JVM Version
The warning mentions "maximum compatible Gradle JVM version is 19"

Check your JVM version:
1. File → Project Structure (or Ctrl+Alt+Shift+S)
2. Click "SDK Location" in left panel
3. Look at "JDK location"
4. Should be JDK 17 or JDK 19 (NOT JDK 20+)

**If using wrong JVM:**
- Download JDK 17 from: https://adoptium.net/
- Point Android Studio to it in Project Structure

**Warning should now be gone!**

---

## Build Process

### Quick Build (Every Time You Make Changes)

**Option A: Single Command**
```bash
npm run build && npx cap sync android && npx cap open android
```

**Option B: Step by Step**
```bash
npm run build          # Build web app
npx cap sync android   # Copy to Android
npx cap open android   # Open Android Studio
```

Then in Android Studio, build your APK (see below).

---

### Build Debug APK (For Testing)

**In Android Studio:**

1. **Menu:** Build → Build Bundle(s) / APK(s) → Build APK(s)
2. **Wait:** 5-10 minutes for first build (faster after that)
3. **Success notification:** "APK(s) generated successfully"
4. **Click:** "locate" link in the notification

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**File size:** Approximately 50-100 MB

**What to do with it:**
- Copy to your phone
- Enable "Install from Unknown Sources" in phone settings
- Install and test
- NOT for Google Play Store

---

## Creating Release Build

### Step 1: Generate Keystore (FIRST TIME ONLY)

A keystore is required to sign your app for Google Play Store.

**In Android Studio:**

1. **Menu:** Build → Generate Signed Bundle / APK...
2. **Select:** Android App Bundle (AAB) - recommended for Play Store
3. **Click:** "Create new..." next to Key store path

**Fill out the form:**

#### Keystore Information:
- **Key store path:** Click folder icon, save as `pitbox-release-key.jks`
  - **IMPORTANT:** Save OUTSIDE your project folder (like Documents folder)
  - Never commit this to Git!
- **Password:** Create a strong password (minimum 6 characters)
  - **WRITE THIS DOWN!** You'll need it forever!
- **Confirm:** Re-enter password

#### Key Information:
- **Alias:** `pitbox-key` (or any name you want)
- **Password:** Same as keystore password (or different - your choice)
  - **WRITE THIS DOWN TOO!**
- **Confirm:** Re-enter password
- **Validity (years):** 25 (default - this is fine)

#### Certificate:
- **First and Last Name:** Your full name
- **Organizational Unit:** PIT-BOX
- **Organization:** PIT-BOX App
- **City or Locality:** Your city
- **State or Province:** Your state
- **Country Code (XX):** US (or your country code)

**Click "OK"**

**CRITICAL:** Copy these details to `keystore-info-TEMPLATE.txt` NOW!

---

### Step 2: Build Release AAB

After creating keystore:

1. **Select:** "release" build variant
2. **Enter:** Keystore password and key password
3. **Check:** "Remember passwords" (optional, but convenient)
4. **Click:** "Next"
5. **Select:** Both signature versions (V1 and V2)
6. **Click:** "Finish"

**Build time:** 5-15 minutes

**Output location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**This AAB file is what you upload to Google Play Store!**

---

### Alternative: Build Release APK

If you need an APK instead of AAB:

1. Follow same steps as above
2. But select "APK" instead of "Android App Bundle"
3. Output location: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Google Play Store prefers AAB files, but APK works too.

---

## File Locations

### Important Folders:

```
your-project/
├── android/                                    ← Android Studio project
│   ├── app/
│   │   ├── build/
│   │   │   └── outputs/
│   │   │       ├── apk/
│   │   │       │   ├── debug/
│   │   │       │   │   └── app-debug.apk      ← Debug APK (testing)
│   │   │       │   └── release/
│   │   │       │       └── app-release.apk    ← Release APK
│   │   │       └── bundle/
│   │   │           └── release/
│   │   │               └── app-release.aab    ← Release AAB (Play Store)
│   │   └── src/                               ← Android source code
│   ├── gradle/
│   │   └── wrapper/
│   │       └── gradle-wrapper.properties      ← Fix Gradle version here
│   └── build.gradle                           ← Project build config
├── dist/                                       ← Your built web app
├── src/                                        ← React source code
├── capacitor.config.ts                         ← Capacitor configuration
└── package.json                                ← Node dependencies
```

### Quick Reference:

**Debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
**Release AAB:** `android/app/build/outputs/bundle/release/app-release.aab`
**Keystore:** Save outside project (e.g., `~/Documents/pitbox-release-key.jks`)

---

## Common Issues

### Issue 1: "Gradle sync failed"

**Solution:**
1. Wait 5-10 minutes for first sync
2. Check internet connection (downloads dependencies)
3. File → Invalidate Caches / Restart
4. Try again

---

### Issue 2: "SDK not found" or "SDK location not found"

**Solution:**
1. File → Project Structure → SDK Location
2. Click "..." next to Android SDK location
3. Select or download Android SDK
4. Recommended: API Level 33 (Android 13)

---

### Issue 3: Build errors mentioning "package does not exist"

**Solution:**
```bash
# Rebuild web app and sync again
npm run build
npx cap sync android
```

Then rebuild in Android Studio.

---

### Issue 4: "Could not find com.android.tools.build:gradle:X.X.X"

**Solution:**
1. Check internet connection
2. File → Project Structure → Project
3. Update "Android Gradle Plugin Version" to latest
4. Sync project

---

### Issue 5: App crashes immediately on phone

**Solutions:**
1. Check Android version (minimum Android 5.0/API 21)
2. View Logcat in Android Studio for error messages
3. Verify all permissions in AndroidManifest.xml
4. Check Supabase credentials in .env file

---

### Issue 6: Camera/Location not working

**Solution:**
1. Check phone permissions: Settings → Apps → PIT-BOX → Permissions
2. Grant Camera, Location permissions manually
3. Verify `AndroidManifest.xml` has permission declarations

---

### Issue 7: "Keystore was tampered with, or password was incorrect"

**Solution:**
- You entered wrong password
- Check `keystore-info-TEMPLATE.txt` for saved passwords
- If lost, you'll need to create a NEW keystore (can't upload to existing Play Store app!)

---

## Testing Checklist

### On Physical Device:

#### Enable Developer Mode:
1. Settings → About Phone
2. Tap "Build Number" 7 times
3. "You are now a developer!"

#### Enable USB Debugging:
1. Settings → Developer Options (now visible)
2. Turn on "USB Debugging"
3. Connect phone to computer via USB
4. Allow USB debugging popup on phone

#### Run from Android Studio:
1. Click green "Run" button (triangle icon)
2. Select your device from list
3. App installs and launches automatically

---

### Features to Test:

- [ ] App launches without crashing
- [ ] Login with Supabase works
- [ ] Sign up creates new account
- [ ] Camera opens and takes photos
- [ ] Location/GPS works
- [ ] All navigation works (bottom nav, etc.)
- [ ] Setup sheets save and load
- [ ] Shock selector works
- [ ] Community feed loads
- [ ] Messages work
- [ ] Push notifications arrive
- [ ] Stripe payment flows work (if applicable)
- [ ] No crashes during normal use
- [ ] App looks good on your phone screen size

---

## Android Studio Plugins (None Required!)

**Good news:** You don't need any additional plugins for Capacitor!

**What's already built into Android Studio:**
- Android SDK ✓
- Gradle build system ✓
- Android Emulator ✓
- ADB (Android Debug Bridge) ✓
- Logcat debugging ✓
- Everything you need ✓

**Optional but NOT required:**
- Material Design plugin
- Flutter/Dart plugin (not relevant for Capacitor)

---

## Quick Command Reference

```bash
# First time setup
npx cap add android

# Every time you make changes
npm run build
npx cap sync android
npx cap open android

# All in one command
npm run build && npx cap sync android && npx cap open android

# Alternative: use package.json script
npm run build:mobile
npx cap open android
```

---

## Support Resources

**Capacitor Docs:** https://capacitorjs.com/docs/android
**Android Studio Docs:** https://developer.android.com/studio
**Gradle Docs:** https://gradle.org/

---

## Final Notes

### IMPORTANT REMINDERS:

1. **Always run `npm run build` before syncing to Android**
2. **Backup your keystore file and passwords** - you can NEVER recover them!
3. **Test on real device** - emulators don't have all hardware features
4. **For Play Store:** Use AAB format, not APK
5. **Never commit keystore to Git** - add `*.jks` to `.gitignore`

### Build Checklist:

- [ ] `npm run build` completed successfully
- [ ] `npx cap sync android` ran without errors
- [ ] Android Studio opened the project
- [ ] Gradle sync completed (green checkmark)
- [ ] Gradle version is 8.5+ (fixed warning)
- [ ] Build APK/AAB completed without errors
- [ ] File found in expected output location
- [ ] Tested on physical device
- [ ] All features work as expected

---

**YOU'RE ALL SET! Start with a debug build to test, then create a release build when ready for the Play Store.**

Good luck! 🚀
