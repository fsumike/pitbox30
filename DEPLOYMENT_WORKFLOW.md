# 🚀 PitBox Deployment Workflow (Capawesome Cloud)

## Your Setup: Capawesome Cloud

You're using **Capawesome Cloud** for building and deploying iOS and Android apps. This means:

- ✅ **No Mac required** for iOS builds
- ✅ **No Xcode required** for iOS builds
- ✅ **No Android Studio required** for Android builds
- ✅ **Automatic code signing** handled by Capawesome
- ✅ **Direct uploads** to TestFlight and Google Play

## 📱 Complete Deployment Process

### Step 1: Build Locally (with Icons)

```bash
npm run build
```

This automatically:
- Builds your web application
- Creates iOS and Android projects
- **Copies all your PitBox icons automatically**
- Configures everything for mobile

### Step 2: Deploy to iOS (TestFlight & App Store)

```bash
npm run capawesome:build:ios
```

Capawesome Cloud automatically:
- Uploads your local project
- Builds iOS app with your PitBox icons
- Signs with your certificates
- Uploads to TestFlight
- Makes it available for testing

### Step 3: Deploy to Android (Google Play)

```bash
npm run capawesome:build:android
```

Capawesome Cloud automatically:
- Uploads your local project
- Builds Android app with your PitBox icons
- Signs with your keystore
- Generates production AAB file
- Ready for Google Play upload

## 🎯 Quick Deploy Commands

```bash
# Full iOS deployment
npm run build && npm run capawesome:build:ios

# Full Android deployment
npm run build && npm run capawesome:build:android

# Deploy both platforms
npm run build && npm run capawesome:build:ios && npm run capawesome:build:android
```

## ✅ What's Automatic

Your PitBox icons are **automatically included** in every Capawesome build because:

1. `npm run build` configures icons locally
2. Capawesome uploads your local project
3. Your icons are already in the project
4. Capawesome builds with your icons included
5. Users see your PitBox branding!

## 📋 Pre-Flight Checklist

Before deploying, make sure:

- [ ] You're logged in: `npm run capawesome:whoami`
- [ ] Local build succeeds: `npm run build`
- [ ] Icons are configured (automatic during build)
- [ ] All changes committed to your repository
- [ ] Ready to deploy!

## 🔐 Authentication

### First Time Setup

```bash
# Login to Capawesome
npm run capawesome:login

# Verify login
npm run capawesome:whoami
```

### Every Time You Deploy

No need to login again - you're already authenticated!

## 🎨 Icon Verification

Your icons are automatically configured during `npm run build`:

### iOS Icons
```bash
# Verify iOS icons are in place
ls -la ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

Should show:
- Icon-1024.png (App Store)
- Icon-60@2x.png (iPhone)
- Icon-60@3x.png (iPhone Pro)
- Icon-76@2x.png (iPad)
- Icon-83.5@2x.png (iPad Pro)
- Contents.json (Configuration)

### Android Icons
```bash
# Verify Android icons are in place
find android/app/src/main/res/mipmap-* -name "ic_launcher.png"
```

Should show icons in all densities:
- mipmap-mdpi
- mipmap-hdpi
- mipmap-xhdpi
- mipmap-xxhdpi
- mipmap-xxxhdpi

## 🔄 Update Workflow

When you make changes to your app:

```bash
# 1. Make your code changes
# ... edit files ...

# 2. Build locally (icons auto-configured)
npm run build

# 3. Test locally if needed
npm run preview

# 4. Deploy to iOS
npm run capawesome:build:ios

# 5. Deploy to Android
npm run capawesome:build:android
```

## 🎯 Where Your App Goes

### iOS Deployment Flow

```
npm run build
    ↓
npm run capawesome:build:ios
    ↓
Capawesome Cloud builds iOS app (with your PitBox icons)
    ↓
Uploaded to App Store Connect
    ↓
Available in TestFlight
    ↓
Users can download from TestFlight
    ↓
After Apple review: Available on App Store
```

### Android Deployment Flow

```
npm run build
    ↓
npm run capawesome:build:android
    ↓
Capawesome Cloud builds Android app (with your PitBox icons)
    ↓
AAB file generated
    ↓
Upload to Google Play Console
    ↓
Users can download from Google Play
```

## 💻 Capawesome Dashboard

Access your builds at: https://cloud.capawesome.io

In the dashboard you can:
- ✅ View build status
- ✅ Download build artifacts
- ✅ Check build logs
- ✅ Manage certificates
- ✅ View deployment history

## 🆘 Common Issues

### "Not logged in to Capawesome"

```bash
npm run capawesome:login
npm run capawesome:whoami
```

### "Build failed - icons missing"

```bash
# Rebuild locally first
npm run build

# Then deploy again
npm run capawesome:build:ios  # or android
```

### "Icons not showing in TestFlight"

This means the icons weren't in the project when it was uploaded. Fix:

```bash
# 1. Verify icons locally
ls ios/App/App/Assets.xcassets/AppIcon.appiconset/

# 2. If missing, rebuild
npm run build

# 3. Deploy again
npm run capawesome:build:ios
```

### "Certificate issues"

Capawesome manages certificates automatically. Check:
1. Dashboard: https://cloud.capawesome.io
2. Navigate to your app
3. Check certificate status
4. Re-run build if needed

## 📊 Build Status

Check build status:

```bash
# Login status
npm run capawesome:whoami

# Or check dashboard
# https://cloud.capawesome.io
```

## 🎉 Success Indicators

You know everything worked when:

1. **Capawesome build succeeds**
   - Check dashboard for green checkmark
   - No errors in build logs

2. **TestFlight shows your app**
   - PitBox icon visible
   - App description appears
   - Users can install

3. **Google Play shows your app**
   - PitBox icon in listing
   - App details correct
   - Users can install

4. **Users see PitBox branding**
   - Icon on home screen
   - Icon in app switcher
   - Professional appearance

## 📚 Related Documentation

- `CAPAWESOME_ICON_WORKFLOW.md` - How icons work with Capawesome
- `ICON_SETUP_COMPLETE.md` - Icon setup details
- `BRANDING_ICONS_SETUP.md` - Complete icon guide

## ✨ Summary

**Your deployment is simple with Capawesome Cloud:**

1. **Build**: `npm run build`
   - Icons automatically configured ✅

2. **Deploy iOS**: `npm run capawesome:build:ios`
   - Builds in cloud, uploads to TestFlight ✅

3. **Deploy Android**: `npm run capawesome:build:android`
   - Builds in cloud, ready for Google Play ✅

**No Mac. No Xcode. No Android Studio. Just Capawesome!**

Your PitBox branding appears automatically on all platforms!
