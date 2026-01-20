# Windows Manual Steps - Switch to App Store Connect API

## If PowerShell Script Fails, Do This Manually

**You're on Windows, so follow these Windows-specific commands.**

---

## Step 1: Get Apple Credentials

Go to: **https://appstoreconnect.apple.com** → Users and Access → Keys

Get these three things:
1. **Issuer ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (at top of page)
2. **Key ID**: `ABC123XYZ` (next to your key)
3. **AuthKey_ABC123.p8**: Download it (only downloadable once!)

---

## Step 2: Login to Capawesome CLI

Open **PowerShell** (not Command Prompt) and run:

```powershell
npx @capawesome/cli login
```

Follow the login prompts.

---

## Step 3: List Current Destinations

```powershell
npx @capawesome/cli apps:store-destinations:list --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8
```

You should see your current destination: `5cea5914-4a94-4f14-82f8-15b65c9275b7`

---

## Step 4: Delete Old Destination (Optional)

```powershell
npx @capawesome/cli apps:store-destinations:delete --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --store-destination-id 5cea5914-4a94-4f14-82f8-15b65c9275b7
```

---

## Step 5: Create New API Key Destination

**IMPORTANT: This is ONE command split across multiple lines for readability.**

In **PowerShell**, run:

```powershell
$P8Content = Get-Content -Path "C:\Users\YourName\Downloads\AuthKey_ABC123.p8" -Raw

npx @capawesome/cli apps:store-destinations:create `
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 `
  --platform ios `
  --bundle-id com.pitbox.app `
  --app-store-connect-issuer-id "YOUR_ISSUER_ID_HERE" `
  --app-store-connect-key-id "YOUR_KEY_ID_HERE" `
  --app-store-connect-private-key "$P8Content"
```

**Replace:**
- `C:\Users\YourName\Downloads\AuthKey_ABC123.p8` with your actual file path
- `YOUR_ISSUER_ID_HERE` with your Issuer ID
- `YOUR_KEY_ID_HERE` with your Key ID

**Example with real values:**

```powershell
# First, load the .p8 file content
$P8Content = Get-Content -Path "C:\Users\John\Downloads\AuthKey_8QCP3F8NV6.p8" -Raw

# Then create the destination
npx @capawesome/cli apps:store-destinations:create `
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 `
  --platform ios `
  --bundle-id com.pitbox.app `
  --app-store-connect-issuer-id "69a6de8e-2aeb-47ad-9b32-eba64a9a19a8" `
  --app-store-connect-key-id "8QCP3F8NV6" `
  --app-store-connect-private-key "$P8Content"
```

---

## Step 6: Copy the New Destination ID

The command will output something like:

```
✓ Successfully created store destination
  ID: 12345678-1234-1234-1234-123456789012
```

**COPY THAT ID!** You need it for the next step.

---

## Step 7: Update capawesome.config.json

Open `capawesome.config.json` in a text editor.

Find this line (around line 54):

```json
"destinationId": "5cea5914-4a94-4f14-82f8-15b65c9275b7",
```

Replace it with your NEW destination ID:

```json
"destinationId": "12345678-1234-1234-1234-123456789012",
```

Save the file.

---

## Step 8: Verify

Run:

```powershell
npx @capawesome/cli apps:store-destinations:list --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8
```

You should now see your NEW destination with "App Store Connect API" authentication method.

---

## ✅ Done!

Now you can build and upload:

```powershell
npm run build:ci:ios
npm run capawesome:build:ios
```

---

## Common Windows Issues

### ❌ "bash: command not found"
- You're in Command Prompt, not PowerShell
- Open **PowerShell** instead

### ❌ ".p8 file not found"
- Use full Windows path with backslashes: `C:\Users\...\file.p8`
- Or forward slashes: `C:/Users/.../file.p8`
- Make sure you put the path in quotes if it has spaces

### ❌ "Private key is invalid"
- The .p8 file content must include the BEGIN/END lines
- Don't manually type it - let PowerShell read the file with `Get-Content`

### ❌ PowerShell won't run the script
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then try again

---

## TL;DR Windows Version

1. **PowerShell** (not CMD)
2. `npx @capawesome/cli login`
3. Load .p8: `$P8Content = Get-Content -Path "path\to\your\file.p8" -Raw`
4. Create destination with your Issuer ID, Key ID, and `"$P8Content"`
5. Copy new destination ID from output
6. Edit `capawesome.config.json` and replace the old `destinationId`
7. Done

---

## Or Just Run the PowerShell Script

```powershell
.\WINDOWS-SWITCH-TO-API-KEY.ps1
```

It does everything automatically.
