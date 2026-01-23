# Version Management - Quick Reference

## Current Version: 1.1.0 (126)

---

## 🚀 Quick Commands

### Check Version
```bash
npm run version:get
```

### Bump Version
```bash
npm run version:bump:patch    # 1.1.0 → 1.1.1
npm run version:bump:minor    # 1.1.0 → 1.2.0
npm run version:bump:major    # 1.1.0 → 2.0.0
```

### Set Specific Version
```bash
npm run version:set -- 1.2.0
```

### Increment Build Number Only
```bash
npm run increment-build
```

---

## 📦 Release Workflow

### Standard Release
```bash
# 1. Bump version
npm run version:bump:minor

# 2. Commit and push
git add .
git commit -m "Release v$(npm run version:get --silent)"
git push

# 3. Build and deploy
npm run capawesome:build:ios
npm run capawesome:build:android
```

### Hotfix Release (Build Only)
```bash
npm run increment-build
git add .
git commit -m "Build $(npm run version:get --silent)"
git push
npm run capawesome:build:ios
```

---

## 🎯 Three Methods

### 1. Capver CLI (Best)
- Syncs all platforms automatically
- Updates package.json, iOS Info.plist, Android build.gradle
- Command: `npm run version:bump:minor`

### 2. Dashboard Variables (Testing)
- Go to Capawesome Dashboard → Builds → Build from Git
- Add environment variables: `APP_VERSION=1.2.0`, `BUILD_NUMBER=127`
- One-time only, doesn't modify repository

### 3. Manual Edit (Last Resort)
- Edit: `package.json`, `capawesome.config.json`, `ios/App/App/Info.plist`, `android/app/build.gradle`
- Ensure all files have matching versions

---

## 📝 Version Format

**Semantic Versioning**: `MAJOR.MINOR.PATCH (BUILD)`

- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features (1.1.0 → 1.2.0)
- **Patch**: Bug fixes (1.1.0 → 1.1.1)
- **Build**: Incremental (126 → 127)

---

## ⚠️ Rules

### iOS App Store
- Version must be higher than previous submission
- Build number must be unique and incrementing
- Format: X.Y.Z (e.g., 1.1.0)

### Google Play
- versionName: User-facing (e.g., "1.1.0")
- versionCode: Must increment (e.g., 126 → 127)

---

## 🔧 Files to Edit Manually

If not using Capver CLI:

1. **package.json**
   ```json
   "version": "1.1.0"
   ```

2. **capawesome.config.json**
   ```json
   "version": "1.1.0",
   "buildNumber": "126",    // iOS
   "versionCode": 126       // Android
   ```

3. **ios/App/App/Info.plist**
   ```xml
   CFBundleShortVersionString: 1.1.0
   CFBundleVersion: 126
   ```

4. **android/app/build.gradle**
   ```gradle
   versionName "1.1.0"
   versionCode 126
   ```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Version already exists" | `npm run version:bump:patch` |
| "Build number must be higher" | `npm run increment-build` |
| Version mismatch | `npm run version:set -- 1.1.0` |
| Wrong version in store | Edit `capawesome.config.json` manually |

---

## 📞 Support

- Capawesome Docs: https://capawesome.io/
- Email: pitboxcom@gmail.com
