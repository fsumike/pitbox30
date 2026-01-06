# PitBox App Store Launch Checklist

**Print this and check off each item as you complete it**

---

## CRITICAL TASKS (Must Complete - Cannot Launch Without These)

### 1. Native Platform Setup
- [ ] Run `npx cap add ios`
- [ ] Run `npx cap add android`
- [ ] Verify iOS platform: Check that `ios/App/App/Info.plist` exists
- [ ] Verify Android platform: Check that `android/app/src/main/AndroidManifest.xml` exists
- [ ] Run `npm run build` to test build process

### 2. App Icons
- [ ] Design 1024x1024 master app icon
- [ ] Generate all iOS icon sizes (13 sizes from 20px to 1024px)
- [ ] Generate all Android icon sizes (6 sizes from 48px to 512px)
- [ ] Replace placeholder files in `/public/` (16 files)
- [ ] Copy iOS icons to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] Copy Android icons to `android/app/src/main/res/mipmap-*` folders
- [ ] Update `ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json`
- [ ] Verify icons are NOT 20-byte placeholder files

**Icon Generator Tools:**
- https://appicon.co/
- https://icon.kitchen/
- https://www.appicon.build/

### 3. Splash Screens
- [ ] Design 2732x2732 splash screen image
- [ ] Replace iOS splash screens in `ios/App/App/Assets.xcassets/Splash.imageset/`
- [ ] Create Android splash screen in `android/app/src/main/res/drawable/`
- [ ] Verify splash screens are NOT 20-byte placeholder files
- [ ] Test splash screens on device

### 4. iOS Permissions Cleanup
- [ ] Open `capacitor.config.ts`
- [ ] **KEEP ONLY** these 5 permission descriptions:
  - [ ] NSCameraUsageDescription
  - [ ] NSPhotoLibraryUsageDescription
  - [ ] NSPhotoLibraryAddUsageDescription
  - [ ] NSLocationWhenInUseUsageDescription
  - [ ] NSLocationAlwaysUsageDescription
- [ ] **DELETE** all other permission descriptions:
  - [ ] Remove NSMicrophoneUsageDescription
  - [ ] Remove NSMotionUsageDescription
  - [ ] Remove NSContactsUsageDescription
  - [ ] Remove NSCalendarsUsageDescription
  - [ ] Remove NSRemindersUsageDescription
  - [ ] Remove NSBluetoothAlwaysUsageDescription
  - [ ] Remove NSBluetoothPeripheralUsageDescription
  - [ ] Remove NSLocalNetworkUsageDescription
  - [ ] Remove NSFaceIDUsageDescription
  - [ ] Remove NSSiriUsageDescription
  - [ ] Remove NSSpeechRecognitionUsageDescription
  - [ ] Remove NSAppleMusicUsageDescription
  - [ ] Remove NSHealthShareUsageDescription
  - [ ] Remove NSHealthUpdateUsageDescription
  - [ ] Remove NSHomeKitUsageDescription
  - [ ] Remove NFCReaderUsageDescription
  - [ ] Remove any other unused permissions
- [ ] Save file
- [ ] Run `npx cap sync ios`

### 5. Android Signing
- [ ] Generate Android keystore:
  ```bash
  keytool -genkey -v -keystore pitbox-release.keystore \
    -alias pitbox -keyalg RSA -keysize 2048 -validity 10000
  ```
- [ ] Record keystore password (store in password manager!)
- [ ] Record key alias password (store in password manager!)
- [ ] Create `android/keystore.properties` file:
  ```
  storeFile=../../pitbox-release.keystore
  storePassword=YOUR_KEYSTORE_PASSWORD
  keyAlias=pitbox
  keyPassword=YOUR_KEY_PASSWORD
  ```
- [ ] Add signing config to `android/app/build.gradle`
- [ ] **BACKUP KEYSTORE FILE** (if lost, can never update app!)
- [ ] Test release build: `cd android && ./gradlew bundleRelease`

### 6. Security Fixes
- [ ] Move GIPHY API key from `GifPicker.tsx` to `.env` as `VITE_GIPHY_API_KEY`
- [ ] Add `.env` to `.gitignore`
- [ ] Create `.env.example` with dummy values
- [ ] Run `git rm --cached .env` to remove from git
- [ ] **ROTATE THESE SECRETS** (they were committed to git):
  - [ ] Generate new EmailJS keys
  - [ ] Generate new Stripe keys (use different test/live keys)
  - [ ] Generate new Capawesome token
  - [ ] Update Supabase anon key if needed
- [ ] Create Supabase Edge Function for email sending
- [ ] Remove `VITE_EMAILJS_PRIVATE_KEY` from client
- [ ] Change `cleartext: true` to `false` in `capacitor.config.ts`

