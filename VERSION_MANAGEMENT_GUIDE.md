# PitBox Version Management Guide

## Current Version
- **Version**: 1.1.0
- **Build Number**: 126

## Three Methods to Manage Versions

### Method 1: Capver CLI (Recommended for Automation)

The Capver CLI synchronizes version numbers across all platforms automatically.

```bash
# Set a new version (updates package.json, iOS Info.plist, Android build.gradle)
npx @capawesome/capver set 1.2.0

# Get current version
npx @capawesome/capver get

# Bump patch version (1.1.0 → 1.1.1)
npx @capawesome/capver bump patch

# Bump minor version (1.1.0 → 1.2.0)
npx @capawesome/capver bump minor

# Bump major version (1.1.0 → 2.0.0)
npx @capawesome/capver bump major
```

**After using Capver:**
```bash
git add .
git commit -m "Bump version to $(npx @capawesome/capver get)"
git push
```

---

### Method 2: Ad-hoc Environment Variables (Dashboard)

Use this for one-time builds with custom versions without committing changes.

**Steps:**
1. Go to [Capawesome Dashboard](https://cloud.capawesome.io/)
2. Navigate to your app → Builds
3. Click "Build from Git"
4. Under "Environment Variables", add:
   - `APP_VERSION=1.2.0`
   - `BUILD_NUMBER=127`
5. Click "Build"

**Note:** These variables only apply to that specific build and don't modify your repository.

---

### Method 3: Manual File Editing

Edit these files directly in your repository:

#### package.json
```json
{
  "version": "1.1.0"
}
```

#### capawesome.config.json
```json
{
  "build": {
    "platforms": {
      "ios": {
        "version": "1.1.0",
        "buildNumber": "126"
      },
      "android": {
        "version": "1.1.0",
        "versionCode": 126
      }
    }
  }
}
```

#### iOS: ios/App/App/Info.plist
```xml
<key>CFBundleShortVersionString</key>
<string>1.1.0</string>
<key>CFBundleVersion</key>
<string>126</string>
```

#### Android: android/app/build.gradle
```gradle
defaultConfig {
    versionName "1.1.0"
    versionCode 126
}
```

---

## Quick Commands (Added to package.json)

We've added these npm scripts for easy version management:

```bash
# Get current version
npm run version:get

# Set specific version
npm run version:set -- 1.2.0

# Bump patch (1.1.0 → 1.1.1)
npm run version:bump:patch

# Bump minor (1.1.0 → 1.2.0)
npm run version:bump:minor

# Bump major (1.1.0 → 2.0.0)
npm run version:bump:major

# Increment build number only
npm run increment-build
```

---

## Recommended Workflow

### For Regular Releases:

```bash
# 1. Bump version
npm run version:bump:minor

# 2. Commit changes
git add .
git commit -m "Release version $(npx @capawesome/capver get)"

# 3. Push to GitHub
git push

# 4. Trigger Capawesome build
npm run capawesome:build:ios
npm run capawesome:build:android
```

### For Hotfixes (Build Number Only):

```bash
# 1. Increment build number
npm run increment-build

# 2. Commit and push
git add .
git commit -m "Increment build number"
git push

# 3. Build
npm run capawesome:build:ios
```

---

## Version Naming Convention

Follow semantic versioning (semver):

- **Major (X.0.0)**: Breaking changes, major new features
- **Minor (1.X.0)**: New features, backward compatible
- **Patch (1.1.X)**: Bug fixes, small improvements
- **Build Number**: Auto-increments with each build

Examples:
- `1.0.0 (100)` - Initial release
- `1.1.0 (126)` - Current version (added new features)
- `1.1.1 (127)` - Bug fix release
- `1.2.0 (130)` - Next feature release
- `2.0.0 (150)` - Major redesign

---

## Apple App Store Requirements

- Version numbers must be **higher** than previously submitted builds
- Format: `MAJOR.MINOR.PATCH` (e.g., 1.1.0)
- Build numbers must be **unique** and **incrementing**
- Build numbers can be any positive integer

## Google Play Store Requirements

- `versionName`: User-facing version string (e.g., "1.1.0")
- `versionCode`: Integer that must increment with each release
- Format: `versionCode` must be greater than previous releases

---

## Troubleshooting

### "Version number must be higher"
You're trying to submit a version that already exists in the store.
```bash
npm run version:bump:patch
```

### "Build number must be unique"
```bash
npm run increment-build
```

### Version mismatch between platforms
```bash
npx @capawesome/capver set 1.1.0
```

This ensures iOS, Android, and package.json all have the same version.

---

## Environment Variables Reference

When using Capawesome Dashboard or CI/CD, these environment variables are available:

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_VERSION` | Semantic version string | `1.2.0` |
| `BUILD_NUMBER` | Build/version code | `127` |
| `IOS_BUILD_NUMBER` | iOS-specific build | `127` |
| `ANDROID_VERSION_CODE` | Android-specific code | `127` |

---

## Automated CI/CD Integration

Add this to your GitHub Actions workflow:

```yaml
- name: Bump version
  run: npx @capawesome/capver bump patch

- name: Commit version bump
  run: |
    git config user.name "GitHub Actions"
    git config user.email "actions@github.com"
    git add .
    git commit -m "chore: bump version [skip ci]"
    git push
```

---

## Need Help?

- Capawesome Docs: https://capawesome.io/
- Capver CLI: https://github.com/capawesome-team/capver
- Contact: pitboxcom@gmail.com
