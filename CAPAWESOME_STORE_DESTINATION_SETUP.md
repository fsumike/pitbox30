# Capawesome Store Destination Setup

Your configuration is correct! Here's how to set up the Store Destination in Capawesome Cloud.

---

## ✅ Your Current Configuration (All Correct!)

**In your code:**
```json
{
  "appId": "8251f381-4aed-4b20-ac20-a3aad250cbb8",
  "publish": {
    "ios": {
      "bundleId": "com.pitbox.app"
    }
  }
}
```

**In capacitor.config.ts:**
```typescript
{
  appId: 'com.pitbox.app',
  appName: 'PitBox',
  webDir: 'dist'
}
```

✅ Everything matches perfectly!

---

## 🔧 Setting Up Store Destination in Capawesome Cloud

### Step 1: Go to Capawesome Cloud
1. Visit: https://cloud.capawesome.io
2. Log in with your account
3. Navigate to your **PitBox** app (ID: `8251f381-4aed-4b20-ac20-a3aad250cbb8`)

### Step 2: Navigate to Store Destinations
1. In the left sidebar, click **Settings** or **Destinations**
2. Look for **Production iOS** destination
3. Click **Edit** on the iOS store destination

### Step 3: Fill Out the Form

You need to provide these exact values:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `iOS` or `Production iOS` | Just a label for you |
| **Platform** | `iOS` | Select from dropdown |
| **Apple ID** | `mg91648@yahoo.com` | Your Apple Developer account email |
| **Apple App ID** | `???????` | **YOU NEED TO FIND THIS** (see below) |
| **App-specific Password** | `••••••••••••••••••••` | Generate one (see below) |
| **Team ID** | `92T67CGL73` | Your Apple Developer Team ID |

---

## 🔍 How to Find Your Apple App ID

The **Apple App ID** is a **numeric ID** that Apple assigns to your app in App Store Connect.

### Option 1: From App Store Connect URL (Easiest)
1. Go to https://appstoreconnect.apple.com/apps
2. Click on **PitBox** (if it exists)
3. Look at the URL in your browser:
   ```
   https://appstoreconnect.apple.com/apps/1234567890/appstore
                                           ^^^^^^^^^^
                                           This is your Apple App ID
   ```

### Option 2: From App Information Page
1. Go to https://appstoreconnect.apple.com/apps
2. Click on **PitBox**
3. Click **App Information** in the left sidebar
4. Look for the **Apple ID** field
5. It will show a number like `1234567890`

### If the App Doesn't Exist Yet
If you haven't created the app in App Store Connect:

1. Go to https://appstoreconnect.apple.com/apps
2. Click **+** button → **New App** → **iOS**
3. Fill in:
   - **Name:** `PitBox`
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Select `com.pitbox.app` from dropdown
     - ⚠️ If it's not in the dropdown, you need to register it first at https://developer.apple.com/account/resources/identifiers/list
   - **SKU:** `pitbox-app` (any unique identifier)
4. Click **Create**
5. After creation, the URL will show your new Apple App ID

---

## 🔑 How to Generate an App-Specific Password

1. Go to https://appleid.apple.com/account/manage
2. Log in with `mg91648@yahoo.com`
3. In the **Security** section, find **App-Specific Passwords**
4. Click **Generate Password**
5. Enter a label: `Capawesome Cloud - PitBox`
6. Click **Create**
7. Copy the password (looks like `xxxx-xxxx-xxxx-xxxx`)
8. Save it somewhere safe - **you can only see it once!**

---

## 📝 Complete Checklist

Before saving the Store Destination, verify:

- [ ] **Bundle ID** in Capawesome config: `com.pitbox.app` ✅ (already correct)
- [ ] **Bundle ID** in App Store Connect matches: `com.pitbox.app`
- [ ] **Apple App ID** is the numeric ID from App Store Connect URL
- [ ] **Team ID** is `92T67CGL73` (verify at https://developer.apple.com/account)
- [ ] **Apple ID** is `mg91648@yahoo.com`
- [ ] **App-specific Password** is generated and saved
- [ ] **Bundle ID** `com.pitbox.app` is registered at https://developer.apple.com/account/resources/identifiers/list

---

## 🎯 What to Do Right Now

**Step 1:** Find your Apple App ID
- Go to App Store Connect: https://appstoreconnect.apple.com/apps
- If PitBox exists, copy the Apple App ID from the URL
- If PitBox doesn't exist, create it first

**Step 2:** Generate App-Specific Password
- Go to https://appleid.apple.com/account/manage
- Generate a new app-specific password
- Save it securely

**Step 3:** Update Capawesome Store Destination
- Go to https://cloud.capawesome.io
- Edit the iOS Production destination
- Fill in all the fields with the correct values

**Step 4:** Test the Build
```bash
npm run capawesome:build:ios
```

---

## ⚠️ Common Issues

### Issue: "Bundle ID not found"
**Solution:** Register the Bundle ID at https://developer.apple.com/account/resources/identifiers/list

1. Click **+** to add a new identifier
2. Select **App IDs** → **Continue**
3. Select **App** → **Continue**
4. Fill in:
   - **Description:** PitBox
   - **Bundle ID:** `com.pitbox.app` (Explicit)
5. Select capabilities you need (Push Notifications, etc.)
6. Click **Continue** → **Register**

### Issue: "Invalid Apple App ID"
**Solution:** Make sure you're using the **numeric ID** from App Store Connect, not the Bundle ID.
- ✅ Correct: `1234567890`
- ❌ Wrong: `com.pitbox.app`

### Issue: "Authentication failed"
**Solution:** Generate a new App-Specific Password and make sure you're using the correct Apple ID email.

---

## 📱 After Setup

Once you've configured the Store Destination:

```bash
# Build iOS app in Capawesome Cloud
npm run capawesome:build:ios

# This will:
# 1. Build your app in the cloud
# 2. Sign it with your certificates
# 3. Upload it to TestFlight
# 4. Make it available for testing
```

---

## 🆘 Need Help?

Tell me:
1. **Does PitBox exist in App Store Connect?** (Yes/No)
2. **If yes, what's the Apple App ID from the URL?**
3. **If no, do you want me to guide you through creating it?**

Once you have the Apple App ID, I'll help you complete the Store Destination setup!
