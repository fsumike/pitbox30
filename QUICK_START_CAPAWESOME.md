# ⚡ Quick Start: PitBox with Capawesome Cloud

## Your Setup

You're using **Capawesome Cloud** for iOS and Android builds. This means no Mac, no Xcode, no Android Studio required!

## 🚀 Deploy in 3 Commands

### 1. Build Locally (Icons Automatic)

```bash
npm run build
```

This automatically configures your PitBox icons for both platforms.

### 2. Deploy to iOS (TestFlight)

```bash
npm run capawesome:build:ios
```

Capawesome builds, signs, and uploads to TestFlight automatically.

### 3. Deploy to Android (Google Play)

```bash
npm run capawesome:build:android
```

Capawesome builds, signs, and creates AAB file automatically.

## ✅ Your Icons Are Automatic

Every time you run `npm run build`, your PitBox branding icons are automatically:
- ✅ Copied to iOS Assets.xcassets
- ✅ Copied to Android mipmap folders
- ✅ Configured for all device sizes
- ✅ Ready for Capawesome Cloud

When Capawesome builds your app, your icons are already included!

## 🎯 Complete Deploy Command

```bash
# Build and deploy everything
npm run build && npm run capawesome:build:ios && npm run capawesome:build:android
```

## 📱 What Users See

**iOS (TestFlight & App Store):**
- Your white PitBox logo on home screen
- Professional branding everywhere
- All iPhone and iPad sizes

**Android (Google Play):**
- Your white PitBox logo on home screen
- Works with all launchers
- All device densities

## 🔐 First Time Setup

```bash
# Login to Capawesome (one time)
npm run capawesome:login

# Verify you're logged in
npm run capawesome:whoami
```

## 📊 Check Your Builds

Dashboard: https://cloud.capawesome.io

## 💡 Remember

- **No Mac needed** for iOS builds
- **No Xcode needed** for iOS builds
- **No Android Studio needed** for Android builds
- **Icons are automatic** on every build
- **Capawesome handles** signing and uploading

## 📚 More Info

- `DEPLOYMENT_WORKFLOW.md` - Complete deployment guide
- `CAPAWESOME_ICON_WORKFLOW.md` - How icons work with Capawesome
- `ICON_SETUP_COMPLETE.md` - Icon setup details

## ✨ That's It!

Your PitBox app with full branding deploys in 3 commands:

```bash
npm run build                      # Icons configured ✅
npm run capawesome:build:ios       # iOS deployed ✅
npm run capawesome:build:android   # Android deployed ✅
```

**Welcome to cloud-native mobile development!**
