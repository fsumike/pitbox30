# 🚀 YOUR PERSONAL LAUNCH GUIDE
## PIT-BOX App - Windows + Rented Mac Setup

**Your Setup:**
- 🪟 Windows PC (for Android development)
- 🍎 Rented Mac (for iOS development)
- ✅ Apple Developer Account (ready)
- ✅ Google Play Developer Account (ready)

---

## ⚠️ IMPORTANT: RENTED MAC CONSIDERATIONS

### Before You Start on Rented Mac:

1. **Time Management**
   - Rent the Mac for at least **4-6 hours** minimum
   - iOS build process takes 2-4 hours first time
   - Testing takes 1-2 hours
   - Have extra time buffer for issues

2. **File Backup Plan**
   - You'll need to save important files locally
   - Download your keychain certificates
   - Export signing certificates
   - Save your .app bundle before disconnecting

3. **Access to Xcode**
   - Make sure Xcode is already installed (15.0+)
   - If not, it's a 10GB+ download (takes time!)
   - Verify you can open Xcode before starting

4. **Testing Strategy**
   - You'll need an iPhone connected via cable OR
   - Use TestFlight for testing (no physical device needed)
   - TestFlight is BETTER for rented Mac setup

---

## 🎯 OPTIMIZED STRATEGY FOR YOUR SETUP

### RECOMMENDED ORDER:

**WEEK 1: PREP + ANDROID (Windows)**
- Day 1: Take screenshots, create test account
- Day 2-3: Build and test Android app (on Windows)
- Day 4: Submit Android app to Play Store

**WEEK 2: iOS (Rented Mac)**
- Day 5: Rent Mac (4-6 hour session)
- Day 5: Build, test, and upload iOS app
- Day 6: Complete iOS store listing and submit

**Why this order?**
- ✅ Android first lets you learn the process
- ✅ Mac rental is one focused session
- ✅ Less expensive (shorter Mac rental)
- ✅ You'll have experience from Android

---

## 📋 PHASE 1: PREPARATION (TODAY - Windows)

### Step 1: Take Screenshots (30 minutes)

**Open your web app in Chrome:**
1. Navigate to: https://pbfdzlkdlxbwijwwysaf.supabase.co
2. Press F12 (open dev tools)
3. Click device toolbar icon (or Ctrl+Shift+M)
4. Select "iPhone 13 Pro" (390 x 844)

**Capture these 6 screens:**
1. **Home Dashboard** (`/home`)
   - Shows setup cards and navigation
   - File name: `01-home.png`

2. **Setup Sheet Detail** (click on any car type)
   - Shows detailed setup form
   - File name: `02-setup-sheet.png`

3. **Swap Meet Marketplace** (`/swap-meet`)
   - Shows listings
   - File name: `03-marketplace.png`

4. **Racing Community** (`/community`)
   - Shows social feed
   - File name: `04-community.png`

5. **Racing Tools** (`/tools`)
   - Shows calculator tools
   - File name: `05-tools.png`

6. **Profile/Subscription** (`/profile`)
   - Shows user profile
   - File name: `06-profile.png`

