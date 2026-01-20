# 🚨 TestFlight Icon Quick Fix

Your PitBox icon isn't showing in TestFlight? Here's the **3-minute fix**:

## The Problem
TestFlight shows a generic white icon instead of your custom PitBox icon on the home screen.

## Why It Happens
iOS doesn't use the icons in your `public/` folder. It needs them in a specific Xcode location.

## ✅ The Fix (3 Commands)

```bash
# 1. Build iOS project (if you haven't already)
npm run build

# 2. Copy icons to the right place automatically
npm run fix:ios-icons

# 3. Open in Xcode
npm run cap:open:ios
```

## In Xcode (Final Steps)

1. Click "App" in the left sidebar
2. Click "App" under TARGETS
3. Go to "General" tab
4. Scroll to "App Icons and Launch Screen"
5. You should see your icon preview now!

Then archive and upload:
- Product → Archive
- Distribute App → App Store Connect
- Upload

**Your icon will now show in TestFlight!**

## 🔍 Verify It Worked

In Xcode, go to:
```
App → Assets.xcassets → AppIcon
```

You should see your icon in all the slots. No yellow warnings.

## Still Not Working?

### Option 1: Use Online Icon Generator

1. Go to https://appicon.co
2. Upload your `public/apple-icon-1024-1024.png`
3. Download the iOS icon set
4. In Xcode, drag the AppIcon.appiconset folder to replace the old one

### Option 2: Manual Copy

```bash
# Navigate to iOS assets folder
cd ios/App/App/Assets.xcassets/AppIcon.appiconset/

# Copy your 1024x1024 icon
cp ../../../../public/apple-icon-1024-1024.png ./Icon-1024.png
```

Then regenerate other sizes using Xcode or an online tool.

## ⚠️ Common Mistakes

1. **Icon has transparency** - iOS rejects icons with alpha channels
   - Solution: Export as RGB PNG without transparency

2. **Icon has rounded corners** - iOS adds corners automatically
   - Solution: Use a square icon with square corners

3. **Wrong file format** - Must be PNG, not JPEG
   - Solution: Convert to PNG

4. **Wrong color space** - Must be RGB, not CMYK
   - Solution: Convert to RGB in Photoshop/GIMP

## 🎯 Quick Checklist

- [ ] Icon is 1024x1024 pixels
- [ ] Icon is PNG format
- [ ] Icon has NO transparency
- [ ] Icon has square corners (not rounded)
- [ ] Ran `npm run fix:ios-icons`
- [ ] Opened Xcode and verified icons visible
- [ ] No yellow warnings in Xcode
- [ ] Archived and uploaded to TestFlight

## 📱 Testing

After uploading to TestFlight:
1. Install on your device
2. If generic icon still shows, delete app completely
3. Restart your device
4. Reinstall from TestFlight
5. Wait 30 seconds (iOS rebuilds icon cache)

Your custom icon should now appear!

## Need More Details?

See the complete guide: `IOS_APP_ICON_SETUP_GUIDE.md`
