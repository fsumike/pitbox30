# Capawesome OTA Updates - Complete Setup Guide

## What You Have Now

✅ **Your app is configured and ready for Capawesome Live Updates**
✅ **Your existing cordova-plugin-purchase is intact** (for payments)
✅ **PWA is fully functional**
✅ **Build completed successfully**

---

## Step-by-Step Setup Instructions

### Step 1: Configure npm Registry with Your License Key

Open your terminal and run:

```bash
npm config set @capawesome-team:registry https://npm.registry.capawesome.io
npm config set //npm.registry.capawesome.io/:_authToken YOUR_LICENSE_KEY_HERE
```

**Where to get your license key:**
- Go to: https://polar.sh/capawesome-team/portal
- Login with your Capawesome account
- Copy your license key

---

### Step 2: Install Capawesome Live Update Plugin

```bash
npm install @capawesome-team/capacitor-live-update
npx cap sync
```

---

### Step 3: Create Your App in Capawesome Cloud Console

1. Go to: https://console.cloud.capawesome.io/
2. Sign in with your Capawesome account
3. Click "Create Organization" (if you haven't already)
4. Click "Create App" or "New App"
5. Fill in:
   - **App Name:** PIT-BOX
   - **Bundle ID:** `com.pitbox.app`
6. Click "Create"
7. **COPY YOUR APP ID** - You'll need this in the next step

---

### Step 4: Update Your App ID in Config

Open `capacitor.config.ts` and replace `YOUR_CAPAWESOME_APP_ID` with the actual App ID you copied:

```typescript
CapawesomeLiveUpdate: {
  appId: 'your_actual_app_id_here',  // Replace this
  enabled: true,
  autoUpdate: true,
  resetOnUpdate: false
}
```

---

### Step 5: Enable Live Updates in Your App

Open `src/App.tsx` and add this import at the top:

```typescript
import { liveUpdateService } from './lib/capawesome-live-update';
```

Then add this inside the `useEffect` hook (around line 181):

```typescript
useEffect(() => {
  const seen = sessionStorage.getItem('hasSeenVideoSplash');
  if (seen === 'true') {
    setHasSeenVideo(true);
    setShowVideoSplash(false);
  }

  // Add this line:
  liveUpdateService.initialize();
}, []);
```

---

### Step 6: Build and Sync

```bash
npm run build
npx cap sync
```

---

### Step 7: Install Capawesome CLI

```bash
npm install -g @capawesome/cli
```

---

### Step 8: Login to Capawesome CLI

```bash
npx @capawesome/cli login
```

This will open your browser for authentication.

---

## How to Deploy OTA Updates

### First Time Upload

After building your app:

```bash
npm run build
npx @capawesome/cli bundle upload \
  --app-id YOUR_APP_ID \
  --path ./dist \
  --channel production
```

---

### Every Future Update

1. Make your code changes
2. Build:
   ```bash
   npm run build
   ```
3. Upload:
   ```bash
   npx @capawesome/cli bundle upload \
     --app-id YOUR_APP_ID \
     --path ./dist \
     --channel production
   ```

Your users will automatically get the update next time they open the app!

---

## Using Multiple Channels (Optional)

### Development Channel
```bash
npx @capawesome/cli bundle upload \
  --app-id YOUR_APP_ID \
  --path ./dist \
  --channel development
```

### Staging Channel
```bash
npx @capawesome/cli bundle upload \
  --app-id YOUR_APP_ID \
  --path ./dist \
  --channel staging
```

### Production Channel
```bash
npx @capawesome/cli bundle upload \
  --app-id YOUR_APP_ID \
  --path ./dist \
  --channel production
```

To configure which channel your app uses, update `capacitor.config.ts`:

```typescript
CapawesomeLiveUpdate: {
  appId: 'YOUR_APP_ID',
  enabled: true,
  autoUpdate: true,
  resetOnUpdate: false,
  channel: 'production' // or 'development' or 'staging'
}
```

---

## Useful CLI Commands

| Command | Description |
|---------|-------------|
| `npx @capawesome/cli login` | Login to Capawesome Cloud |
| `npx @capawesome/cli bundle upload` | Upload a new bundle |
| `npx @capawesome/cli bundle list --app-id YOUR_APP_ID` | List all bundles |
| `npx @capawesome/cli app list` | List all your apps |
| `npx @capawesome/cli --help` | Show all available commands |

---

## Testing OTA Updates

1. **Deploy your app** to your device (via Android Studio or Xcode)
2. **Make a change** to your code (change some text, colors, etc.)
3. **Build:** `npm run build`
4. **Upload:** `npx @capawesome/cli bundle upload --app-id YOUR_APP_ID --path ./dist --channel production`
5. **Close your app** completely on the device
6. **Reopen the app** - It will download and apply the update automatically!

---

## What Can Be Updated via OTA

### ✅ Can Update (No App Store Review Needed)
- JavaScript/TypeScript code changes
- HTML/CSS changes
- Images and assets
- Any web-based functionality
- Bug fixes
- Feature updates
- UI changes

### ❌ Cannot Update (Requires App Store Submission)
- Native code changes (Android/iOS)
- Capacitor plugin additions/removals
- capacitor.config.ts changes
- AndroidManifest.xml or Info.plist changes
- New native permissions

---

## Your Payment System

**IMPORTANT:** Your existing payment system using `cordova-plugin-purchase` is completely separate and will continue to work exactly as before:

- ✅ Apple In-App Purchases (iOS)
- ✅ Google Play Billing (Android)
- ✅ Stripe (Web/PWA)

Capawesome OTA Updates do not affect or interfere with your payments.

---

## File Structure Created

```
project/
├── capacitor.config.ts              # Updated with Capawesome config
├── src/
│   └── lib/
│       └── capawesome-live-update.ts   # Live update service
└── CAPAWESOME_SETUP_GUIDE.md        # This file
```

---

## Troubleshooting

### Issue: "Plugin not installed" error
**Solution:** Make sure you ran `npm install @capawesome-team/capacitor-live-update` and `npx cap sync`

### Issue: Build fails with "cannot resolve @capawesome-team/capacitor-live-update"
**Solution:**
1. Check that your npm registry is configured correctly
2. Verify your license key is valid
3. Run `npm install @capawesome-team/capacitor-live-update` again

### Issue: Updates not showing up
**Solution:**
1. Make sure you uploaded the bundle to the correct channel
2. Verify your app is configured to use that channel
3. Close and reopen the app (updates check on app start)
4. Check the console logs for any errors

### Issue: "Unauthorized" when using CLI
**Solution:** Run `npx @capawesome/cli login` again

---

## Quick Reference

**Your App Details:**
- **App Name:** PIT-BOX
- **Bundle ID:** com.pitbox.app
- **Capawesome Console:** https://console.cloud.capawesome.io/
- **License Portal:** https://polar.sh/capawesome-team/portal

**Quick Update Workflow:**
```bash
# 1. Make your changes
# 2. Build
npm run build

# 3. Upload
npx @capawesome/cli bundle upload \
  --app-id YOUR_APP_ID \
  --path ./dist \
  --channel production

# 4. Done! Users get the update automatically
```

---

## Support & Documentation

- **Capawesome Documentation:** https://capawesome.io/cloud/live-updates/setup/
- **CLI Documentation:** https://capawesome.io/cloud/cli/
- **API Documentation:** https://api.cloud.capawesome.io/docs
- **Community Support:** https://github.com/capawesome-team/capacitor-plugins

---

## Summary

You're all set up! Just complete Steps 1-8 above, and you'll be able to push instant updates to your users without waiting for App Store approval. Your existing payment system remains unchanged and fully functional.