**Save all screenshots to a folder:** `C:\PitBox\Screenshots\`

**Then switch device to "Pixel 5" (393 x 851) and take same 6 screenshots:**
- Name them: `android-01-home.png`, `android-02-setup-sheet.png`, etc.
- Save to same folder

---

### Step 2: Create Test Account (15 minutes)

**On your web app:**
1. Sign out if logged in
2. Click "Sign Up"
3. Use these credentials:
   - Email: `pitbox.test@gmail.com` (or your test email)
   - Password: Create strong password (save it!)
   - Username: `TestDriver`
   - Full Name: `Test Driver`

4. Create sample data:
   - Go to Home, click any car type
   - Fill out a setup sheet
   - Save it (even without Premium)
   - Go to Community, make a test post
   - Go to Tools, try a calculator

5. **Write down credentials:**
   ```
   Test Account:
   Email: pitbox.test@gmail.com
   Password: [your password]
   ```

---

## 📱 PHASE 2: BUILD ANDROID APP (Days 2-3 - Windows)

### Prerequisites Check:

**Before we start, verify you have:**
- [ ] Node.js installed (you already have this)
- [ ] Android Studio installed
- [ ] Android device with USB cable OR Android emulator

**If you don't have Android Studio:**
1. Download: https://developer.android.com/studio
2. Install (follow wizard)
3. This may take 30-60 minutes

---

### Step 3: Build Android App on Windows

**Open Command Prompt or PowerShell in your project folder:**

```bash
# Step 1: Build the web app
npm run build
```

**Wait for build to complete (should show "✓ built in X seconds")**

```bash
# Step 2: Add Android platform
npm run cap:add:android
```

**This will:**
- Create `android/` folder
- Install Android dependencies
- Configure capacitor
- Takes 2-5 minutes

**When done, you should see:** `✔ Adding native android project in android in X.XXs`

```bash
# Step 3: Open in Android Studio
npm run cap:open:android
```

**Android Studio will open.**

---

### Step 4: Wait for Gradle Sync (Important!)

**When Android Studio opens:**
1. Wait for "Gradle Sync" to finish (bottom status bar)
2. This takes 5-15 minutes first time
3. Don't do anything until it says "Gradle sync completed"

**If you see errors:**
- Ignore yellow warnings
- Red errors - tell me what they say

---

### Step 5: Create Signing Keystore (CRITICAL!)

**In Android Studio:**

1. Click **Build** menu → **Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Click **Next**
4. Click **Create new...** (for key store)

**Fill out the form:**
```
Key store path: C:\PitBox\pitbox-release.keystore
Password: [Create strong password - SAVE THIS!]
Confirm: [Same password]

Key:
Alias: pitbox
Password: [Same password as keystore]
Validity: 25 (years)

Certificate:
First and Last Name: Michael Glover
Organizational Unit: PIT-BOX
Organization: PIT-BOX.COM
City or Locality: [Your city]
State or Province: [Your state]
Country Code: US
```

5. Click **OK**

**⚠️ CRITICAL - BACKUP YOUR KEYSTORE:**

```bash
# Copy keystore to safe locations:
copy C:\PitBox\pitbox-release.keystore C:\Users\[YourName]\Documents\
copy C:\PitBox\pitbox-release.keystore D:\Backup\

# Upload to cloud storage (Google Drive, Dropbox, etc.)
# Email it to yourself
# Save the password in a password manager
```

**YOU CANNOT UPDATE YOUR APP WITHOUT THIS FILE!**

---

### Step 6: Build Signed Bundle

**Continue in the Generate Signed Bundle wizard:**

1. Select your keystore: `C:\PitBox\pitbox-release.keystore`
2. Enter Key store password
3. Select Key alias: `pitbox`
4. Enter Key password
5. Click **Next**

6. Select destination: `release`
7. Build Variants: `release`
8. Signature Versions: Check both V1 and V2
9. Click **Finish**

**Wait for build** (2-10 minutes)

**When done, you'll see:**
```
locate: android\app\release\app-release.aab
```

**This is your app bundle!** Save it to:
```
C:\PitBox\Builds\app-release.aab
```

---

### Step 7: Test on Android Device (Optional but Recommended)

**Connect your Android phone:**
1. Enable Developer Options on phone:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging (ON)
3. Connect phone via USB
4. Allow USB debugging when prompted

**In Android Studio:**
1. Click the green **Run** button (▶️)
2. Select your connected device
3. Wait for app to install and launch
4. Test the app:
   - Sign in works?
   - Navigation works?
   - Camera permission prompt?
   - Location permission prompt?
   - All features working?

**If you don't have Android device:** Skip to next step, we'll test in Play Console internal testing.

---

## 📱 PHASE 3: SUBMIT TO GOOGLE PLAY (Day 4 - Windows)

### Step 8: Go to Google Play Console

**Open:** https://play.google.com/console

1. Click **Create app**
2. Fill out:
   - App name: `PIT-BOX`
   - Default language: `English (United States)`
   - App or game: `App`
   - Free or paid: `Free`
   - Check the declarations checkboxes
3. Click **Create app**

---

### Step 9: Complete Store Listing

**Go to: Main store listing**

**App name:**
```
PIT-BOX - Racing Setup & Tools
```

**Short description (80 characters):**
```
Digital garage for racers. Setup sheets, tools, marketplace, and community.
```

**Full description (4000 characters):**
```
PIT-BOX is the complete digital garage for dirt track and sprint car racers. Whether you're running Late Models, Modifieds, Sprints, or any other class, PIT-BOX gives you the tools to win.

