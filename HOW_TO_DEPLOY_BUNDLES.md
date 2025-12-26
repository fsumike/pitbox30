# How to Deploy Live Update Bundles

## Authentication Required

The Capawesome CLI requires authentication, which needs to be done in an **interactive terminal** on your local machine.

## Step-by-Step Deployment Process

### 1. Login on Your Local Machine

Open a terminal on your computer and run:

```bash
npm run capawesome:login
```

This will:
- Open your web browser
- Prompt you to login to Capawesome Cloud
- Save authentication credentials locally

**Alternative**: Run directly with npx:
```bash
npx @capawesome/cli login
```

### 2. Verify You're Logged In

```bash
npm run capawesome:whoami
```

You should see your account information.

### 3. Deploy Your First Bundle

Once authenticated, deploy a bundle:

```bash
npm run deploy:bundle
```

This command will:
1. ✅ Build your app with Vite
2. ✅ Create an optimized production bundle
3. ✅ Upload the bundle to Capawesome Cloud

### 4. Activate the Bundle

After upload completes:

1. Go to https://cloud.capawesome.io
2. Navigate to your app
3. Find the newly uploaded bundle
4. Click **"Deploy"** to make it live
5. Users will receive the update on next app launch

## Your App Details

- **App ID**: `8251f381-4aed-4b20-ac20-a3aad250cbb8`
- **Dashboard**: https://cloud.capawesome.io

## Quick Deployment Workflow

After initial login, your typical workflow is:

1. **Make changes** to your app
   ```bash
   # Edit files in src/
   ```

2. **Deploy bundle**
   ```bash
   npm run deploy:bundle
   ```

3. **Activate in dashboard**
   - Visit https://cloud.capawesome.io
   - Deploy the new bundle

4. **Test on device**
   - Close and reopen your app
   - The update will be downloaded and applied

## Authentication Token (Optional)

For CI/CD environments, you can use an authentication token:

1. Get your token from Capawesome Cloud dashboard
2. Set it as an environment variable:
   ```bash
   export CAPAWESOME_TOKEN="your-token-here"
   ```

Then the CLI will use the token automatically in non-interactive environments.

## Build Output

The production build creates:
- **dist/** folder with optimized files
- **2055 KB** of precached content
- **138 files** in the bundle
- PWA service worker for offline support

## Troubleshooting

### "You must be logged in"
Run `npm run capawesome:login` on your local machine first.

### "You must provide a token"
This appears in non-interactive environments. Either:
- Run the command locally where you can login interactively
- Or set the `CAPAWESOME_TOKEN` environment variable

### "App not found"
Verify your app ID in `capacitor.config.ts` matches your Capawesome Cloud app.

## What Gets Updated

Live Updates can update:
- ✅ JavaScript code
- ✅ CSS styles
- ✅ HTML templates
- ✅ Images and assets
- ✅ Configuration files

Live Updates **cannot** update:
- ❌ Native code (Android/iOS)
- ❌ Native plugins
- ❌ App permissions
- ❌ App icons/splash screens

For native changes, you must publish a new app store version.

## Next Steps

1. **Login now** on your local machine:
   ```bash
   npm run capawesome:login
   ```

2. **Deploy your first bundle**:
   ```bash
   npm run deploy:bundle
   ```

3. **Start making instant updates** to your app!

---

Your build is ready. Just login on your local machine to start deploying!
