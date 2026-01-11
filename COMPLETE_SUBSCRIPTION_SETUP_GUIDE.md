# Complete Subscription Setup Guide for PitBox

## What Users Are Paying For

**ONLY Racing Setup Sheets require a subscription. Everything else is FREE!**

✅ **FREE for Everyone:**
- Racing Community
- Swap Meet Marketplace
- All Racing Tools
- Track Locations
- Events & Challenges
- Groups & Teams

🔒 **Requires Subscription (Setup Sheets Only):**
- Save unlimited racing setup sheets
- Sync setups across all devices
- Setup comparison tools
- Premium: End-to-end encryption

---

# Part 1: iOS App Store Connect Setup

## Step 1: Create Subscription Group

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your **PitBox** app
3. Go to **Features** tab → **In-App Purchases and Subscriptions**
4. Click **"Subscriptions"**
5. Click the **"+"** button to create a new subscription group

**Subscription Group Details:**
```
Reference Name: PitBox Setup Access
Localized Name (US): PitBox Setup Access
```

Click **Create**

---

## Step 2: Add Basic Monthly Subscription

1. Inside your new subscription group, click **"+"** to add a subscription
2. Fill in the details:

### Basic Information
```
Reference Name: Basic Setup Access - Monthly
Product ID: com.pitbox.basic.monthly
```

### Subscription Duration
```
Duration: 1 Month (Auto-Renewable)
```

### Subscription Prices
1. Click **"Add Subscription Price"**
2. Select **United States**
3. Enter **$9.99** (or select Tier 10)
4. Click **"Next"** to add other territories (Apple will suggest equivalent pricing)
5. Click **"Add"**

### Subscription Localization (English - US)
1. Click **"Add Localization"**
2. Select **English (U.S.)**
3. Fill in:

```
Subscription Display Name: Basic Setup Access

Description:
Save unlimited racing setup sheets and access them on all your devices. Never lose a winning setup again.

Note: Community, Swap Meet, and all Racing Tools are FREE for everyone! This subscription is only for saving setup sheets.
```

Click **"Save"**

### Introductory Offer (7-Day Free Trial)
1. Scroll to **"Introductory Offer"**
2. Click **"Set Up Introductory Offer"**
3. Select:
   - **Offer Type**: Free Trial
   - **Duration**: 7 Days
   - **Availability**: All Customers
4. Click **"Create"**

### App Store Promotion (Optional but Recommended)
1. Scroll to **"App Store Promotion"**
2. Toggle **ON**
3. Upload a promotional image (1024x1024px showing your setup sheets)
4. Enter promotional text:
```
Never lose a winning setup! Save unlimited racing setups and sync across all devices.
```

Click **"Save"** at the top right

---

## Step 3: Add Premium Monthly Subscription

1. Click **"+"** again in your subscription group
2. Fill in the details:

### Basic Information
```
Reference Name: Encrypted Setup Access - Monthly
Product ID: com.pitbox.premium.monthly
```

### Subscription Duration
```
Duration: 1 Month (Auto-Renewable)
```

### Subscription Prices
```
United States: $12.99 (Tier 12)
```

### Subscription Localization (English - US)
```
Subscription Display Name: Encrypted Setup Access

Description:
All Basic features plus end-to-end encryption for your setup sheets, advanced templates, priority support, and early access to new features.

For professional racing teams who need maximum security.

Note: Community, Swap Meet, and all Racing Tools are FREE for everyone!
```

### Introductory Offer
```
Offer Type: Free Trial
Duration: 7 Days
Availability: All Customers
```

Click **"Save"**

---

## Step 4: Add Quarterly Subscriptions (Optional but Recommended)

### Basic Quarterly

```
Reference Name: Basic Setup Access - Quarterly
Product ID: com.pitbox.basic.quarterly
Duration: 3 Months
Price: $24.99 USD

Display Name: Basic Setup Access - Quarterly

Description:
Save unlimited racing setup sheets for 3 months. Sync across all devices.

Save $5 compared to monthly billing!

Community, Swap Meet, and all Tools are FREE!

Free Trial: 7 Days
```

### Premium Quarterly

```
Reference Name: Encrypted Setup Access - Quarterly
Product ID: com.pitbox.premium.quarterly
Duration: 3 Months
Price: $34.99 USD

Display Name: Encrypted Setup Access - Quarterly

Description:
All Basic features plus encryption for 3 months.

Save $4 compared to monthly billing!

Community, Swap Meet, and all Tools are FREE!

Free Trial: 7 Days
```

---

## Step 5: Add Yearly Subscriptions (Best Value)

### Basic Yearly

```
Reference Name: Basic Setup Access - Yearly
Product ID: com.pitbox.basic.yearly
Duration: 1 Year
Price: $99.99 USD

Display Name: Basic Setup Access - Yearly

Description:
Save unlimited racing setup sheets for one full year. Best value!

Save $20 compared to monthly billing!

Community, Swap Meet, and all Tools are FREE!

Free Trial: 7 Days
```

