# Quick Android Certificate Setup

You need to create your Android signing certificate on your **local computer** (not in this cloud environment), then upload it to Capawesome Cloud.

## Option 1: Use Capawesome Cloud Web Console (Easiest)

### Step 1: Generate Keystore on Your Computer

On your local computer, open Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```bash
# Navigate to a safe directory
cd ~/Documents

# Create keystore
keytool -genkey -v -keystore pitbox-release.keystore \
  -alias pitbox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

**Fill in the prompts:**
- **Keystore password**: [Create a strong password - SAVE THIS!]
- **First and last name**: Your Name or Company
- **Organizational unit**: PitBox or Development
- **Organization**: Your Company Name
- **City**: Your City
- **State**: Your State
- **Country code**: US (or your country)
- **Key password**: [Press ENTER to use same as keystore password]

**⚠️ CRITICAL:** Write down these details immediately:
```
Keystore File: pitbox-release.keystore
Keystore Password: _______________________
Key Alias: pitbox
Key Password: _________________________ (same as keystore)
```

### Step 2: Upload to Capawesome Cloud

1. Go to **https://cloud.capawesome.io/**
2. Log in to your account
3. Select your app: **PitBox** (ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8)
4. Navigate to **Settings** → **Certificates** (or **Android Signing**)
5. Click **Upload Certificate** or **Add Certificate**
6. Upload your keystore file and enter:
   - **Certificate Name**: `pitbox-production`
   - **Keystore File**: Select `pitbox-release.keystore`
   - **Keystore Password**: [Your password]
   - **Key Alias**: `pitbox`
   - **Key Password**: [Your password]
7. Click **Save** or **Upload**

### Step 3: Build with Certificate

Back here in the cloud environment, run:

```bash
# Create a release build using your certificate
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --type release \
  --certificate pitbox-production \
  --aab ./pitbox-release.aab \
  --apk ./pitbox-release.apk
```

## Option 2: Let Capawesome Generate It (Alternative)

If you don't want to deal with keytool, Capawesome Cloud can generate a certificate for you:

1. Go to **https://cloud.capawesome.io/**
2. Navigate to your app → **Settings** → **Certificates**
3. Click **Generate New Certificate**
4. Fill in:
   - **Certificate Name**: `pitbox-production`
   - **Common Name**: Your Name or Company
   - **Organization**: PitBox
   - **Country**: US (or your country)
5. Click **Generate**
6. **Download and SAVE** the generated keystore file securely
7. **Save the passwords** shown on screen (you can't recover them!)

## Option 3: Check if You Already Have One

If you've built Android apps before, you might already have a keystore:

**Common locations:**
- Windows: `C:\Users\YourName\.android\debug.keystore` (debug only)
- Mac: `~/.android/debug.keystore` (debug only)
- Previous project folders

**⚠️ WARNING:** Don't use debug keystores for production!

## What Happens Next?

Once your certificate is uploaded to Capawesome:

1. ✅ All release builds will be automatically signed
2. ✅ You can upload to Google Play Store
3. ✅ You can distribute your app to users
4. ✅ You can publish updates

## Important Security Notes

**NEVER LOSE YOUR KEYSTORE!**

If you lose your keystore file or password:
- ❌ You CANNOT update your app on Google Play
- ❌ You CANNOT fix bugs in production
- ❌ You must create a new app with a new package name
- ❌ You lose all users, reviews, and downloads

**Create Multiple Backups:**
1. Save to password manager (1Password, LastPass, Bitwarden)
2. Save to encrypted cloud storage (Google Drive, Dropbox)
3. Save to external USB drive
4. Email yourself an encrypted copy

## Quick Commands Reference

```bash
# Check if Java/keytool is installed
java -version
keytool -help

# Generate keystore (if not already done)
keytool -genkey -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000 -storetype JKS

# Verify keystore
keytool -list -v -keystore pitbox-release.keystore

# Build release APK/AAB with Capawesome
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --type release \
  --certificate pitbox-production \
  --aab ./release.aab \
  --apk ./release.apk

# Check build status
npx @capawesome/cli apps:builds:logs \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8
```

## Need Help?

- **Capawesome Docs**: https://capawesome.io/docs/
- **Capawesome Support**: support@capawesome.io
- **Android Signing Guide**: https://developer.android.com/studio/publish/app-signing

---

**Next Steps:** After uploading your certificate, come back here and I'll help you create your first production build!
