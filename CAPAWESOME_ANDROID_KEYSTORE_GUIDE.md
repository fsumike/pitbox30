# Capawesome Cloud Android Keystore Setup Guide

This guide will help you create and upload an Android keystore to Capawesome Cloud for building your PitBox app.

## Prerequisites

- ✅ Google Play Developer Account ($25 one-time fee)
- ✅ Java JDK installed (for keytool command)
- ✅ Capawesome Cloud account logged in
- ✅ Package Name: com.pitbox.app

## Step 1: Create Android Keystore

### Using Command Line (Recommended):

On any computer (Windows, Mac, Linux) with Java JDK installed:

```bash
# Navigate to a secure directory
cd ~/Documents/PitBox-Keys

# Generate keystore
keytool -genkey -v -keystore pitbox-release.keystore \
  -alias pitbox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

### Fill in the prompts:

```
Enter keystore password: [Create a strong password]
Re-enter new password: [Same password]
What is your first and last name?
  [Your Name or Company Name]
What is the name of your organizational unit?
  [Your Team/Department or "Development"]
What is the name of your organization?
  [Your Company Name or "PitBox"]
What is the name of your City or Locality?
  [Your City]
What is the name of your State or Province?
  [Your State/Province]
What is the two-letter country code for this unit?
  [US, CA, etc.]
Is CN=..., OU=..., O=..., L=..., ST=..., C=... correct?
  [yes]

Generating 2,048 bit RSA key pair...
[wait for generation]

Enter key password for <pitbox>
  [Press ENTER to use same password as keystore]
```

### Verify Keystore Created:

```bash
# List keystore details
keytool -list -v -keystore pitbox-release.keystore -alias pitbox

# You should see:
# - Alias name: pitbox
# - Creation date
# - Entry type: PrivateKeyEntry
# - Certificate fingerprints (SHA1, SHA256)
```

### Save These Details (CRITICAL!):

Create a file called `ANDROID_KEYSTORE_INFO.txt` and save:

```
Keystore Filename: pitbox-release.keystore
Keystore Password: [YOUR_KEYSTORE_PASSWORD]
Key Alias: pitbox
Key Password: [YOUR_KEY_PASSWORD - usually same as keystore password]
```

**⚠️ CRITICAL: If you lose these, you can NEVER update your app on Google Play!**

## Step 2: Get SHA-1 and SHA-256 Fingerprints

These are needed for Google services (Firebase, Google Sign-In, etc.):

```bash
keytool -list -v -keystore pitbox-release.keystore -alias pitbox
```

Copy the fingerprints:
- **SHA1**: `12:34:56:78:90:AB:CD:EF:...`
- **SHA-256**: `AB:CD:EF:12:34:56:78:90:...`

You'll need these for:
- Google Play App Signing
- Firebase configuration
- Google Sign-In setup
- In-App Purchase verification

## Step 3: Upload to Capawesome Cloud

### Via Capawesome Cloud Console:

1. Log into [Capawesome Cloud](https://cloud.capawesome.io/)
2. Go to your app (PitBox - ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8)
3. Navigate to **Settings** → **Android Signing**
4. Click **Upload Keystore**
5. Upload and fill in:
   - **Keystore File**: `pitbox-release.keystore`
   - **Keystore Password**: [Your keystore password]
   - **Key Alias**: `pitbox`
   - **Key Password**: [Your key password]
6. Click **Save**

### Via Capawesome CLI:

```bash
# Login first
npx @capawesome/cli login

# Upload Android keystore
npx @capawesome/cli apps:keystores:upload \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --keystore pitbox-release.keystore \
  --keystore-password "YOUR_KEYSTORE_PASSWORD" \
  --key-alias pitbox \
  --key-password "YOUR_KEY_PASSWORD"
