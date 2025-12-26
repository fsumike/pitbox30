# Capawesome Cloud Quick Start Guide
## Build & Deploy PitBox to iOS and Android - No Mac or Android Studio Required!

This is your complete guide to launching PitBox on both App Stores using Capawesome Cloud Native Builds.

---

## 🎯 What You'll Accomplish

By following this guide, you'll:
- ✅ Build production-ready iOS and Android apps in the cloud
- ✅ Deploy to TestFlight and Google Play Internal Testing
- ✅ Submit to both app stores for review
- ✅ Set up OTA updates for instant bug fixes

**Total Time**: 2-4 hours (mostly waiting for builds and reviews)
**Cost**: $9-$29/month (Capawesome) + $99/year (Apple) + $25 one-time (Google)

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

### Accounts:
- [ ] Apple Developer Account ($99/year) - [Sign up](https://developer.apple.com/programs/)
- [ ] Google Play Developer Account ($25 one-time) - [Sign up](https://play.google.com/console/signup)
- [ ] Capawesome Cloud Account - [Sign up](https://cloud.capawesome.io/)

### Local Setup:
- [ ] Node.js 18+ installed
- [ ] Java JDK installed (for Android keystore generation)
- [ ] Git repository access (GitHub, GitLab, Bitbucket, or Azure DevOps)

### Files Needed:
- [ ] App icons (1024x1024 for iOS, 512x512 for Android)
- [ ] Screenshots for both platforms
- [ ] Privacy Policy URL
- [ ] Terms of Service URL

---

## 🚀 Step-by-Step Launch Plan

### Phase 1: Account Setup (30 minutes)

#### 1. Verify Your Capawesome Account

```bash
# Login to Capawesome CLI
npx @capawesome/cli login

# Verify you're logged in
npx @capawesome/cli whoami

# Should show: Logged in as: [Your Email]
# App ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8
```

#### 2. Create Apple Developer Account
- Go to [Apple Developer](https://developer.apple.com/programs/)
- Enroll as Individual or Organization
- Pay $99/year fee
- Wait for approval (usually same day)

#### 3. Create Google Play Developer Account
- Go to [Google Play Console](https://play.google.com/console/signup)
- Pay $25 one-time registration fee
- Complete account setup
- Verify identity (if required)

---

### Phase 2: Generate Signing Credentials (45 minutes)

#### iOS Certificate Generation

**On a Mac (you'll need access to one Mac, just once):**

See detailed guide: `CAPAWESOME_IOS_CERTIFICATES_GUIDE.md`

**Quick Steps:**
1. Request Certificate Signing Request in Keychain Access
2. Create iOS Distribution Certificate in Apple Developer Portal
3. Export as .p12 file with password
4. Create App ID: `com.pitbox.app`
5. Create App Store Provisioning Profile
6. Download .mobileprovision file

**Save these files securely:**
- `ios-distribution.p12` + password
- `PitBox App Store Profile.mobileprovision`

#### Android Keystore Generation

**On any computer (Windows, Mac, or Linux):**

See detailed guide: `CAPAWESOME_ANDROID_KEYSTORE_GUIDE.md`

**Quick Steps:**
```bash
# Generate keystore
keytool -genkey -v -keystore pitbox-release.keystore \
  -alias pitbox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS

# Save these details:
# - Keystore password
# - Key alias: pitbox
# - Key password
```

**Save this file securely:**
- `pitbox-release.keystore` + passwords

---

### Phase 3: Upload Credentials to Capawesome (15 minutes)

#### Upload iOS Certificate

**Via Web Console:**
1. Go to [Capawesome Cloud](https://cloud.capawesome.io/)
2. Navigate to your app → Settings → iOS Signing
3. Upload:
   - Certificate: `ios-distribution.p12`
   - Password: [Your .p12 password]
   - Provisioning Profile: `*.mobileprovision`

**Via CLI:**
```bash
npx @capawesome/cli apps:certificates:upload \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --certificate ios-distribution.p12 \
  --password "YOUR_P12_PASSWORD" \
  --provisioning-profile "PitBox App Store Profile.mobileprovision"
```

#### Upload Android Keystore

**Via Web Console:**
1. Navigate to Settings → Android Signing
2. Upload:
   - Keystore: `pitbox-release.keystore`
   - Keystore Password: [Your password]
   - Key Alias: `pitbox`
   - Key Password: [Your key password]

**Via CLI:**
```bash
npx @capawesome/cli apps:keystores:upload \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --keystore pitbox-release.keystore \
  --keystore-password "YOUR_KEYSTORE_PASSWORD" \
  --key-alias pitbox \
  --key-password "YOUR_KEY_PASSWORD"
```

---

### Phase 4: Configure App Store Listings (Jenny baby)
2. Create New App:
   - Name: PitBox
   - Bundle ID: com.pitbox.app
   - SKU: com.pitbox.app.2024
3. Fill in App Information:
   - Category: Sports
   - Age Rating: 4+
   - Privacy Policy URL
4. Add Screenshots (see `APP_STORE_ASSETS_COMPLETE_CHECKLIST.md`)
5. Configure In-App Purchases:
   - Monthly: com.pitbox.app.premium.monthly ($9.99)
   - Yearly: com.pitbox.app.premium.yearly ($79.99)

#### Android - Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Create New App:
   - Name: PitBox
   - Language: English
   - Type: App
   - Free with in-app purchases
3. Complete Store Listing:
   - App name, description, screenshots
   - Feature graphic (1024x500)
   - Category: Sports
   - Content rating questionnaire
4. Complete Data Safety Form:
   - Declare location, photos, personal info collection
   - Mark location as optional
   - No third-party sharing
5. Configure In-App Products:
   - com.pitbox.app.premium.monthly ($9.99/month)
   - com.pitbox.app.premium.yearly ($79.99/year)

---

### Phase 5: Trigger Cloud Builds (20 minutes)

#### Build iOS App

**Via CLI:**
```bash
# Start iOS build
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --download-ipa

# Monitor progress
# Build time: ~5-10 minutes on M4 instances
```

**Via Web Console:**
1. Go to Capawesome Cloud Dashboard
2. Navigate to Builds
3. Click "Create Build"
4. Select iOS platform
5. Click "Build Now"
6. Monitor progress in real-time

**What Capawesome Does:**
- ✅ Clones your Git repository
- ✅ Runs `npm install` and `npm run build`
- ✅ Executes Capacitor sync
- ✅ Builds Xcode project with your certificate
- ✅ Signs the IPA with your provisioning profile
- ✅ Generates downloadable IPA file

#### Build Android App

**Via CLI:**
```bash
# Start Android build
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --download-apk \
  --download-aab

# Monitor progress
# Build time: ~3-7 minutes
```

**Via Web Console:**
1. Same process as iOS
2. Select Android platform
3. Click "Build Now"

**What Capawesome Does:**
- ✅ Clones your Git repository
- ✅ Runs `npm install` and `npm run build`
- ✅ Executes Capacitor sync
- ✅ Builds Gradle project with your keystore
- ✅ Signs APK and AAB with your keystore
- ✅ Generates both APK (testing) and AAB (Play Store)

---

### Phase 6: Test Builds (30 minutes)

#### Test iOS Build

**  (Automatic):**

If you configured App Store Connect API key:
- Build automatically uploads to TestFlight
- Add beta testers
- Testers receive invitation email
- Install and test the app

**Via Manual Upload:**
1. Download IPA from Capawesome Cloud
2. Open Transporter app on Mac
3. Drag and drop IPA
4. Click "Deliver"
5. Wait 10-30 minutes for processing
6. Add testers in TestFlight

#### Test Android Build

**Via Internal Testing:**

1. Download AAB from Capawesome Cloud
2. Upload to Google Play Console → Internal Testing
3. Add internal testers (email addresses)
4. Share opt-in link with testers
5. Testers install and test

**Via Direct APK Install:**
1. Download APK from Capawesome Cloud
2. Transfer to Android device
3. Enable "Install from Unknown Sources"
4. Install APK directly
5. Test all features

#### Testing Checklist:
- [ ] App launches successfully
- [ ] Login/signup works
- [ ] Camera permission works
- [ ] Location permission works (optional)
- [ ] Push notifications work
- [ ] In-app purchases show correctly (test mode)
- [ ] All major features function
- [ ] No crashes or critical bugs

---

### Phase 7: Deploy to App Stores (15 minutes)

#### Submit iOS to App Store

1. In App Store Connect:
   - Go to your app
   - Select the TestFlight build
   - Click "Submit for Review"
2. Answer review questions:
   - Advertising identifier: No
   - Encryption: No (unless you added it)
   - Content rights: Yes
3. Provide demo account credentials
4. Add review notes (see `APP_STORE_ASSETS_COMPLETE_CHECKLIST.md`)
5. Click "Submit"

**Review Time**: Typically 24-48 hours

#### Submit Android to Google Play

1. In Google Play Console:
   - Navigate to Production track
   - Click "Create new release"
   - Upload AAB file
   - Add release notes
2. Review release:
   - Countries: Select all
   - Rollout: 100% or staged
3. Click "Review Release"
4. Click "Start Rollout to Production"

**Review Time**: Typically 1-3 days

---

### Phase 8: Configure Auto-Deploy (Optional, 30 minutes)

#### iOS Auto-Deploy to TestFlight

1. Generate App Store Connect API Key:
   - App Store Connect → Users and Access → Keys
   - Create new key: "Capawesome Cloud"
   - Download .p8 file (only shown once!)
   - Note Key ID and Issuer ID

2. Upload to Capawesome Cloud:
   - Settings → iOS Deployments
   - Upload .p8 key
   - Enter Key ID and Issuer ID
   - Enable "Auto-deploy to TestFlight"

**Result**: Every successful iOS build automatically uploads to TestFlight!

#### Android Auto-Deploy to Google Play

1. Create Service Account:
   - Google Play Console → Setup → API Access
   - Create service account in Google Cloud
   - Grant "Editor" role
   - Generate JSON key file

2. Upload to Capawesome Cloud:
   - Settings → Android Deployments
   - Upload service account JSON
   - Enable "Auto-deploy to Internal Testing"

**Result**: Every successful Android build automatically uploads to Google Play Internal Testing!

---

## 🔄 Continuous Deployment Workflow

Once setup is complete, your workflow becomes:

### For Code Changes:

```bash
# 1. Make your code changes
git add .
git commit -m "Add new feature"
git push origin main

# 2. Trigger builds (automatically or manually)
# Via CLI:
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios

npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android

# 3. Builds automatically upload to TestFlight and Google Play (if configured)

# 4. Test the builds

# 5. Promote to production when ready
```

### For OTA Updates (Minor Fixes):

```bash
# 1. Make your changes
npm run build

# 2. Deploy OTA update (NO app store review needed!)
npm run deploy:bundle

# 3. Update goes live in minutes
# Users get update automatically on next app launch
```

**When to use OTA vs Native Build:**
- **OTA Updates**: Bug fixes, content updates, UI tweaks (web code only)
- **Native Builds**: New Capacitor plugins, permission changes, native code changes

---

## 💰 Pricing Breakdown

### Capawesome Cloud:
- **Hobby**: $9/month (200 build minutes) - Good for solo developer
- **Pro**: $29/month (1,000 build minutes) - Good for small team
- **Business**: $299/month (5,400 build minutes) - Good for large team

**Typical Build Times:**
- iOS: 5-10 minutes
- Android: 3-7 minutes

**Example**: With $9/month plan (200 minutes), you get ~20-30 builds per month.

### App Store Fees:
- **Apple Developer**: $99/year (required)
- **Google Play**: $25 one-time (required)

### Total First Year:
- Capawesome: $108-$348 (depending on plan)
- Apple: $99
- Google: $25
- **Total**: $232-$472

**Subsequent Years**: $207-$447 (no Google fee)

---

## 🎉 Launch Day Checklist

### Day Before Launch:
- [ ] Final beta test completed
- [ ] All critical bugs fixed
- [ ] Support email configured
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Social media posts prepared
- [ ] Press kit ready

### Launch Day:
- [ ] Submit iOS for review
- [ ] Submit Android for review
- [ ] Post on social media
- [ ] Email existing users
- [ ] Update website
- [ ] Monitor submissions

### Week After Launch:
- [ ] Monitor crash reports daily
- [ ] Respond to reviews within 24h
- [ ] Track key metrics (downloads, DAU, retention)
- [ ] Collect user feedback
- [ ] Plan first update
- [ ] Celebrate! 🎉

---

## 🆘 Troubleshooting

### iOS Build Fails

**"Certificate not found":**
- Re-upload .p12 certificate
- Verify password is correct
- Check certificate hasn't expired

**"Provisioning profile doesn't match":**
- Regenerate provisioning profile
- Ensure it includes your certificate
- Verify App ID matches exactly

**"Code signing failed":**
- Check all capabilities are enabled in App ID
- Verify provisioning profile is for App Store
- Try regenerating both certificate and profile

### Android Build Fails

**"Keystore was tampered with":**
- Check keystore password is correct
- Ensure keystore file uploaded completely
- Verify keystore isn't corrupted

**"Cannot recover key":**
- Check key alias is correct (case-sensitive!)
- Verify key password is correct
- List keystore contents to confirm alias

**"Build timeout":**
- Check for infinite loops in build scripts
- Verify dependencies can be downloaded
- Contact Capawesome support if persistent

### Common Issues

**Build succeeds but app crashes:**
- Check for console errors in browser
- Verify all environment variables are set
- Test the web build locally first
- Review Capacitor plugin compatibility

**In-app purchases don't work:**
- Verify product IDs match exactly in code and store
- Check that products are approved in store
- Test with sandbox/test accounts
- Review Stripe configuration

---

## 📚 Additional Resources

### Documentation:
- [Capawesome Cloud Docs](https://capawesome.io/docs/)
- [iOS Setup Guide](./CAPAWESOME_IOS_CERTIFICATES_GUIDE.md)
- [Android Setup Guide](./CAPAWESOME_ANDROID_KEYSTORE_GUIDE.md)
- [Assets Checklist](./APP_STORE_ASSETS_COMPLETE_CHECKLIST.md)

### Apple:
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Developer Portal](https://developer.apple.com/account/)
- [TestFlight](https://developer.apple.com/testflight/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Google:
- [Play Console](https://play.google.com/console/)
- [Developer Policies](https://play.google.com/about/developer-content-policy/)
- [App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)

### Support:
- **Capawesome Support**: support@capawesome.io
- **PitBox Support**: [Your Email]
- **Apple Developer Support**: developer.apple.com/contact
- **Google Play Support**: support.google.com/googleplay/android-developer

---

## 🎯 Success Metrics

### Week 1 Goals:
- [ ] 100+ downloads
- [ ] 4+ star rating
- [ ] <1% crash rate
- [ ] 10+ beta testers

### Month 1 Goals:
- [ ] 1,000+ downloads
- [ ] 4.5+ star rating
- [ ] 50+ reviews
- [ ] 5-10% free-to-premium conversion

### Month 3 Goals:
- [ ] 5,000+ downloads
- [ ] 40% Day-1 retention
- [ ] 20% Day-7 retention
- [ ] 10% Day-30 retention

---

## 🚀 You're Ready to Launch!

Follow this guide step-by-step, and you'll have PitBox live on both app stores within a week.

**Key Advantages of Capawesome Cloud:**
- ✅ No Mac or Android Studio required
- ✅ Build from any computer (Windows, Mac, Linux)
- ✅ 3-5x faster builds than traditional CI/CD
- ✅ Automatic deployment to TestFlight and Google Play
- ✅ OTA updates without app store review
- ✅ Integrated with Git (auto-build on push)
- ✅ Encrypted credential storage
- ✅ Build logs and history
- ✅ CLI and web interface

**Next Steps:**
1. Review the prerequisites checklist
2. Start with Phase 1 (Account Setup)
3. Follow each phase in order
4. Don't skip the testing phase!
5. Launch with confidence

**Questions?** Create an issue in the repository or email [Your Email].

Good luck with your launch! 🏁🎉
