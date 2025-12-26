# Product IDs for App Store Setup

## Complete Payment Schedule - All Platforms

---

## 📱 Apple App Store Connect

Create these **6 subscription products** in a subscription group called "PitBox Premium":

### Basic Tier

1. **Basic Monthly**
   - Product ID: `com.pitbox.basic.monthly`
   - Price: **$9.99**
   - Duration: 1 Month
   - Type: Auto-renewable subscription

2. **Basic Quarterly**
   - Product ID: `com.pitbox.basic.quarterly`
   - Price: **$24.99**
   - Duration: 3 Months
   - Type: Auto-renewable subscription

3. **Basic Yearly**
   - Product ID: `com.pitbox.basic.yearly`
   - Price: **$99.99**
   - Duration: 1 Year
   - Type: Auto-renewable subscription

### Premium Tier

4. **Premium Monthly**
   - Product ID: `com.pitbox.premium.monthly`
   - Price: **$12.99**
   - Duration: 1 Month
   - Type: Auto-renewable subscription

5. **Premium Quarterly**
   - Product ID: `com.pitbox.premium.quarterly`
   - Price: **$34.99**
   - Duration: 3 Months
   - Type: Auto-renewable subscription

6. **Premium Yearly**
   - Product ID: `com.pitbox.premium.yearly`
   - Price: **$134.99**
   - Duration: 1 Year
   - Type: Auto-renewable subscription

---

## 🤖 Google Play Console

Create these **6 subscription products** under: Monetize → Products → Subscriptions

### Basic Tier

1. **Basic Monthly**
   - Product ID: `basic_monthly`
   - Name: "Basic Setup Access - Monthly"
   - Price: **$9.99**
   - Billing period: Monthly (every 1 month)

2. **Basic Quarterly**
   - Product ID: `basic_quarterly`
   - Name: "Basic Setup Access - Quarterly"
   - Price: **$24.99**
   - Billing period: Every 3 months

3. **Basic Yearly**
   - Product ID: `basic_yearly`
   - Name: "Basic Setup Access - Yearly"
   - Price: **$99.99**
   - Billing period: Yearly (every 1 year)

### Premium Tier

4. **Premium Monthly**
   - Product ID: `premium_monthly`
   - Name: "Encrypted Setup Access - Monthly"
   - Price: **$12.99**
   - Billing period: Monthly (every 1 month)

5. **Premium Quarterly**
   - Product ID: `premium_quarterly`
   - Name: "Encrypted Setup Access - Quarterly"
   - Price: **$34.99**
   - Billing period: Every 3 months

6. **Premium Yearly**
   - Product ID: `premium_yearly`
   - Name: "Encrypted Setup Access - Yearly"
   - Price: **$134.99**
   - Billing period: Yearly (every 1 year)

---

## 🌐 Stripe (Web) - Already Configured

Your Stripe products are already set up with these price IDs:

### Basic Tier

- Monthly: `price_1RRU4fANikXpQi11v5yoYilZ` ($9.99)
- Quarterly: `price_1RRU4fANikXpQi11xJ5EG1vx` ($24.99)
- Yearly: `price_1RRU4fANikXpQi11GZmyUEwK` ($99.99)

### Premium Tier

- Monthly: `price_1RRU7iANikXpQi11N4km6XFf` ($12.99)
- Quarterly: `price_1RRUhCANikXpQi11RVy5KKbK` ($34.99)
- Yearly: `price_1RRUhCANikXpQi11Ya6mzjHl` ($134.99)

---

## 💰 Pricing Summary

| Tier | Monthly | Quarterly | Yearly | Savings |
|------|---------|-----------|--------|---------|
| **Basic** | $9.99 | $24.99 | $99.99 | $20/year |
| **Premium** | $12.99 | $34.99 | $134.99 | $21/year |

---

## 📦 Feature Comparison

### Basic Setup Access ($9.99/month)
- Unlimited setup saves
- Access on all your devices
- Basic setup templates
- Community access

### Encrypted Setup Access ($12.99/month)
- All Basic features
- End-to-end encryption
- Advanced setup templates
- Priority support
- Early access to new features

---

## ✅ Setup Checklist

### Apple App Store
- [ ] Log into App Store Connect
- [ ] Navigate to your app
- [ ] Go to "Subscriptions" tab
- [ ] Create subscription group "PitBox Premium"
- [ ] Create all 6 products with exact IDs above
- [ ] Submit for review (takes 24-48 hours)
- [ ] Add in-app purchase capability in Xcode
- [ ] Test with sandbox account

### Google Play Store
- [ ] Log into Play Console
- [ ] Navigate to your app
- [ ] Go to Monetize → Products → Subscriptions
- [ ] Create all 6 products with exact IDs above
- [ ] Activate all products
- [ ] Test with license testing account

### Web (Stripe)
- [x] Already configured and ready to use

---

## 🧪 Testing

### Apple
Create sandbox tester accounts in App Store Connect:
1. Go to Users and Access → Sandbox Testers
2. Create test account
3. Sign out of real Apple ID on device
4. Sign in with sandbox account when testing

### Google
Add license testers in Play Console:
1. Go to Setup → License testing
2. Add email addresses
3. Select "License Test Response" as your test type
4. Test with those accounts

### Stripe
Use Stripe test mode with test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## 📝 Important Notes

1. **Product IDs must match exactly** - Copy/paste from this document
2. **Prices must match exactly** - Use the amounts listed above
3. **Apple review takes time** - Submit subscriptions before app review
4. **Test thoroughly** - Use sandbox/test accounts before going live
5. **All platforms sync** - User gets premium on all platforms regardless of where they paid

---

## 🚀 After Setup

Once all products are created:

1. **Test on iOS simulator** with sandbox account
2. **Test on Android emulator** with test account
3. **Test on web** with Stripe test mode
4. **Verify database** - Check subscription saves correctly
5. **Submit apps** - Both stores require approval

Your code is already configured for all these products and will automatically detect the platform and show the correct payment options!
