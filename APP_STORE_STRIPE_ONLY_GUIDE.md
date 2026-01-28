# App Store Connect - Stripe-Only Payment Guide

## Overview
PitBox uses **Stripe-only payment processing** and qualifies for Apple's "Reader App" / "Multiplatform Service" exception, allowing us to bypass Apple's In-App Purchase requirements.

---

## ✅ Why PitBox Qualifies

### App Store Review Guidelines Section 3.1.3(a) - "Reader Apps"
PitBox is a **productivity and utility app** that:
- ✅ Provides racing setup sheet management (productivity tool)
- ✅ Includes community features (social platform)
- ✅ Offers marketplace for physical goods (Swap Meet)
- ✅ Provides professional racing tools
- ✅ Subscriptions unlock access across ALL platforms (web, iOS, Android)

### Similar Apps Using This Model:
- Netflix, Spotify, Kindle
- Dropbox, Evernote
- Strava Premium, ClassPass
- Many SaaS productivity tools

---

## 📋 App Store Connect Setup

### 1. **NO In-App Purchases Required**
- Do NOT create any in-app purchase products
- Do NOT set up subscriptions in App Store Connect
- Leave the "In-App Purchases" section empty

### 2. **NO Financial Information Required**
- Skip "Agreements, Tax, and Banking"
- Only needed if Apple processes payments for you
- Since we use Stripe, this is NOT required

### 3. **App Description Requirements**

**REQUIRED wording in App Description:**
```
Premium features are available via web subscription at pitbox.app.
Subscriptions are managed through your PitBox account on our website.
```

**DO:**
- ✅ Mention that premium features exist
- ✅ Direct users to your website for subscriptions
- ✅ Include "Manage Subscription" button in app that opens website
- ✅ Show subscription pricing in app (informational only)

**DON'T:**
- ❌ Say "cheaper on web" or mention App Store pricing
- ❌ Disparage App Store or in-app purchases
- ❌ Include checkout UI inside the app
- ❌ Use "Buy" or "Purchase" buttons that trigger web checkout

---

## 🎯 App Review Information

### App Review Notes (Important!)
**Copy this into your "App Review Information" notes:**

```
PAYMENT MODEL: External Web-Based Subscriptions

PitBox qualifies as a "Reader App" / "Multiplatform Service" under App Store
Review Guidelines 3.1.3(a). Our app provides:

1. Primary Function: Racing setup sheet management and productivity tools
2. Community features and user-generated content platform
3. Physical goods marketplace (Swap Meet section)
4. Professional racing calculators and tools

SUBSCRIPTION DETAILS:
- All subscriptions are processed via Stripe on our website (pitbox.app)
- No in-app purchases or Apple payment processing
- Users can create accounts and subscribe on our website
- App provides "Manage Subscription" link to website
- Free features: Community, Swap Meet, Racing Tools, Events
- Paid features: Setup sheet storage and encryption only

COMPLIANCE:
- App does not use StoreKit or any Apple payment APIs
- Subscription information is displayed (informational only)
- Users are directed to website for subscription management
- App does not include checkout UI or external payment buttons
- All subscription processing happens outside the app via web browser

TEST ACCOUNT:
Email: reviewers@pitbox.app
Password: [Your test account password]

This account has premium access enabled for testing all features.
```

### Demo Account Setup
1. Create a test account: `reviewers@pitbox.app`
2. Enable premium access via your Supabase admin panel
3. Provide credentials in App Review Information

---

## 📱 In-App Requirements

### What Your App MUST Have:

1. **Account Creation on Website**
   ```
   Users must be able to create accounts at pitbox.app
   ```

2. **Manage Subscription Button**
   ```
   - Opens pitbox.app/profile in Safari/browser
   - Does NOT use in-app webview for checkout
   - Labeled: "Manage Subscription" or "View Plans on Website"
   ```

3. **Informational Pricing Display**
   ```
   - CAN show pricing tiers
   - CAN show "what's included"
   - Button says "View Plans" or "Continue to Website"
   - Opens external browser (NOT in-app webview)
   ```

4. **No StoreKit or Apple APIs**
   ```
   - Do not import StoreKit
   - Do not use SKPayment or any IAP code
   - Use Capacitor's Browser plugin to open external URLs
   ```

---

## 🎨 App Store Listing

### Title
```
PitBox - Racing Setup Sheets
```

### Subtitle
```
Setup Management & Racing Community
```

