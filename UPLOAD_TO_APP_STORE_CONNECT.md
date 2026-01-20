# Upload iOS Build to App Store Connect

## Step 1: Trigger the Build
Once your iOS credentials are configured in Capawesome Cloud Console, run:

```bash
npm run capawesome:build:ios
```

Or directly:

```bash
npx @capawesome/cli apps:builds:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios
```

**This will automatically:**
1. Build your iOS app in the cloud
2. Sign it with your Apple credentials
3. **Upload it directly to App Store Connect**

## Step 2: Monitor the Build
The command will output a build ID. You can check logs with:

```bash
npx @capawesome/cli apps:builds:logs --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --build-id <BUILD_ID>
```

## Step 3: Verify in App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Navigate to **My Apps** → **PitBox**
3. Go to **TestFlight** tab
4. Your build should appear under "Builds" within 5-10 minutes

## Alternative: Download Build Manually
If you need to upload manually using Xcode:

```bash
# Download the IPA
npx @capawesome/cli apps:builds:download --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --build-id <BUILD_ID> --output ./build.ipa

# Then use Xcode's Application Loader or Transporter app to upload
```

## Important Notes
- **Credentials must be set up in Capawesome Cloud Console first**
- The build process typically takes 5-15 minutes
- The app will be automatically uploaded to App Store Connect when complete
- You'll receive an email from Apple when processing is done
