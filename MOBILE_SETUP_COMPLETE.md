# Mobile App Setup - Complete

Your PitBox app is now fully configured for both Android and iOS!

## What Has Been Set Up

### ✅ Android Platform
- **Platform Added**: Android project created in `/android` folder
- **Web Assets Synced**: Your built app is ready in the Android project
- **Permissions Configured**: All necessary permissions added to AndroidManifest.xml
  - Internet & Network access
  - Camera access (for setup photos, dyno sheets)
  - Location access (for track detection)
  - Storage access (for saving photos and files)
  - Push notifications

### ✅ iOS Platform
- **Platform Added**: iOS project created in `/ios` folder
- **Web Assets Synced**: Your built app is ready in the iOS project
- **Permissions Configured**: All required privacy descriptions added to Info.plist
  - Camera usage description
  - Photo library access
  - Location services
  - Microphone access (for voice notes)
- **Privacy Manifest**: PrivacyInfo.xcprivacy added (required for App Store)

### ✅ Capacitor Plugins Configured
The following plugins are installed and configured:
- @capacitor/app - App lifecycle events
- @capacitor/camera - Take photos and access gallery
- @capacitor/device - Device information
- @capacitor/filesystem - File access and storage
- @capacitor/geolocation - Location services for track detection
- @capacitor/network - Network status monitoring
- @capacitor/push-notifications - Push notification support
- @capacitor/share - Native sharing functionality
- @capacitor/splash-screen - Launch screen
- @capacitor/status-bar - Status bar styling

## Project Structure

```
project/
├── android/                    # Android project (open in Android Studio)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # Permissions configured ✓
│   │   │   ├── assets/public/       # Your web app
│   │   │   └── java/com/pitbox/app/
│   │   └── build.gradle
│   ├── build.gradle
│   └── gradlew                # Build script
│
├── ios/                       # iOS project (open in Xcode)
│   └── App/
│       ├── App/
│       │   ├── Info.plist            # Permissions configured ✓
│       │   ├── PrivacyInfo.xcprivacy # Privacy manifest ✓
│       │   └── public/               # Your web app
│       └── App.xcodeproj
│
├── dist/                      # Built web app (synced to mobile)
├── capacitor.config.ts        # Capacitor configuration
└── package.json
```

## Next Steps

### For Android Development:

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install with standard configuration
   - Wait for all components to download

2. **Open the Project**
   - Launch Android Studio
   - Click "Open" and select the `android/` folder
   - Wait for Gradle sync (first time takes 5-15 minutes)

3. **Build Debug APK** (for testing)
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```
   - APK location: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Install on your device for testing

4. **Build Release APK** (for Google Play Store)
   ```
   Build → Generate Signed Bundle / APK
   ```
   - Create/use a keystore (SAVE IT SAFELY!)
   - Build signed APK
   - Ready for Play Store upload

### For iOS Development:

1. **Requirements**
   - Mac computer with macOS
   - Xcode installed (from Mac App Store)
   - Apple Developer Account ($99/year for App Store)

2. **Open the Project**
   - Open Xcode
   - File → Open → Select `ios/App/App.xcworkspace`
   - Wait for dependencies to resolve

3. **Configure Signing**
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Select your team/Apple Developer account
   - Xcode will handle provisioning profiles

4. **Build for Testing**
   - Connect iPhone via USB
   - Select your device in Xcode
   - Click Run (▶️) button
   - App installs and runs on your device

5. **Build for App Store**
   - Product → Archive
   - Upload to App Store Connect
   - Submit for review

## Making Changes

When you modify your web app:

1. **Rebuild the web app**
   ```bash
   npm run build
   ```

2. **Sync changes to mobile**
   ```bash
   npx cap sync
   ```

3. **Rebuild in Android Studio or Xcode**

## App Configuration

### App Details
- **App Name**: PIT-BOX
- **App ID**: com.pitbox.app
- **Package Name (Android)**: com.pitbox.app
- **Bundle ID (iOS)**: com.pitbox.app

### Change App Name
- **Android**: Edit `android/app/src/main/res/values/strings.xml`
- **iOS**: Edit `ios/App/App/Info.plist` (CFBundleDisplayName)

### Change App Icons
- **Android**: Replace icons in `android/app/src/main/res/mipmap-*` folders
- **iOS**: Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset`

## Environment Variables

Make sure your `.env` file has all required values:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_EMAILJS_SERVICE_ID
- VITE_EMAILJS_TEMPLATE_ID
- VITE_EMAILJS_PUBLIC_KEY

These are automatically included in the mobile builds.

## Testing Checklist

Before submitting to app stores, test:

- [ ] User login/registration
- [ ] Camera access for setup photos
- [ ] Location services for track detection
- [ ] Photo saving and loading
- [ ] Setup sheet creation and editing
- [ ] Setup sharing functionality
- [ ] Push notifications
- [ ] All racing class setup sheets
- [ ] Tools and calculators
- [ ] Community features
- [ ] Payments/subscriptions

## Common Issues & Solutions

### Android Build Fails
- **Solution**: Update Gradle to 8.7+ (already configured)
- Check that Java/JDK is installed
- Clear Gradle cache: `./gradlew clean` in android folder

### iOS Build Fails
- **Solution**: Run `pod install` in `ios/App` folder
- Update CocoaPods: `sudo gem install cocoapods`
- Clean build: Product → Clean Build Folder in Xcode

### Changes Not Appearing
- **Solution**: Always run `npm run build` then `npx cap sync`
- Hard reload in Android Studio/Xcode

### Permissions Not Working
- **Solution**: All permissions are already configured!
- Make sure to test on a real device, not simulator
- Users must accept permission prompts

## App Store Submission

### Google Play Store (Android)
1. Create developer account ($25 one-time)
2. Create app listing in Play Console
3. Upload signed APK/AAB
4. Fill out store listing (title, description, screenshots)
5. Submit for review (typically 2-3 days)

### Apple App Store (iOS)
1. Enroll in Apple Developer Program ($99/year)
2. Create app in App Store Connect
3. Archive and upload from Xcode
4. Fill out app information
5. Submit for review (typically 1-2 days)

## Resources

### Documentation
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/)
- [iOS Developer Guide](https://developer.apple.com/)

### Build Commands
```bash
# Rebuild web app
npm run build

# Sync to mobile platforms
npx cap sync

# Sync specific platform
npx cap sync android
npx cap sync ios

# Open in IDE
npx cap open android
npx cap open ios

# Update Capacitor
npm install @capacitor/core @capacitor/cli@latest
npm install @capacitor/android@latest
npm install @capacitor/ios@latest
npx cap sync
```

## You're All Set! 🚀

Your mobile app is fully configured and ready to build. The app includes:
- ✅ All necessary permissions
- ✅ Native mobile functionality
- ✅ Camera and location services
- ✅ Push notification support
- ✅ Privacy compliance (iOS)
- ✅ Professional app configuration

Open Android Studio or Xcode and start building!
