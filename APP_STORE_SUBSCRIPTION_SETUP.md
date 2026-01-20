# Apple App Store Subscription Setup Guide

## Overview
This guide walks you through setting up your in-app subscriptions in App Store Connect.

**IMPORTANT**: Your first subscription MUST be submitted with your app version. You cannot submit the app without configuring subscriptions first.

---

## Step 1: Create Subscription Group

1. Go to **App Store Connect** → Your App → **Subscriptions**
2. Click **"Create"** under Subscription Groups
3. Fill in:
   - **Subscription Group Name**: `PitBox Premium`
   - **Subscription Group Reference Name**: `pitbox_premium_group`

---

## Step 2: Create Monthly Subscriptions (Start Here)

### Basic Monthly Subscription

Click **"+"** in the subscription group to add a new subscription:

**Product Information:**
- **Reference Name**: `Basic Setup Access - Monthly`
- **Product ID**: `com.pitbox.basic.monthly`
- **Subscription Duration**: 1 Month
- **Review Screenshot**: Upload a screenshot showing the subscription screen

**Subscription Prices:**
- Click **"Add Subscription Price"**
- Select **United States**
- Price: **$9.99** (Tier 10)
- Click **"Next"** to set prices for other territories (recommended: let Apple suggest equivalent pricing)

**Subscription Localization (English - US):**
- **Display Name**: `Basic Setup Access`
- **Description**:
  ```
  Save unlimited racing setup sheets and access them on all your devices. Never lose a winning setup again. Note: Community, Swap Meet, and all Racing Tools are FREE for everyone!
  ```

**Introductory Offer (Free Trial):**
1. Click **"Set Up Introductory Offer"**
2. **Offer Type**: Pay Up Front
3. **Duration**: 7 Days
4. **Price**: Free
5. **Availability**: First time subscribers
6. **Countries**: All

---

### Premium Monthly Subscription

Add second subscription to the same group:

**Product Information:**
- **Reference Name**: `Encrypted Setup Access - Monthly`
- **Product ID**: `com.pitbox.premium.monthly`
- **Subscription Duration**: 1 Month
- **Review Screenshot**: Upload a screenshot showing the premium features

**Subscription Prices:**
- United States: **$12.99** (Tier 12)
- Add other territories as needed

**Subscription Localization (English - US):**
- **Display Name**: `Encrypted Setup Access`
- **Description**:
  ```
  All Basic features plus end-to-end encryption for your setup sheets, advanced templates, priority support, and early access. For professional teams who need maximum security. Note: Community, Swap Meet, and all Racing Tools are FREE for everyone!
  ```

**Introductory Offer (Free Trial):**
- Same as Basic: 7 Days Free

---

## Step 3: Optional - Add Quarterly Subscriptions

If you want to offer quarterly options (recommended for better revenue):

### Basic Quarterly
- **Product ID**: `com.pitbox.basic.quarterly`
- **Duration**: 3 Months
- **Price**: $24.99 (save 17%)
- **Display Name**: `Basic Setup Access - Quarterly`
- **Description**: `Save unlimited racing setup sheets for 3 months. Community and all tools are FREE!`

### Premium Quarterly
- **Product ID**: `com.pitbox.premium.quarterly`
- **Duration**: 3 Months
- **Price**: $34.99 (save 10%)
- **Display Name**: `Encrypted Setup Access - Quarterly`
- **Description**: `All Basic features plus encryption for 3 months. Community and all tools are FREE!`

---

## Step 4: Optional - Add Yearly Subscriptions

For maximum savings:

### Basic Yearly
- **Product ID**: `com.pitbox.basic.yearly`
- **Duration**: 1 Year
- **Price**: $89.99 (save 25%)
- **Display Name**: `Basic Setup Access - Annual`

### Premium Yearly
- **Product ID**: `com.pitbox.premium.yearly`
- **Duration**: 1 Year
- **Price**: $119.99 (save 23%)
- **Display Name**: `Encrypted Setup Access - Annual`

---

## Step 5: Configure Group Settings

1. Go back to your Subscription Group
2. Click **"Set Up Billing Grace Period"**
   - Enable: **16 Days** (recommended)
   - This gives users 16 days to fix payment issues without losing access

3. **Streamlined Purchasing**: Keep **Turned On** (allows purchasing from links)

4. **Family Sharing**:
   - Optional - Enable if you want users to share subscriptions with family members
   - Recommended: **Keep Off** for racing app (individual use)

---

## Step 6: Link to Your App Version

**CRITICAL STEP - Don't Submit Without This!**

