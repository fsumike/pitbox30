# App Store Subscriptions - Quick Start

## What You're Seeing

Apple requires you to set up subscriptions BEFORE submitting your app. You cannot submit your app without completing this step.

---

## Do This Right Now (5 Minutes)

### 1. Create Subscription Group
- Click **"Create"** button
- Name: `PitBox Premium`
- Reference: `pitbox_premium_group`
- Click **Save**

### 2. Add Basic Monthly Subscription
Click the **"+"** in your new group:

```
Reference Name: Basic Setup Access - Monthly
Product ID: com.pitbox.basic.monthly
Duration: 1 Month
Price: $9.99 USD

Display Name: Basic Setup Access
Description: Save unlimited racing setup sheets on all devices. Community, Swap Meet & Tools are FREE!

Free Trial: 7 days
```

### 3. Add Premium Monthly Subscription
Click **"+"** again:

```
Reference Name: Encrypted Setup Access - Monthly
Product ID: com.pitbox.premium.monthly
Duration: 1 Month
Price: $12.99 USD

Display Name: Encrypted Setup Access
Description: All Basic features plus setup encryption, advanced templates, priority support. Community & Tools are FREE!

Free Trial: 7 days
```

### 4. Link to Your App
**DON'T SKIP THIS!**

1. Go to your app version (3.0.0)
2. Find **"In-App Purchases and Subscriptions"**
3. Click **"+"**
4. Select BOTH subscriptions
5. Click **Done**
6. **Save** the version

---

## You're Done!

Now you can submit your app for review. Apple will review both your app AND subscriptions together.

---

## Optional: Add More Plans Later

After your first submission is approved, you can add:
- Quarterly plans ($24.99 / $34.99)
- Yearly plans ($89.99 / $119.99)

But start with just monthly to keep it simple!

---

## Need More Details?

See `APP_STORE_SUBSCRIPTION_SETUP.md` for complete step-by-step instructions.

---

**TL;DR**: Create a subscription group, add 2 monthly subscriptions (Basic $9.99, Premium $12.99), link them to your app version, then submit.
