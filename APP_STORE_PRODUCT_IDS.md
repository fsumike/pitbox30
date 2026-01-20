# App Store Connect - Exact Product IDs

Copy and paste these EXACTLY into App Store Connect. Typos will break the app!

---

## Subscription Group

**Name**: `PitBox Premium`
**Reference Name**: `pitbox_premium_group`

---

## Required Subscriptions (Create These First)

### 1. Basic Monthly

```
Reference Name: Basic Setup Access - Monthly
Product ID: com.pitbox.basic.monthly
Duration: 1 Month
Price: $9.99 USD (Tier 10)

Display Name: Basic Setup Access
Description: Unlimited setup saves, access on all devices, full community access, and all professional racing tools.

Free Trial: 7 Days
```

---

### 2. Premium Monthly

```
Reference Name: Encrypted Setup Access - Monthly
Product ID: com.pitbox.premium.monthly
Duration: 1 Month
Price: $12.99 USD (Tier 12)

Display Name: Encrypted Setup Access
Description: All Basic features plus end-to-end encryption, advanced templates, priority support, and early access to new features.

Free Trial: 7 Days
```

---

## Optional Subscriptions (Add Later)

### 3. Basic Quarterly

```
Reference Name: Basic Setup Access - Quarterly
Product ID: com.pitbox.basic.quarterly
Duration: 3 Months
Price: $24.99 USD

Display Name: Basic Setup Access - 3 Months
Description: 3 months of unlimited setup saves and full access. Save 17% compared to monthly!
```

---

### 4. Premium Quarterly

```
Reference Name: Encrypted Setup Access - Quarterly
Product ID: com.pitbox.premium.quarterly
Duration: 3 Months
Price: $34.99 USD

Display Name: Encrypted Setup Access - 3 Months
Description: 3 months of premium features including encryption. Save 10% compared to monthly!
```

---

### 5. Basic Yearly

```
Reference Name: Basic Setup Access - Yearly
Product ID: com.pitbox.basic.yearly
Duration: 1 Year
Price: $89.99 USD

Display Name: Basic Setup Access - Annual
Description: Full year of unlimited access. Save 25% compared to monthly - best value!
```

---

### 6. Premium Yearly

```
Reference Name: Encrypted Setup Access - Yearly
Product ID: com.pitbox.premium.yearly
Duration: 1 Year
Price: $119.99 USD

Display Name: Encrypted Setup Access - Annual
Description: Full year of premium features with encryption. Save 23% compared to monthly!
```

---

## Important Notes

1. **Product IDs must match EXACTLY** - No typos!
2. **Start with Monthly only** - Add quarterly/yearly later if needed
3. **Free trials** - Both tiers offer 7-day free trial
4. **Link to app version** - Must add subscriptions to version 3.0.0 before submitting

---

## Copy-Paste Quick Reference

When creating in App Store Connect, copy these exact Product IDs:

```
com.pitbox.basic.monthly
com.pitbox.premium.monthly
com.pitbox.basic.quarterly
com.pitbox.premium.quarterly
com.pitbox.basic.yearly
com.pitbox.premium.yearly
```

**These are already configured in your app code!** ✅

File: `/src/lib/payments/payment-router.ts`
