# iOS App Icon Setup for TestFlight & App Store

## The Problem
When you install via TestFlight, you're seeing a generic white icon instead of your custom PitBox icon.

## Why This Happens
iOS requires app icons to be placed in a specific location: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Your icons exist in the `public/` folder, but TestFlight doesn't look there. We need to copy them to the iOS project.

## ✅ Your Current Icons

You have these Apple icon files ready:
- `apple-icon-1024-1024.png` (App Store icon)
- `apple-icon-180-180.png` (iPhone Pro Max, iPhone 14/15 Plus)
- `apple-icon-167-167.png` (iPad Pro)
- `apple-icon-152-152.png` (iPad, iPad mini)
- `apple-icon-120-120.png` (iPhone, iPhone SE)

## 🚀 Quick Fix (3 Steps)

### Step 1: Run the Setup Script
```bash
npm run fix:ios-icons
```

This will automatically:
- Copy your icons to the correct iOS location
- Create the proper Contents.json configuration
- Set up all required icon sizes

### Step 2: Rebuild iOS Project
```bash
npm run build:ios
```

### Step 3: Open in Xcode and Verify
```bash
npm run cap:open:ios
```

In Xcode:
1. Click on `App` in the left sidebar
2. Select the `App` target
3. Click on `App Icons and Launch Screen`
4. You should see your icon in all the slots

Then:
1. Product → Archive
2. Upload to TestFlight
3. Your icon will now appear!

## 📋 Manual Setup (If Script Doesn't Work)

### Step 1: Generate All Icon Sizes

iOS requires these specific sizes:
- 1024x1024 (App Store)
- 180x180 (iPhone 3x)
- 167x167 (iPad Pro)
- 152x152 (iPad 2x)
- 120x120 (iPhone 2x)
- 87x87 (iPhone 3x Settings)
- 80x80 (iPad 2x Settings)
- 76x76 (iPad 1x)
- 60x60 (iPhone 2x Spotlight)
- 58x58 (iPhone 2x Settings)
- 40x40 (iPad 1x Spotlight)
- 29x29 (iPhone 1x Settings)
- 20x20 (iPad 1x Notifications)

You can use online tools like:
- https://appicon.co
- https://www.appicon.build
- https://makeappicon.com

Upload your 1024x1024 icon and download the iOS icon set.

### Step 2: Copy Icons to iOS Project

1. Build your iOS project first:
   ```bash
   npm run build
   ```

2. Navigate to:
   ```
   ios/App/App/Assets.xcassets/AppIcon.appiconset/
   ```

3. Replace all the icon files there with your new icons

4. Make sure the `Contents.json` file lists all your icons

### Step 3: Configure in Xcode

1. Open Xcode:
   ```bash
   npm run cap:open:ios
   ```

2. In Xcode, select your project in the left sidebar

3. Select the "App" target

4. Go to "General" tab

5. Under "App Icons and Launch Screen" you should see "AppIcon"

6. Click on "AppIcon" to view all sizes - they should all be filled

## 🎨 Icon Requirements for App Store

Your icon MUST:
- ✅ Be 1024x1024 pixels
- ✅ Be in PNG format
- ✅ Use RGB color space (not CMYK)
- ✅ NOT have transparency/alpha channel
- ✅ NOT have rounded corners (iOS adds them automatically)
- ✅ Be a square image

Your icon SHOULD NOT:
- ❌ Include the word "Apple" or iPhone/iPad
- ❌ Look like other Apple apps
- ❌ Include Apple interface elements
- ❌ Have placeholder text like "Beta" or "Test"

## 🔍 Troubleshooting

### Icon Still Not Showing in TestFlight

**Solution 1: Clean Build**
```bash
# In Xcode:
Product → Clean Build Folder (Cmd+Shift+K)
# Then rebuild and archive again
```

**Solution 2: Check Icon Format**
```bash
# Verify your icon has no alpha channel
file public/apple-icon-1024-1024.png
# Should say: PNG image data, 1024 x 1024, 8-bit/color RGB
# NOT 8-bit/color RGBA
```

