# Capawesome Code Signing Setup

Your app requires code signing for bundle uploads. This is a security feature to ensure only you can deploy updates.

## Quick Setup (3 Steps)

### Step 1: Get Your Signing Key from Capawesome Dashboard

1. Go to https://cloud.capawesome.io
2. Log in to your account
3. Select your app **"PitBox"** (App ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8)
4. Look for one of these menu options:
   - **"Keys"** (in left sidebar or top menu)
   - **"Security"** → **"Signing Keys"**
   - **"Settings"** → **"Code Signing"**
   - **"Bundles"** → **"Signing"**

5. Click **"Generate Key Pair"** or **"Create Signing Key"** or similar button
6. **Download the private key** (it will be a `.pem` file)
7. Copy the `.pem` file to your project root directory
8. Rename it to: `capawesome-signing-key.pem`

### Step 2: Verify the Key File Location

Your project structure should look like this:
```
project/
├── capawesome-signing-key.pem  ← Your private key here
├── package.json
├── capacitor.config.ts
└── ...
```

The key file is already in `.gitignore` so it won't be committed to version control.

### Step 3: Deploy Your Bundle

Now you can deploy with signing:
```bash
npm run deploy:bundle
```

That's it! The bundle will be signed automatically.

## Alternative Locations

If the dashboard UI is different, try these locations:

### Option A: App Settings
1. Click on your app
2. Go to **Settings** (gear icon)
3. Look for **"Code Signing"** or **"Bundle Signing"**
4. Generate or download key

### Option B: Keys Tab
1. Click on your app
2. Look for a **"Keys"** tab at the top
3. Generate a new signing key
4. Download the private key

### Option C: Security Section
1. Click on your app
2. Go to **Security** section
3. Find **"Signing Keys"**
4. Generate and download

### Option D: API Keys
1. Sometimes signing keys are in the same place as API keys
2. Look for **"API Keys"** or **"Credentials"**
3. There might be a separate section for signing keys

## Troubleshooting

### Can't Find Signing Key Option?

If you can't find where to generate the key, try:

1. **Contact Capawesome Support**
   - Email: support@capawesome.io
   - Or use the chat widget on their website

2. **Check the Documentation**
   - https://capawesome.io/cloud/docs
   - Look for "Code Signing" or "Bundle Signing"

3. **Use the CLI to generate a key**
   ```bash
   openssl genpkey -algorithm RSA -out capawesome-signing-key.pem -pkeyopt rsa_keygen_bits:2048
   ```
   Then upload the public key to Capawesome dashboard (if this option is available)

### Error: "Private key not found"

Make sure the file is named exactly:
```
capawesome-signing-key.pem
```

And it's in the project root directory (same level as package.json).

### Error: "Invalid signature"

This means the key doesn't match what's registered in the Capawesome dashboard. Make sure you:
1. Downloaded the correct private key
2. The key is for the correct app (App ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8)

## Manual Signing (Alternative)

If you prefer to sign manually without the npm script:

```bash
# Build first
npm run build

# Then upload with signing
npx @capawesome/cli apps:bundles:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --path dist \
  --private-key-path ./capawesome-signing-key.pem
```

## Security Notes

- **NEVER commit the `.pem` file to git** (it's already in .gitignore)
- **Keep a backup** of your signing key in a secure location
- **Don't share** your private key with anyone
- If you lose the key, you'll need to generate a new one and update it in the dashboard

## What's Changed

1. ✅ Updated `package.json` with new `deploy:bundle` script that includes signing
2. ✅ Added `capawesome-signing-key.pem` to `.gitignore`
3. ✅ Created this guide

## Next Steps

1. Get your signing key from the Capawesome dashboard
2. Save it as `capawesome-signing-key.pem` in project root
3. Run `npm run deploy:bundle`
4. Your bundle will be uploaded with proper signing!
