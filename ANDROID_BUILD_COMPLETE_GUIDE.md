# Android Studio Complete Build Guide for PIT-BOX

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [First Time Setup](#first-time-setup)
3. [Fix Gradle Warning](#fix-gradle-warning)
4. [Build Process](#build-process)
5. [Creating Release Build](#creating-release-build)
6. [File Locations](#file-locations)
7. [Common Issues](#common-issues)
8. [Testing Checklist](#testing-checklist)
9. [Helper Script Usage](#helper-script-usage)

---

## Prerequisites

### Required Software:
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Android Studio** (latest version)
- **JDK 17** or **JDK 19** (NOT JDK 20+)

### Download Links:
- **Android Studio:** https://developer.android.com/studio
- **JDK 17 (Recommended):** https://adoptium.net/
- **Node.js:** https://nodejs.org/

---

## First Time Setup

### Step 1: Install Dependencies
Open Terminal/Command Prompt in your project root folder:

```bash
npm install
```

**What this does:** Installs all Node.js packages required for the project.
**Time:** 1-3 minutes
**You should see:** Package installation progress and completion message

---

### Step 2: Build Your Web App
In the same terminal, run:

```bash
npm run build
```

**What this does:** Compiles your React app into optimized files in the `dist/` folder.
**Time:** 30-60 seconds
**You should see:** "✓ built in X seconds" message

**IMPORTANT:** Always run this before syncing to Android!

---

### Step 3: Add Android Platform (ONLY DO THIS ONCE)
In the same terminal, run:

```bash
npx cap add android
```

**What this does:** Creates the `android/` folder with your complete Android Studio project.
**Time:** 10-30 seconds
**You should see:** "✓ Adding native android project in android/" message

**Expected result:** You'll now have an `android` folder in your project root.

**WARNING:** Only run this command ONCE. Running it again will overwrite your Android folder!

---

### Step 4: Sync Web App to Android
Every time you make changes to your React app, run:

```bash
npx cap sync android
```

**What this does:** Copies your built web app from `dist/` into the Android project.
**Time:** 5-10 seconds
**Run this:** Every time you change your code

---

### Step 5: Open in Android Studio
Run this command:

```bash
npx cap open android
```

**OR manually:**
1. Open Android Studio
2. Click "Open"
3. Navigate to your project folder
4. Select the `android` folder (NOT the root folder!)
5. Click "OK"

**First time:** Android Studio will take 5-10 minutes to:
- Index files
- Download Gradle dependencies
- Sync project
- Set up build tools

**Let it finish completely before proceeding!**

---

## Fix Gradle Warning

### The Warning You're Seeing:
```
We recommend upgrading to Gradle version 9.0-milestone-1.
The minimum compatible Gradle version is 8.5.
The maximum compatible Gradle JVM version is 19.
```

### Solution: Update Gradle to 8.5 (Stable Version)

#### Step 1: Locate the Gradle Wrapper File
In Android Studio's Project view (left side):
1. Click dropdown at top and switch to "Project" view (not "Android")
2. Navigate to: `android/gradle/wrapper/gradle-wrapper.properties`
3. Double-click to open

**OR** manually open this file in any text editor:
```
android/gradle/wrapper/gradle-wrapper.properties
```

#### Step 2: Update the Gradle Version
Find this line (it might say a different version):
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.3-bin.zip
```

Change it to:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
```

**Save the file!**

#### Step 3: Sync Project
In Android Studio:
1. Look for the "Sync Now" banner at the top
2. Click "Sync Now"

   **OR**

3. Menu: File → Sync Project with Gradle Files

**Wait for sync to complete** (2-5 minutes first time)

You'll see progress at the bottom: "Syncing... X/Y modules"

#### Step 4: Verify JVM Version
The warning mentions "maximum compatible Gradle JVM version is 19"

Check your JVM version:
1. Menu: File → Project Structure (or Ctrl+Alt+Shift+S / Cmd+; on Mac)
2. Click "SDK Location" in left panel
3. Look at "JDK location"
4. Should show JDK 17 or JDK 19 (NOT JDK 20 or higher!)

**If using wrong JVM:**
1. Download JDK 17 from: https://adoptium.net/
2. Install it
3. Go back to File → Project Structure → SDK Location
4. Click "..." next to JDK location
5. Browse to your new JDK 17 installation
6. Click "Apply" then "OK"
7. Sync project again

**Warning should now be gone!**

---

## Build Process

### Quick Build Workflow (Every Time You Make Changes)

**Option A: Single Command**
```bash
npm run build && npx cap sync android && npx cap open android
```

**Option B: Step by Step**
```bash
npm run build          # 1. Build web app
npx cap sync android   # 2. Copy to Android
npx cap open android   # 3. Open Android Studio
```

**Option C: Use Helper Script (Faster!)**
```bash
./android-build.sh build && ./android-build.sh open
```

Then in Android Studio, build your APK (see below).

---

### Build Debug APK (For Testing)

**In Android Studio:**

1. **Menu:** Build → Build Bundle(s) / APK(s) → Build APK(s)
2. **Wait:** 5-10 minutes for first build (30 seconds - 2 minutes after that)
3. **Success notification:** Bottom right: "APK(s) generated successfully"
4. **Click:** "locate" link in the notification

**APK Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**File size:** Approximately 50-100 MB

**What to do with it:**
1. Copy to your phone (via USB, email, cloud storage, etc.)
2. On phone: Enable "Install from Unknown Sources" in Settings
3. Tap the APK file to install
4. Test your app!

**NOTE:** Debug APK is NOT for Google Play Store - only for testing!

---

## Creating Release Build

### Step 1: Generate Keystore (FIRST TIME ONLY - DO THIS ONCE!)

A keystore is required to sign your app for Google Play Store.

**CRITICAL:** This keystore is your app's identity forever. Never lose it!

**In Android Studio:**

1. **Menu:** Build → Generate Signed Bundle / APK...
2. **Select:** Android App Bundle (AAB) - recommended for Play Store
3. **Click:** "Next"
4. **Click:** "Create new..." next to Key store path

**Fill out the form carefully:**

#### Keystore Information:
- **Key store path:**
  - Click folder icon
  - Navigate to a SAFE location OUTSIDE your project
  - Example: `C:\Users\YourName\Documents\pitbox-release-key.jks`
  - Example: `/Users/yourname/Documents/pitbox-release-key.jks`
  - **NEVER save inside your project folder!**
  - **NEVER commit to Git!**
  - Type filename: `pitbox-release-key.jks`
  - Click "OK"

- **Password:**
  - Create a STRONG password (minimum 6 characters)
  - Example: `PitBox2024Secure!`
  - **WRITE THIS DOWN IN `keystore-info.txt` NOW!**

- **Confirm:**
  - Re-enter the EXACT same password

#### Key Information:
- **Alias:**
  - Enter: `pitbox-key` (or any name you want)
  - This identifies your signing key
  - **WRITE THIS DOWN IN `keystore-info.txt` NOW!**

- **Password:**
  - Can be same as keystore password OR different (your choice)
  - If different, you'll need to remember TWO passwords
  - **WRITE THIS DOWN IN `keystore-info.txt` NOW!**

- **Confirm:**
  - Re-enter the key password

- **Validity (years):**
  - Leave default: 25 years (or set to 50)

#### Certificate Information:
- **First and Last Name:** Your full name (or company name)
- **Organizational Unit:** PIT-BOX
- **Organization:** PIT-BOX App
- **City or Locality:** Your city
- **State or Province:** Your state/province
- **Country Code (XX):** US (or your 2-letter country code)

**Click "OK"**

**CRITICAL - DO THIS NOW:**
1. Open the included `keystore-info.txt` file
2. Fill in ALL the information you just entered
3. Save it in a SAFE location
4. Make a BACKUP copy (cloud storage, USB drive, etc.)

**If you lose this keystore or passwords:**
- You CANNOT update your app on Google Play Store
- You'll have to create a NEW app with a NEW package name
- You'll lose ALL reviews, ratings, and downloads
- **THIS IS IRREVERSIBLE!**

---

### Step 2: Build Release AAB

After creating keystore (or if you already have one):

1. **Menu:** Build → Generate Signed Bundle / APK...
2. **Select:** Android App Bundle (AAB)
3. **Click:** "Next"
4. **Choose existing keystore:**
   - Key store path: Browse to your `pitbox-release-key.jks` file
   - Key store password: Enter your keystore password
   - Key alias: Select `pitbox-key` (or your alias)
   - Key password: Enter your key password
5. **Check:** "Remember passwords" (optional, but convenient for your local machine)
6. **Click:** "Next"
7. **Build Variant:** Select "release"
8. **Signature Versions:** Check BOTH V1 and V2 (both should be checked)
9. **Click:** "Finish"

**Build time:** 5-15 minutes (first time)

**Success notification:** Bottom right: "Generate Signed Bundle" completed

**Output location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

**File size:** Approximately 30-60 MB

**This AAB file is what you upload to Google Play Store!**

---

### Alternative: Build Release APK

If you need an APK instead of AAB (for direct distribution, not Play Store):

1. Follow same steps as above
2. But select "APK" instead of "Android App Bundle" at step 2
3. Complete the same signing process
4. Output location: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Google Play Store strongly prefers AAB files over APK files.

---

## File Locations

### Important Folders and Files:

```
your-project/
├── android/                                    ← Android Studio project
│   ├── app/
│   │   ├── build/
│   │   │   └── outputs/
│   │   │       ├── apk/
│   │   │       │   ├── debug/
│   │   │       │   │   └── app-debug.apk      ← Debug APK (testing only)
│   │   │       │   └── release/
│   │   │       │       └── app-release.apk    ← Release APK (signed)
│   │   │       └── bundle/
│   │   │           └── release/
│   │   │               └── app-release.aab    ← Release AAB (Play Store)
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml        ← App permissions, metadata
│   │   │       ├── res/                       ← App icons, splash screens
│   │   │       └── assets/                    ← Your web app files
│   │   └── build.gradle                       ← App build configuration
│   ├── gradle/
│   │   └── wrapper/
│   │       └── gradle-wrapper.properties      ← FIX GRADLE VERSION HERE
│   ├── build.gradle                           ← Project build config
│   └── gradle.properties                      ← Gradle settings
├── dist/                                       ← Your built web app
├── src/                                        ← React source code
├── capacitor.config.ts                         ← Capacitor configuration
├── package.json                                ← Node dependencies
└── keystore-info.txt                          ← YOUR KEYSTORE INFO (FILL THIS OUT!)
```

### Quick Reference:

| File Type | Location |
|-----------|----------|
| Debug APK | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Release APK | `android/app/build/outputs/apk/release/app-release.apk` |
| Release AAB | `android/app/build/outputs/bundle/release/app-release.aab` |
| Keystore | Save OUTSIDE project (e.g., `~/Documents/pitbox-release-key.jks`) |
| Gradle Version | `android/gradle/wrapper/gradle-wrapper.properties` |

---

## Common Issues

### Issue 1: "Gradle sync failed"

**Symptoms:**
- Red errors in Android Studio
- "Gradle project sync failed" message
- Can't build project

**Solutions:**
1. **Wait longer** - First sync takes 5-10 minutes, be patient!
2. **Check internet connection** - Gradle downloads dependencies from internet
3. **Invalidate caches:**
   - File → Invalidate Caches / Restart
   - Click "Invalidate and Restart"
   - Wait for Android Studio to restart and re-index
4. **Update Gradle version** (see "Fix Gradle Warning" section above)
5. **Check Gradle wrapper:**
   ```bash
   cd android
   ./gradlew --version
   ```

---

### Issue 2: "SDK not found" or "SDK location not found"

**Symptoms:**
- "Failed to find target with hash string 'android-XX'"
- "SDK location not found"

**Solution:**
1. File → Project Structure → SDK Location
2. **Android SDK location:**
   - Windows: Usually `C:\Users\YourName\AppData\Local\Android\Sdk`
   - Mac: Usually `/Users/yourname/Library/Android/sdk`
   - Linux: Usually `/home/yourname/Android/Sdk`
3. If empty, click "..." and browse to your Android SDK
4. If you don't have one, click "Download Android SDK"
5. Recommended API Level: 33 (Android 13) or higher
6. Click "Apply" then "OK"

---

### Issue 3: Build errors mentioning "package does not exist" or "cannot find symbol"

**Symptoms:**
- Java compilation errors
- Red errors in Logcat
- Build fails with package errors

**Solution:**
```bash
# Rebuild web app and sync again
npm run build
npx cap sync android
```

Then in Android Studio:
1. Build → Clean Project
2. Build → Rebuild Project
3. Try building APK again

**If still fails:**
1. Close Android Studio
2. Delete `android/app/build` folder
3. Reopen Android Studio
4. Let Gradle sync complete
5. Build again

---

### Issue 4: "Could not find com.android.tools.build:gradle:X.X.X"

**Symptoms:**
- Gradle sync fails
- Can't download dependencies

**Solutions:**
1. **Check internet connection** - Make sure you're online
2. **Update Android Gradle Plugin:**
   - File → Project Structure → Project
   - Update "Android Gradle Plugin Version" to latest (e.g., 8.1.4)
   - Click "Apply"
   - Sync project
3. **Check `android/build.gradle`:**
   ```gradle
   dependencies {
       classpath 'com.android.tools.build:gradle:8.1.4'
   }
   ```

---

### Issue 5: App crashes immediately on phone

**Symptoms:**
- App opens then immediately closes
- White screen then crash
- "Unfortunately, PIT-BOX has stopped"

**Solutions:**
1. **Check Android version:**
   - Minimum: Android 5.0 (API 21)
   - Recommended: Android 8.0+ (API 26+)
2. **View crash logs:**
   - Connect phone via USB
   - Android Studio → Logcat (bottom panel)
   - Look for red errors
3. **Check permissions:**
   - Settings → Apps → PIT-BOX → Permissions
   - Grant Camera, Location, Storage permissions
4. **Verify Supabase credentials:**
   - Check `.env` file in project root
   - Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
5. **Rebuild clean:**
   ```bash
   npm run build
   npx cap sync android
   ```
   Then rebuild in Android Studio

---

### Issue 6: Camera/Location not working

**Symptoms:**
- Camera doesn't open
- GPS doesn't work
- "Permission denied" errors

**Solutions:**
1. **Check phone permissions:**
   - Settings → Apps → PIT-BOX → Permissions
   - Enable Camera, Location (Allow all the time)
2. **Check AndroidManifest.xml:**
   - Open `android/app/src/main/AndroidManifest.xml`
   - Verify these permissions exist:
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```
3. **For Android 10+:**
   - Location permission needs "Allow all the time" (not just "While using app")
   - Camera needs explicit permission at runtime

---

### Issue 7: "Keystore was tampered with, or password was incorrect"

**Symptoms:**
- Can't sign release build
- Password not working
- Keystore error

**Solutions:**
1. **Check your passwords:**
   - Open your `keystore-info.txt` file
   - Verify keystore password and key password
   - Try again carefully
2. **Case sensitive:**
   - Passwords are case-sensitive
   - Make sure Caps Lock is OFF
3. **If password is truly lost:**
   - **YOU CANNOT RECOVER IT**
   - You must create a NEW keystore
   - You CANNOT update existing Play Store app
   - You must publish as NEW app with NEW package name
   - **THIS IS WHY BACKUPS ARE CRITICAL!**

---

### Issue 8: "Execution failed for task ':app:processDebugResources'"

**Symptoms:**
- Build fails at resource processing
- AAPT errors

**Solutions:**
1. **Clean and rebuild:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run build
   npx cap sync android
   ```
2. **Check for invalid characters in:**
   - App name
   - Resource files
   - XML files
3. **Invalidate caches:**
   - File → Invalidate Caches / Restart

---

## Testing Checklist

### Setup Physical Device for Testing:

#### Enable Developer Mode:
1. Open Settings on your Android phone
2. Go to "About Phone"
3. Find "Build Number"
4. Tap "Build Number" 7 times rapidly
5. You'll see: "You are now a developer!"

#### Enable USB Debugging:
1. Go back to main Settings
2. Look for "Developer Options" (now visible)
3. Turn on "USB Debugging"
4. Connect phone to computer via USB cable
5. On phone: Allow USB debugging popup (check "Always allow from this computer")

#### Run from Android Studio:
1. Make sure phone is connected via USB
2. Look at device dropdown (top toolbar in Android Studio)
3. Select your device from list
4. Click green "Run" button (triangle icon) or press Shift+F10
5. App installs and launches automatically on your phone

---

### Features to Test on Physical Device:

#### Authentication:
- [ ] Sign up creates new account
- [ ] Login works with existing account
- [ ] Logout works
- [ ] "Remember me" persists session

#### Camera/Media:
- [ ] Camera opens without errors
- [ ] Can take photos
- [ ] Photos save correctly
- [ ] Can select from gallery

#### Location/GPS:
- [ ] GPS gets current location
- [ ] Location accuracy is reasonable
- [ ] Maps display correctly
- [ ] Track detection works

#### Core Features:
- [ ] App launches without crashing
- [ ] All navigation works (bottom nav, side menu, etc.)
- [ ] Setup sheets save and load
- [ ] Shock selector opens and works
- [ ] Data syncs with Supabase
- [ ] Offline mode works (if implemented)

#### Social Features:
- [ ] Community feed loads posts
- [ ] Can create new posts
- [ ] Messages send/receive
- [ ] Friend requests work
- [ ] Notifications appear

#### Payments (if applicable):
- [ ] Subscription page loads
- [ ] Stripe checkout opens
- [ ] Test payment works
- [ ] Premium features unlock

#### Performance:
- [ ] App feels responsive
- [ ] No lag when scrolling
- [ ] Images load quickly
- [ ] No memory warnings
- [ ] Battery drain is reasonable

#### Visual/UI:
- [ ] App looks good on your phone screen size
- [ ] Text is readable (not too small/large)
- [ ] Buttons are tappable
- [ ] Colors look correct
- [ ] Icons display properly

---

## Helper Script Usage

### Included Script: `android-build.sh`

This script automates common Android build tasks.

**Make it executable (first time only):**
```bash
chmod +x android-build.sh
```

### Commands:

#### First Time Setup:
```bash
./android-build.sh setup
```
- Installs Android platform
- Builds web app
- Syncs to Android
- Ready for Android Studio

#### Build and Sync (Most Common):
```bash
./android-build.sh build
```
- Builds web app (`npm run build`)
- Syncs to Android (`npx cap sync android`)
- Ready to open in Android Studio

#### Open Android Studio:
```bash
./android-build.sh open
```
- Opens project in Android Studio
- Use after `build` command

#### Clean Build Files:
```bash
./android-build.sh clean
```
- Removes `dist/` folder
- Removes `android/app/build/`
- Cleans Gradle cache
- Fresh start for troubleshooting

#### Show Help:
```bash
./android-build.sh help
```
- Shows all available commands

### Typical Workflow with Script:

**First time:**
```bash
./android-build.sh setup
./android-build.sh open
```

**Every time you make changes:**
```bash
./android-build.sh build
./android-build.sh open
```

**Or combine them:**
```bash
./android-build.sh build && ./android-build.sh open
```

**If something breaks:**
```bash
./android-build.sh clean
./android-build.sh build
./android-build.sh open
```

---

## Quick Command Reference

### First Time Setup:
```bash
npm install                    # Install dependencies
npm run build                  # Build web app
npx cap add android            # Add Android platform (once)
npx cap sync android           # Sync to Android
npx cap open android           # Open Android Studio
```

### Every Time You Make Changes:
```bash
npm run build                  # Build web app
npx cap sync android           # Sync to Android
npx cap open android           # Open Android Studio
```

### All in One:
```bash
npm run build && npx cap sync android && npx cap open android
```

### Using Helper Script:
```bash
./android-build.sh build && ./android-build.sh open
```

### Update Capacitor:
```bash
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/android@latest
npx cap sync android
```

---

## Support Resources

**Official Documentation:**
- **Capacitor:** https://capacitorjs.com/docs/android
- **Android Studio:** https://developer.android.com/studio
- **Gradle:** https://gradle.org/

**Helpful Links:**
- **Capacitor Android Guide:** https://capacitorjs.com/docs/android/configuration
- **Android Publishing:** https://developer.android.com/studio/publish
- **App Signing:** https://developer.android.com/studio/publish/app-signing

**Community:**
- **Capacitor Discord:** https://discord.gg/UPYYRhtyzp
- **Stack Overflow:** Tag with `capacitor` and `android`

---

## Final Reminders

### CRITICAL - DON'T FORGET:

1. ✅ **Always run `npm run build` before syncing to Android**
   - Android shows the last built version
   - Changes in `src/` won't appear until you build

2. ✅ **Backup your keystore file and passwords**
   - Save `pitbox-release-key.jks` in multiple locations
   - Fill out `keystore-info.txt` and backup
   - You can NEVER recover a lost keystore

3. ✅ **Test on real device, not just emulator**
   - Emulators don't have all hardware (GPS, camera, etc.)
   - Real device testing catches more issues

4. ✅ **For Play Store: Use AAB format, not APK**
   - Google Play requires AAB (Android App Bundle)
   - APK is only for direct distribution

5. ✅ **Never commit keystore to Git**
   - Add `*.jks` to `.gitignore`
   - Keep keystore OUTSIDE project folder

6. ✅ **Update Gradle to version 8.5+**
   - Fixes compatibility warnings
   - Edit `android/gradle/wrapper/gradle-wrapper.properties`

---

## Complete Build Checklist

### First Time Setup:
- [ ] Android Studio installed
- [ ] JDK 17 installed
- [ ] `npm install` completed
- [ ] `npm run build` successful
- [ ] `npx cap add android` created android folder
- [ ] `npx cap sync android` completed
- [ ] Android Studio opened project
- [ ] Gradle sync completed (green checkmark)
- [ ] Gradle version updated to 8.5
- [ ] JVM version is 17 or 19 (not 20+)

### Every Build:
- [ ] Code changes made
- [ ] `npm run build` successful
- [ ] `npx cap sync android` completed
- [ ] Android Studio opened
- [ ] Build APK completed without errors
- [ ] APK file found in expected location
- [ ] Tested on physical device
- [ ] All features work as expected

### Release Build (Play Store):
- [ ] Keystore created and saved securely
- [ ] `keystore-info.txt` filled out and backed up
- [ ] Release AAB built successfully
- [ ] AAB file signed correctly
- [ ] Tested signed APK on device
- [ ] App version code/name updated
- [ ] Release notes prepared
- [ ] Screenshots ready
- [ ] Play Store listing complete

---

## Version Information

This guide was created for:
- **PIT-BOX App Version:** 3.0.0
- **Capacitor Version:** 5.7.0
- **Recommended Gradle Version:** 8.5
- **Recommended JDK Version:** 17
- **Target Android API:** 33 (Android 13)
- **Minimum Android API:** 21 (Android 5.0)

---

**YOU'RE ALL SET! Follow this guide step by step, and you'll have your Android app built and ready for testing or the Play Store.**

**Good luck! 🚀**

---

## Need Help?

If you get stuck:
1. Read the "Common Issues" section above
2. Check Android Studio's Logcat for error messages
3. Search the error message on Google or Stack Overflow
4. Ask in Capacitor Discord: https://discord.gg/UPYYRhtyzp

Remember: First-time Android builds can be tricky, but once set up, it gets much easier!