---

## HIGH PRIORITY TASKS (Required for Approval)

### 7. Screenshots
- [ ] Build and install app on test devices
- [ ] iOS Screenshots Required:
  - [ ] iPhone 6.9" (iPhone 16 Pro Max)
  - [ ] iPhone 6.7" (iPhone 15 Pro Max)
  - [ ] iPhone 6.5" (iPhone 14 Pro Max)
  - [ ] iPhone 6.1" (iPhone 15 Pro)
  - [ ] iPhone 5.5" (iPhone 8 Plus)
- [ ] Android Screenshots Required:
  - [ ] Phone: 1080x1920 minimum
  - [ ] Tablet: 1200x1920 minimum
- [ ] Capture these key screens:
  - [ ] Welcome/onboarding screen
  - [ ] Main setup sheet interface
  - [ ] Track detection feature
  - [ ] Community/social feed
  - [ ] Tools/calculators section
- [ ] Optionally use mockup tools:
  - https://app-mockup.com/
  - https://www.mockuphone.com/

### 8. App Store Descriptions

#### iOS App Store Connect:
- [ ] App Name (30 characters max)
- [ ] Subtitle (30 characters max)
- [ ] Description (4000 characters max)
- [ ] Keywords (100 characters, comma-separated)
- [ ] What's New / Release Notes (4000 characters max)
- [ ] Promotional Text (170 characters max)
- [ ] Support URL
- [ ] Marketing URL (optional)

#### Google Play Console:
- [ ] Short Description (80 characters max)
- [ ] Full Description (4000 characters max)
- [ ] What's New (500 characters max)
- [ ] Feature Graphic (1024x500 PNG or JPG)

### 9. Privacy & Legal URLs
- [ ] Verify https://pit-box.com/privacy is publicly accessible (no auth required)
- [ ] Verify https://pit-box.com/terms is publicly accessible (no auth required)
- [ ] Test URLs in incognito/private browser window
- [ ] Have URLs ready for store submission forms

---

## MEDIUM PRIORITY TASKS (Best Practices)

### 10. Code Cleanup
- [ ] Update Privacy Policy date from "November 15, 2025" to current date
  - Location: `src/pages/Privacy.tsx:13`
- [ ] Review and clean up console.log statements (optional - build removes them)
- [ ] Run final linter check: `npm run lint`

### 11. Build Script Optimization
- [ ] Remove `npx cap add android || true` from `package.json` build script
- [ ] Remove `npx cap add ios || true` from `package.json` build script
- [ ] Keep only `vite build && npx cap sync` in build script

---

## BUILD & TEST TASKS

### 12. iOS Build (Requires Mac + Xcode)
- [ ] Install CocoaPods dependencies: `cd ios/App && pod install`
- [ ] Open in Xcode: `npx cap open ios`
- [ ] Select "Any iOS Device" or connected device
- [ ] Set signing team in Xcode project settings
- [ ] Build app: Product > Build (⌘B)
- [ ] Fix any build errors
- [ ] Archive app: Product > Archive (⌘⌥B)
- [ ] Upload to App Store Connect

### 13. Android Build
- [ ] Open Android Studio: `npx cap open android`
- [ ] Wait for Gradle sync to complete
- [ ] Select Build > Generate Signed Bundle / APK
- [ ] Choose Android App Bundle (AAB)
- [ ] Select release keystore
- [ ] Build and save AAB file
- [ ] Test AAB in internal testing track

### 14. Device Testing
- [ ] Install on physical iOS device
- [ ] Install on physical Android device
- [ ] Test all main features:
  - [ ] Camera access (dyno sheets)
  - [ ] Photo library save/load
  - [ ] Location tracking
  - [ ] Push notifications
  - [ ] In-app purchases
  - [ ] Setup creation and saving
  - [ ] Community features
  - [ ] Offline functionality
- [ ] Check for crashes or errors
- [ ] Test on slow/no internet connection
- [ ] Test with location services off/on
- [ ] Test camera permissions denied/granted

---

## STORE SUBMISSION TASKS

### 15. Apple Developer Account
- [ ] Have active Apple Developer account ($99/year)
- [ ] Create App ID in Apple Developer portal
- [ ] Create iOS certificates:
  - [ ] iOS Distribution certificate
  - [ ] iOS Development certificate
- [ ] Create provisioning profiles:
  - [ ] App Store Distribution profile
  - [ ] Development profile
- [ ] Download and install certificates in Xcode

### 16. Google Play Developer Account
- [ ] Have active Google Play Developer account ($25 one-time)
- [ ] Complete account verification
- [ ] Accept developer agreement
- [ ] Set up merchant account (for in-app purchases)

