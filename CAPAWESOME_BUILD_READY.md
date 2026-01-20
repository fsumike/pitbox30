# PitBox - Ready for App Store Upload

## What Was Fixed

### 1. Build Number Incremented
- **Old:** Build 97
- **New:** Build 98 ✅
- **Note:** Increment this for EVERY new upload

### 2. All Privacy Descriptions Added
All required iOS privacy descriptions are now in `capawesome.config.json`:
- Camera, Photo Library, Microphone ✅
- Location (Always, When In Use) ✅
- Bluetooth, Motion, Face ID ✅
- Contacts, Calendar, Reminders ✅
- Health, NFC, Siri, HomeKit ✅
- Encryption declaration ✅

### 3. Configuration Validated
- Bundle ID: `com.pitbox.app` ✅
- Version: `3.0.0` ✅
- Store destinations configured ✅

---

## How to Build and Upload

### Step 1: Run Pre-Build Check (Optional)
```bash
npm run pre-build-check
```

### Step 2: Build iOS Project
```bash
npm run build:ci:ios
```
This creates the iOS folder with all configurations.

### Step 3: Trigger Capawesome Build
```bash
npm run capawesome:build:ios
```

### Step 4: Monitor Build
Go to: https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/builds

---

## Important Notes

### Before Each Upload:
1. **Increment build number** in `capawesome.config.json`
   ```json
   "buildNumber": "99"  // Change this!
   ```

2. **Check store destination** is set correctly
   - ID: `5cea5914-4a94-4f14-82f8-15b65c9275b7`
   - Make sure it uses **App Store Connect API** (not Apple ID)

### Store Destination Settings
If you need to recreate the destination:
- Type: **App Store Connect API** (NOT "Apple ID")
- Issuer ID: From App Store Connect > Keys
- Key ID: From your generated API key
- Private Key: Contents of your .p8 file
- Bundle ID: `com.pitbox.app`

---

## Troubleshooting

### "Build number was not incremented"
Edit `capawesome.config.json` line 13:
```json
"buildNumber": "99"  // Increment this number
```

### "Missing Privacy Descriptions"
Already fixed! All descriptions are in `capawesome.config.json`.

### "Incorrect build settings"
Usually means the store destination is wrong. Delete and recreate using **App Store Connect API** method.

### Build not showing in App Store Connect
- Check Capawesome build logs for errors
- Verify store destination ID matches: `5cea5914-4a94-4f14-82f8-15b65c9275b7`
- Make sure destination uses API key (not Apple ID/password)
- Allow 10-15 minutes for processing

---

## Quick Commands

```bash
# Check configuration
npm run pre-build-check

# Build iOS
npm run build:ci:ios

# Upload to App Store
npm run capawesome:build:ios

# Check Capawesome login
npm run capawesome:whoami
```

---

## Current Configuration Summary

| Setting | Value |
|---------|-------|
| App Name | PitBox |
| Bundle ID | com.pitbox.app |
| Version | 3.0.0 |
| Build Number | 98 |
| Capawesome App ID | 8251f381-4aed-4b20-ac20-a3aad250cbb8 |
| Store Destination | 5cea5914-4a94-4f14-82f8-15b65c9275b7 |
| TestFlight | Enabled ✅ |
| App Store | Enabled ✅ |

---

## Next Build Checklist

- [ ] Increment build number in `capawesome.config.json`
- [ ] Run `npm run build:ci:ios`
- [ ] Run `npm run capawesome:build:ios`
- [ ] Monitor build at Capawesome dashboard
- [ ] Wait for build to appear in App Store Connect (10-15 min)
- [ ] Submit for review in App Store Connect

**Everything is configured correctly. You're ready to build!**
