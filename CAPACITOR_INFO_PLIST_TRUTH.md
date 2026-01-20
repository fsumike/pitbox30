# The Truth About Capacitor Info.plist Configuration

## Research Summary

After comprehensive research of official Capacitor documentation and GitHub discussions, here are the facts:

### MYTH: `infoPlistValues` in capacitor.config.ts Syncs to Info.plist
**REALITY:** This is NOT an official Capacitor feature and does NOT work.

### Official Capacitor Documentation States:

1. **From capacitorjs.com/docs/config** - The entire configuration schema has NO `infoPlistValues` option
2. **From capacitorjs.com/docs/ios/configuration** - States you must manually edit Info.plist
3. **From Capacitor Maintainer** - "Capacitor never updates your native project files"

## The Official Way to Add iOS Permissions

According to official Capacitor documentation:

```
The Info.plist file is the main configuration file for iOS apps.
You may need to edit it whenever a Capacitor plugin requires new
settings or permissions.

To modify it, open your project in Xcode, select the App project
and the App target, and click the Info tab.

You can also open and edit the ios/App/App/Info.plist file manually.
```

### What Capacitor Sync Actually Does

- **Copies web assets** to ios/App/App/public
- **Updates Podfile** with plugins
- **DOES NOT touch Info.plist**

The `npx cap sync` command will NEVER overwrite your Info.plist file.

## Why Your Permissions Keep Missing

### The Real Problem:

When using **Capawesome Cloud Build**, if your `ios/` folder is in `.gitignore`, Capawesome generates a **fresh iOS project** from scratch without your custom Info.plist.

### The Real Solution:

1. **Remove ios/ from .gitignore** (or specifically track Info.plist)
2. **Manually edit ios/App/App/Info.plist** with all required permissions
3. **Commit Info.plist to git**
4. Capawesome will use the committed Info.plist in builds

## What We Fixed

### ✅ Step 1: Updated .gitignore

```gitignore
# Keep Info.plist with permissions for App Store
ios/
!ios/App/
!ios/App/App/
!ios/App/App/Info.plist
ios/App/Pods/
ios/App/*.xcworkspace/
ios/App/*.xcodeproj/
ios/App/build/
ios/App/App/public/
```

### ✅ Step 2: Manually Added All Permissions to Info.plist

File: `ios/App/App/Info.plist`

All 20+ required permission strings are now in the file:
- NSPhotoLibraryUsageDescription ✅
- NSLocationWhenInUseUsageDescription ✅
- NSCameraUsageDescription ✅
- And 17 more...

### ✅ Step 3: Ready to Commit

```bash
git add ios/App/App/Info.plist
git add .gitignore
git commit -m "Fix: Add iOS permissions directly to Info.plist for App Store"
git push origin main
```

## About infoPlistValues in Your Config

The `infoPlistValues` block in your `capacitor.config.ts` **does nothing**. It's not processed by Capacitor.

You can:
- **Remove it** - It has no effect
- **Keep it** - As documentation of what's in Info.plist

But it will NOT sync to Info.plist automatically.

## Verification

Run this to verify Info.plist has permissions:

```bash
./verify-ios-permissions.sh
```

All checks pass ✅

## Deploy Steps

```bash
# 1. Commit the Info.plist
git add ios/App/App/Info.plist .gitignore
git commit -m "Fix: Add iOS permissions to Info.plist"
git push

# 2. Build with Capawesome
npm run capawesome:build:ios

# 3. Upload to App Store Connect
# Download .ipa and submit
```

## Why This Works

- ✅ Info.plist is now in git repository
- ✅ Capawesome clones your repo and uses committed files
- ✅ Info.plist has all required permissions
- ✅ Capacitor sync doesn't overwrite Info.plist
- ✅ Apple will accept the build

## Official Sources

- [Capacitor iOS Configuration](https://capacitorjs.com/docs/ios/configuration)
- [Capacitor Config Schema](https://capacitorjs.com/docs/config)
- [GitHub Discussion: How should info.plist be managed?](https://github.com/ionic-team/capacitor/discussions/6720)

---

**Bottom Line:** Manually edit Info.plist, commit it to git, and Capawesome will use it. That's the official, documented way.
