# 📋 PITBOX APP - QUICK LAUNCH CHECKLIST

**Print this page and check off items as you complete them!**

---

## ✅ STEP 1: APPLE DEVELOPER ACCOUNT SETUP

### Apple Account Requirements:
- [ ] Have Apple ID ready
- [ ] Enroll in Apple Developer Program ($99/year)
  - Go to: https://developer.apple.com/programs/enroll/
  - Complete enrollment (takes 24-48 hours for approval)

### App Store Connect Setup:
- [ ] Log into App Store Connect: https://appstoreconnect.apple.com/
- [ ] Accept any agreements/terms
- [ ] Set up banking information (for receiving payments)
- [ ] Set up tax information
- [ ] Create new app:
  - Click "+" button → New App
  - Platform: iOS
  - Name: PitBox Racing
  - Primary Language: English
  - Bundle ID: (from your capacitor.config.ts - I'll provide this)
  - SKU: pitbox-racing-app

### Apple Subscription Products (In-App Purchases):
- [ ] In App Store Connect, go to your app → Features → In-App Purchases
- [ ] Click "+" to create Subscription Group
  - Name: "PitBox Premium"
- [ ] Create 6 subscription products (copy these exactly):

**Product 1: Basic Monthly**
- [ ] Product ID: `com.pitbox.basic.monthly`
- [ ] Reference Name: Basic Setup Access - Monthly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $9.99
- [ ] Duration: 1 Month

**Product 2: Basic Quarterly**
- [ ] Product ID: `com.pitbox.basic.quarterly`
- [ ] Reference Name: Basic Setup Access - Quarterly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $24.99
- [ ] Duration: 3 Months

**Product 3: Basic Yearly**
- [ ] Product ID: `com.pitbox.basic.yearly`
- [ ] Reference Name: Basic Setup Access - Yearly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $99.99
- [ ] Duration: 1 Year

**Product 4: Premium Monthly**
- [ ] Product ID: `com.pitbox.premium.monthly`
- [ ] Reference Name: Encrypted Setup Access - Monthly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $12.99
- [ ] Duration: 1 Month

**Product 5: Premium Quarterly**
- [ ] Product ID: `com.pitbox.premium.quarterly`
- [ ] Reference Name: Encrypted Setup Access - Quarterly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $34.99
- [ ] Duration: 3 Months

**Product 6: Premium Yearly**
- [ ] Product ID: `com.pitbox.premium.yearly`
- [ ] Reference Name: Encrypted Setup Access - Yearly
- [ ] Type: Auto-Renewable Subscription
- [ ] Subscription Group: PitBox Premium
- [ ] Price: $134.99
- [ ] Duration: 1 Year

- [ ] Submit all 6 products for review (this can take 24-48 hours)

---

## ✅ STEP 2: GOOGLE PLAY DEVELOPER ACCOUNT SETUP

### Google Account Requirements:
- [ ] Have Google account ready
- [ ] Register for Google Play Console ($25 one-time fee)
  - Go to: https://play.google.com/console/signup
  - Complete registration (takes 24-48 hours for approval)

### Play Console Setup:
- [ ] Log into Play Console: https://play.google.com/console/
- [ ] Accept any agreements/terms
- [ ] Set up merchant account (for receiving payments)
- [ ] Complete account verification
- [ ] Create new app:
  - Click "Create app"
  - App name: PitBox Racing
  - Default language: English (United States)
  - App or game: App
  - Free or paid: Free
  - Declarations: Accept all

### Google Play Subscription Products:
- [ ] In Play Console, go to your app → Monetize → Subscriptions
- [ ] Click "Create subscription"
- [ ] Create 6 subscription products (copy these exactly):

**Product 1: Basic Monthly**
- [ ] Product ID: `basic_monthly`
- [ ] Name: Basic Setup Access - Monthly
- [ ] Description: Unlimited setup saves and access on all devices
- [ ] Billing period: Monthly (every 1 month)
- [ ] Price: $9.99
- [ ] Benefits: Unlimited setups, cloud sync, all devices
- [ ] Status: Active

**Product 2: Basic Quarterly**
- [ ] Product ID: `basic_quarterly`
- [ ] Name: Basic Setup Access - Quarterly
- [ ] Description: Unlimited setup saves and access on all devices
- [ ] Billing period: Every 3 months
- [ ] Price: $24.99
- [ ] Benefits: Unlimited setups, cloud sync, all devices
- [ ] Status: Active

**Product 3: Basic Yearly**
- [ ] Product ID: `basic_yearly`
- [ ] Name: Basic Setup Access - Yearly
- [ ] Description: Unlimited setup saves and access on all devices
- [ ] Billing period: Yearly (every 1 year)
- [ ] Price: $99.99
- [ ] Benefits: Unlimited setups, cloud sync, all devices
- [ ] Status: Active

**Product 4: Premium Monthly**
- [ ] Product ID: `premium_monthly`
- [ ] Name: Encrypted Setup Access - Monthly
- [ ] Description: All Basic features plus end-to-end encryption
- [ ] Billing period: Monthly (every 1 month)
- [ ] Price: $12.99
- [ ] Benefits: Encryption, priority support, early access
- [ ] Status: Active

**Product 5: Premium Quarterly**
- [ ] Product ID: `premium_quarterly`
- [ ] Name: Encrypted Setup Access - Quarterly
- [ ] Description: All Basic features plus end-to-end encryption
- [ ] Billing period: Every 3 months
- [ ] Price: $34.99
- [ ] Benefits: Encryption, priority support, early access
- [ ] Status: Active

**Product 6: Premium Yearly**
- [ ] Product ID: `premium_yearly`
- [ ] Name: Encrypted Setup Access - Yearly
- [ ] Description: All Basic features plus end-to-end encryption
- [ ] Billing period: Yearly (every 1 year)
- [ ] Price: $134.99
- [ ] Benefits: Encryption, priority support, early access
- [ ] Status: Active

- [ ] Activate all 6 products

---

## ✅ STEP 3: PREPARE APP ASSETS (Do While Waiting for Approvals)

### Screenshots to Take:

**iOS Screenshots (using iPhone simulator or device):**
- [ ] Screenshot 1: Home page with racing class selection grid
- [ ] Screenshot 2: Setup page with data filled in
- [ ] Screenshot 3: Community feed showing posts
- [ ] Screenshot 4: Swap Meet marketplace
- [ ] Screenshot 5: Tools page showing all 11 tools
- [ ] Screenshot 6: User profile page
- [ ] Screenshot 7: Track locations map (optional)

**Required sizes:**
- [ ] 6.5" display: 1290 x 2796 px (iPhone 14 Pro Max, 15 Pro Max)
- [ ] 5.5" display: 1242 x 2208 px (iPhone 8 Plus)

**Android Screenshots (using Android emulator or device):**
- [ ] Same 7 screenshots as iOS
- [ ] Size: 1080 x 1920 px minimum

### App Icons:
- [ ] Verify you have 1024x1024px icon (for iOS)
- [ ] Verify you have 512x512px icon (for Android)

### App Descriptions:
- [ ] Ask me: "Write app descriptions" and I'll provide all text for:
  - Short description (80 characters)
  - Full description (up to 4000 characters)
  - Keywords (100 characters for iOS)
  - What's New text
  - Feature highlights

---

## ✅ STEP 4: CREATE TEST ACCOUNT

- [ ] Tell me: "Create test account"
- [ ] I'll create a test user with:
  - Email address
  - Password
  - Active subscription
- [ ] Copy the credentials
- [ ] Add to App Store Connect submission notes
- [ ] Add to Play Console submission notes

---

## ✅ STEP 5: VERIFY SUBSCRIPTION PRICES IN CODE

**Current prices in app:**
- Basic: $9.99/month, $24.99/quarter, $99.99/year
- Premium: $12.99/month, $34.99/quarter, $134.99/year

- [ ] Tell me: "Prices are correct" OR "Change [price] to $X.XX"
- [ ] I'll update the code if needed
- [ ] I'll rebuild the app

---

## ✅ STEP 6: BUILD iOS APP (After Apple Approval)

- [ ] Tell me: "Build iOS app"
- [ ] I'll run: `npm run build && npm run cap:sync`
- [ ] You run: `npm run cap:open:ios`
- [ ] In Xcode:
  - [ ] Select "Any iOS Device" as target
  - [ ] Product → Archive
  - [ ] Wait for archive to complete
  - [ ] Click "Distribute App"
  - [ ] Select "App Store Connect"
  - [ ] Upload
  - [ ] Wait for upload to complete

---

## ✅ STEP 7: SUBMIT TO APP STORE

- [ ] Go to App Store Connect
- [ ] Click on your app
- [ ] Click "+" next to iOS App
- [ ] Select the build you just uploaded
- [ ] Fill in metadata:
  - [ ] App name: PitBox Racing
  - [ ] Subtitle: (I'll provide - 30 chars)
  - [ ] Description: (I'll provide)
  - [ ] Keywords: (I'll provide)
  - [ ] Support URL: (your website)
  - [ ] Marketing URL: (optional)
  - [ ] Screenshots: Upload your 6-7 screenshots
  - [ ] App icon: 1024x1024px
  - [ ] Category: Sports
  - [ ] Age Rating: Complete questionnaire
  - [ ] Copyright: Your name/company
  - [ ] Contact information: Your email/phone

- [ ] App Review Information:
  - [ ] Contact: Your email/phone
  - [ ] Demo account: (test credentials I provide)
  - [ ] Notes: "App requires subscription to access premium features"

- [ ] Click "Submit for Review"

---

## ✅ STEP 8: BUILD ANDROID APP (After Google Approval)

- [ ] Tell me: "Build Android app"
- [ ] I'll run: `npm run build && npm run cap:sync`
- [ ] You run: `npm run cap:open:android`
- [ ] In Android Studio:
  - [ ] Build → Generate Signed Bundle / APK
  - [ ] Select "Android App Bundle"
  - [ ] Click "Next"
  - [ ] Create keystore (first time only):
    - [ ] Click "Create new..."
    - [ ] Save keystore file safely (YOU NEED THIS FOREVER!)
    - [ ] Set keystore password (save this!)
    - [ ] Set key alias: pitbox
    - [ ] Set key password (save this!)
    - [ ] Fill in certificate info
  - [ ] Or select existing keystore if you have one
  - [ ] Click "Next" → "Finish"
  - [ ] Wait for build to complete
  - [ ] Locate the .aab file (usually in app/release/)

---

## ✅ STEP 9: SUBMIT TO GOOGLE PLAY

- [ ] Go to Play Console
- [ ] Click on your app
- [ ] Go to Production → Create new release
- [ ] Upload the .aab file
- [ ] Fill in "Release notes": (I'll provide text)
- [ ] Click "Review release"

- [ ] Complete Store Listing:
  - [ ] App name: PitBox Racing
  - [ ] Short description: (I'll provide - 80 chars)
  - [ ] Full description: (I'll provide - up to 4000 chars)
  - [ ] Screenshots: Upload your 6-7 screenshots
  - [ ] App icon: 512x512px
  - [ ] Feature graphic: 1024x500px (I'll help create)
  - [ ] Category: Sports
  - [ ] Contact details: Your email
  - [ ] Privacy Policy: (your website URL to privacy page)

- [ ] Content Rating:
  - [ ] Complete questionnaire
  - [ ] (Usually rated for Everyone)

- [ ] Target Audience:
  - [ ] Select age groups
  - [ ] (Typically 13+)

- [ ] App Access:
  - [ ] Select "All functionality is available without restrictions"
  - [ ] Provide test account: (credentials I provide)

- [ ] Click "Start rollout to Production"

---

## ✅ STEP 10: WAIT FOR REVIEW

### Apple Review:
- [ ] Check status daily in App Store Connect
- [ ] Typical review time: 1-3 days
- [ ] Respond to any questions within 24 hours

### Google Review:
- [ ] Check status daily in Play Console
- [ ] Typical review time: 1-7 days
- [ ] Respond to any questions within 24 hours

---

## ✅ STEP 11: LAUNCH!

- [ ] Apple approves → Click "Release this version"
- [ ] Google approves → App goes live automatically
- [ ] Monitor crash reports (if any)
- [ ] Monitor user reviews
- [ ] Tell me about any issues and I'll fix them!

---

## 📝 IMPORTANT NOTES

### Save These Forever:
- [ ] Apple Developer account credentials
- [ ] Google Play Console credentials
- [ ] Android keystore file (YOU MUST KEEP THIS!)
- [ ] Keystore passwords
- [ ] Test account credentials

### Product IDs Must Match Exactly:

**Apple:**
- com.pitbox.basic.monthly
- com.pitbox.basic.quarterly
- com.pitbox.basic.yearly
- com.pitbox.premium.monthly
- com.pitbox.premium.quarterly
- com.pitbox.premium.yearly

**Google:**
- basic_monthly
- basic_quarterly
- basic_yearly
- premium_monthly
- premium_quarterly
- premium_yearly

### Prices:
- Basic: $9.99, $24.99, $99.99
- Premium: $12.99, $34.99, $134.99

---

## ⏰ TIMELINE

**Week 1: Setup Accounts**
- Day 1: Enroll in Apple Developer Program (wait 24-48 hours)
- Day 2: Register for Google Play Console (wait 24-48 hours)
- Day 3-4: Set up in-app products on both platforms
- Day 5-6: Take screenshots, wait for product approvals

**Week 2: Build & Submit**
- Day 7: Build iOS app
- Day 8: Submit iOS app to App Store
- Day 9: Build Android app
- Day 10: Submit Android app to Play Store
- Day 11-14: Wait for review

**Week 3: LAUNCH!**
- Day 15+: Apps go live! 🎉

---

## 🆘 NEED HELP?

**At any point, just tell me:**
- "I'm stuck on [step]"
- "Write app descriptions"
- "Create test account"
- "Build iOS app"
- "Build Android app"
- "Something went wrong with [problem]"

**I'm here to help every step of the way!**

---

## ✅ QUICK START ORDER

**Do these in this exact order:**

1. Enroll in Apple Developer Program → WAIT 24-48 hours
2. Register for Google Play Console → WAIT 24-48 hours
3. While waiting: Take screenshots (all 7)
4. While waiting: Ask me for app descriptions
5. Once Apple approved: Set up 6 subscription products
6. Once Google approved: Set up 6 subscription products
7. Tell me "Create test account"
8. Tell me "Build iOS app" → Submit to Apple
9. Tell me "Build Android app" → Submit to Google
10. WAIT for review (1-7 days)
11. LAUNCH! 🎉

---

**Total Active Work Time: 6-8 hours**
**Total Calendar Time: 2-3 weeks (due to waiting for approvals)**

---

**PRINT THIS PAGE AND CHECK OFF ITEMS AS YOU GO!**

**Good luck! You've got this! 🚀**
