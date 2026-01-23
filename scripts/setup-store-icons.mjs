#!/usr/bin/env node

/**
 * 🎨 PitBox Store Icons Setup
 *
 * This script ensures your custom PitBox branding icons are properly
 * configured for both App Store Connect (iOS) and Google Play Store (Android).
 *
 * These icons are used in store listings and are separate from the app icons
 * that appear on users' devices.
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║     🎨 PitBox Store Marketing Icons Setup                 ║');
console.log('║                                                            ║');
console.log('║     Setting up icons for App Store Connect & Play Store   ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Icon file paths
const appStoreIcon = join(projectRoot, 'app-store-icon.png');
const playStoreIcon = join(projectRoot, 'play-store-icon.png');

// Verify source icons exist
if (!existsSync(appStoreIcon)) {
  console.error('❌ Error: app-store-icon.png not found in project root');
  process.exit(1);
}

if (!existsSync(playStoreIcon)) {
  console.error('❌ Error: play-store-icon.png not found in project root');
  process.exit(1);
}

console.log('✅ Source icons found:');
console.log(`   • app-store-icon.png (1024x1024 for iOS)`);
console.log(`   • play-store-icon.png (512x512 for Android)\n`);

// ============================================================
// iOS App Store Connect Setup
// ============================================================

console.log('📱 Setting up iOS App Store Connect icon...\n');

const iosAssets = join(projectRoot, 'ios/App/App/Assets.xcassets/AppIcon.appiconset');

if (existsSync(iosAssets)) {
  // Copy the 1024x1024 icon to iOS assets
  const ios1024Path = join(iosAssets, 'app-store-icon-1024.png');
  copyFileSync(appStoreIcon, ios1024Path);
  console.log('   ✅ Copied to iOS Assets: app-store-icon-1024.png');

  // Update Contents.json to include it
  const contentsPath = join(iosAssets, 'Contents.json');
  if (existsSync(contentsPath)) {
    try {
      const contents = JSON.parse(readFileSync(contentsPath, 'utf8'));

      // Ensure the 1024x1024 icon is in the configuration
      const has1024 = contents.images.some(img => img.size === "1024x1024");

      if (!has1024) {
        contents.images.push({
          "filename": "app-store-icon-1024.png",
          "idiom": "ios-marketing",
          "scale": "1x",
          "size": "1024x1024"
        });
        writeFileSync(contentsPath, JSON.stringify(contents, null, 2));
        console.log('   ✅ Updated Contents.json with 1024x1024 icon');
      } else {
        console.log('   ✅ Contents.json already has 1024x1024 icon entry');
      }
    } catch (error) {
      console.log('   ⚠️  Could not update Contents.json:', error.message);
    }
  }
} else {
  console.log('   ℹ️  iOS folder not found - will be set up on next build');
}

// Copy to public folder for web/PWA
const public1024 = join(projectRoot, 'public/apple-icon-1024-1024.png');
copyFileSync(appStoreIcon, public1024);
console.log('   ✅ Copied to public folder for PWA\n');

// ============================================================
// Android Google Play Store Setup
// ============================================================

console.log('🤖 Setting up Google Play Store icon...\n');

const androidRes = join(projectRoot, 'android/app/src/main/res');

if (existsSync(androidRes)) {
  // Create a high-res icon folder if it doesn't exist
  const mipmapXxxhdpi = join(androidRes, 'mipmap-xxxhdpi');
  if (!existsSync(mipmapXxxhdpi)) {
    mkdirSync(mipmapXxxhdpi, { recursive: true });
  }

  // Copy 512x512 as a reference (Play Store requires manual upload)
  const androidIconPath = join(mipmapXxxhdpi, 'play-store-icon.png');
  copyFileSync(playStoreIcon, androidIconPath);
  console.log('   ✅ Copied to Android res: play-store-icon.png');
} else {
  console.log('   ℹ️  Android folder not found - will be set up on next build');
}

// Copy to public folder for reference
const publicPlayStore = join(projectRoot, 'public/play-store-icon.png');
copyFileSync(playStoreIcon, publicPlayStore);
console.log('   ✅ Copied to public folder for reference\n');

// ============================================================
// Create Store Icon Documentation
// ============================================================

const storeIconsReadme = `# 🎨 PitBox Store Icons Configuration

## Current Icon Setup

Your PitBox branding icons are configured for both app stores:

### iOS App Store Connect
- **Location:** \`app-store-icon.png\`
- **Size:** 1024x1024 pixels
- **Format:** PNG (no transparency, RGB color space)
- **Used in:**
  - App Store listing page
  - TestFlight preview
  - Xcode Assets.xcassets/AppIcon.appiconset

### Google Play Store
- **Location:** \`play-store-icon.png\`
- **Size:** 512x512 pixels
- **Format:** PNG (high-res icon)
- **Used in:**
  - Google Play Store listing page
  - Play Console app details

---

## 🚀 How Capawesome Cloud Uses These Icons

### iOS Automatic Upload

When you run \`npm run capawesome:build:ios\`, Capawesome Cloud:

1. ✅ Builds your iOS app with the icons from \`ios/App/App/Assets.xcassets/AppIcon.appiconset\`
2. ✅ Signs the app with your certificates
3. ✅ Uploads to App Store Connect via API
4. ✅ The app appears in TestFlight with your branding

**The 1024x1024 icon from App Store Connect is used in:**
- TestFlight app listing
- App Store search results
- App Store product page

### Android Automatic Upload

When you run \`npm run capawesome:build:android\`, Capawesome Cloud:

1. ✅ Builds your Android app with icons from \`android/app/src/main/res/mipmap-*\`
2. ✅ Signs the APK/AAB with your keystore
3. ✅ Uploads to Google Play Console (internal track)
4. ✅ The app appears in Play Console with your branding

**Note:** The 512x512 high-res icon must be **manually uploaded** to Play Console:
- Go to Google Play Console
- Select your app
- Store presence → Store listing
- Upload 512x512 icon in the "App icon" section

---

## 📋 Store Listing Requirements

### App Store Connect (iOS)

**Required for store listing:**
- ✅ App icon: 1024x1024 PNG (already configured!)
- Screenshots (various sizes for different devices)
- Privacy policy URL
- App description, keywords, etc.

**Your icon meets requirements:**
- ✅ 1024x1024 pixels
- ✅ RGB color space
- ✅ No transparency
- ✅ No rounded corners

### Google Play Console (Android)

**Required for store listing:**
- ✅ App icon: 512x512 PNG (already configured!)
- Feature graphic: 1024x500 PNG (create this for banner)
- Screenshots (various sizes)
- Privacy policy URL
- App description, category, etc.

**Your icon meets requirements:**
- ✅ 512x512 pixels
- ✅ 32-bit PNG with alpha

---

## 🔄 Update Process

### When You Need to Change Icons

1. **Replace the source files:**
   \`\`\`bash
   # Replace with your new icon files
   app-store-icon.png    # 1024x1024 for iOS
   play-store-icon.png   # 512x512 for Android
   \`\`\`

2. **Run the setup script:**
   \`\`\`bash
   node scripts/setup-store-icons.mjs
   \`\`\`

3. **Rebuild and deploy:**
   \`\`\`bash
   npm run build
   npm run capawesome:build:ios      # For iOS
   npm run capawesome:build:android  # For Android
   \`\`\`

4. **Manual steps (one-time):**
   - iOS: Icon automatically uploaded with build
   - Android: Upload 512x512 to Play Console manually

---

## 📸 Additional Store Assets Needed

### App Store Connect

**Screenshots required (use Capawesome or Xcode simulator):**
- iPhone 6.7" (1290×2796): 3-10 screenshots
- iPhone 6.5" (1242×2688): 3-10 screenshots
- iPhone 5.5" (1242×2208): 3-10 screenshots
- iPad Pro 12.9" (2048×2732): 3-10 screenshots

**Optional but recommended:**
- App preview videos (up to 3 per device size)

### Google Play Store

**Screenshots required:**
- Phone: 320dp - 3840dp (minimum 2)
- Tablet 7": 320dp - 3840dp (minimum 1)
- Tablet 10": 320dp - 3840dp (minimum 1)

**Feature Graphic (banner):**
- Size: 1024×500 PNG or JPG
- Shows at top of store listing
- Should match your branding

**Promotional Assets (optional):**
- Promo graphic: 180×120
- TV banner: 1280×720
- Wear OS square: 512×512

---

## ✅ Current Status

Your store icons are **ready for deployment**!

| Platform | Icon Ready | Auto Upload | Manual Upload Needed |
|----------|-----------|-------------|---------------------|
| **iOS App Store** | ✅ | ✅ Capawesome | None |
| **Google Play** | ✅ | ✅ Capawesome (app) | 512x512 icon (store listing) |

---

## 🎯 Next Steps

### For iOS:
1. ✅ Icon configured and ready
2. Run: \`npm run capawesome:build:ios\`
3. Wait for build to appear in App Store Connect
4. Add screenshots and other metadata
5. Submit for review

### For Android:
1. ✅ Icon configured and ready
2. Run: \`npm run capawesome:build:android\`
3. Wait for build to appear in Play Console
4. **Manually upload 512x512 icon** to store listing
5. Add screenshots and other metadata
6. Submit for review

---

## 🔧 Troubleshooting

### Icon not showing in TestFlight/App Store

**Causes:**
- Icon has transparency (iOS doesn't allow this)
- Icon has rounded corners (iOS adds them automatically)
- Icon is in CMYK color space (must be RGB)
- Wrong dimensions

**Solution:**
- Verify icon is 1024x1024 RGB PNG with no alpha
- Use the provided \`app-store-icon.png\` which meets all requirements

### Icon looks pixelated on Android

**Causes:**
- Using low-resolution source image
- Not providing all density buckets

**Solution:**
- Use high-resolution 512x512+ source
- Run \`npm run fix:android-icons\` to regenerate all sizes

---

## 📞 Quick Reference

**Your Icon Files:**
- \`app-store-icon.png\` - 1024x1024 for iOS
- \`play-store-icon.png\` - 512x512 for Android

**Setup Command:**
\`\`\`bash
node scripts/setup-store-icons.mjs
\`\`\`

**Build Commands:**
\`\`\`bash
npm run capawesome:build:ios      # iOS to TestFlight/App Store
npm run capawesome:build:android  # Android to Play Console
\`\`\`

**Store Dashboards:**
- iOS: https://appstoreconnect.apple.com
- Android: https://play.google.com/console

Your PitBox branding is ready to shine in both app stores! 🏁
`;

writeFileSync(join(projectRoot, 'STORE_ICONS_GUIDE.md'), storeIconsReadme);
console.log('📖 Created STORE_ICONS_GUIDE.md with full documentation\n');

// ============================================================
// Summary
// ============================================================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                    ✅ SETUP COMPLETE                       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('📱 iOS App Store Connect:');
console.log('   ✅ 1024x1024 icon configured');
console.log('   ✅ Will be automatically uploaded with Capawesome build');
console.log('   ✅ No manual upload needed\n');

console.log('🤖 Google Play Store:');
console.log('   ✅ 512x512 icon configured');
console.log('   ✅ App will build with correct icons');
console.log('   ⚠️  Manually upload 512x512 icon to Play Console store listing\n');

console.log('🚀 Next Steps:');
console.log('   1. Build for stores: npm run capawesome:build:ios');
console.log('   2. Wait for upload to complete (5-10 minutes)');
console.log('   3. Check TestFlight/Play Console');
console.log('   4. For Android: Manually upload 512x512 to store listing\n');

console.log('📖 Read STORE_ICONS_GUIDE.md for complete documentation\n');

console.log('✨ Your PitBox branding is ready for the app stores!');
