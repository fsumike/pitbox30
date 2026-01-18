# 🎨 PitBox Branding Icons - Automatic Setup

## Overview

Your PitBox icons are now **automatically configured** for both iOS and Android during the build process. This ensures your branding appears consistently across all platforms.

## ✅ What's Automatic

When you run `npm run build`, the following happens automatically:

1. **iOS Icons**: Copied to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. **Android Icons**: Copied to `android/app/src/main/res/mipmap-*/`
3. **All Sizes**: Proper icon sizes configured for all devices
4. **Branding**: Your white PitBox logo maintained across both platforms

## 🚀 Quick Start

### Build Everything (Automatic Icon Setup)

```bash
npm run build
```

This single command:
- Builds your web app
- Sets up iOS project
- Sets up Android project
- **Automatically configures all icons for both platforms**
- Fixes permissions
- Syncs everything

### Platform-Specific Builds

```bash
# iOS only (with icons)
npm run build:ios

# Android only (with icons)
npm run build:android

# Both platforms (with icons)
npm run build:mobile
```

## 🎯 Manual Icon Fix (If Needed)

If you ever need to re-run icon setup without rebuilding:

```bash
# Fix both platforms
npm run fix:all-icons

# Fix iOS only
npm run fix:ios-icons

# Fix Android only
npm run fix:android-icons
```

## 📱 Icon Locations

### iOS Icons

Source files in `public/`:
- `apple-icon-1024-1024.png` → App Store icon
- `apple-icon-180-180.png` → iPhone @3x
- `apple-icon-152-152.png` → iPad @2x
- `apple-icon-167-167.png` → iPad Pro
- `apple-icon-120-120.png` → iPhone @2x

Copied to:
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
├── Icon-1024.png
├── Icon-60@2x.png
├── Icon-60@3x.png
├── Icon-76@2x.png
├── Icon-83.5@2x.png
└── Contents.json
```

### Android Icons

Source files in `public/`:
- `android-icon-48-48.png` → mdpi (48dp)
- `android-icon-72-72.png` → hdpi (72dp)
- `android-icon-96-96.png` → xhdpi (96dp)
- `android-icon-144-144.png` → xxhdpi (144dp)
- `android-icon-192-192.png` → xxxhdpi (192dp)

Copied to:
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
```

## 🔍 Verification

### Verify iOS Icons

1. Open Xcode:
   ```bash
   npm run cap:open:ios
   ```

2. Navigate to: `App → Assets.xcassets → AppIcon`

3. Check that all icon slots are filled with your PitBox logo

4. Look for: **No yellow warnings**

### Verify Android Icons

1. Open Android Studio:
   ```bash
   npm run cap:open:android
   ```

2. Navigate to: `app → res → mipmap-*` folders

3. Check that `ic_launcher.png` exists in all density folders

4. Preview: Right-click any icon → Show in Explorer/Finder

## 📦 Build for Release (Capawesome Cloud)

### iOS (TestFlight & App Store)

```bash
# 1. Build with icons
npm run build

# 2. Deploy to Capawesome Cloud
npm run capawesome:build:ios
```

Capawesome Cloud automatically:
- ✅ Builds your app with PitBox icons
- ✅ Signs with your certificates
- ✅ Uploads to TestFlight & App Store Connect
- ✅ No Mac or Xcode needed!

Your PitBox icon will appear in TestFlight and the App Store!

### Android (Google Play)

```bash
# 1. Build with icons
npm run build

# 2. Deploy to Capawesome Cloud
npm run capawesome:build:android
```

Capawesome Cloud automatically:
- ✅ Builds your app with PitBox icons
- ✅ Signs with your keystore
- ✅ Generates signed AAB
- ✅ No Android Studio needed!

Your PitBox icon will appear in Google Play and on all Android devices!

## ⚙️ Icon Requirements

### iOS

Your icon MUST:
- ✅ Be 1024x1024 pixels (App Store)
- ✅ Be PNG format
- ✅ Have NO transparency/alpha channel
- ✅ Have square corners (iOS rounds them)
- ✅ Use RGB color space (not CMYK)

### Android

Your icon MUST:
- ✅ Be square (1:1 aspect ratio)
- ✅ Be PNG format
- ✅ Use multiple densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- ✅ Work well at all sizes (48dp to 192dp)

## 🎨 Your Current Icons

All your icons are in the `public/` folder:

**iOS Icons:**
- ✅ apple-icon-1024-1024.png
- ✅ apple-icon-180-180.png
- ✅ apple-icon-167-167.png
- ✅ apple-icon-152-152.png
- ✅ apple-icon-120-120.png