SETUP MANAGEMENT
• Save unlimited setup sheets (Premium)
• Track shocks, springs, and every adjustment
• Compare setups side-by-side
• Share setups with your team
• Import/export for backup

RACING TOOLS
• Gear Ratio Calculator
• Stagger Calculator
• Weight Distribution Calculator
• Spring Rate Calculator
• Fuel Calculator
• Pinion Angle Calculator
• And more!

SWAP MEET MARKETPLACE
• Buy and sell racing parts
• Distance filter to find local deals
• Chat with sellers
• Photo uploads for listings
• Safe, secure transactions

RACING COMMUNITY
• Share photos and updates
• Connect with racers nationwide
• Post stories and reels
• Like, comment, and engage
• Build your racing network

MAINTENANCE TRACKER
• Pre-race checklists by class
• Track motor health and wear
• Log maintenance history
• Never miss critical maintenance

TIRE MANAGEMENT
• Track tire wear and heat cycles
• Manage your tire inventory
• Optimize tire strategy

Perfect for:
✓ Sprint Cars (410, 360, 305, Winged/Non-Winged)
✓ Late Models (Super, Crate, Modified)
✓ Modifieds (Dirt, UMP, IMCA, B-Mod, Sport Mod)
✓ Micros & Midgets (600cc, Quarter, Focus)
✓ And all other racing classes!

Premium Subscription includes:
• Unlimited setup saves
• Advanced calculators
• Priority support
• No ads
• Exclusive features

Support: pitboxcom@gmail.com
Phone: (279) 245-0737

Privacy Policy: https://pit-box.com/privacy
Terms of Service: https://pit-box.com/terms

Join thousands of racers using PIT-BOX to go faster!
```

**App icon:**
- Upload: `android-icon-512-512.png` from your project

**Feature graphic (1024x500):**
- You'll need to create this - I can help you with Canva or similar

**Phone screenshots:**
- Upload your 6 Android screenshots in order

**App category:**
- `Sports`

**Tags:**
- `Racing`
- `Motorsports`

**Contact details:**
- Email: `pitboxcom@gmail.com`
- Phone: `+1 (279) 245-0737`
- Website: `https://pit-box.com`

**Privacy policy URL:**
```
https://pit-box.com/privacy
```

Click **Save**

---

### Step 10: Complete Data Safety Form

**Go to: App content → Data safety**

**Data collection and security:**

1. **Does your app collect or share user data?**
   - YES

2. **Data types collected:**
   - ✅ Personal info: Email address, Name
   - ✅ Photos: User-generated photos
   - ✅ App activity: App interactions, User-generated content

3. **How is data used?**
   - ✅ App functionality
   - ✅ Account management

4. **Data sharing:**
   - No data shared with third parties

5. **Data security:**
   - ✅ Data is encrypted in transit
   - ✅ Users can request data deletion
   - ✅ Data deletion policy: Users can delete account in app settings

6. **Purpose of data collection:**
   - Account functionality
   - App features
   - User communications

Click **Save** → **Submit**

---

### Step 11: Content Rating

**Go to: App content → Content rating**

1. Click **Start questionnaire**
2. Select category: `IARC`
3. Fill out questionnaire:
   - Violence: None
   - Sexual content: None
   - Language: No inappropriate language
   - Controlled substances: None
   - Gambling: None
   - User interaction: Yes (users can interact)
   - Personal info: Yes (collects personal info)
   - Location: Yes (optional location)

4. Click **Save** → **Submit**

**You'll get:** Everyone rating

---

### Step 12: Configure Subscriptions

