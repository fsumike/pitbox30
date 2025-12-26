# Quick Start Commands

## Development

### Run Development Server
```bash
npm run dev
```
Opens at http://localhost:5173

### Build for Production
```bash
npm run build
```

## Mobile Development

### Build and Sync to Mobile Platforms
```bash
# Build and sync to both platforms
npm run build:mobile

# Build and sync to iOS only
npm run build:ios

# Build and sync to Android only
npm run build:android
```

### Open in Native IDEs
```bash
# Open Android Studio
npm run cap:open:android

# Open Xcode
npm run cap:open:ios
```

## Capawesome Cloud (Live Updates)

### Login to Capawesome CLI
```bash
npm run capawesome:login
```

### Check Login Status
```bash
npm run capawesome:whoami
```

### Deploy Live Update Bundle (Signed)
```bash
npm run deploy:bundle
```
This will:
1. Build the production version
2. Create a signed bundle
3. Upload to Capawesome Cloud

### Deploy Live Update Bundle (Unsigned - Testing)
```bash
npm run deploy:bundle:unsigned
```

### Create Native Builds on Capawesome Cloud
```bash
# Build for iOS
npm run capawesome:build:ios

# Build for Android
npm run capawesome:build:android
```

## Manual Capacitor Commands

### Sync Web Assets
```bash
npm run cap:sync
```

### Add Platforms
```bash
# Add Android
npm run cap:add:android

# Add iOS
npm run cap:add:ios
```

## Quick Mobile Test Flow

1. Build the app:
   ```bash
   npm run build:android
   ```

2. Open Android Studio:
   ```bash
   npm run cap:open:android
   ```

3. In Android Studio, click the green "Run" button to launch on emulator or device

## Live Update Flow

1. Login (first time only):
   ```bash
   npm run capawesome:login
   ```

2. Deploy an update:
   ```bash
   npm run deploy:bundle
   ```

3. Users with the app installed will receive the update automatically on next app launch!

## Troubleshooting

### If build fails
```bash
npm install
npm run build
```

### If Capacitor sync fails
```bash
npx cap sync
```

### Check Capacitor health
```bash
npx cap doctor
```

## App Configuration

- **App ID**: com.pitbox.app
- **App Name**: PIT-BOX
- **Capawesome App ID**: 8251f381-4aed-4b20-ac20-a3aad250cbb8
- **Live Updates**: Enabled with auto-update
- **Signing Key**: ./capawesome-signing-key.pem (for signed bundles)