### Premium Yearly

```
Reference Name: Encrypted Setup Access - Yearly
Product ID: com.pitbox.premium.yearly
Duration: 1 Year
Price: $134.99 USD

Display Name: Encrypted Setup Access - Yearly

Description:
All Basic features plus encryption for one full year. Best value for professional teams!

Save $21 compared to monthly billing!

Community, Swap Meet, and all Tools are FREE!

Free Trial: 7 Days
```

---

## Step 6: Submit for Review

1. After creating all subscriptions, click **"Submit for Review"** on each one
2. Apple will review your subscriptions (usually 24-48 hours)
3. Once approved, they'll be available in your app

---

## Step 7: Link Subscriptions to Your App

**CRITICAL: Don't skip this step!**

1. Go to your app's **"App Information"** section
2. Scroll to **"Subscriptions"**
3. Click **"+"** and select your subscription group
4. This makes subscriptions visible in the app

---

# Part 2: Google Play Console Setup

## Step 1: Create Subscription Group

1. Log in to [Google Play Console](https://play.google.com/console)
2. Select your **PitBox** app
3. Go to **"Monetize"** → **"Subscriptions"**
4. Click **"Create subscription"**

---

## Step 2: Basic Monthly Subscription

### Product details
```
Product ID: basic_monthly
Name: Basic Setup Access - Monthly
Description:
Save unlimited racing setup sheets and access them on all your devices. Never lose a winning setup again.

Community, Swap Meet, and all Racing Tools are FREE for everyone! This subscription is only for saving setup sheets.
```

### Base plans and offers

1. Click **"Add base plan"**

**Base Plan:**
```
Billing period: Monthly (1 month / 1 month)
Price: $9.99 USD
```

2. Click **"Add offer"** to create a free trial

**Free Trial Offer:**
```
Offer ID: free_trial
Phase 1:
  Duration: 7 days
  Price: Free
Phase 2:
  Duration: Unlimited
  Price: $9.99 USD
Eligibility: New customers only
```

Click **"Activate"**

---

## Step 3: Premium Monthly Subscription

```
Product ID: premium_monthly
Name: Encrypted Setup Access - Monthly

Description:
All Basic features plus end-to-end encryption for your setup sheets, advanced templates, priority support, and early access.

For professional racing teams who need maximum security.

Community, Swap Meet, and all Racing Tools are FREE!

Base Plan:
  Billing period: Monthly
  Price: $12.99 USD

Free Trial: 7 days
```

Click **"Activate"**

---

## Step 4: Quarterly Subscriptions

### Basic Quarterly
```
Product ID: basic_quarterly
Name: Basic Setup Access - Quarterly
Description: Save unlimited racing setups for 3 months. Save $5 vs monthly! Community & Tools are FREE!

Billing period: Every 3 months
Price: $24.99 USD
Free Trial: 7 days
```

### Premium Quarterly
```
Product ID: premium_quarterly
Name: Encrypted Setup Access - Quarterly
Description: All Basic + encryption for 3 months. Save $4 vs monthly! Community & Tools are FREE!

Billing period: Every 3 months
Price: $34.99 USD
Free Trial: 7 days
```

---

## Step 5: Yearly Subscriptions

### Basic Yearly
```
Product ID: basic_yearly
Name: Basic Setup Access - Yearly
Description: Best value! Save unlimited racing setups for one year. Save $20 vs monthly! Community & Tools are FREE!

Billing period: Yearly (12 months)
Price: $99.99 USD
Free Trial: 7 days
```

### Premium Yearly
```
Product ID: premium_yearly
Name: Encrypted Setup Access - Yearly
Description: Best value for pro teams! All Basic + encryption for one year. Save $21 vs monthly! Community & Tools are FREE!

Billing period: Yearly (12 months)
Price: $134.99 USD
Free Trial: 7 days
```

---

# Part 3: Testing Your Subscriptions

## iOS Testing (TestFlight)

1. In App Store Connect, go to **Users and Access** → **Sandbox Testers**
2. Click **"+"** to add a test account
3. Create a fake Apple ID (e.g., `test1@example.com`)
4. On your iPhone:
   - Install app via TestFlight
   - Sign out of App Store (Settings → Apple ID → Media & Purchases → Sign Out)
   - Open PitBox app
   - Try to access a setup sheet page
   - When prompted, sign in with your sandbox test account
   - Subscribe to Basic or Premium
   - Verify you can save setups
5. **Important**: Free trials last only ~5 minutes in sandbox for testing

## Android Testing (Google Play)

1. In Play Console, go to **Setup** → **License testing**
2. Add your Gmail accounts as testers
3. Create a closed testing track
4. Upload your APK/Bundle
5. Install from Play Store (internal testing link)
6. Try to save a setup sheet
7. Subscribe using test account
8. Google gives you fake payment confirmation

---

# Part 4: Update Your App's Privacy & Description

## App Store (iOS)

Go to your app's **"App Information"** section:

### Subtitle
```
Racing Setup Sheets & Community
```

### Promotional Text
```
Save unlimited racing setup sheets! Community, Swap Meet, and Tools are FREE for everyone.
```

### Description
```
PitBox is the complete racing companion app with FREE community features and premium setup sheet management.

🆓 ALWAYS FREE:
• Racing Community - Connect with racers worldwide
• Swap Meet - Buy and sell racing parts
• Racing Tools & Calculators
• Track Locations & Maps
• Events & Challenges

💎 PREMIUM SETUP SHEETS:
Subscribe to save and sync unlimited racing setup sheets across all your devices.

BASIC ($9.99/month):
✓ Unlimited setup sheets
✓ Multi-device sync
✓ Setup comparison
✓ Cloud backup

PREMIUM ($12.99/month):
✓ All Basic features
✓ End-to-end encryption
✓ Advanced templates
✓ Priority support

7-DAY FREE TRIAL
Try all features risk-free before you subscribe!

Join thousands of racers managing their setups with PitBox.
```

### What's New (for your next update)
```
• Clarified subscription model: Community, Swap Meet, and Tools are FREE!
• Subscriptions only required for racing setup sheets
• Bug fixes and performance improvements
```

---

## Google Play Store (Android)

Go to **"Store presence"** → **"Main store listing"**:

### Short description
```
Racing setup sheets & FREE community for dirt track, sprint cars, and all motorsports
```

### Full description
```
PitBox - Your Complete Racing Companion

🆓 ALWAYS FREE FOR EVERYONE:
• Racing Community - Posts, stories, messaging
• Swap Meet Marketplace - Buy/sell parts
• All Racing Tools & Calculators
• Track Locations & Maps
• Events & Challenges
• Groups & Teams

💎 PREMIUM SETUP SHEETS (Subscription):
Save unlimited racing setup sheets and sync across all devices!

BASIC - $9.99/month
✓ Unlimited setup sheets
✓ Multi-device sync
✓ Setup comparison tools
✓ Cloud backup & history

PREMIUM - $12.99/month
✓ All Basic features
✓ End-to-end encryption
✓ Advanced templates
✓ Priority support
✓ Early access to new features

🏁 FREE TRIAL
Get 7 days free to try all premium setup features!

Perfect for:
• Sprint Car Racing
• Dirt Track Racing
• Late Models
• Modifieds
• Midgets
• Stock Cars
• Karting

Never lose a winning setup again. Join the PitBox community today!
```

---

# Part 5: Important Notes

## What to Tell Users

✅ **DO SAY:**
- "Community, Swap Meet, and Tools are always FREE"
- "Subscriptions only for saving setup sheets"
- "Try 7 days free, cancel anytime"
- "Everything else in the app is free forever"

❌ **DON'T SAY:**
- "Premium features" (too vague)
- "Unlock full access" (implies everything is locked)
- "Free trial of PitBox" (the app itself is free)

## Pricing Summary

| Plan | Monthly | Quarterly | Yearly | Savings |
|------|---------|-----------|--------|---------|
| Basic | $9.99 | $24.99 | $99.99 | Up to $20/year |
| Premium | $12.99 | $34.99 | $134.99 | Up to $21/year |

## Support Questions Template

When users ask "What do I get with premium?":

> "Hey! Great question. Most of PitBox is FREE including the entire Community, Swap Meet marketplace, and all Racing Tools.
>
> You only need a subscription if you want to save and sync your racing setup sheets across devices.
>
> Basic ($9.99/mo) = Unlimited setup saves
> Premium ($12.99/mo) = Basic + encryption
>
> Everything else is free! Try the 7-day trial to test it out."

---

# Part 6: Your Product IDs Reference

## iOS (App Store Connect)

```
com.pitbox.basic.monthly     - $9.99/month
com.pitbox.basic.quarterly   - $24.99/3 months
com.pitbox.basic.yearly      - $99.99/year

com.pitbox.premium.monthly   - $12.99/month
com.pitbox.premium.quarterly - $34.99/3 months
com.pitbox.premium.yearly    - $134.99/year
```

## Android (Google Play)

```
basic_monthly     - $9.99/month
basic_quarterly   - $24.99/3 months
basic_yearly      - $99.99/year

premium_monthly   - $12.99/month
premium_quarterly - $34.99/3 months
premium_yearly    - $134.99/year
```

---

# You're All Set!

Once you complete these steps:

1. ✅ Subscriptions are configured in App Store Connect
2. ✅ Subscriptions are configured in Google Play Console
3. ✅ Product IDs match your app code
4. ✅ Free trials are set up (7 days)
5. ✅ Users understand what's free vs paid
6. ✅ Descriptions clearly state setup sheets only

Your app is ready to launch with a clear, user-friendly subscription model!
