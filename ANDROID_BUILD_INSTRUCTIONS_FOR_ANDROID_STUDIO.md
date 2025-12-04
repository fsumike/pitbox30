# PitBox Android App - Complete Build Instructions

This guide will walk you through building the PitBox Android app using Android Studio step by step.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Android Studio** (latest version recommended)
   - Download from: https://developer.android.com/studio
   - Version: Android Studio Hedgehog (2023.1.1) or newer

2. **Java Development Kit (JDK)**
   - Android Studio usually includes this
   - Required version: JDK 11 or higher

## Part 1: Setting Up Android Studio

### Step 1: Install Android Studio

1. Download Android Studio from https://developer.android.com/studio
2. Run the installer
3. Follow the setup wizard
4. When prompted, choose "Standard" installation
5. Wait for Android Studio to download all required components

### Step 2: Install Android SDK Components

1. Open Android Studio
2. Click on "More Actions" or "Configure" (on welcome screen)
3. Select "SDK Manager"
4. In the "SDK Platforms" tab, make sure the following are checked:
   - Android 13.0 (Tiramisu) - API Level 33
   - Android 12.0 (S) - API Level 31
   - Android 11.0 (R) - API Level 30
5. Click on the "SDK Tools" tab
6. Make sure the following are checked:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator (if you want to test on emulator)
   - Google Play services
7. Click "Apply" and wait for downloads to complete

## Part 2: Opening the Project in Android Studio

### Step 3: Open the Android Project

1. Open Android Studio
2. Click "Open" (or File → Open)
3. Navigate to your PitBox project folder
4. **IMPORTANT:** Select the `android` folder inside your project
   - Example path: `C:\Users\YourName\PitBox\android`
   - Do NOT open the root project folder
   - Do NOT open any other subfolder
5. Click "OK"

### Step 4: Wait for Gradle Sync

1. Android Studio will automatically start syncing Gradle
2. You'll see a progress bar at the bottom: "Gradle Sync in progress..."
3. This may take 5-15 minutes the first time
4. Wait until you see "Gradle sync finished" or "Build successful"

**If you see errors:**
- Click "File" → "Sync Project with Gradle Files"
- If that doesn't work, click "Build" → "Clean Project", then "Build" → "Rebuild Project"

## Part 3: Building the APK

### Step 5: Select Build Variant

1. In Android Studio, look at the bottom left
2. Click on "Build Variants" (or View → Tool Windows → Build Variants)
3. You'll see two options:
   - **debug** - For testing (creates a larger APK)
   - **release** - For production (creates an optimized APK)
4. For now, select **debug** to test
5. Later, you'll use **release** for the Play Store

### Step 6: Build the APK

#### For Debug APK (Testing):

1. Click on "Build" in the top menu
2. Select "Build Bundle(s) / APK(s)"
3. Click "Build APK(s)"
4. Wait for the build to complete
5. You'll see a notification: "APK(s) generated successfully"
6. Click "locate" in the notification

The APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### For Release APK (Production):

**IMPORTANT:** Release APKs must be signed with a keystore. See Part 4 below.

## Part 4: Creating a Signed Release APK

To upload your app to Google Play Store, you need a signed release APK.

### Step 7: Generate a Keystore (First Time Only)

1. In Android Studio, click "Build" → "Generate Signed Bundle / APK"
2. Select "APK" and click "Next"
3. Click "Create new..." (next to Key store path)
4. Fill in the form:
   - **Key store path:** Choose a location (e.g., `C:\Users\YourName\pitbox-keystore.jks`)
   - **Password:** Create a strong password (SAVE THIS!)
   - **Alias:** Enter `pitbox` (or any name you like)
   - **Alias Password:** Same as keystore password or different (SAVE THIS!)
   - **Validity (years):** 25
   - **First and Last Name:** Your name or company name
   - **Organizational Unit:** Your team/department (optional)
   - **Organization:** Your company name (optional)
   - **City or Locality:** Your city
   - **State or Province:** Your state
   - **Country Code:** Your country code (e.g., US, UK, CA)
5. Click "OK"

**CRITICAL:** Save your keystore file and passwords in a SAFE place!
- If you lose the keystore, you CANNOT update your app on Play Store
- You'll have to publish as a new app with a different package name

### Step 8: Build Signed Release APK

1. Click "Build" → "Generate Signed Bundle / APK"
2. Select "APK" and click "Next"
3. Fill in the keystore information:
   - **Key store path:** Browse to your keystore file
   - **Key store password:** Enter the password you created
   - **Key alias:** Enter the alias (e.g., `pitbox`)
   - **Key password:** Enter the alias password
4. Check "Remember passwords" (optional, but convenient)
5. Click "Next"
6. Select "release" as the build variant
7. Select both signature versions (V1 and V2)
8. Click "Finish"
9. Wait for the build to complete