**Solution 3: Verify All Sizes Present**
Open Xcode → Assets.xcassets → AppIcon
- Every box should have an icon
- No yellow warnings should appear

**Solution 4: Update Bundle ID**
Make sure your bundle ID in Xcode matches TestFlight:
1. Select project in Xcode
2. Go to "Signing & Capabilities"
3. Verify Bundle Identifier is: `com.pitbox.app`

### Generic Icon on Home Screen

If the icon appears in TestFlight but not on home screen:
1. Delete the app from your device completely
2. Restart your device
3. Reinstall from TestFlight
4. Wait 30 seconds for iOS to rebuild icon cache

### Icon Appears Blurry

Your source icon might be too small:
1. Make sure you're starting with at least 1024x1024
2. Use high-quality PNG export
3. Don't scale up a smaller image

## 📱 Testing Your Icons

Before uploading to TestFlight:
1. Run on simulator to preview
2. Check all device sizes (iPhone, iPad)
3. View in Settings app (uses smaller sizes)
4. Check Spotlight search results

## ⚡ Pro Tips

### Tip 1: Use Capacitor's Icon Generation
```bash
# If you have capacitor-assets
npx capacitor-assets generate --ios
```

### Tip 2: Check Icon in TestFlight Before Release
After uploading build to TestFlight:
1. Go to App Store Connect
2. Select your build
3. View "App Icon" in build details
4. It should show your icon, not generic

### Tip 3: Icon Shows in TestFlight But Not Release
Make sure you uploaded the same build:
1. Build number must match
2. Bundle ID must match
3. Signing certificate must be valid

## 📄 Contents.json Example

Your `ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json` should look like:

```json
{
  "images" : [
    {
      "size" : "20x20",
      "idiom" : "iphone",
      "filename" : "Icon-20@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "20x20",
      "idiom" : "iphone",
      "filename" : "Icon-20@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "filename" : "Icon-29@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "29x29",
      "idiom" : "iphone",
      "filename" : "Icon-29@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "filename" : "Icon-40@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "40x40",
      "idiom" : "iphone",
      "filename" : "Icon-40@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "filename" : "Icon-60@2x.png",
      "scale" : "2x"
    },
    {
      "size" : "60x60",
      "idiom" : "iphone",
      "filename" : "Icon-60@3x.png",
      "scale" : "3x"
    },
    {
      "size" : "1024x1024",
      "idiom" : "ios-marketing",
      "filename" : "Icon-1024.png",
      "scale" : "1x"
    }
  ],
  "info" : {
    "version" : 1,
    "author" : "xcode"
  }
}
```

## ✅ Verification Checklist

Before submitting to App Store Connect:

- [ ] Icon is 1024x1024 pixels
- [ ] Icon has no transparency
- [ ] Icon has no rounded corners
- [ ] All icon sizes present in Assets.xcassets
- [ ] No yellow warnings in Xcode
- [ ] Icon appears in Xcode preview
- [ ] Icon appears on simulator
- [ ] Icon appears in TestFlight
- [ ] Icon appears on device home screen
- [ ] Bundle ID matches App Store Connect
- [ ] Build compiles with no errors

## 🆘 Still Having Issues?

If none of the above works:

1. **Export your current icon:**
   ```bash
   cp public/apple-icon-1024-1024.png ~/Desktop/pitbox-icon.png
   ```

2. **Use an online generator:**
   - Go to https://appicon.co
   - Upload `pitbox-icon.png`
   - Download the iOS icon set

3. **Replace the entire AppIcon.appiconset folder:**
   - Delete `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Copy the downloaded AppIcon.appiconset folder there

4. **Clean and rebuild everything:**
   ```bash
   npm run build:ios
   # Then in Xcode: Product → Clean Build Folder
   # Then: Product → Archive
   ```

## 📞 Need More Help?

Check these resources:
- [Apple Human Interface Guidelines - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [App Store Connect Help - App Icons](https://developer.apple.com/help/app-store-connect/reference/app-icon-specifications)
- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios/configuration)
