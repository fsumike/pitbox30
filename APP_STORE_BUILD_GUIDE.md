# Complete App Store Build & Submission Guide

This guide will walk you through building PIT-BOX for both Google Play Store and Apple App Store.

## Current Status

✅ Web app built successfully
✅ Android project created
✅ iOS project created
✅ Android version set to 3.0.0 (versionCode 3)
✅ iOS privacy permissions configured

---

## Part 1: Building for Android (Google Play Store)

### Prerequisites

1. **Install Android Studio**: Download from https://developer.android.com/studio
2. **Google Play Console Account**: $25 one-time fee at https://play.google.com/console

### Step 1: Open Project in Android Studio

```bash
# Open Android Studio, then:
# File > Open > Select the 'android' folder in your project
```

Or run:
```bash
npm run cap:open:android
```

### Step 2: Generate Signing Key

You need a signing key to publish to Google Play. Run this command:

```bash
keytool -genkeypair -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000
```

**CRITICAL - Save these values:**
- Keystore password: _______________
- Key alias: `pitbox`
- Key password: _______________
- Your name/organization details

**Keep this keystore file safe - you'll need it for ALL future updates!**

### Step 3: Configure Signing in Android Studio

1. In Android Studio, go to: **Build > Generate Signed Bundle / APK**
2. Select: **Android App Bundle** (AAB format required by Google Play)
3. Click: **Create new...**
4. Point to your `pitbox-release.keystore` file
5. Enter your passwords
6. Select: **release** build type
7. Click: **Finish**

### Step 4: Locate Your AAB File

After building, find your file at:
```
android/app/release/app-release.aab
```

This is the file you'll upload to Google Play Console!

### Alternative: Build from Command Line

```bash
cd android
./gradlew bundleRelease
```

---

## Part 2: Building for iOS (Apple App Store)

### Prerequisites

1. **Mac with Xcode**: Required for iOS builds
2. **Apple Developer Account**: $99/year at https://developer.apple.com
3. **Xcode installed**: Download from Mac App Store

### Step 1: Open Project in Xcode

```bash
npm run cap:open:ios
```

Or manually open: `ios/App/App.xcworkspace`

### Step 2: Configure Signing in Xcode

1. Select **App** in the project navigator
2. Go to **Signing & Capabilities** tab
3. Select your **Team** (Apple Developer account)
4. Xcode will automatically manage provisioning profiles

### Step 3: Set Version Number

In Xcode:
1. Select the **App** target
2. Go to **General** tab
3. Set **Version**: `3.0.0`
4. Set **Build**: `3`

### Step 4: Configure App Icons and Launch Screen

1. Select **Assets.xcassets**
2. Click **AppIcon** - drag in your app icons
3. Click **LaunchImage** - add launch screen images

### Step 5: Build Archive for App Store

1. In Xcode, select: **Product > Archive**
2. Wait for build to complete
3. In the Organizer window, click: **Distribute App**
4. Select: **App Store Connect**
5. Follow the wizard to upload

Your IPA will be uploaded to App Store Connect!

---

## Part 3: Google Play Console Setup

### Step 1: Create App

1. Go to https://play.google.com/console
2. Click: **Create app**
3. Fill in:
   - **App name**: PIT-BOX
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
4. Accept declarations and create

### Step 2: Complete App Content

You need to fill out these sections:

**1. App Access**
- Declare if all features are available to all users
- Add test credentials if needed

**2. Ads**
- Does your app contain ads? (Yes/No based on your setup)

**3. Content Rating**
- Complete the questionnaire
- Select **Utility, Productivity** category

**4. Target Audience**
- Select **Ages 13+** or appropriate range

**5. News Apps**
- Is this a news app? **No**

**6. COVID-19 Contact Tracing**
- Is this a contact tracing app? **No**

**7. Data Safety**
- What data do you collect?
- Location data (for track detection)
- User account info
- Photos (for setup sharing)
- How is data used?

**8. Government Apps**
- Is this a government app? **No**

### Step 3: Store Listing

Fill in:
- **App name**: PIT-BOX
- **Short description**: Track your race car setups and connect with racers
- **Full description**: (Detailed description of features)
- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Phone screenshots**: At least 2 (1080x1920 or 1920x1080)
- **7-inch tablet screenshots**: Optional
- **10-inch tablet screenshots**: Optional

### Step 4: Upload AAB

