# Multi-Platform Payment System Documentation

## Overview

Your app now supports payments from **three different platforms**, all sharing the same backend:

- **Web (Stripe)**: For users accessing via browser
- **iOS (Apple In-App Purchase)**: For users on iPhone/iPad via App Store
- **Android (Google Play Billing)**: For users on Android via Play Store

## How It Works

### Automatic Platform Detection

The app automatically detects which platform it's running on:

```typescript
import { getPaymentProvider, isMobileApp } from './lib/payments/payment-router';

const provider = getPaymentProvider(); // 'stripe' | 'apple' | 'google'
const isMobile = isMobileApp(); // true on iOS/Android, false on web
```

### Smart Payment Routing

When a user subscribes, the payment is automatically routed to the correct provider:

- **On Web**: Opens Stripe checkout
- **On iOS**: Opens Apple In-App Purchase flow
- **On Android**: Opens Google Play Billing flow

### Unified Database

All subscriptions are stored in the same `user_subscriptions` table:

```sql
user_subscriptions
├── payment_provider (stripe | apple | google)
├── subscription_id (Stripe subscription ID)
├── apple_transaction_id (Apple receipt)
├── google_purchase_token (Google token)
└── status, tier, expires_date, etc.
```

## For Developers

### File Structure

```
src/
├── lib/
│   └── payments/
│       ├── payment-router.ts       # Platform detection & routing
│       ├── payment-service.ts      # Unified payment service
│       ├── apple-iap.ts           # Apple IAP integration
│       └── google-billing.ts      # Google Play integration
└── components/
    ├── SubscriptionPlans.tsx      # Updated to support all platforms
    └── SubscriptionStatus.tsx     # Shows platform-specific info
```

### Making Changes in Bolt

You continue working in Bolt **exactly as before**:

1. Make your changes (features, bug fixes, UI updates)
2. Test in browser → Uses Stripe
3. Build for mobile → Uses Apple/Google
4. **ONE codebase handles everything automatically**

### Adding New Features

When you add features to your app, they work on **all platforms automatically**:

```typescript
// Example: Adding a new feature
function NewFeature() {
  // This works on web AND mobile - no platform-specific code needed!
  return <div>Your new feature</div>;
}
```

The payment system handles itself - you only need to think about it when explicitly working on subscription features.

## For Deployment

### Web Deployment (Stripe)

```bash
npm run build
# Deploy dist/ to your hosting
# Users pay via Stripe
```

### iOS Deployment (Apple IAP)

```bash
npm run build:mobile
npm run cap:open:ios
# In Xcode:
# 1. Configure App Store Connect
# 2. Set up subscription products matching:
#    - com.pitbox.monthly ($9.99/month)
#    - com.pitbox.yearly ($99.99/year)
# 3. Build and submit to App Store
```

### Android Deployment (Google Play)

```bash
npm run build:mobile
npm run cap:open:android
# In Android Studio:
# 1. Configure Google Play Console
# 2. Set up subscription products matching:
#    - monthly_premium ($9.99/month)
#    - yearly_premium ($99.99/year)
# 3. Build and submit to Play Store
```

## Product IDs Configuration

### Current Configuration

The app is configured with these product IDs:

**Apple (iOS)**:
- Monthly: `com.pitbox.monthly`
- Yearly: `com.pitbox.yearly`

**Google (Android)**:
- Monthly: `monthly_premium`
- Yearly: `yearly_premium`

**Stripe (Web)**:
- Monthly: `price_1RRU4fANikXpQi11v5yoYilZ`
- Yearly: `price_1RRU4fANikXpQi11GZmyUEwK`

### Changing Product IDs

