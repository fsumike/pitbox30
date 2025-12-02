# App Store Setup Guide

## Quick Reference: Product IDs You Need to Create

### Apple App Store (iOS)
Create these subscription products in App Store Connect:

1. **Monthly Subscription**
   - Product ID: `com.pitbox.monthly`
   - Price: $9.99/month
   - Type: Auto-renewable subscription

2. **Yearly Subscription**
   - Product ID: `com.pitbox.yearly`
   - Price: $99.99/year
   - Type: Auto-renewable subscription

### Google Play Store (Android)
Create these subscription products in Google Play Console:

1. **Monthly Subscription**
   - Product ID: `monthly_premium`
   - Price: $9.99/month
   - Type: Subscription

2. **Yearly Subscription**
   - Product ID: `yearly_premium`
   - Price: $99.99/year
   - Type: Subscription

---

## Detailed Setup Instructions

### Apple App Store Setup

#### Step 1: Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" → "+" → "New App"
3. Fill in details:
   - **Platform**: iOS
   - **Name**: PitBox
   - **Primary Language**: English
   - **Bundle ID**: com.pitbox.app
   - **SKU**: com.pitbox.app (or any unique identifier)

#### Step 2: Create Subscription Group

1. In your app, go to "Subscriptions" tab
2. Click "Create Subscription Group"
3. Name: "PitBox Premium"
4. Save

#### Step 3: Create Monthly Subscription

1. Click "+" to add subscription
2. Fill in details:
   - **Reference Name**: Monthly Premium
   - **Product ID**: `com.pitbox.monthly`
   - **Subscription Duration**: 1 Month
3. Click "Create"
4. Add pricing: $9.99 USD
5. Add localized descriptions (required)
6. Save and submit for review

#### Step 4: Create Yearly Subscription

1. Click "+" to add another subscription
2. Fill in details:
   - **Reference Name**: Yearly Premium
   - **Product ID**: `com.pitbox.yearly`
   - **Subscription Duration**: 1 Year
3. Click "Create"
4. Add pricing: $99.99 USD
5. Add localized descriptions
6. Save and submit for review

#### Step 5: Configure In-App Purchase Testing

1. Go to "Users and Access" → "Sandbox Testers"
2. Add test accounts for testing purchases
3. Use these accounts on your test device to test subscriptions

---

### Google Play Store Setup

#### Step 1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Click "Create app"
3. Fill in details:
   - **App name**: PitBox
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free

#### Step 2: Set Up Billing

1. Go to "Monetize" → "Products" → "Subscriptions"
2. Click "Create subscription"

#### Step 3: Create Monthly Subscription

1. Fill in details:
   - **Product ID**: `monthly_premium`
   - **Name**: Monthly Premium
   - **Description**: Full access to PitBox premium features
2. Set pricing:
   - **Base price**: $9.99 USD
   - **Billing period**: Monthly
   - **Free trial**: Optional (e.g., 7 days)
3. Save and activate

#### Step 4: Create Yearly Subscription

1. Click "Create subscription" again
2. Fill in details:
   - **Product ID**: `yearly_premium`
   - **Name**: Yearly Premium
   - **Description**: Full access to PitBox premium features for one year
3. Set pricing:
   - **Base price**: $99.99 USD
   - **Billing period**: Yearly
   - **Free trial**: Optional
4. Save and activate

#### Step 5: Configure Testing

1. Go to "Setup" → "License testing"
2. Add test Gmail accounts
3. These accounts can make test purchases without being charged

---

## Building & Submitting Apps

### iOS Build & Submit

```bash
# 1. Build the web assets
npm run build

# 2. Sync with Capacitor
npm run cap:sync

# 3. Open in Xcode
npm run cap:open:ios

# 4. In Xcode:
# - Select your development team
# - Configure signing & capabilities
# - Add In-App Purchase capability
# - Archive the app
# - Upload to App Store Connect
# - Submit for review
```

### Android Build & Submit

```bash
# 1. Build the web assets
npm run build

# 2. Sync with Capacitor
npm run cap:sync

# 3. Open in Android Studio
npm run cap:open:android

# 4. In Android Studio:
# - Build → Generate Signed Bundle/APK
# - Choose "Android App Bundle"
# - Create or select signing key
# - Build release bundle
# - Upload to Play Console
# - Submit for review
```

---

## Testing Subscriptions

### Testing on iOS

1. Sign out of your normal Apple ID on the device
2. Go to Settings → App Store → Sandbox Account
3. Sign in with a sandbox tester account (created in App Store Connect)
4. Open your app
5. Try subscribing - you won't be charged
6. Verify subscription shows as active in app

### Testing on Android

1. Add your Google account as a license tester in Play Console
2. Install your app from internal testing track
3. Try subscribing - you'll see "Test purchase" in payment flow
4. Complete purchase - you won't be charged
5. Verify subscription shows as active in app

---

## Common Issues & Solutions

### iOS: "Cannot connect to iTunes Store"

**Solution**:
- Make sure you're signed in with a sandbox account
- Ensure subscriptions are approved in App Store Connect
- Try signing out and back in

### Android: "Product not found"

**Solution**:
- Verify product IDs match exactly
- Ensure products are activated in Play Console
- Wait 2-4 hours after creating products for them to propagate

### Subscriptions not syncing to database

**Solution**:
- Check Supabase logs for errors
- Verify database migration ran successfully
- Check that `user_subscriptions` table exists with new columns

### "Restore purchases" not working

**Solution**:
- Ensure user is signed in with same Apple ID / Google account
- Verify subscription is still active in App Store / Play Store
- Check that products are "subscription" type, not "consumable"

---

## Post-Launch Checklist

After your apps are approved and live:

- [ ] Test real purchases with real money
- [ ] Verify subscriptions sync to database correctly
- [ ] Test subscription management on each platform
- [ ] Verify users can access premium features after subscribing
- [ ] Test subscription renewal (wait 24 hours in sandbox)
- [ ] Test subscription cancellation
- [ ] Monitor Supabase for errors
- [ ] Check revenue in App Store Connect / Play Console

---

## Revenue Tracking

### Where to View Revenue

**Apple (iOS)**:
- App Store Connect → "Sales and Trends"
- View daily/weekly/monthly subscription revenue
- Export financial reports

**Google (Android)**:
- Play Console → "Financial reports"
- View subscription revenue by time period
- Download CSV reports

**Stripe (Web)**:
- Stripe Dashboard → "Payments"
- Real-time transaction tracking
- Detailed revenue analytics

---

## Support & Help

### If Users Can't Subscribe

**iOS Users**: Direct them to:
- Settings → [Their Name] → Payment & Shipping
- Verify payment method is valid

**Android Users**: Direct them to:
- Play Store → Menu → Payment methods
- Verify payment method is valid

### If Subscription Doesn't Show in App

1. Ask user to try "Restore Purchases"
2. Verify their account email matches
3. Check database for subscription record
4. If missing, may need to manually add (rare)

---

## Next Steps

1. Create products in App Store Connect (iOS)
2. Create products in Google Play Console (Android)
3. Build and test apps
4. Submit for review
5. Wait for approval (typically 1-3 days for iOS, 1-2 days for Android)
6. Launch!

Your multi-platform payment system is ready to go. Good luck with your launch!