**Go to: Monetize → Subscriptions**

1. Click **Create subscription**

**For each subscription, create:**

**Basic Monthly:**
```
Product ID: basic_monthly
Name: Basic Setup Access - Monthly
Description: Unlimited setup saves and basic features
Base plan: Monthly ($9.99)
```

**Basic Quarterly:**
```
Product ID: basic_quarterly
Name: Basic Setup Access - Quarterly
Description: Unlimited setup saves - Save $5 vs monthly
Base plan: Every 3 months ($24.99)
```

**Basic Yearly:**
```
Product ID: basic_yearly
Name: Basic Setup Access - Yearly
Description: Unlimited setup saves - Save $20 vs monthly
Base plan: Yearly ($99.99)
```

**Premium Monthly:**
```
Product ID: premium_monthly
Name: Encrypted Setup Access - Monthly
Description: All features plus encryption and priority support
Base plan: Monthly ($12.99)
```

**Premium Quarterly:**
```
Product ID: premium_quarterly
Name: Encrypted Setup Access - Quarterly
Description: Premium features - Save $4 vs monthly
Base plan: Every 3 months ($34.99)
```

**Premium Yearly:**
```
Product ID: premium_yearly
Name: Encrypted Setup Access - Yearly
Description: Premium features - Save $21 vs monthly
Base plan: Yearly ($134.99)
```

**For each product:**
- Set prices for all countries (or use auto-convert)
- Set eligibility: All users
- Set subscription benefits
- Click **Activate**

---

### Step 13: Upload App Bundle

**Go to: Production → Create new release**

1. Click **Upload**
2. Select: `C:\PitBox\Builds\app-release.aab`
3. Wait for upload and processing (5-10 minutes)

**Release name:**
```
3.0.0 (1)
```

**Release notes:**
```
Welcome to PIT-BOX 3.0! The ultimate racing companion.

• Track and share unlimited setup sheets
• Access 12+ racing calculators
• Buy/sell parts in the Swap Meet marketplace
• Connect with racers in the Community
• Manage maintenance schedules
• Track motor health and performance
• Premium features available

Built by racers, for racers. Get faster, smarter, better.
```

4. Click **Save**
5. Click **Review release**
6. Fix any warnings/errors shown
7. When ready, click **Start rollout to Production**

**Choose:**
- Staged rollout: 20% initially
- Or full rollout: 100%

8. Click **Rollout**

---

## 🎉 ANDROID SUBMITTED!

**What happens next:**
- Google review: Usually 2-24 hours
- You'll get email updates
- Check Play Console for status
- If approved, it goes live automatically!

---

## 🍎 PHASE 4: BUILD iOS APP (Day 5 - Rented Mac)

### Before You Rent the Mac:

**Prepare on Windows:**
1. Zip your entire project:
   ```bash
   # Exclude node_modules and build folders
   tar -czf pitbox-project.tar.gz --exclude=node_modules --exclude=dist --exclude=android .
   ```

2. Upload to cloud (Google Drive, Dropbox, etc.)
3. Have your Apple Developer credentials ready
4. Have your test account credentials ready
5. Have screenshots ready

---

### Step 14: On Rented Mac - Setup (30 minutes)

**When you connect to rented Mac:**

1. **Download your project:**
   ```bash
   cd ~/Desktop
   # Download from cloud storage
   tar -xzf pitbox-project.tar.gz
   cd pitbox-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   (This takes 5-10 minutes)

3. **Verify Xcode is installed:**
   ```bash
   xcodebuild -version
   ```
   Should show: `Xcode 15.x` or higher

4. **Open Xcode once to accept license:**
   ```bash
   sudo xcodebuild -license accept
   ```

---

### Step 15: Build iOS App (30 minutes)

```bash
# Build web app
npm run build

# Add iOS platform
npm run cap:add:ios

# Copy privacy manifest
cp PrivacyInfo.xcprivacy.template ios/App/App/PrivacyInfo.xcprivacy