1. Go to **App Store Connect** → Your App → **iOS App** → Current version (3.0.0)
2. Scroll down to **"In-App Purchases and Subscriptions"** section
3. Click the **"+"** button
4. Select **ALL** subscriptions you created (at minimum, select the 2 monthly ones)
5. Click **"Done"**
6. **Save** your app version

---

## Step 7: App Review Information

When submitting your app, Apple will ask about subscriptions:

**Subscription Information for Review:**
```
Test Account:
Email: reviewer@pitbox-test.com
Password: PitBox2024Review!

Note: This test account has been granted premium access for testing purposes.

How to Test Subscriptions:
1. Sign in with the test account
2. Go to Profile/Settings
3. Tap "Upgrade to Premium"
4. Select any subscription tier
5. Use Apple's Sandbox testing environment
6. Subscription features will unlock immediately

Premium Features to Test:
- End-to-end encryption toggle in setup sheets
- Advanced setup templates
- Priority support badge in profile
- Early access features section
```

---

## Step 8: Subscription Screenshots

Apple requires screenshots showing your subscription screen. You need:

**Required Screenshots:**
1. **Subscription selection screen** - Where users choose between Basic/Premium
2. **Premium features screen** - Showing what Premium includes
3. **Feature comparison** - Side-by-side Basic vs Premium

**Size Requirements:**
- 6.7" display: 1290 x 2796 pixels
- 6.5" display: 1284 x 2778 pixels
- 5.5" display: 1242 x 2208 pixels

---

## Product IDs Already in Your App

Your app code is already configured with these Product IDs:

### Basic Tier:
✅ `com.pitbox.basic.monthly` - $9.99/month
✅ `com.pitbox.basic.quarterly` - $24.99/3 months
✅ `com.pitbox.basic.yearly` - $89.99/year

### Premium Tier:
✅ `com.pitbox.premium.monthly` - $12.99/month
✅ `com.pitbox.premium.quarterly` - $34.99/3 months
✅ `com.pitbox.premium.yearly` - $119.99/year

**Code Location:** `/src/lib/payments/apple-iap.ts` lines 41-66

---

## Common Issues & Solutions

### Issue: "Subscription not available"
**Solution**: Make sure you:
- Created the subscription in App Store Connect
- Added it to your app version
- Submitted the version for review
- Product ID matches exactly in code and App Store Connect

### Issue: "Agreement needs to be accepted"
**Solution**:
1. Go to **Agreements, Tax, and Banking**
2. Accept the **Paid Applications Agreement**
3. Set up your **Tax Information**
4. Add **Banking Information** for payments

### Issue: "Cannot purchase subscription"
**Solution**:
- Use a Sandbox test account (create in Users and Access → Sandbox Testers)
- Sign out of your real Apple ID in Settings → App Store
- Don't sign into sandbox in Settings - do it in the app when prompted

---

## Recommended Launch Strategy

### Start Simple (Recommended):
1. **Month 1**: Launch with just Monthly subscriptions (Basic + Premium)
2. **Month 2**: Add Quarterly subscriptions once you have data
3. **Month 3**: Add Yearly subscriptions with better discounts

### Why Start Simple:
- Easier to manage and test
- Get user feedback first
- Can adjust pricing based on data
- Less confusing for initial users

---

## Testing Checklist

Before submitting to App Review:

- [ ] Subscription group created
- [ ] At least 2 subscriptions created (Basic + Premium monthly)
- [ ] Subscriptions linked to app version 3.0.0
- [ ] Test account can purchase subscriptions in TestFlight
- [ ] Free trial works (7 days)
- [ ] Premium features unlock after purchase
- [ ] Restore purchases works
- [ ] Subscription auto-renews in sandbox (24 hours in sandbox = 1 month in production)
- [ ] Screenshots uploaded for subscription review
- [ ] Agreements, tax, and banking completed

---

## Quick Reference

**Minimum Setup (Start Here):**
1. Create subscription group: `pitbox_premium_group`
2. Add Basic Monthly: `com.pitbox.basic.monthly` @ $9.99
3. Add Premium Monthly: `com.pitbox.premium.monthly` @ $12.99
4. Link both to app version 3.0.0
5. Submit app with subscriptions

**Next Steps After Approval:**
- Monitor subscription analytics
- Add quarterly/yearly options if demand exists
- Run promotional offers (after 6 months)
- Test win-back offers for cancelled users

---

## Support Links

- [Apple In-App Purchase Documentation](https://developer.apple.com/in-app-purchase/)
- [Subscription Testing Guide](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

---

**Document Version**: 1.0
**Last Updated**: 2026-01-11
**Status**: Ready for Configuration ✅