To change product IDs, edit `src/lib/payments/payment-router.ts`:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 9.99,
    interval: 'month',
    stripeProductId: 'your_stripe_price_id',
    appleSku: 'your.apple.sku',
    googleSku: 'your_google_sku'
  }
];
```

## Database Schema

### New Columns in `user_subscriptions`

```sql
payment_provider      TEXT    -- 'stripe' | 'apple' | 'google'
apple_transaction_id  TEXT    -- Apple receipt ID
google_purchase_token TEXT    -- Google purchase token
original_transaction_date TIMESTAMPTZ -- First purchase date
expires_date          TIMESTAMPTZ     -- Subscription expiry (mobile only)
```

### New Functions

**check_premium_status(user_id)**:
- Returns `true` if user has active subscription from ANY provider
- Checks Stripe, Apple, and Google subscriptions
- Used throughout the app for access control

**get_active_subscription(user_id)**:
- Returns active subscription details
- Works for all payment providers
- Returns: id, payment_provider, status, tier, etc.

## Testing

### Testing Web (Stripe)

1. Run `npm run dev`
2. Open browser
3. Subscribe → Should open Stripe checkout
4. Payment provider shows "Web"

### Testing iOS (Apple IAP)

1. Run `npm run build:mobile`
2. Open in Xcode
3. Run on simulator or device with sandbox account
4. Subscribe → Should open Apple IAP
5. Payment provider shows "App Store"

### Testing Android (Google Play)

1. Run `npm run build:mobile`
2. Open in Android Studio
3. Run on emulator or device with test account
4. Subscribe → Should open Google Play
5. Payment provider shows "Google Play"

## User Experience

### For Web Users

1. Visit your website
2. Click "Subscribe"
3. Redirected to Stripe checkout
4. Pay with credit card
5. Subscription managed via Stripe portal

### For iOS Users

1. Download app from App Store
2. Tap "Subscribe"
3. Apple's native payment sheet appears
4. Pay with Face ID / Touch ID
5. Manage subscription in iOS Settings

### For Android Users

1. Download app from Play Store
2. Tap "Subscribe"
3. Google Play payment sheet appears
4. Pay with saved Google payment method
5. Manage subscription in Play Store

## Subscription Management

### Web Users (Stripe)

Click "Manage Subscription" → Opens Stripe Customer Portal
- Cancel subscription
- Update payment method
- View invoices

### Mobile Users (Apple/Google)

Click "Manage Subscription" → Shows instructions:
- **iOS**: Settings > Your Name > Subscriptions
- **Android**: Play Store > Menu > Subscriptions

This follows Apple and Google's requirements - subscription management must be done through their systems.

## Revenue & Fees

### Platform Commissions

- **Stripe (Web)**: ~3% transaction fee
- **Apple (iOS)**: 15-30% commission
- **Google (Android)**: 15-30% commission

### Why Use Apple/Google Despite Higher Fees?

**Required by Apple/Google**:
- Cannot use Stripe in mobile apps distributed through stores
- Apps using third-party payments get rejected

**Benefits**:
- Users can pay with Face ID / Touch ID
- Payment methods already on file
- Better conversion rates
- Automatic subscription management
- App Store / Play Store visibility

## Troubleshooting

### Issue: "Payment system initialization failed" on mobile

**Solution**: Ensure cordova-plugin-purchase is installed:
```bash
npm install cordova-plugin-purchase
npm run cap:sync
```

### Issue: Subscriptions not showing up

**Solution**: Check database function exists:
```sql
SELECT * FROM get_active_subscription('user-id-here');
```

### Issue: "Product not found" on mobile

**Solution**:
1. Verify product IDs match in App Store Connect / Play Console
2. Ensure products are approved and available
3. Check that app bundle ID matches

### Issue: Restore purchases not working

**Solution**:
1. Verify user is signed in to App Store / Play Store
2. Check that previous purchases used same Apple ID / Google account
3. Ensure products are subscription type (not consumable)

## Security

### Payment Security

- **Stripe**: PCI-compliant, tokens never touch your server
- **Apple**: Apple validates all transactions
- **Google**: Google validates all transactions

### Subscription Verification

All subscriptions are verified:
- Stripe: Webhook verifies with Stripe API
- Apple: Receipt verification on app
- Google: Purchase token verification

### RLS Policies

Row Level Security ensures:
- Users can only see their own subscriptions
- Subscription status is protected
- Payment provider info is private

## Migration Notes

### Existing Stripe Users

Existing Stripe subscriptions continue working:
- No migration needed
- Keep using Stripe portal
- Database automatically handles them

### Future Mobile Users

New mobile users will use Apple/Google:
- Automatic platform detection
- Native payment experience
- Same premium access

## Need Help?

### Common Questions

**Q: Can I test without real money?**
A: Yes! Use Stripe test mode, Apple sandbox, and Google test accounts.

**Q: Can a user subscribe on web then use mobile?**
A: Yes! All platforms share the same database. Premium status syncs across all platforms.

**Q: What if user subscribes on both web and mobile?**
A: Only one subscription is needed. The app checks for active subscription from ANY provider.

**Q: How do I change prices?**
A: Update prices in:
- Stripe Dashboard (web)
- App Store Connect (iOS)
- Play Console (Android)

**Q: Can I add more subscription tiers?**
A: Yes! Add to SUBSCRIPTION_PLANS in payment-router.ts and create products in all three platforms.

## Summary

Your app now has a **complete multi-platform payment system**:

✅ **Web** pays via Stripe
✅ **iOS** pays via Apple In-App Purchase
✅ **Android** pays via Google Play Billing
✅ **One codebase** handles everything
✅ **One database** stores all subscriptions
✅ **Automatic routing** based on platform
✅ **Works in Bolt** with your normal workflow

You can continue developing features in Bolt exactly as before - the payment system works automatically in the background!
