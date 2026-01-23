# 🔧 COMPLETE Capawesome Cloud Setup Guide - Fix Version 1.0(1) Issue

## ❌ THE REAL PROBLEMS

1. **iOS/Android projects are incomplete/empty** - Native projects weren't fully generated
2. **No Git repository** - Capawesome Cloud REQUIRES a Git repo (GitHub, GitLab, etc.)
3. **capawesome.config.json was set to 125** - This overrides everything

## ✅ COMPLETE SOLUTION - Step by Step

### Step 1: Create Git Repository

Capawesome Cloud builds from YOUR Git repository. You MUST have your code on GitHub, GitLab, or Bitbucket.

```bash
# If you don't have Git yet:
# 1. Go to GitHub.com
# 2. Create new repository called "pitbox-app"
# 3. Get the repository URL (e.g., https://github.com/yourusername/pitbox-app.git)

# Then in your project:
git init
git add .
git commit -m "Initial commit - PitBox app"
git branch -M main
git remote add origin YOUR_GITHUB_URL_HERE
git push -u origin main
```

### Step 2: Link Capawesome to Your Git Repository

```bash
# Log into Capawesome Dashboard: https://cloud.capawesome.io
# Go to your PitBox app settings
# Under "Git Integration":
#   - Connect your GitHub/GitLab account
#   - Select the pitbox-app repository
#   - Set branch to "main"
```

### Step 3: Fix Version in ALL 4 Places

The version MUST be consistent in 4 files:

#### 3a. capawesome.config.json (MOST IMPORTANT)
```json
{
  "build": {
    "platforms": {
      "ios": {
        "buildCommand": "...Set :CFBundleVersion 126...",  // ← Must say 126
        "buildNumber": "126",  // ← Must say 126
      },
      "android": {
        "versionCode": 126  // ← Must say 126
      }
    }
  }
}
```

#### 3b. ios/App/App.xcodeproj/project.pbxproj
```
CURRENT_PROJECT_VERSION = 126;
MARKETING_VERSION = 1.1.0;
```

#### 3c. android/app/build.gradle
```gradle
versionCode 126
versionName "1.1.0"
```

#### 3d. package.json
```json
"version": "1.1.0"
```

### Step 4: Commit Version Changes

```bash
# Commit the updated version files
git add capawesome.config.json ios/ android/ package.json .gitignore
git commit -m "Set version to 1.1.0 (126)"
git push
```

### Step 5: Build with Capawesome

```bash
# Now build - it will pull from your Git repo
npm run capawesome:build:ios
```

Capawesome will:
1. Clone your Git repo (with ios/android folders)
2. Read version 126 from capawesome.config.json
3. Run the build command which sets it to 126
4. Upload with correct version

### Step 6: Verify It Worked

Check the Capawesome dashboard - you should see:
- **iOS**: Version 1.1.0 (126)
- **Android**: Version 1.1.0 (126)

## 🔄 For Next Build (127, 128, etc.)

1. Update `capawesome.config.json`:
   - Change buildCommand: `Set :CFBundleVersion 127`
   - Change buildNumber: `"127"`
   - Change versionCode: `127`

2. Update native projects:
   - iOS: `ios/App/App.xcodeproj/project.pbxproj`
   - Android: `android/app/build.gradle`

3. Commit and push:
   ```bash
   git add .
   git commit -m "Bump to build 127"
   git push
   ```

4. Build:
   ```bash
   npm run capawesome:build:ios
   ```

## 📋 Pre-Flight Checklist

Before each Capawesome build, verify:

- [ ] Code is committed to Git
- [ ] Code is pushed to GitHub/GitLab
- [ ] capawesome.config.json has correct build number
- [ ] ios/App/App.xcodeproj/project.pbxproj has correct CURRENT_PROJECT_VERSION
- [ ] android/app/build.gradle has correct versionCode
- [ ] All changes are committed and pushed

## 🎯 Why This Matters

**Capawesome Cloud does NOT use your local files!**

It:
1. Clones from your Git repository
2. Reads capawesome.config.json for build settings
3. Runs the buildCommand which sets the version
4. Builds and uploads

If your Git repo is:
- Missing ios/android folders → Generates defaults (version 1.0.1)
- Has old version numbers → Uses old version
- Not updated → Builds old code

**YOU MUST COMMIT AND PUSH BEFORE BUILDING!**

## 🆘 If Still Showing 1.0(1)

1. Check what's in your Git repo:
   ```bash
   git log --oneline -1  # Check last commit
   git ls-files | grep -E "ios/|android/"  # Verify ios/android are tracked
   ```

2. Check Capawesome is pointing to correct repo:
   - Log into cloud.capawesome.io
   - Check Git integration settings
   - Verify it's pointing to the right repository and branch

3. Check capawesome.config.json in your Git repo:
   ```bash
   git show HEAD:capawesome.config.json | grep -E "buildNumber|versionCode"
   ```

4. Re-push everything:
   ```bash
   git add -A
   git commit -m "Force update all files"
   git push --force
   ```

## 📞 Still Having Issues?

The problem is ALWAYS one of these:
1. Git repository not connected to Capawesome
2. Latest code not pushed to Git
3. capawesome.config.json has old version number
4. ios/android folders not in Git (gitignored)

Check these 4 things and you'll find the issue.
