# Capawesome Live Update - Setup Complete

## Configuration Summary

Your app is now configured with Capawesome Live Update for over-the-air updates.

### App Configuration
- **App ID**: `8251f381-4aed-4b20-ac20-a3aad250cbb8`
- **Auto-Update**: Enabled
- **Plugin Version**: @capawesome/capacitor-live-update@5.0.0

### What's Been Set Up

1. **Capacitor Configuration** (`capacitor.config.ts`)
   - App ID configured
   - Auto-update enabled
   - Reset on update disabled (preserves user data)

2. **Live Update Service** (`src/lib/capawesome-live-update.ts`)
   - Service initialized on app startup
   - Automatic update checking
   - Background download and installation

3. **App Integration** (`src/App.tsx`)
   - Service initialized when app starts
   - Runs on every app launch

## How It Works

When your app launches:
1. The Live Update service checks Capawesome Cloud for new bundles
2. If an update is available, it downloads in the background
3. The update is applied on the next app restart (automatic)
4. Users always have the latest version without App Store updates

## Deploying Updates

### Step 1: Make Your Changes
Edit your app code as needed.

### Step 2: Build for Production
```bash
npm run build
```

### Step 3: Upload to Capawesome Cloud
The Capawesome CLI is already installed. Use it to upload your bundle:

```bash
# Login to your account (first time only)
npx @capawesome/cli login

# Upload the new bundle
npx @capawesome/cli apps:bundles:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --path dist
```

### Step 4: Deploy to Users
In the Capawesome Cloud dashboard:
1. Go to your app
2. Find the newly uploaded bundle
3. Click "Deploy" to make it live
4. Choose deployment options (immediate, gradual rollout, etc.)

## Testing the Update

1. **Build and Install Initial Version**
   ```bash
   npm run build
   npx cap sync android
   npx cap open android
   ```
   Build and install the APK on your test device.

2. **Make a Change**
   - Edit a file (e.g., change some text or styling)
   - Rebuild: `npm run build`

3. **Upload New Bundle**
   ```bash
   npx @capawesome/cli apps:bundles:create \
     --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
     --path dist
   ```

4. **Deploy in Dashboard**
   Deploy the new bundle in Capawesome Cloud

5. **Test on Device**
   - Close and reopen your app
   - The update should download automatically
   - Restart the app again to see your changes

## Console Logs

The Live Update service logs helpful information:
- "Capawesome Live Update initialized" - Service started
- "Current bundle: [bundle-id]" - Currently running bundle
- "Update available: [bundle-id]" - New update found
- "App is up to date" - No updates available

## Important Notes

1. **Native Code Changes**: Live Updates only work for web assets (HTML, CSS, JS). Native code changes require a full App Store/Play Store update.

2. **Bundle Size**: Keep bundles small for faster downloads. The build process already optimizes your assets.

3. **Versioning**: Each bundle gets a unique ID. You can roll back to previous bundles in the Capawesome dashboard.

4. **User Data**: With `resetOnUpdate: false`, user data persists across updates.

5. **Network**: Updates download in the background and only on Wi-Fi by default (configurable).

## Next Steps

1. **Set up Capawesome CLI**: Install and login to the CLI tool
2. **Test the flow**: Deploy a test update to verify everything works
3. **Configure rollout strategy**: Set up gradual rollouts or targeted deployments in the dashboard
4. **Monitor**: Track update adoption in the Capawesome dashboard

## Troubleshooting

### Updates not downloading
- Check console logs for errors
- Verify App ID matches in config and dashboard
- Ensure device has internet connection
- Check Capawesome dashboard for deployment status

### App not reloading
- Updates apply on next app restart
- Try force-closing and reopening the app
- Check if auto-reload is enabled in config

### Console shows "plugin not installed"
- Verify @capawesome/capacitor-live-update is in package.json
- Run `npm install` and `npx cap sync`

## Resources

- [Capawesome Documentation](https://capawesome.io/docs)
- [Live Update Guide](https://capawesome.io/docs/plugins/live-update)
- [Capawesome Dashboard](https://cloud.capawesome.io)