**Android Icons:**
- ✅ android-icon-48-48.png
- ✅ android-icon-72-72.png
- ✅ android-icon-96-96.png
- ✅ android-icon-144-144.png
- ✅ android-icon-192-192.png

These are automatically copied during builds!

## 🔧 How It Works

### Build Process Integration

The icon setup is integrated into your build scripts:

1. **Main Build** (`npm run build`):
   - Runs `fix-all-icons.mjs` automatically
   - Configures both iOS and Android

2. **iOS Build** (`npm run build:ios`):
   - Runs `fix-ios-icons.mjs` automatically
   - Only configures iOS

3. **Android Build** (`npm run build:android`):
   - Runs `fix-android-icons.mjs` automatically
   - Only configures Android

### Scripts

Three automated scripts handle icon setup:

1. **`fix-ios-icons.mjs`**
   - Copies iOS icons to Assets.xcassets
   - Creates Contents.json
   - Validates all sizes

2. **`fix-android-icons.mjs`**
   - Copies Android icons to mipmap folders
   - Creates adaptive icon backgrounds
   - Validates all densities

3. **`fix-all-icons.mjs`**
   - Runs both iOS and Android scripts
   - Provides unified summary
   - Handles missing platforms gracefully

## 🆘 Troubleshooting

### "Icons not showing in TestFlight"

**Solution:**
```bash
# Re-run icon setup
npm run fix:ios-icons

# Verify in Xcode
npm run cap:open:ios

# Check Assets.xcassets → AppIcon
# All slots should be filled

# Archive again
# Product → Archive → Upload
```

### "Icons not showing on Android"

**Solution:**
```bash
# Re-run icon setup
npm run fix:android-icons

# Verify in Android Studio
npm run cap:open:android

# Check app/res/mipmap-* folders
# All should have ic_launcher.png

# Rebuild APK/AAB
```

### "Missing icon files"

If you're missing any icon files, generate them using:

**For iOS:**
- https://appicon.co
- https://www.appicon.build

**For Android:**
- https://icon.kitchen
- https://romannurik.github.io/AndroidAssetStudio/

Upload your 1024x1024 icon and download the icon set.

### "Yellow warnings in Xcode"

This means some icon sizes are missing. Run:

```bash
npm run fix:ios-icons
```

Check the output for any missing files, then generate them.

### "Android launcher icon looks wrong"

Make sure your icon:
1. Has a white background (not transparent)
2. Is the correct size for each density
3. Is named exactly `ic_launcher.png`

Re-run:
```bash
npm run fix:android-icons
```

## 📊 Icon Checklist

Before releasing to production:

### iOS
- [ ] Ran `npm run build:ios`
- [ ] Opened Xcode and verified icons
- [ ] No yellow warnings in Assets.xcassets
- [ ] All icon slots filled with PitBox logo
- [ ] Icon appears in simulator
- [ ] Archived and uploaded to TestFlight
- [ ] Icon appears in TestFlight app
- [ ] Icon appears on device home screen

### Android
- [ ] Ran `npm run build:android`
- [ ] Opened Android Studio and verified icons
- [ ] All mipmap folders have ic_launcher.png
- [ ] Icon appears in emulator
- [ ] Generated signed bundle/APK
- [ ] Uploaded to Google Play Internal Testing
- [ ] Icon appears in Google Play listing
- [ ] Icon appears on device home screen

## 🎉 Success Indicators

You know the icons are working when:

1. **TestFlight**: Your PitBox logo appears instead of generic white icon
2. **Google Play**: Your PitBox logo appears in the app listing
3. **Home Screen**: Users see your PitBox logo after installing
4. **App Switcher**: PitBox logo appears when switching apps
5. **Settings**: PitBox logo appears in device settings

## 💡 Pro Tips

1. **Always rebuild after icon changes:**
   ```bash
   npm run build
   ```

2. **Test on real devices**, not just simulators/emulators

3. **Check both light and dark modes** on iOS

4. **Test on various Android launchers** (Samsung, Pixel, OnePlus, etc.)

5. **Clear cache** if icon doesn't update:
   - iOS: Delete app, restart device, reinstall
   - Android: Clear app data and cache

## 📚 Additional Resources

- [Apple Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Icon Design Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios/configuration)
- [Capacitor Android Configuration](https://capacitorjs.com/docs/android/configuration)

## 🎯 Summary

**Your icons are now automatic!**

Just run `npm run build` and your PitBox branding will be correctly configured for:
- ✅ iOS (TestFlight & App Store)
- ✅ Android (Google Play)
- ✅ All device sizes and densities
- ✅ Light and dark modes
- ✅ Adaptive launchers

No manual work needed - it's all automatic!