# Open in Xcode
npm run cap:open:ios
```

**Xcode will open.**

---

### Step 16: Configure iOS Permissions

**In Xcode, navigate to:**
1. Click on `App` in left sidebar (top item)
2. Click on `App` target in center
3. Click on `Info` tab

**Add these keys at the bottom:**

Right-click in the list → **Add Row** → Paste each:

```
NSCameraUsageDescription
String: PitBox needs camera access to let you share photos of your racing setups, cars, and parts in the marketplace.

NSPhotoLibraryUsageDescription
String: PitBox needs photo library access to let you share racing photos and dyno sheets with the community.

NSLocationWhenInUseUsageDescription
String: PitBox uses your location to show you racing parts and equipment for sale near you in the Swap Meet marketplace. Your location is only used to filter listings and is never stored or tracked.
```

---

### Step 17: Configure Signing

**In Xcode:**

1. Select **App** target
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (your Apple Developer account)
5. Xcode will create provisioning profiles automatically

**If you get errors:**
- Make sure you're logged into Xcode with your Apple ID
- Xcode → Preferences → Accounts → Add your Apple ID

---

### Step 18: Archive and Upload to App Store Connect

**IMPORTANT: Use TestFlight instead of physical device (better for rented Mac)**

**In Xcode:**

1. Top bar: Change destination from simulator to **Any iOS Device (arm64)**
2. Menu: **Product** → **Archive**
3. Wait 5-15 minutes for archive to build
4. **Organizer** window opens automatically
5. Select your archive
6. Click **Distribute App**
7. Select **App Store Connect**
8. Click **Next**
9. Select **Upload**
10. Click **Next** through all screens
11. Click **Upload**

**Wait 5-10 minutes for upload to complete.**

**When done:**
- You'll see "Upload Successful"
- Close Xcode (you're done on Mac!)
- Download any certificates you created (Keychain Access → export)

---

## 🍎 PHASE 5: COMPLETE iOS SUBMISSION (Day 6 - Windows)

### Step 19: Configure iOS In-App Purchases

**Go to:** https://appstoreconnect.apple.com

1. Select your app
2. Click **Features** → **Subscriptions**
3. Click **Create Subscription Group**
   - Reference Name: `Premium Subscription`
   - Click **Create**

**Create each subscription:**

**Basic Monthly:**
```
Product ID: com.pitbox.basic.monthly
Reference Name: Basic Monthly
Subscription Duration: 1 Month
Price: $9.99
Subscription Display Name: Basic Setup Access
Description: Unlimited setup saves and access to all your devices. Track setups and use basic racing tools.
```

**Repeat for all 6 products** (use the product IDs from earlier)

**For each product:**
- Add localization (English US)
- Set pricing (or use price tier)
- Upload screenshot (optional)
- Review information
- Save
- Click **Submit for Review**

---

### Step 20: Complete App Store Listing

**In App Store Connect → Your App:**

**App Information:**
- Name: `PIT-BOX`
- Subtitle: `Racing Setup & Tools`
- Primary Category: `Sports`
- Secondary Category: `Utilities`

**Pricing and Availability:**
- Price: `Free`
- Availability: `All countries`

**Version Information:**

**Screenshots (upload your iOS screenshots):**
- 6.5" Display: Upload your 6 screenshots
- 5.5" Display: Can use same screenshots

**Promotional Text (optional):**
```
The ultimate racing companion for dirt track racers. Track setups, connect with racers, and optimize your performance.
```

**Description (use same as Android):**
[Copy from earlier]

**Keywords:**
```
racing,dirt track,sprint car,setup sheet,race car,late model,modified,calculator,garage
```

**Support URL:**
```
https://pit-box.com/contact
```

**Marketing URL:**
```
https://pit-box.com
```

**Privacy Policy URL:**
```
https://pit-box.com/privacy
```

**Version:** `3.0.0`

**Copyright:**
```
2025 Michael Glover DBA PIT-BOX.COM
```

**What's New (Release Notes):**
```
Welcome to PIT-BOX 3.0! The ultimate racing companion.

• Track and share unlimited setup sheets
• Access 12+ racing calculators
• Buy/sell parts in the Swap Meet marketplace
• Connect with racers in the Community
• Manage maintenance schedules
• Track motor health and performance
• Premium features available