### Description Template
```
PitBox is the ultimate racing productivity app for dirt track and sprint car racers.

FREE FOREVER:
• Racing Community - Connect with racers worldwide
• Swap Meet - Buy and sell racing parts
• Racing Tools - Spring calculator, gear ratio, tire pressure tools
• Track Locations - Find tracks near you
• Events & Challenges - Join racing events

PREMIUM SETUP ACCESS:
Upgrade on our website (pitbox.app) to unlock:
• Unlimited setup sheet storage
• Cloud sync across all devices
• Setup comparison tools
• Advanced templates
• End-to-end encryption (Premium tier)

PRODUCTIVITY TOOLS:
✓ Spring rate calculator
✓ Gear ratio calculator
✓ Weight distribution calculator
✓ Tire pressure management
✓ Shock inventory tracking
✓ Motor maintenance logs
✓ Track notebook with lap times

COMMUNITY FEATURES:
✓ Share setups and tips
✓ Post photos and videos
✓ Direct messaging
✓ Find racing buddies by location
✓ Join racing groups and teams

SWAP MEET MARKETPLACE:
✓ Buy and sell parts
✓ Search by location
✓ Direct messaging with sellers
✓ Save favorite listings

Subscriptions are managed at pitbox.app. Create your free account today!
```

### Keywords
```
racing, dirt track, sprint car, setup, late model, modified, tools, community
```

### Category
```
Primary: Sports
Secondary: Productivity
```

### Content Rating
```
12+ (Community features with user-generated content)
```

---

## 🎬 App Preview Requirements

### Screenshots Should Show:
1. Free community features
2. Racing tools (calculators)
3. Setup sheet interface (with "Premium Feature" badge)
4. Swap Meet marketplace
5. Social features (posts, messaging)

### App Preview Video (Optional):
- Show free features predominantly
- Brief mention of premium upgrade
- Focus on utility and community value

---

## ❓ If App Review Asks About Payments

### Response Template:
```
Thank you for reviewing PitBox.

Our app qualifies under App Store Review Guidelines 3.1.3(a) as a
"Reader App" / "Multiplatform Service."

PitBox is primarily a productivity and utility app for racing professionals.
The majority of features (community, marketplace, tools) are free forever.
Only setup sheet storage requires a subscription.

Subscriptions are managed on our website (pitbox.app) where users can:
- Create accounts
- Subscribe via Stripe
- Manage their subscription
- Access their data on web, iOS, and Android

This is consistent with apps like Netflix, Spotify, Dropbox, and Strava,
which also use external subscription systems.

The app does not include:
- Any StoreKit or Apple payment code
- Checkout UI or payment forms
- Links that circumvent Apple's payment system

We believe this approach provides the best cross-platform experience
for our users while complying with App Store guidelines.

Please let us know if you need any clarification.
```

---

## ✅ Pre-Submission Checklist

- [ ] App description mentions website subscriptions
- [ ] No in-app purchases created in App Store Connect
- [ ] "Manage Subscription" button opens external browser
- [ ] Test account provided with premium access
- [ ] App Review Notes explain payment model
- [ ] No StoreKit imports in code
- [ ] All free features work without subscription
- [ ] Subscription page shows pricing (informational only)
- [ ] External links open in Safari (not in-app webview)
- [ ] App metadata doesn't disparage App Store

---

## 🚀 What to Expect

### Timeline:
- **First Submission**: 1-3 days for initial review
- **Possible Rejection**: Be prepared for questions about payment
- **Appeal if Needed**: Use response template above
- **Final Approval**: Usually within 1 week total

### Most Common Questions:
1. "Why aren't you using In-App Purchase?"
   - **Answer**: We qualify under 3.1.3(a) as a reader/productivity app

2. "How do users subscribe?"
   - **Answer**: Via our website, similar to Netflix/Spotify model

3. "Can you show us the subscription flow?"
   - **Answer**: Provide test account with premium already enabled

---

## 📞 Need Help?

If your app is rejected:
1. Read the rejection reason carefully
2. Use the response template above
3. Reference Section 3.1.3(a) of App Store Review Guidelines
4. Provide examples of similar apps (Spotify, Netflix)
5. Request a phone call with App Review (available option)

---

## 📚 Official Apple References

- [App Store Review Guidelines 3.1.3](https://developer.apple.com/app-store/review/guidelines/#business)
- [Reader Apps Documentation](https://developer.apple.com/support/reader-apps/)
- [Business Section FAQ](https://developer.apple.com/app-store/review/guidelines/#business)

---

## ✨ You're All Set!

Your app is now configured for Stripe-only payments. You do NOT need to:
- ❌ Set up bank accounts in App Store Connect
- ❌ Fill out tax forms for Apple
- ❌ Create in-app purchase products
- ❌ Configure App Store subscriptions
- ❌ Pay Apple's 15-30% commission

You only need:
- ✅ Apple Developer Program membership ($99/year)
- ✅ Clear app description mentioning website subscriptions
- ✅ "Manage Subscription" button that opens your website
- ✅ Your Stripe account for payment processing

**Good luck with your submission!**
