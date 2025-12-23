# Capawesome Cloud iOS Certificates Setup Guide

This guide will help you create and upload iOS signing certificates to Capawesome Cloud for building your PitBox app.

## Prerequisites

- ✅ Apple Developer Account ($99/year)
- ✅ Access to a Mac computer (only for initial certificate generation)
- ✅ Capawesome Cloud account logged in
- ✅ App ID: com.pitbox.app

## Step 1: Create App ID in Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** button
4. Select **App IDs** → **Continue**
5. Select **App** → **Continue**
6. Fill in the details:
   - **Description**: PitBox
   - **Bundle ID**: Explicit → `com.pitbox.app`
7. Enable capabilities:
   - ✅ Push Notifications
   - ✅ In-App Purchase
   - ✅ Associated Domains (for deep linking)
8. Click **Continue** → **Register**

## Step 2: Generate iOS Distribution Certificate

### On Mac (One-Time Setup):

1. Open **Keychain Access** application
2. Go to **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
3. Fill in the form:
   - **User Email**: Your Apple ID email
   - **Common Name**: Your name or company name
   - **CA Email**: Leave blank
   - **Request**: Saved to disk
   - **Let me specify key pair information**: Check this
4. Click **Continue**
5. Save the file as `CertificateSigningRequest.certSigningRequest`
6. Click **Done**

### In Apple Developer Portal:

1. Navigate to **Certificates, Identifiers & Profiles** → **Certificates**
2. Click **+** button
3. Select **Apple Distribution** (for App Store)
4. Click **Continue**
5. Upload the `.certSigningRequest` file you created
6. Click **Continue**
7. Download the certificate (`.cer` file)
8. Double-click the `.cer` file to install it in Keychain Access

### Export Certificate as .p12:

1. In **Keychain Access**, find your "Apple Distribution" certificate
2. Expand it to see the private key
3. Right-click the **certificate** (not the private key) → **Export**
4. Save as: `ios-distribution.p12`
5. **Set a strong password** - You'll need this for Capawesome Cloud!
6. Save the password securely (e.g., in a password manager)

## Step 3: Create Provisioning Profile

### In Apple Developer Portal:

1. Navigate to **Profiles** → **+** button
2. Select **App Store** → **Continue**
3. Select your App ID: `com.pitbox.app` → **Continue**
4. Select your **Apple Distribution** certificate → **Continue**
5. Profile Name: `PitBox App Store Profile`
6. Click **Generate**
7. Download the `.mobileprovision` file

## Step 4: Upload to Capawesome Cloud

### Via Capawesome Cloud Console:

