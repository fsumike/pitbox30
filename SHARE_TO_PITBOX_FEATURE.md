# 🎉 Share to PitBox Feature - Complete Implementation

Your PitBox app now has **Social Media Share Target** functionality! Users can share content from Instagram, Facebook, TikTok, and other apps directly to Pit Community.

---

## ✨ What Was Implemented

### 1. **Share Target Hook** (`src/hooks/useShareTarget.ts`)
- Listens for incoming share intents from other apps
- Automatically parses shared URLs and content
- Detects source platform (Instagram, Facebook, TikTok, etc.)
- Handles app state changes and deep links

### 2. **Share Target Handler Component** (`src/components/ShareTargetHandler.tsx`)
- Beautiful UI for previewing shared content
- Platform-specific branding and icons
- Comment input with emoji picker
- Link preview with original content
- Success animation when posted

### 3. **App Integration** (`src/App.tsx`)
- Integrated share target handler into main app
- Automatically shows when content is shared
- Redirects to Pit Community after successful share

### 4. **Platform Utilities** (`src/utils/platform.ts`)
- Added `isPlatform()` helper function
- Detects if running on native vs web

### 5. **Setup Scripts**
- `scripts/setup-share-target.mjs` - Automated configuration tool
- Configures both Android and iOS native projects
- Added `npm run setup:share-target` command

---

## 🚀 How It Works

### User Experience Flow:

1. **User opens Instagram**
   - Finds a cool race car video or post
   - Taps the Share button (paper airplane icon)

2. **Share menu appears**
   - PitBox icon shows up in the list
   - User taps on PitBox

3. **PitBox opens automatically**
   - Shows beautiful preview with Instagram branding
   - Displays the shared link and content
   - Pre-fills with original caption

4. **User adds their comment**
   - Can edit or add their own thoughts
   - Can add emojis
   - Sees clear "From Instagram" attribution

5. **Post is created**
   - Appears in Pit Community feed
   - Shows "Shared from Instagram" badge
   - Includes link to original post

---

## 🎨 Supported Platforms

The feature automatically detects and shows branded UI for:

- **Instagram** 📸 - Purple/pink gradient
- **Facebook** 👍 - Blue gradient
- **TikTok** 🎵 - Black/pink gradient
- **Twitter/X** 🐦 - Blue gradient
- **YouTube** 📺 - Red gradient
- **Generic links** 🔗 - Gold gradient

---

## 📱 Next Steps to Enable

### Step 1: Build Native Projects
```bash
npm run build
```
This generates the Android and iOS projects if they don't exist.

### Step 2: Configure Share Target
```bash
npm run setup:share-target
```
This automatically configures both platforms to show PitBox in share menus.

### Step 3: Test on Device

**For Android:**
```bash
npm run cap:open:android
```
Then build and install on device from Android Studio.

**For iOS:**
```bash
npm run cap:open:ios
```
Then build and install on device from Xcode.

### Step 4: Test the Feature

1. Install the app on your test device
2. Open Instagram (or any social media app)
3. Tap Share on any post
4. Look for "PitBox" in the share menu
5. Tap it and see the magic happen!

---

## 🗄️ Database Changes

Posts created via share target include these fields:

```javascript
{
  user_id: uuid,              // Who shared it
  content: text,              // User's comment + original URL
  shared_from: text,          // 'instagram', 'facebook', 'tiktok', etc.
  shared_url: text,           // Original link
  visibility: 'public',       // Always public for now
  status: 'published'         // Immediately published
}
```

No migration needed - these fields already exist in your `posts` table!

---

## 🔧 Technical Details

### Android Configuration (AndroidManifest.xml)

The setup script adds these intent filters:

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
    <data android:mimeType="image/*" />
    <data android:mimeType="video/*" />
</intent-filter>
```

This makes PitBox appear when users share:
- Text/links
- Images
- Videos

### iOS Configuration (Info.plist)

The setup script adds URL scheme handling:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>pitbox</string>
        </array>
    </dict>
</array>
```

This allows PitBox to receive shared content via deep links.

---

## 🎯 Key Features

### Smart URL Parsing
- Automatically detects Instagram, Facebook, TikTok URLs
- Shows appropriate platform branding
- Extracts titles and descriptions when available

### Beautiful UI
- Platform-specific color schemes
- Smooth animations
- Mobile-optimized with haptic feedback
- Drag-to-close gesture support

### Security
- Users must be signed in to share
- No automatic posting - user must confirm
- Respects existing RLS policies
- All processing happens client-side first

### User Experience
- Pre-fills comment with original caption
- Shows link preview
- Source attribution badge
- Success animation on post
- Automatically redirects to community

---

## 🐛 Troubleshooting

### PitBox doesn't show in share menu

**Android:**
1. Make sure you ran `npm run setup:share-target`
2. Rebuild the app completely
3. Clear app data and reinstall
4. Check that AndroidManifest.xml has the intent filters

**iOS:**
1. Make sure you ran `npm run setup:share-target`
2. Rebuild the app completely
3. Restart device if needed
4. Check that Info.plist has CFBundleURLTypes

### Shared content doesn't appear

1. Check that user is signed in
2. Open browser console for errors
3. Verify internet connection
4. Check Supabase RLS policies allow inserts

---

## 📚 Documentation Files

Three files were created for you:

1. **SOCIAL_SHARE_SETUP_GUIDE.md** - Complete setup guide
2. **SHARE_TO_PITBOX_FEATURE.md** - This file (feature overview)
3. **scripts/setup-share-target.mjs** - Automated setup script

---

## ✅ What You Can Do Now

- **Test locally:** Share content between apps on your device
- **Customize branding:** Edit ShareTargetHandler.tsx colors/styles
- **Add more platforms:** Extend platform detection in useShareTarget.ts
- **Analytics:** Track which platforms users share from most
- **Marketing:** Tell users they can share to PitBox from anywhere!

---

## 🎊 Success Metrics You Can Track

Once deployed, you can monitor:

1. **Share sources:** Which platform users share from most
2. **Engagement:** Do shared posts get more likes/comments?
3. **User growth:** Does this feature attract new users?
4. **Content quality:** What type of content gets shared most?

Add queries like:
```sql
SELECT shared_from, COUNT(*)
FROM posts
WHERE shared_from IS NOT NULL
GROUP BY shared_from
ORDER BY COUNT(*) DESC;
```

---

## 🚀 Ready to Launch!

Your implementation is complete and ready to test. Just run:

```bash
npm run build
npm run setup:share-target
npm run cap:open:android  # or cap:open:ios
```

Then build and install on a device to see it in action!

**Questions?** Check SOCIAL_SHARE_SETUP_GUIDE.md for detailed troubleshooting and testing instructions.