1. Go to: **Production > Create new release**
2. Upload your: `app-release.aab`
3. Add release notes:
   ```
   Initial release of PIT-BOX
   - Track race car setups
   - Community features
   - Setup sharing
   - Track detection
   ```
4. Save and review

### Step 5: Review and Publish

1. Complete all required sections (marked with red !)
2. Click: **Review release**
3. Click: **Start rollout to Production**

**Google Play Review Time**: 1-7 days

---

## Part 4: App Store Connect Setup

### Step 1: Create App

1. Go to https://appstoreconnect.apple.com
2. Click: **My Apps > +**
3. Select: **New App**
4. Fill in:
   - **Platform**: iOS
   - **Name**: PIT-BOX
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.pitbox.app
   - **SKU**: com.pitbox.app (or unique identifier)
   - **User Access**: Full Access

### Step 2: App Information

1. Go to: **App Information**
2. Fill in:
   - **Subtitle**: Race Car Setup Tracker
   - **Category**: Sports (Primary), Utilities (Secondary)
   - **Content Rights**: (Your info)

### Step 3: Pricing and Availability

1. Select: **Free**
2. Select: **Make this app available** (all territories)

### Step 4: Prepare for Submission

1. Go to: **iOS App** section
2. Create new version: **3.0.0**
3. Upload screenshots:
   - **6.5" Display**: Required (1284x2778 or 2778x1284)
   - **5.5" Display**: Required (1242x2208 or 2208x1242)
4. Fill in:
   - **Description**: (Full app description)
   - **Keywords**: racing, setup, track, motorsports
   - **Support URL**: Your website
   - **Marketing URL**: Optional

### Step 5: App Review Information

1. Add:
   - **First Name**: (Your name)
   - **Last Name**: (Your name)
   - **Phone**: (Your phone)
   - **Email**: (Your email)
   - **Demo Account**: (If login required)
   - **Notes**: Any special instructions

### Step 6: Version Information

1. **Copyright**: 2024 PIT-BOX
2. **Age Rating**: Complete questionnaire
3. **App Store Version**: 3.0.0

### Step 7: Submit for Review

1. Upload your build (from Xcode archive)
2. Click: **Add for Review**
3. Click: **Submit to App Review**

**Apple Review Time**: 1-3 days

---

## Important Version Numbers

- **Current Version**: 3.0.0
- **Android versionCode**: 3
- **iOS Build Number**: 3

For future updates, increment these numbers!

---

## Next Steps After Approval

Once both apps are approved:

1. **Enable Capawesome Live Updates**: Push instant updates without app store review
2. **Monitor Analytics**: Track downloads and usage
3. **Respond to Reviews**: Engage with users
4. **Plan Updates**: Add new features

---

## Required Assets Checklist

### Android (Google Play)
- [ ] App Icon: 512x512 PNG
- [ ] Feature Graphic: 1024x500 PNG
- [ ] Phone Screenshots: At least 2
- [ ] Signed AAB file

### iOS (App Store)
- [ ] App Icon: 1024x1024 PNG
- [ ] 6.5" Screenshots: 3-10 images
- [ ] 5.5" Screenshots: 3-10 images
- [ ] Signed IPA file (uploaded via Xcode)

---

## Troubleshooting

### Android Build Errors

**Issue**: Gradle sync failed
**Solution**:
```bash
cd android
./gradlew clean
./gradlew build
```

**Issue**: Signing key not found
**Solution**: Verify keystore path and passwords are correct

### iOS Build Errors

**Issue**: No signing identity found
**Solution**:
1. Xcode > Preferences > Accounts
2. Add your Apple ID
3. Download Manual Profiles

**Issue**: Missing provisioning profile
**Solution**: Let Xcode automatically manage signing

---

## Support

Need help? Common issues:
1. **Android Studio not detecting device**: Enable USB debugging on phone
2. **Xcode build fails**: Clean build folder (Cmd+Shift+K)
3. **App crashes on launch**: Check console logs in Android Studio/Xcode

---

## Build Commands Reference

```bash
# Web build
npm run build

# Add platforms (first time only)
npm run cap:add:android
npm run cap:add:ios

# Sync changes to native projects
npm run cap:sync

# Open in IDEs
npm run cap:open:android
npm run cap:open:ios
```

---

**Congratulations!** Your apps are now ready for the world. Good luck with your submissions!
