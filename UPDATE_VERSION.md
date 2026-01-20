# 🔢 How to Update Version & Build Numbers

## The Problem You Had

**Your build wasn't showing up in App Store Connect because:**
- Your `buildNumber` was set to `98`
- Apple already had build 98 uploaded
- **Apple silently rejects duplicate build numbers** - no error, just doesn't show up

---

## ✅ FIXED: Updated to Build 99

I've updated your config to:
```json
"version": "3.0.0",
"buildNumber": "99",
```

---

## 📋 How Version Numbers Work

### For iOS (in capawesome.config.json)

```json
"ios": {
  "version": "3.0.0",        ← Marketing version (what users see)
  "buildNumber": "99",       ← Build number (must be unique & increment)
}
```

**Rules:**
1. **version** = User-facing version (e.g., 3.0.0, 3.0.1, 3.1.0, 4.0.0)
   - Can be same across multiple builds
   - Only change when you release a new version to users

2. **buildNumber** = Internal build number (e.g., 99, 100, 101, 102)
   - **MUST be unique for EVERY upload**
   - **MUST always increment** (can't go backwards)
   - Each time you upload to Apple, increment this by 1
   - Never reuse a build number

---

## 🚀 Before Each Upload

**EVERY TIME you run `npm run capawesome:build:ios`, you MUST:**

### Step 1: Open `capawesome.config.json`

### Step 2: Increment the buildNumber
```json
Before:  "buildNumber": "99",
After:   "buildNumber": "100",    ← Add 1 to the number
```

### Step 3: Save the file

### Step 4: Build
```bash
npm run capawesome:build:ios
```

---

## 📝 Version Update Examples

### Example 1: Testing Fixes (Same Version, Different Builds)
```json
Upload 1: "version": "3.0.0", "buildNumber": "99"
Upload 2: "version": "3.0.0", "buildNumber": "100"  ← Same version, new build
Upload 3: "version": "3.0.0", "buildNumber": "101"  ← Same version, new build
```

### Example 2: New Release Version
```json
Old: "version": "3.0.0", "buildNumber": "101"
New: "version": "3.1.0", "buildNumber": "102"  ← New version, increment build
```

### Example 3: Major Version
```json
Old: "version": "3.1.0", "buildNumber": "150"
New: "version": "4.0.0", "buildNumber": "151"  ← New major version, increment build
```

---

## 🎯 Your Current Setup

**File Location:** `/tmp/cc-agent/41299875/project/capawesome.config.json`

**Current Values:**
- Version: `3.0.0`
- Build Number: `99` ← **Start here, increment for each upload**

---

## 🔄 Quick Reference

| What Are You Doing? | What to Change |
|---------------------|----------------|
| Fixing a bug and re-uploading | Increment buildNumber only (99 → 100) |
| Testing new features | Increment buildNumber only (100 → 101) |
| Releasing to public (minor update) | Increment version to 3.1.0, increment buildNumber |
| Releasing to public (major update) | Increment version to 4.0.0, increment buildNumber |

---

## ⚠️ Common Mistakes

❌ **Wrong:** Uploading same buildNumber twice
```json
Upload 1: "buildNumber": "99"
Upload 2: "buildNumber": "99"  ← WILL NOT SHOW IN APP STORE CONNECT
```

✅ **Correct:** Always increment
```json
Upload 1: "buildNumber": "99"
Upload 2: "buildNumber": "100"  ← Shows up in App Store Connect
```

❌ **Wrong:** Going backwards
```json
Before: "buildNumber": "105"
After:  "buildNumber": "104"  ← WILL BE REJECTED
```

✅ **Correct:** Always go up
```json
Before: "buildNumber": "105"
After:  "buildNumber": "106"  ← Works perfectly
```

---

## 🎬 Your Next Build

1. Open `capawesome.config.json`
2. Find line 13: `"buildNumber": "99",`
3. Change to: `"buildNumber": "100",`
4. Save
5. Run: `npm run capawesome:build:ios`
6. **Build will show up in App Store Connect!**

---

## 📱 Checking App Store Connect

After upload (takes 5-10 minutes):

1. Go to: https://appstoreconnect.apple.com/apps/6757286830/appstore
2. Click **TestFlight** tab
3. Look under **Builds** section
4. You should see: **Version 3.0.0 (99)** ← Your build!

If you don't see it after 10 minutes and build succeeded:
- ❌ You used a duplicate buildNumber
- ✅ Increment the buildNumber and try again

---

## 💡 Pro Tip: Track Your Builds

Keep a note of what buildNumber you're on:

```
Build 99  - Fixed login bug
Build 100 - Added dark mode
Build 101 - Fixed crash on startup
Build 102 - Ready for TestFlight testers
Build 103 - Fixed tester feedback
Build 104 - SUBMITTED TO APP STORE
```

This helps you never lose track of which number to use next!

---

## ✅ Summary

**The Fix:**
- Changed buildNumber from `98` to `99`
- This build will now show up in App Store Connect

**Going Forward:**
- **ALWAYS increment buildNumber before each upload**
- Never reuse a build number
- Keep version the same unless releasing a new version to users

**Your next upload:**
- Change `"buildNumber": "99"` to `"buildNumber": "100"`
- Save and build
- Done!
