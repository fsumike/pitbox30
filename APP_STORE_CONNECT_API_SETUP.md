# App Store Connect API Setup for Capawesome

## Why Switch to API Keys?

The old Apple ID + Password method is being phased out by Apple. Using App Store Connect API is:
- More secure
- More reliable
- Required for automated CI/CD
- Recommended by Apple

---

## Step 1: Create App Store Connect API Key

### A. Log into App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple ID: **mg91648@yahoo.com**

### B. Navigate to API Keys
1. Click **Users and Access** in the top navigation
2. Click the **Keys** tab
3. Click the **App Store Connect API** sub-tab (or just "API Keys")

### C. Generate New Key
1. Click the **+** button (or "Generate API Key")
2. Fill in:
   - **Name:** `PitBox Capawesome`
   - **Access:** Select **App Manager** (recommended) or **Admin**
     - App Manager: Can upload builds and manage app info
     - Admin: Full access (use if you need more control)
3. Click **Generate**

### D. Download Your Key
⚠️ **IMPORTANT:** You can only download this ONCE!

1. Click **Download API Key**
2. You'll get a file like: `AuthKey_ABCD1234.p8`
3. **Save this file safely** - you cannot download it again!

### E. Copy Important Information
You'll need three pieces of information:

**From the Keys page:**
- **Issuer ID** (at top of page, format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- **Key ID** (next to your key name, format: `ABCD1234`)

**The .p8 file you just downloaded**

---

## Step 2: Set Up Capawesome Store Destination

### A. Log into Capawesome Cloud
```bash
npm run capawesome:login
```

Or go to: https://cloud.capawesome.io

### B. Navigate to Your App
1. Go to: https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8
2. Click **Settings** in left sidebar
3. Click **Store Destinations**

### C. Delete Old Destination (Optional but Recommended)
1. Find destination: `5cea5914-4a94-4f14-82f8-15b65c9275b7`
2. Click the **trash/delete icon**
3. Confirm deletion

### D. Create New Destination
1. Click **Add Destination** or **Create New Destination**
2. Select **iOS** as platform
3. Select **App Store Connect API** as method (NOT "Apple ID")

### E. Fill in API Details
```
Destination Name: PitBox App Store
Platform: iOS
Method: App Store Connect API

Bundle ID: com.pitbox.app
Issuer ID: [paste from App Store Connect]
Key ID: [paste from App Store Connect]
Private Key: [paste contents of .p8 file]

Destinations:
☑ TestFlight
☑ App Store
```

### F. How to Get Private Key Contents
Open your `.p8` file in a text editor. It looks like:
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
[multiple lines of random characters]
...abc123xyz==
-----END PRIVATE KEY-----
```

**Copy the ENTIRE contents** including the BEGIN and END lines.

### G. Save Destination
1. Click **Create** or **Save**
2. **COPY THE NEW DESTINATION ID** - looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. Keep this for Step 3

---

## Step 3: Update Your Configuration

Edit `capawesome.config.json` and update the `destinationId`:

```json
{
  "publish": {
    "ios": {
      "bundleId": "com.pitbox.app",
      "destinationId": "YOUR-NEW-DESTINATION-ID-HERE",
      "destinations": [
        {
          "type": "testflight",
          "enabled": true
        },
        {
          "type": "app-store",
          "enabled": true
        }
      ]
    }
  }
}
```

Replace `YOUR-NEW-DESTINATION-ID-HERE` with the destination ID from Step 2G.

---

## Step 4: Test Your Setup

### A. Increment Build Number
Edit `capawesome.config.json` line 13:
```json
"buildNumber": "99"
```

### B. Run Build
```bash
npm run build:ci:ios
npm run capawesome:build:ios
```

### C. Monitor Build
Go to: https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/builds

The build should:
1. Complete successfully
2. Upload to TestFlight
3. Appear in App Store Connect within 10-15 minutes

---

## Troubleshooting

### "Invalid Issuer ID"
- Make sure you copied the **Issuer ID** from the top of the Keys page
- Format should be: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### "Invalid Key ID"
- Make sure you copied the **Key ID** next to your key name
- Format should be: `ABCD1234` (10 characters)

### "Invalid Private Key"
- Make sure you copied the ENTIRE contents of the .p8 file
- Include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Don't add extra spaces or line breaks

### "Insufficient Permissions"
- Your API key needs **App Manager** or **Admin** role
- Go back to App Store Connect → Users and Access → Keys
- Check the Access level of your key

### Build Completes But Doesn't Appear in App Store Connect
- Wait 15-20 minutes (sometimes takes time)
- Check your email for errors from Apple
- Verify Bundle ID matches: `com.pitbox.app`
- Check that TestFlight is enabled in destination

---

## Quick Reference

### Your Current Info:
- **Bundle ID:** com.pitbox.app
- **Capawesome App ID:** 8251f381-4aed-4b20-ac20-a3aad250cbb8
- **Team ID:** 92T67CGL73
- **Apple ID:** mg91648@yahoo.com
- **Apple App ID:** 6757286830

### What You Need to Get:
1. ✅ Issuer ID (from App Store Connect → Keys)
2. ✅ Key ID (from App Store Connect → Keys)
3. ✅ Private Key file (.p8)
4. ✅ New Destination ID (from Capawesome after creating)

### Commands:
```bash
# Login to Capawesome
npm run capawesome:login

# Build and upload
npm run build:ci:ios
npm run capawesome:build:ios

# Check status
npm run capawesome:whoami
```

---

## Step-by-Step Visual Guide

### 1. App Store Connect - Create API Key
```
appstoreconnect.apple.com
→ Users and Access
→ Keys tab
→ App Store Connect API
→ + (Generate)
→ Name: "PitBox Capawesome"
→ Access: App Manager
→ Generate
→ Download API Key (SAVE THIS!)
→ Copy Issuer ID & Key ID
```

### 2. Capawesome Cloud - Create Destination
```
cloud.capawesome.io
→ Your App (8251f381...)
→ Settings
→ Store Destinations
→ Add Destination
→ Platform: iOS
→ Method: App Store Connect API
→ Fill in:
   - Bundle ID: com.pitbox.app
   - Issuer ID: [paste]
   - Key ID: [paste]
   - Private Key: [paste .p8 contents]
→ Enable TestFlight & App Store
→ Save
→ COPY THE NEW DESTINATION ID
```

### 3. Update Config
```
Edit: capawesome.config.json
Find: "destinationId"
Replace: with new ID from step 2
Save file
```

### 4. Build & Upload
```
Terminal:
npm run build:ci:ios
npm run capawesome:build:ios

Wait 10-15 minutes
Check App Store Connect for new build
```

---

## Need Help?

If you get stuck:
1. Check Capawesome build logs for specific errors
2. Verify all three pieces (Issuer ID, Key ID, Private Key)
3. Make sure API key has App Manager or Admin access
4. Wait at least 15-20 minutes for build to appear

Once set up correctly, future uploads will be automatic and reliable!