The signed release APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Part 5: Installing the APK on Your Device

### Step 9: Install on Android Device

#### Option A: Via USB Cable

1. Enable Developer Options on your Android phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"
2. Enable USB Debugging:
   - Go to Settings → Developer Options
   - Turn on "USB Debugging"
3. Connect your phone to your computer via USB
4. Allow USB debugging when prompted on your phone
5. In Android Studio, click the green "Run" button (▶️)
6. Select your device from the list
7. The app will install and launch automatically

#### Option B: Direct APK Install

1. Copy the APK file to your phone:
   - Email it to yourself
   - Upload to Google Drive and download on phone
   - Transfer via USB cable
2. On your phone, open the APK file
3. You may need to allow "Install from Unknown Sources"
4. Tap "Install"
5. The app will install

## Part 6: Troubleshooting Common Issues

### Issue 1: "Gradle sync failed"

**Solution:**
1. Click "File" → "Invalidate Caches / Restart"
2. Select "Invalidate and Restart"
3. Wait for Android Studio to restart
4. Try syncing again

### Issue 2: "SDK location not found"

**Solution:**
1. In Android Studio, go to "File" → "Project Structure"
2. Under "SDK Location", make sure the Android SDK path is correct
3. It should be something like: `C:\Users\YourName\AppData\Local\Android\Sdk`
4. Click "OK"

### Issue 3: "Build failed: compileSdkVersion"

**Solution:**
1. Open "SDK Manager" (Tools → SDK Manager)
2. Install Android SDK Platform 33
3. Click "Apply" and wait for installation
4. Sync project again

### Issue 4: "AAPT2 error"

**Solution:**
1. Click "File" → "Sync Project with Gradle Files"
2. If that doesn't work:
   - Go to "File" → "Settings" → "Build, Execution, Deployment" → "Gradle"
   - Change "Gradle JDK" to "Embedded JDK"
   - Click "OK"
   - Sync again

### Issue 5: APK won't install on device

**Solution:**
- If you already have PitBox installed, uninstall it first
- Make sure "Install from Unknown Sources" is enabled
- Try a different transfer method (email vs USB)

## Part 7: Next Steps

### Customize Your App

Before building for production, you should:

1. **Update App Icon:**
   - Replace files in `android/app/src/main/res/mipmap-*` folders
   - Use Android Studio's Image Asset Studio: Right-click `res` → New → Image Asset

2. **Update App Name:**
   - Edit `android/app/src/main/res/values/strings.xml`
   - Change the `app_name` value

3. **Update Package Name (if needed):**
   - In `android/app/build.gradle`, change `applicationId`
   - Note: This must match your Play Store listing

### Prepare for Google Play Store

1. Build a signed release APK (see Part 4)
2. Test thoroughly on multiple devices
3. Create a developer account at https://play.google.com/console
4. Prepare app listing materials:
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (at least 2)
   - App description
   - Privacy policy URL
5. Upload your signed APK
6. Fill in all required information
7. Submit for review

## Part 8: File Locations Reference

Here's where to find important files:

```
android/
├── app/
│   ├── build.gradle                    # App-level Gradle config
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml     # App permissions and config
│   │       ├── java/                   # Java/Kotlin source code
│   │       └── res/                    # Resources (icons, strings, etc.)
│   │           ├── mipmap-*/           # App icons
│   │           ├── values/             # Strings, colors, styles
│   │           └── drawable/           # Images and drawables
│   └── build/
│       └── outputs/
│           └── apk/
│               ├── debug/              # Debug APKs
│               └── release/            # Release APKs
├── build.gradle                        # Project-level Gradle config
├── variables.gradle                    # SDK versions and dependencies
└── gradlew                            # Gradle wrapper script
```

## Quick Reference Commands

If you prefer using the command line:

### Build Debug APK:
```bash
cd android
./gradlew assembleDebug
```

### Build Release APK:
```bash
cd android
./gradlew assembleRelease
```

### Install on connected device:
```bash
cd android
./gradlew installDebug
```

### Clean build:
```bash
cd android
./gradlew clean
```

## Support and Resources

- **Capacitor Documentation:** https://capacitorjs.com/docs
- **Android Developer Guide:** https://developer.android.com/guide
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/android-studio

## Important Notes

1. **Always keep your keystore file safe!** Back it up in multiple secure locations.
2. **Never share your keystore passwords publicly.**
3. **The first build always takes longer** - subsequent builds will be faster.
4. **Test on real devices** - emulators don't always behave the same way.
5. **Keep Android Studio updated** for the latest features and bug fixes.

---

**Congratulations!** You should now be able to build your PitBox Android app. If you encounter any issues not covered here, check the troubleshooting section or seek help from the Android developer community.

Good luck with your app launch!
