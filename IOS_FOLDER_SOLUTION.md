# iOS Folder Persistence Solution

## The Problem

The `ios/` folder **disappears after rebooting Bolt** because Bolt's filesystem is ephemeral and doesn't persist certain directories between sessions.

## The Solution

We've created a backup archive and restore script that lets you quickly restore the ios folder whenever needed.

## Quick Start - Restore iOS Folder

After any reboot where the `ios/` folder is missing, simply run:

```bash
tar -xzf ios-platform-backup.tar.gz
```

That's it! The ios folder is restored in seconds with all plugins and web assets.

### Alternative: Use the restore script

```bash
bash restore-ios.sh
```

## Files Included

- `ios-platform-backup.tar.gz` - Complete iOS platform with plugins & web assets (782KB)
- `restore-ios.sh` - Interactive restore script with safety checks

## Full Workflow

### When ios/ folder is missing:

1. **Restore the folder:**
   ```bash
   bash restore-ios.sh
   ```

2. **Build your web app:**
   ```bash
   npm run build
   ```

3. **Sync to iOS platform:**
   ```bash
   npx cap sync ios
   ```

4. **Deploy to Capawesome Cloud:**
   ```bash
   npm run capawesome:build:ios
   ```

## Alternative: Create Fresh iOS Platform

If the backup is corrupted or outdated, create a fresh platform:

```bash
# Remove old backup
rm -rf ios/ ios-platform-backup.tar.gz

# Create fresh iOS platform
npx cap add ios

# Create new backup
tar -czf ios-platform-backup.tar.gz ios/

echo "✅ New iOS backup created!"
```

## What's in the iOS Platform?

The `ios/` folder contains:
- `App.xcodeproj` - Xcode project configuration
- `App.xcworkspace` - Xcode workspace
- `Podfile` - CocoaPods dependencies
- `App/` directory with:
  - `AppDelegate.swift` - iOS app entry point
  - `Info.plist` - App configuration
  - `Assets.xcassets` - App icons and splash screens
  - Capacitor plugin configurations

## Why This Approach?

✅ **Fast** - Restore in 2 seconds vs 2+ minutes to rebuild
✅ **Reliable** - Archived file persists across reboots
✅ **Simple** - One command to restore: `tar -xzf ios-platform-backup.tar.gz`
✅ **Complete** - Includes plugins, web assets, and full Xcode project (782KB)

## Troubleshooting

**Q: restore-ios.sh says "file not found"**
A: Make sure you're in the project root directory where the script is located

**Q: The ios folder is empty after restore**
A: The archive might be corrupted. Create a fresh platform using the "Alternative" steps above

**Q: Can I commit ios/ to git?**
A: Yes, but it's not recommended. The archive approach is cleaner and takes less space

---

**Last Updated:** December 26, 2024
**Archive Size:** 782KB (includes web assets + plugins)
**Capacitor Version:** 5.7.0