### 17. App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Select bundle ID (com.pitbox.app)
- [ ] Upload screenshots
- [ ] Fill in app description
- [ ] Set category: Sports or Lifestyle
- [ ] Set age rating (complete questionnaire)
- [ ] Upload app icon (1024x1024)
- [ ] Set pricing (Free with in-app purchases)
- [ ] Configure in-app purchases:
  - [ ] Premium subscription
  - [ ] Any other products
- [ ] Enter privacy policy URL
- [ ] Enter support URL
- [ ] Submit for review

### 18. Google Play Console Setup
- [ ] Create new app in Play Console
- [ ] Select app name and default language
- [ ] Upload screenshots (phone and tablet)
- [ ] Upload feature graphic
- [ ] Fill in description
- [ ] Set category: Sports or Lifestyle
- [ ] Set content rating (complete questionnaire)
- [ ] Upload app icon (512x512)
- [ ] Set pricing (Free with in-app purchases)
- [ ] Configure in-app products:
  - [ ] Premium subscription
  - [ ] Any other products
- [ ] Enter privacy policy URL
- [ ] Upload signed AAB to internal testing
- [ ] Test internal release
- [ ] Promote to production and submit

---

## BETA TESTING (RECOMMENDED)

### 19. iOS Beta Testing (TestFlight)
- [ ] Upload build to App Store Connect
- [ ] Add internal testers
- [ ] Add external testers (optional)
- [ ] Distribute build via TestFlight
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Upload new build if needed

### 20. Android Beta Testing
- [ ] Upload AAB to internal testing track
- [ ] Add internal testers
- [ ] Create closed testing track (optional)
- [ ] Add external testers (optional)
- [ ] Distribute build
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Upload new build if needed

---

## POST-LAUNCH TASKS

### 21. Monitoring & Support
- [ ] Monitor crash reports (Xcode Organizer / Play Console)
- [ ] Monitor user reviews
- [ ] Respond to user feedback
- [ ] Set up customer support email monitoring (pitboxcom@gmail.com)
- [ ] Create FAQ document
- [ ] Plan first update/bug fix release

### 22. Marketing & Promotion
- [ ] Announce launch on social media
- [ ] Create app landing page
- [ ] Reach out to racing communities
- [ ] Consider app store optimization (ASO)
- [ ] Track key metrics:
  - Downloads
  - Active users
  - Subscription conversions
  - User retention

---

## ESTIMATED TIME TO COMPLETE

| Section | Time Required |
|---------|---------------|
| Tasks 1-6 (Critical) | 8-12 hours |
| Tasks 7-9 (High Priority) | 4-6 hours |
| Tasks 10-11 (Medium Priority) | 1 hour |
| Tasks 12-14 (Build & Test) | 4-8 hours |
| Tasks 15-18 (Store Submission) | 3-4 hours |
| Tasks 19-20 (Beta Testing) | 3-7 days |
| **TOTAL ACTIVE WORK** | **20-30 hours** |
| **TOTAL CALENDAR TIME** | **1-2 weeks** |

---

## QUICK START (Do This Now)

**First 5 Minutes:**
```bash
# 1. Generate platforms
npx cap add ios
npx cap add android

# 2. Verify platforms exist
ls -la ios/App/App/Info.plist
ls -la android/app/src/main/AndroidManifest.xml

# 3. Test build
npm run build
```

**Next Priority:**
1. Create app icons (use generator tools)
2. Fix iOS permissions in capacitor.config.ts
3. Secure API keys and rotate secrets

---

## NOTES & REMINDERS

- **BACKUP YOUR ANDROID KEYSTORE!** If you lose it, you can never update the app
- Store all passwords in a secure password manager
- Test on physical devices, not just simulators
- Apple review takes 1-3 days, Google takes 1-7 days
- Budget extra time for potential rejections and resubmissions
- Keep your developer accounts active (Apple is yearly subscription)

---

## RESOURCES

**Icon Generators:**
- https://appicon.co/
- https://icon.kitchen/
- https://www.appicon.build/

**Screenshot Tools:**
- https://app-mockup.com/
- https://www.mockuphone.com/

**Your Documentation:**
- PRE_LAUNCH_CRITICAL_ISSUES.md (detailed fix guide)
- MOBILE_APP_READINESS_CHECKLIST.md
- APP_STORE_LAUNCH_CHECKLIST.md
- IOS_SETUP_GUIDE.md
- ANDROID_SETUP_GUIDE.md

**Developer Portals:**
- Apple Developer: https://developer.apple.com/
- Google Play Console: https://play.google.com/console/
- App Store Connect: https://appstoreconnect.apple.com/

---

**Last Updated:** January 6, 2026

**Current Status:** 60% Ready - Complete critical tasks first, then work through the rest

**Good luck with your launch! 🏁**
