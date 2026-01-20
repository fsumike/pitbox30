# Social Media Share Target Setup Guide

This guide explains how to enable the "Share to PitBox" feature that allows users to share content from Instagram, Facebook, TikTok, and other apps directly to Pit Community.

## 🎯 What This Does

When enabled, users can:
1. Open Instagram, Facebook, TikTok, etc.
2. Tap the Share button on any post
3. See "PitBox" in their share menu
4. Tap PitBox to share that content to Pit Community
5. Add their own comment before posting

## 🚀 Quick Setup

### Step 1: Run the Setup Script

```bash
npm run setup:share-target
```

This script will automatically configure both Android and iOS projects.

### Step 2: Rebuild Native Projects

```bash
npm run build
```

### Step 3: Test on Device

**For Android:**
```bash
npm run cap:open:android
```

**For iOS:**
```bash
npm run cap:open:ios
```

## 📱 Manual Setup (if needed)

### Android Configuration

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    ...>

    <!-- Add these intent filters -->
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
        <data android:mimeType="image/*" />
        <data android:mimeType="video/*" />
    </intent-filter>

    <intent-filter>
        <action android:name="android.intent.action.SEND_MULTIPLE" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="image/*" />
    </intent-filter>
</activity>
```

### iOS Configuration

Edit `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.pitbox.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>pitbox</string>
        </array>
    </dict>
</array>

<key>NSUserActivityTypes</key>
<array>
    <string>com.pitbox.app.share</string>
</array>
```

## 🧪 Testing

### Test on Android

1. Open Instagram on your Android device
2. Find any post and tap the Share button (paper airplane icon)
3. You should see "PitBox" in the share sheet
4. Tap PitBox - the app will open with a share dialog
5. Add your comment and tap "Share to Community"

### Test on iOS

1. Open Instagram on your iPhone
2. Find any post and tap the Share button
3. Scroll to find "PitBox" in the share menu
4. Tap PitBox - the app will open with a share dialog
5. Add your comment and tap "Share to Community"

## 🔧 Supported Content Types

The share target supports:
- **Text**: Plain text links and captions
- **URLs**: Direct links from social media posts
- **Images**: Single or multiple images (up to 4)
- **Videos**: Video files up to 50MB

## 📋 Supported Platforms

Automatically detects and displays appropriate branding for:
- Instagram
- Facebook
- TikTok
- Twitter/X
- YouTube
- Generic external links

## 🎨 User Experience Flow

1. **User shares from Instagram**
   - Taps Share button on a post
   - Sees PitBox icon in share menu
   - Taps PitBox

2. **PitBox opens with preview**
   - Shows Instagram branding
   - Displays link preview
   - Pre-fills caption if available

3. **User adds comment**
   - Can edit or add their own thoughts
   - Can add emojis
   - Sees clear source attribution

4. **Post is created**
   - Posts to Pit Community feed
   - Shows "Shared from Instagram" badge
   - Includes original link

## 🐛 Troubleshooting

### PitBox doesn't appear in share menu

**Android:**
- Rebuild the app: `npm run build:android`
- Clear app data and reinstall
- Check that intent filters are in AndroidManifest.xml

**iOS:**
- Rebuild the app: `npm run build:ios`
- Ensure CFBundleURLTypes is in Info.plist
- Restart device if needed

### App doesn't open when sharing

**Check:**
- URL scheme is registered correctly (pitbox://)
- App has necessary permissions
- Try rebuilding and reinstalling

### Shared content doesn't show up

**Verify:**
- User is signed in
- Internet connection is active
- Check browser console for errors

## 📝 Database Schema

Posts created via share target include:
```sql
{
  user_id: uuid,
  content: text (includes user comment + shared URL),
  shared_from: text ('instagram', 'facebook', 'tiktok', etc.),
  shared_url: text (original link),
  visibility: 'public',
  status: 'published'
}
```

## 🔐 Security Notes

- All shared content is processed client-side first
- User must be authenticated to share
- No automatic posting - user must confirm
- Respects existing RLS policies

## 📚 Additional Resources

- [Capacitor App Plugin Docs](https://capacitorjs.com/docs/apis/app)
- [Android Intent Filters](https://developer.android.com/guide/components/intents-filters)
- [iOS URL Schemes](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app)

## ✅ Verification Checklist

Before deploying:
- [ ] Setup script runs successfully
- [ ] Android shows PitBox in share menu
- [ ] iOS shows PitBox in share menu
- [ ] Shared posts appear in Pit Community
- [ ] Source attribution displays correctly
- [ ] Users must be signed in to share
- [ ] Error handling works properly

## 🎉 Success!

Once configured, your users can seamlessly share racing content from any social media platform directly to Pit Community, creating a more engaged and active community!
