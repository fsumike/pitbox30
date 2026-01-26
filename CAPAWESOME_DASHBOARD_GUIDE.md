# Capawesome Dashboard - Version Management Guide

## Using Ad-hoc Environment Variables for Builds

This guide shows you how to override version numbers using the Capawesome Dashboard without modifying your repository.

---

## Step-by-Step Instructions

### 1. Login to Capawesome Dashboard
1. Go to https://cloud.capawesome.io/
2. Sign in with your account
3. Select your app: **PitBox** (8251f381-4aed-4b20-ac20-a3aad250cbb8)

---

### 2. Navigate to Builds
1. Click on **"Builds"** in the left sidebar
2. You'll see your build history

---

### 3. Start a New Build with Custom Version
1. Click **"Build from Git"** button (top right)
2. Select your branch (usually `main`)
3. Look for the **"Environment Variables"** or **"Ad-hoc Variables"** section

---

### 4. Add Environment Variables

In the Environment Variables section, add these variables:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `APP_VERSION` | `1.2.0` | The semantic version string |
| `BUILD_NUMBER` | `127` | The build/version code |

**Example:**
```
APP_VERSION=1.2.0
BUILD_NUMBER=127
```

**Optional - Platform Specific:**
```
IOS_BUILD_NUMBER=127
ANDROID_VERSION_CODE=127
```

---

### 5. Trigger the Build

1. Choose the platform:
   - iOS (App Store)
   - Android (Google Play)
   - Both

2. Click **"Start Build"** or **"Build"**

3. Monitor the build progress

---

## Environment Variable Reference

### Required Variables

| Variable | Type | Example | Used For |
|----------|------|---------|----------|
| `APP_VERSION` | String | `1.2.0` | iOS CFBundleShortVersionString<br>Android versionName |
| `BUILD_NUMBER` | Integer | `127` | iOS CFBundleVersion<br>Android versionCode |

### Optional Variables

| Variable | Type | Example | Used For |
|----------|------|---------|----------|
| `IOS_BUILD_NUMBER` | Integer | `127` | iOS-specific build (overrides BUILD_NUMBER) |
| `ANDROID_VERSION_CODE` | Integer | `127` | Android-specific code (overrides BUILD_NUMBER) |

---

## Common Scenarios

### Scenario 1: Testing a New Version
**Goal:** Test version 1.2.0 without committing to repository

```
APP_VERSION=1.2.0
BUILD_NUMBER=128
```

This builds version 1.2.0 (128) without changing your code.

---

### Scenario 2: Emergency Hotfix
**Goal:** Quick build with incremented build number

```
APP_VERSION=1.1.0
BUILD_NUMBER=127
```

Keeps the same version but increments build number for a hotfix.

---

### Scenario 3: Platform-Specific Builds
**Goal:** Different build numbers for iOS and Android

```
APP_VERSION=1.1.0
IOS_BUILD_NUMBER=130
ANDROID_VERSION_CODE=128
```

iOS gets build 130, Android gets build 128.

---

### Scenario 4: Beta Testing
**Goal:** Beta version with special identifier

```
APP_VERSION=1.2.0-beta
BUILD_NUMBER=129
```

Creates a beta build for TestFlight or internal testing.

---

## Important Notes

### ✅ Advantages
- **Quick testing** without code changes
- **No git commits** required
- **Isolated builds** don't affect repository
- **Platform flexibility** (different versions per platform)

### ⚠️ Limitations
- Variables only apply to **that specific build**
- **Not persistent** - next build uses repository values
- **Must be set manually** for each build
- **Team members** won't see these changes

---

## Best Practices

### 1. Document Your Builds
Keep a log of which ad-hoc variables you used:
```
Build #1234: APP_VERSION=1.2.0, BUILD_NUMBER=128 (Testing new UI)
Build #1235: APP_VERSION=1.1.0, BUILD_NUMBER=127 (Hotfix for crash)
```

### 2. Use for Testing Only
- Ad-hoc variables are great for **testing** and **quick fixes**
- For **production releases**, update the repository with proper version management

### 3. Sync Repository Later
After testing with ad-hoc variables, update your repository:
```bash
npm run version:set -- 1.2.0
git add .
git commit -m "Release version 1.2.0"
git push
```

### 4. Communication
If working in a team, communicate when using ad-hoc variables:
- **Slack/Teams:** "Building iOS with version 1.2.0 (129) for testing"
- **Build notes:** Document the purpose of the build

---

## Troubleshooting

### "Variables not applied"
**Solution:** Make sure you're entering variables in the correct format:
- No quotes: `APP_VERSION=1.2.0` ✅
- Not: `APP_VERSION="1.2.0"` ❌

### "Build fails with wrong version"
**Solution:** Check that your `capawesome.config.json` uses environment variable syntax:
```json
"version": "${APP_VERSION:-1.1.0}"
```

The `:-` provides a default fallback value.

### "Can't find environment variables section"
**Solution:**
1. Ensure you're using the latest Capawesome dashboard
2. Look for "Advanced Options" or "Build Configuration"
3. Contact support if section is missing

---

## Alternative: Using Capawesome CLI with Variables

You can also use environment variables with the Capawesome CLI:

```bash
# iOS build with custom version
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --type app-store \
  --env APP_VERSION=1.2.0 \
  --env BUILD_NUMBER=128

# Android build with custom version
npx @capawesome/cli apps:builds:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform android \
  --env APP_VERSION=1.2.0 \
  --env BUILD_NUMBER=128
```

---

## GitHub Actions Integration

You can also use environment variables in GitHub Actions:

```yaml
name: Build iOS

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'App Version'
        required: true
        default: '1.1.0'
      build_number:
        description: 'Build Number'
        required: true
        default: '126'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Build with custom version
        run: |
          npx @capawesome/cli apps:builds:create \
            --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
            --platform ios \
            --env APP_VERSION=${{ github.event.inputs.version }} \
            --env BUILD_NUMBER=${{ github.event.inputs.build_number }}
```

---

## Quick Reference

| Action | Dashboard Location | Example Value |
|--------|-------------------|---------------|
| Set version | Environment Variables → APP_VERSION | 1.2.0 |
| Set build | Environment Variables → BUILD_NUMBER | 127 |
| iOS only | Environment Variables → IOS_BUILD_NUMBER | 128 |
| Android only | Environment Variables → ANDROID_VERSION_CODE | 126 |

---

## Support & Resources

- **Capawesome Docs:** https://capawesome.io/docs/
- **Dashboard:** https://cloud.capawesome.io/
- **Support:** support@capawesome.io
- **PitBox Contact:** pitboxcom@gmail.com

---

## Related Documents

- [VERSION_MANAGEMENT_GUIDE.md](./VERSION_MANAGEMENT_GUIDE.md) - Complete version management guide
- [VERSION_QUICK_REFERENCE.md](./VERSION_QUICK_REFERENCE.md) - Quick command reference
- [capawesome.yml.example](./capawesome.yml.example) - Configuration file example