Built by racers, for racers. Get faster, smarter, better.
```

---

### Step 21: App Review Information

**Contact Information:**
- First Name: `Michael`
- Last Name: `Glover`
- Phone: `+1 (279) 245-0737`
- Email: `pitboxcom@gmail.com`

**Notes for Reviewer:**
```
Thank you for reviewing PIT-BOX!

TEST ACCOUNT:
Email: pitbox.test@gmail.com
Password: [your test password]

FEATURES TO TEST:
1. Sign in with test account
2. Create a setup sheet (tap floating + button or select car type)
3. Use any calculator in Tools section
4. Browse Swap Meet marketplace
5. View Community posts

LOCATION PERMISSION:
- Only used for distance filter in Swap Meet marketplace
- Optional feature, not required to use app
- Never stored or tracked
- User has manual ZIP code option

CAMERA PERMISSION:
- Used for posting photos to Community
- Used for uploading items to Swap Meet
- User-initiated only (tap camera icon)

SUBSCRIPTION:
- Premium features are marked with crown icon
- Subscription is optional
- Free features are fully functional
- Users can try app before subscribing

The app is a tool for racing enthusiasts to track their car setups and connect with the racing community.

Contact: pitboxcom@gmail.com | (279) 245-0737
```

**Sign-in required:** Yes
- Username: `pitbox.test@gmail.com`
- Password: `[your test password]`

---

### Step 22: Submit for Review

**Final checks:**
- [ ] All screenshots uploaded
- [ ] Description complete
- [ ] Keywords entered
- [ ] Privacy policy URL working
- [ ] Support URL working
- [ ] Test account credentials provided
- [ ] Subscriptions configured
- [ ] Build uploaded and processed

**When everything is complete:**
1. Click **Add for Review**
2. Answer export compliance: **No** (no encryption)
3. Answer advertising identifier questions
4. Click **Submit for Review**

---

## 🎉 BOTH APPS SUBMITTED!

### What Happens Next:

**Android:**
- Review: 2-24 hours typically
- Email notifications
- Usually very fast

**iOS:**
- Review: 24-48 hours typically
- Email notifications
- May have questions

**If Approved:**
- Android: Goes live automatically
- iOS: You choose when to release (or auto-release)

**If Rejected:**
- Read rejection reason carefully
- Fix the issue
- Reply to reviewer or resubmit
- I'll help you fix it!

---

## 📊 POST-LAUNCH CHECKLIST

**First 24 Hours:**
- [ ] Monitor both store consoles
- [ ] Check email for updates
- [ ] Test downloads on real devices
- [ ] Verify subscriptions work
- [ ] Monitor for crash reports

**First Week:**
- [ ] Respond to user reviews
- [ ] Monitor download numbers
- [ ] Track subscription conversions
- [ ] Fix any critical bugs
- [ ] Collect user feedback

---

## 🆘 TROUBLESHOOTING

**Android Build Fails:**
- Make sure Gradle sync completed
- Check Android SDK is installed
- File → Invalidate Caches → Restart

**iOS Build Fails:**
- Make sure you accepted Xcode license
- Check signing certificates
- Product → Clean Build Folder

**Upload Fails:**
- Check internet connection
- Try uploading again
- Check file size limits

**Rejected:**
- Read reason carefully
- Contact me with the rejection message
- We'll fix it together!

---

## ✅ YOUR ACTION ITEMS TODAY:

1. **Take screenshots** (30 min) - Do this now on Windows
2. **Create test account** (15 min) - Do this now
3. **Verify Android Studio installed** - Check this
4. **Schedule Mac rental** - Book 4-6 hour session

**Tomorrow:** Start Android build!

---

## 📞 I'M HERE TO HELP

**At every step, tell me:**
- What you're seeing
- Any errors or questions
- Where you're stuck

**And I'll give you:**
- The exact next step
- Solutions to errors
- Copy-paste text for forms

**Let's get PIT-BOX live! Ready to start with screenshots?** 🏁
