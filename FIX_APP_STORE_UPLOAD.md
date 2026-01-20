# Fix App Store Connect Upload Issue

Your local configuration looks correct. The issue is in your **Capawesome Console destination settings**.

## The Problem

Your `capawesome.config.json` references destination ID: `5cea5914-4a94-4f14-82f8-15b65c9275b7`

This destination needs these credentials configured in Capawesome Console:
- Apple ID
- App-Specific Password nbgm-kyzf-dnqn-pxhx
- Team ID
- Apple App ID

## Step 1: Generate App-Specific Password

1. Go to https://appleid.apple.com/
2. Sign in with your Apple ID (mg91648@yahoo.com)
3. Click **Sign-In and Security**
4. Click **App-Specific Passwords**
5. Click the **+** button to generate a new password
6. Name it "Capawesome" or "PitBox Deployment"
7. Copy the generated password (format: xxxx-xxxx-xxxx-xxxx)

**IMPORTANT**: Save this password somewhere safe - you can only see it once!

## Step 2: Configure Capawesome Console Destination

1. Go to https://console.cloud.capawesome.io/
2. Log in with your Capawesome account
3. Navigate to **Apps** > **PitBox** > **Destinations**
4. Find or create your iOS App Store destination
5. Fill in ALL fields:

| Field | Value |
|-------|-------|
| Name | App Store Connect |
| Type | Apple App Store |
| Apple ID | mg91648@yahoo.com |
| App-Specific Password | (paste password from Step 1) |
| Team ID | (see Step 3 below) |
| Apple App ID | 6757286830 |

## Step 3: Find Your Team ID

1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
3. Click **Membership Details** in the left sidebar
4. Copy the **Team ID** (10-character alphanumeric code)

## Step 4: Verify Destination ID Matches

After saving your destination in Capawesome Console, ensure the destination ID matches your config:

Your `capawesome.config.json` shows:
```json
"destinationId": "5cea5914-4a94-4f14-82f8-15b65c9275b7"
```

If you created a new destination, update this ID in `capawesome.config.json`.

## Step 5: Test the Upload

Run these commands to test:

```bash
# Increment build number first
npm run increment-build

# Create iOS build for App Store
npx @capawesome/cli apps:builds:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios --type app-store

# After build completes, deploy to your destination
npx @capawesome/cli apps:deployments:create --build-id [BUILD_ID] --destination 5cea5914-4a94-4f14-82f8-15b65c9275b7
```

## Common Issues & Fixes

### "Authentication failed"
- App-Specific Password is wrong or expired
- Generate a new App-Specific Password

### "Team ID invalid"
- Copy Team ID exactly from Apple Developer portal
- Make sure no extra spaces

### "App not found"
- Apple App ID is wrong
- Find correct ID in App Store Connect > App Information

### "Build number already exists"
- Run `npm run increment-build` before each submission
- Current build number: 104
- Next build will be: 105

### "Invalid provisioning profile"
- Certificate type must be "Distribution" (not Development)
- Profile type must be "App Store" (not Ad Hoc)

## Your Current Configuration

```
App ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8
Bundle ID: com.pitbox.app
Version: 3.0.0
Build Number: 104
Destination ID: 5cea5914-4a94-4f14-82f8-15b65c9275b7
```

## Quick Checklist

- [ ] Generated App-Specific Password from appleid.apple.com
- [ ] Copied Team ID from developer.apple.com
- [ ] Updated Capawesome Console destination with all credentials
- [ ] Verified destination ID matches capawesome.config.json
- [ ] Incremented build number before submission
- [ ] Used Distribution certificate (not Development)
- [ ] Used App Store provisioning profile

## Need More Help?

If uploads still fail after completing these steps, check:

1. Capawesome build logs in the Console for specific error messages
2. Email from Apple - they send notifications about processing errors
3. App Store Connect > TestFlight to see if builds are processing

The build may appear in TestFlight up to 30 minutes after a successful upload.