```

## Step 4: Configure Google Play Console

### Create App in Google Play Console:

1. Go to [Google Play Console](https://play.google.com/console/)
2. Click **Create app**
3. Fill in details:
   - **App name**: PitBox
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (with in-app purchases)
4. Accept declarations and click **Create app**

### Setup App Signing:

Google Play now requires app bundle format (AAB) and manages signing:

1. In Google Play Console, go to **Release** → **Setup** → **App Integrity**
2. Select **Let Google manage and protect your app signing key** (Recommended)
3. Upload your keystore:
   - Click **Upload**
   - Select `pitbox-release.keystore`
   - Enter keystore password and key alias
4. Google will create a new upload key certificate
5. Download the **upload certificate** - You'll use this for future updates

**Important**: After this, Google manages the production signing. You use the upload key for all future builds.

### Configure In-App Products:

1. Go to **Monetize** → **Products** → **In-app products**
2. Create subscription products:
   - **Product ID**: `com.pitbox.app.premium.monthly`
   - **Name**: PitBox Premium - Monthly
   - **Description**: "Full access to all PitBox premium features"
   - **Price**: $9.99
   - **Billing period**: 1 month
3. Create yearly subscription:
   - **Product ID**: `com.pitbox.app.premium.yearly`
   - **Name**: PitBox Premium - Yearly
   - **Description**: "Full access to all PitBox premium features. Save 30%!"
   - **Price**: $79.99
   - **Billing period**: 1 year

## Step 5: Build APK and AAB via Capawesome Cloud

### Trigger Build:

```bash
# Build for Android
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --download-apk \
  --download-aab

# Or via web console:
# 1. Go to Capawesome Cloud dashboard
# 2. Navigate to Builds → Create Build
# 3. Select Android platform
# 4. Click "Build Now"
```

### Build Outputs:

Capawesome Cloud will generate both:
- **APK** (`app-release.apk`) - For testing on devices
- **AAB** (`app-release.aab`) - For uploading to Google Play

### Monitor Build:

1. Watch build progress in Capawesome Cloud console
2. Build typically takes 3-7 minutes
3. Download both APK and AAB when complete
4. Check build logs for any errors

## Step 6: Test the APK

Before uploading to Google Play, test the signed APK:

### Install on Physical Device:

```bash
# Enable USB Debugging on your Android device
# Connect device via USB

# Install APK
adb install app-release.apk