1. Log into [Capawesome Cloud](https://cloud.capawesome.io/)
2. Go to your app (PitBox - ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8)
3. Navigate to **Settings** → **iOS Signing**
4. Click **Upload Certificate**
5. Upload files:
   - **Certificate**: `ios-distribution.p12`
   - **Password**: Enter the password you set when exporting
   - **Provisioning Profile**: `PitBox App Store Profile.mobileprovision`
6. Click **Save**

### Via Capawesome CLI:

```bash
# Login first
npx @capawesome/cli login

# Upload iOS certificate
npx @capawesome/cli apps:certificates:upload \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --certificate ios-distribution.p12 \
  --password "YOUR_P12_PASSWORD" \
  --provisioning-profile "PitBox App Store Profile.mobileprovision"
```

## Step 5: Configure App Store Connect

### Create App in App Store Connect:

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+** → **New App**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: PitBox
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.pitbox.app
   - **SKU**: com.pitbox.app.2024
   - **User Access**: Full Access
4. Click **Create**

### Setup In-App Purchases:

1. In your app, go to **Monetization** → **In-App Purchases**
2. Click **+** → **Auto-Renewable Subscription**
3. Create subscription group: "PitBox Premium"
4. Add your subscription tiers:
   - **Monthly**: com.pitbox.app.premium.monthly ($9.99/month)
   - **Yearly**: com.pitbox.app.premium.yearly ($79.99/year)
5. Set up subscription details, pricing, and localizations

## Step 6: Test Build via Capawesome Cloud

### Trigger Build:

```bash
# Build for iOS
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --download-ipa

# Or via web console:
# 1. Go to Capawesome Cloud dashboard
# 2. Navigate to Builds → Create Build
# 3. Select iOS platform
# 4. Click "Build Now"
```

### Monitor Build:

1. Watch build progress in Capawesome Cloud console
2. Build typically takes 5-10 minutes
3. Download IPA when complete
4. Check for any errors in build logs

## Step 7: Deploy to TestFlight

### Automatic Deployment (Recommended):

Once your build succeeds, Capawesome Cloud can automatically upload to TestFlight:

1. In Capawesome Cloud dashboard
2. Go to **Deployments** → **iOS** → **TestFlight**
3. Click **Connect to App Store Connect**
4. Generate an **App Store Connect API Key**:
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Navigate to **Users and Access** → **Keys** (under Integrations)
   - Click **+** to create new key
   - Name: "Capawesome Cloud"
   - Access: **Admin** or **App Manager**
   - Download the `.p8` key file (only shown once!)
   - Note the **Key ID** and **Issuer ID**
5. Upload the API key to Capawesome Cloud
6. Enable **Auto-deploy to TestFlight**
7. Future builds will automatically upload!

### Manual Upload (Alternative):

If you prefer manual control:

1. Download the IPA from Capawesome Cloud
2. Open **Transporter** app on Mac
3. Drag and drop the IPA file
4. Click **Deliver**
5. Wait for processing (can take 10-60 minutes)

## Important Files to Keep Secure

Store these files safely (password manager, encrypted drive, etc.):

- ✅ `CertificateSigningRequest.certSigningRequest` - Keep for future certificates
- ✅ `ios-distribution.p12` - Your signing certificate
- ✅ Password for .p12 file - Required for builds
- ✅ `PitBox App Store Profile.mobileprovision` - Provisioning profile
- ✅ App Store Connect API Key (`.p8` file) - For automated deployments

**NEVER commit these files to Git!**

## Troubleshooting

### "Certificate not found" error:

- Ensure you exported both certificate AND private key as .p12
- Verify the password is correct
- Check that the certificate hasn't expired

### "Provisioning profile doesn't match" error:

- Ensure the provisioning profile includes your certificate
- Verify the App ID matches exactly: com.pitbox.app
- Regenerate the provisioning profile if needed

### "Code signing failed" error:

- Check that all capabilities in Xcode match the App ID capabilities
- Ensure the provisioning profile is valid and not expired
- Try regenerating the provisioning profile

### Build takes too long:

- First build can take 10-15 minutes
- Subsequent builds are faster (5-7 minutes)
- Check build logs for stuck processes

## Certificate Renewal

iOS certificates expire after 1 year. When renewing:

1. Generate a new Certificate Signing Request
2. Create a new Apple Distribution certificate
3. Export as new .p12 file
4. Update provisioning profiles with new certificate
5. Upload new files to Capawesome Cloud
6. Old builds will continue to work until app expiry

## Cost Summary

- **Apple Developer Account**: $99/year (required)
- **Capawesome Cloud**: Starting at $9/month for 200 build minutes
- **No Mac required** after initial certificate generation

## Next Steps

Once certificates are uploaded:

1. ✅ Trigger a test build via Capawesome Cloud
2. ✅ Verify build completes successfully
3. ✅ Deploy to TestFlight
4. ✅ Add beta testers
5. ✅ Gather feedback
6. ✅ Submit for App Store review

## Useful Commands

```bash
# Login to Capawesome CLI
npx @capawesome/cli login

# Check current user
npx @capawesome/cli whoami

# List all apps
npx @capawesome/cli apps:list

# Create iOS build
npx @capawesome/cli apps:builds:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios

# Download latest build
npx @capawesome/cli apps:builds:download --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios

# Deploy to TestFlight
npx @capawesome/cli apps:deployments:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios --destination testflight
```

## Resources

- [Apple Developer Portal](https://developer.apple.com/account/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Capawesome Cloud Dashboard](https://cloud.capawesome.io/)
- [Capawesome Documentation](https://capawesome.io/docs/)
- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
