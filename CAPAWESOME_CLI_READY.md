# Capawesome CLI - Ready to Use!

## ✅ Installation Complete

The Capawesome CLI v3.8.0 is installed and ready to use.

## Quick Command Reference

### Login (First Time Only)
```bash
npm run capawesome:login
```
This will open your browser to authenticate.

### Check Current User
```bash
npm run capawesome:whoami
```

### Deploy a Bundle (Build + Upload)
```bash
npm run deploy:bundle
```
This will:
1. Build your app (`npm run build`)
2. Upload the bundle to Capawesome Cloud
3. After upload, go to https://cloud.capawesome.io to deploy

## Manual Commands

If you prefer to run commands directly:

```bash
# Login
npx @capawesome/cli login

# Check who you're logged in as
npx @capawesome/cli whoami

# Upload a bundle
npx @capawesome/cli apps:bundles:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --path dist

# View all available commands
npx @capawesome/cli --help
```

## Your App Details

- **App ID**: `8251f381-4aed-4b20-ac20-a3aad250cbb8`
- **Dashboard**: https://cloud.capawesome.io

## Deployment Workflow

1. **Make changes to your app**
   Edit any files in `src/`

2. **Deploy bundle**
   ```bash
   npm run deploy:bundle
   ```

3. **Activate in dashboard**
   - Go to https://cloud.capawesome.io
   - Select your app
   - Find the new bundle
   - Click "Deploy"

4. **Test on device**
   - Users will get the update on next app launch
   - Close and reopen your app to test

## What Happens When You Deploy

When you run `npm run deploy:bundle`:
1. ✅ Vite builds optimized production bundle
2. ✅ Bundle is uploaded to Capawesome Cloud
3. ⏳ You activate it in the dashboard
4. 📱 Users receive update on next app launch

## Important Files

- `capacitor.config.ts` - App ID and Live Update settings
- `src/lib/capawesome-live-update.ts` - Live Update service
- `src/App.tsx` - Auto-initialization on app startup

## Next Steps

1. **Login now:**
   ```bash
   npm run capawesome:login
   ```

2. **Test deployment:**
   ```bash
   npm run deploy:bundle
   ```

3. **Deploy in dashboard:**
   Visit https://cloud.capawesome.io

You're all set to push instant updates to your users!