# Or simply transfer APK to device and install manually
```

### Test Checklist:

- [ ] App launches successfully
- [ ] All permissions work (camera, location, notifications)
- [ ] In-app purchases can be tested (use test account)
- [ ] Push notifications receive properly
- [ ] No crashes or errors in critical flows

## Step 7: Upload to Google Play Console

### Internal Testing Track (First):

1. Go to **Release** → **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload the **AAB file** (not APK!)
4. Add release notes:
   ```
   Initial release of PitBox mobile app
   - Racing setup tracking
   - Swap Meet marketplace
   - Community features
   - Premium subscriptions
   ```
5. Click **Review release** → **Start rollout to Internal testing**

### Add Internal Testers:

1. Create an internal testing email list
2. Add testers' email addresses
3. Copy the opt-in URL and share with testers
4. Testers will receive access within minutes

### Promote to Production:

Once internal testing is successful:

1. Go to **Release** → **Production**
2. Click **Create new release**
3. Select **Promote from internal testing** or upload new AAB
4. Complete all store listing requirements
5. Submit for review (typically 1-3 days)

## Step 8: Configure Capawesome Auto-Deploy

For automatic deployment to Google Play:

### Create Service Account:

1. In Google Play Console, go to **Setup** → **API access**
2. Link to Google Cloud Project (or create new)
3. Click **Create new service account**
4. In Google Cloud Console:
   - Service account name: "Capawesome Cloud"
   - Click **Create and Continue**
   - Grant role: **Editor**
   - Click **Done**
5. Click on the service account
6. Go to **Keys** → **Add Key** → **Create new key**
7. Select **JSON** format
8. Download the JSON key file

### Upload to Capawesome Cloud:

1. In Capawesome Cloud dashboard
2. Go to **Deployments** → **Android** → **Google Play**
3. Click **Connect to Google Play Console**
4. Upload the service account JSON file
5. Enable **Auto-deploy to Internal Testing**
6. Future builds will automatically upload!

## Important Files to Keep Secure

Store these files safely and NEVER lose them:

- ✅ `pitbox-release.keystore` - Your signing keystore (MOST CRITICAL!)
- ✅ `ANDROID_KEYSTORE_INFO.txt` - Passwords and alias
- ✅ Google Play service account JSON - For automated deployments
- ✅ SHA-1 and SHA-256 fingerprints - For Google services

**⚠️ CRITICAL WARNING:**
If you lose your keystore file or passwords, you will NEVER be able to update your app on Google Play. You would have to create a completely new app with a new package name and lose all your users, reviews, and downloads!

Create multiple encrypted backups in different locations:
- Password manager (1Password, LastPass, Bitwarden)
- Encrypted USB drive
- Secure cloud storage (encrypted)
- Physical safe deposit box

## Keystore Security Best Practices

1. **Never commit keystore to Git**
   - Add to `.gitignore`:
     ```
     *.keystore
     *.jks
     ANDROID_KEYSTORE_INFO.txt
     google-play-service-account.json
     ```

2. **Use strong passwords**
   - Minimum 20 characters
   - Mix of letters, numbers, symbols
   - Don't reuse passwords

3. **Limit access**
   - Only share with trusted team members
   - Use password managers for secure sharing
   - Revoke access when team members leave

4. **Regular backups**
   - Backup keystore weekly
   - Verify backups can be opened
   - Test restore process

## Troubleshooting

### "Keystore was tampered with" error:

- Check that the password is correct
- Ensure the keystore file wasn't corrupted during transfer
- Verify file permissions allow reading

### "Cannot recover key" error:

- Verify the key alias is correct (case-sensitive!)
- Check that the key password is correct
- List keystore contents to verify alias exists

### "Wrong version of key store" error:

- Ensure you're using JKS format (not PKCS12)
- Regenerate keystore with `-storetype JKS` flag

### Build signing fails on Capawesome:

- Double-check all passwords in Capawesome dashboard
- Ensure keystore file uploaded completely
- Verify keystore isn't expired (check validity)

### Google Play rejects AAB:

- Ensure AAB is signed with correct keystore
- Check that package name matches exactly: com.pitbox.app
- Verify version code increments with each upload

## Version Management

When releasing updates:

1. **Increment version code** in `build.gradle`:
   ```gradle
   versionCode 2  // Increment by 1 each release
   versionName "3.0.1"  // Follow semantic versioning
   ```

2. **Build new AAB** via Capawesome Cloud

3. **Upload to appropriate track**:
   - Internal testing → Alpha → Beta → Production

## Cost Summary

- **Google Play Developer Account**: $25 (one-time)
- **Capawesome Cloud**: Starting at $9/month for 200 build minutes
- **Java JDK**: Free
- **No Windows/Mac/Linux preference** - Works on any OS

## Next Steps

Once keystore is uploaded:

1. ✅ Trigger a test build via Capawesome Cloud
2. ✅ Verify both APK and AAB are generated
3. ✅ Test APK on physical device
4. ✅ Upload AAB to Internal Testing
5. ✅ Add internal testers
6. ✅ Gather feedback
7. ✅ Promote to Production
8. ✅ Submit for Google Play review

## Useful Commands

```bash
# Generate keystore
keytool -genkey -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000

# List keystore contents
keytool -list -v -keystore pitbox-release.keystore

# Get SHA fingerprints
keytool -list -v -keystore pitbox-release.keystore -alias pitbox

# Verify APK signature
jarsigner -verify -verbose -certs app-release.apk

# Create Android build via CLI
npx @capawesome/cli apps:builds:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform android

# Download latest build
npx @capawesome/cli apps:builds:download --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform android

# Deploy to Google Play
npx @capawesome/cli apps:deployments:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform android --destination google-play --track internal
```

## Resources

- [Google Play Console](https://play.google.com/console/)
- [Capawesome Cloud Dashboard](https://cloud.capawesome.io/)
- [Capawesome Documentation](https://capawesome.io/docs/)
- [Android App Signing Guide](https://developer.android.com/studio/publish/app-signing)
- [Google Play App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)
- [Keytool Documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html)
