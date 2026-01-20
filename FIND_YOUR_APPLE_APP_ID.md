# How to Find Your Correct Apple App ID

The **Apple App ID** is a unique numeric identifier Apple assigns to your app in App Store Connect.

---

## 🔍 Finding Your Apple App ID

### Method 1: App Store Connect (Easiest)

1. Go to: https://appstoreconnect.apple.com/apps
2. Find **PitBox** in your apps list
3. Click on it
4. Look at the URL in your browser:
   ```
   https://appstoreconnect.apple.com/apps/XXXXXXXXXX/appstore
                                           ^^^^^^^^^^
                                           This is your Apple App ID
   ```

### Method 2: App Information Page

1. Go to: https://appstoreconnect.apple.com/apps
2. Click on **PitBox**
3. Go to **App Information** (left sidebar)
4. Look for **Apple ID** field
5. It will show a number like `1234567890`

---

## 🔎 Verify Your Configuration

**Current Store Destination Settings:**
```
Apple App ID: 6757286830
Bundle ID: com.pitbox.app
Team ID: 92T67CGL73
```

**Questions to Verify:**

1. **Is 6757286830 the correct Apple App ID for PitBox?**
   - Check the URL or App Information page
   - It should match exactly

2. **Is com.pitbox.app the correct Bundle ID?**
   - In App Store Connect, go to your app
   - Click **App Information**
   - Check the **Bundle ID** field
   - It should say `com.pitbox.app`

3. **Is 92T67CGL73 your correct Team ID?**
   - Go to: https://developer.apple.com/account
   - Click **Membership** in sidebar
   - Check **Team ID**

---

## ⚠️ Common Issues

### Issue 1: Wrong Apple App ID
If `6757286830` is NOT your PitBox app ID:
- You may have copied the ID from a different app
- You need to use the correct numeric ID from App Store Connect

### Issue 2: Bundle ID Mismatch
If your app in App Store Connect has a different Bundle ID:
- Your app might be registered as `com.pitbox.pitbox` or similar
- You need to update either:
  - **Option A:** Update Capawesome config to match App Store Connect
  - **Option B:** Create a new app in App Store Connect with `com.pitbox.app`

### Issue 3: App Doesn't Exist Yet
If you haven't created the app in App Store Connect:
1. Go to https://appstoreconnect.apple.com/apps
2. Click **+** (Add Apps)
3. Select **iOS**
4. Fill in:
   - **Name:** PitBox
   - **Primary Language:** English
   - **Bundle ID:** Select `com.pitbox.app` from dropdown
   - **SKU:** pitbox-app (or any unique identifier)
5. Click **Create**
6. Copy the Apple App ID from the URL

---

## 🎯 What to Do Next

**Step 1:** Verify the Apple App ID
- Go to App Store Connect
- Find your PitBox app
- Confirm the Apple App ID matches `6757286830`

**Step 2:** If it doesn't match, let me know:
- What is the CORRECT Apple App ID?
- What Bundle ID does it show in App Store Connect?
- Does the app exist in App Store Connect at all?

**Step 3:** I'll update your configuration accordingly

---

## 📱 Quick Check Script

Tell me the answers to these questions:

1. **Does PitBox exist in App Store Connect?** (Yes/No)
2. **If yes, what's the Apple App ID shown in the URL or App Information?**
3. **If yes, what's the Bundle ID shown in App Information?**
4. **What's your Team ID from developer.apple.com/account?**

Once you provide these, I'll make sure everything matches correctly!
