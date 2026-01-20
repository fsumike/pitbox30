# Capawesome Cloud Upload to App Store Connect (NO MAC NEEDED)

## You're right - Capawesome Cloud does this FOR YOU

### Option 1: Capawesome Auto-Upload (EASIEST)

If you configured your App Store Connect API key in Capawesome Cloud, it uploads automatically.

**Check if it's already uploaded:**
1. Go to https://appstoreconnect.apple.com
2. Sign in
3. Click "My Apps"
4. Click your app
5. Look under "TestFlight" or your version
6. If you see a build with today's date - IT'S ALREADY THERE

**If not there, configure auto-upload:**
1. Go to https://cloud.capawesome.io
2. Click your app
3. Go to "Settings" → "iOS"
4. Add your App Store Connect API Key:
   - Key ID
   - Issuer ID
   - .p8 file
5. Next build will auto-upload

---

### Option 2: Capawesome Manual Upload (NO MAC STILL)

Capawesome has a CLI command to upload from Windows:

```bash
npm run build
```

Then:

```bash
npx @capawesome/cli apps:builds:upload --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios --build-id [BUILD_ID]
```

Get your BUILD_ID from https://cloud.capawesome.io (it's in the build details)

---

### Option 3: If You Already Have the .ipa File

If Capawesome already built it and you downloaded the .ipa:

```bash
npx @capawesome/cli apps:builds:upload-to-store --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios --file path/to/your/file.ipa
```

---

## What You Actually Need (from Apple)

You need an **App Store Connect API Key** to let Capawesome upload for you.

### Get the API Key:

1. Go to https://appstoreconnect.apple.com
2. Click "Users and Access"
3. Click "Keys" tab (under "Integrations")
4. Click the "+" to create a new key
5. Name it "Capawesome"
6. Give it "Admin" or "App Manager" access
7. Click "Generate"
8. Download the .p8 file (SAVE IT - you can't download again)
9. Copy the Key ID and Issuer ID

### Add to Capawesome:

1. Go to https://cloud.capawesome.io
2. Click your app (PitBox)
3. Settings → iOS
4. Paste Key ID, Issuer ID
5. Upload the .p8 file

### Now Run:

```bash
npm run capawesome:build:ios
```

Capawesome will build AND upload to App Store Connect automatically.

---

## Still Not Working?

Run this to see what's going on:

```bash
npx @capawesome/cli apps:builds:list --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8
```

This shows all your builds and their status.

---

## Bottom Line

**You DO NOT need a Mac.** Capawesome handles everything IF you give it your App Store Connect API key.

If you already have a build, use the upload command. If not, configure the API key and Capawesome does it automatically.
