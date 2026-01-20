# How to Get App Store Connect API Credentials

## The Answer to "Where the hell is it?"

**IT'S NOT IN CAPAWESOME.** You get these from Apple, then you give them to Capawesome via CLI.

---

## Get Your Credentials from Apple (5 minutes)

### Step 1: Go to App Store Connect
URL: **https://appstoreconnect.apple.com**

### Step 2: Click "Users and Access"
- Top right corner
- Blue icon with two people

### Step 3: Click "Keys" Tab
- You'll see tabs: Users | Keys | API Keys | In-App Purchase
- Click **"Keys"**

### Step 4: Get the Issuer ID
- At the TOP of the page, you'll see:
  ```
  Issuer ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  ```
- **COPY THIS** - You need it for Capawesome

### Step 5: Create or Find Your API Key

**If you already have a key:**
- Find it in the list
- Copy the **Key ID** (looks like: ABC123XYZ)
- If you already downloaded the .p8 file, great! If not, you CAN'T download it again. You'll need to create a new one.

**If you need to create a new key:**
1. Click the **"+"** button (Generate API Key)
2. Name it: **"Capawesome iOS Build"**
3. Access: Check **"App Manager"** (required for uploads)
4. Click **"Generate"**
5. **IMMEDIATELY DOWNLOAD THE .p8 FILE**
   - You can ONLY download it ONCE
   - If you lose it, you have to revoke the key and create a new one
6. Copy the **Key ID** (shown next to the key name)

---

## What You'll Have

After following the steps above, you should have:

1. **Issuer ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. **Key ID**: `ABCD1234XY` (10 characters)
3. **File**: `AuthKey_ABCD1234XY.p8` (downloaded file)

---

## Now Give Them to Capawesome

Run this command:

```bash
npx @capawesome/cli apps:store-destinations:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --bundle-id com.pitbox.app \
  --app-store-connect-issuer-id "YOUR_ISSUER_ID_HERE" \
  --app-store-connect-key-id "YOUR_KEY_ID_HERE" \
  --app-store-connect-private-key "$(cat AuthKey_XXXXX.p8)"
```

**Replace:**
- `YOUR_ISSUER_ID_HERE` with the Issuer ID you copied
- `YOUR_KEY_ID_HERE` with the Key ID you copied
- `AuthKey_XXXXX.p8` with your actual filename

---

## Or Use the Interactive Script

Just run:
```bash
bash SWITCH_TO_API_KEY_NOW.sh
```

It will ask you for each value step by step.

---

## Visual Guide

```
┌─────────────────────────────────────────────────────┐
│ App Store Connect                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [My Apps]  [TestFlight]  [Users and Access] ← HERE │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Users and Access                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Users]  [Keys] ← HERE  [API Keys]  [In-App]      │
│                                                     │
│  Issuer ID: 12345678-1234-1234-1234-123456789012  ← COPY THIS│
│                                                     │
│  Active Keys:                                       │
│  ┌───────────────────────────────────────────┐     │
│  │ Name: Capawesome iOS Build                │     │
│  │ Key ID: ABC123XYZ  ← COPY THIS            │     │
│  │ [Download .p8] ← DO THIS IMMEDIATELY      │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  [+ Generate API Key]                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Common Mistakes

### ❌ "I can't find the Keys tab"
- Make sure you're logged into App Store Connect (not Developer Portal)
- URL should be: **appstoreconnect.apple.com**
- Not: developer.apple.com

### ❌ "I lost my .p8 file"
- You can't download it again
- Revoke the old key and create a new one

### ❌ "Where do I put these in Capawesome's website?"
- **You don't.** There's no UI for it.
- You MUST use the CLI commands

### ❌ "The command failed"
- Make sure you're logged into Capawesome CLI first:
  ```bash
  npx @capawesome/cli login
  ```

---

## TL;DR

1. **Go here**: https://appstoreconnect.apple.com → Users and Access → Keys
2. **Copy**: Issuer ID (top of page)
3. **Copy**: Key ID (next to your key)
4. **Download**: .p8 file (only chance!)
5. **Run**: `bash SWITCH_TO_API_KEY_NOW.sh`
6. **Done**

No web UI. CLI only. That's why you can't find it.
