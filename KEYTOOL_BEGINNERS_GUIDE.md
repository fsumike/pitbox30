# Keytool Beginner's Guide - Never Used It? No Problem!

## What is Keytool?

`keytool` is a command-line program that comes with Java. It creates digital certificates that prove your Android app is really from you. Think of it like a digital signature.

**You need it to publish your app on Google Play Store.**

## Step 1: Check If You Have Keytool

Open your Terminal (Mac/Linux) or Command Prompt (Windows):

**Mac:**
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

**Windows:**
- Press `Win + R`
- Type "cmd"
- Press Enter

**Linux:**
- Press `Ctrl + Alt + T`

Now type this command and press Enter:

```bash
keytool -version
```

### If It Works:
You'll see something like:
```
keytool version 17.0.1
```
✅ **Great! Skip to Step 3.**

### If It Doesn't Work:
You'll see:
```
'keytool' is not recognized as an internal or external command
```
or
```
command not found: keytool
```
❌ **No problem! Go to Step 2.**

## Step 2: Install Java (If Keytool Didn't Work)

Keytool comes with Java, so we need to install Java first.

### Mac (Easiest Way)

**Option A: Using Homebrew (Recommended)**

If you have Homebrew installed:
```bash
brew install openjdk@17
```

Then add it to your path:
```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Option B: Manual Download**
1. Go to https://adoptium.net/
2. Click "Download" for the latest version
3. Open the downloaded file
4. Follow the installation wizard
5. Close and reopen Terminal

### Windows

1. Go to https://adoptium.net/
2. Click "Download" (it will auto-detect Windows)
3. Open the downloaded `.msi` file
4. Click "Next" through the installer
5. **IMPORTANT:** Check the box "Add to PATH"
6. Click "Install"
7. Close and reopen Command Prompt

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### Verify Java is Installed

Close and reopen your Terminal/Command Prompt, then run:

```bash
java -version
```

You should see:
```
openjdk version "17.0.x"
```

Now try keytool again:
```bash
keytool -version
```

✅ **It should work now!**

## Step 3: Create Your Android Keystore

Now that keytool works, let's create your certificate!

### Step 3.1: Choose a Safe Location

First, go to a safe folder to store your keystore:

```bash
cd ~/Documents
```

### Step 3.2: Run the Keytool Command

Copy and paste this ENTIRE command:

```bash
keytool -genkey -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000 -storetype JKS
```

**What this command means:**
- `genkey` = generate a new key
- `-keystore pitbox-release.keystore` = name the file "pitbox-release.keystore"
- `-alias pitbox` = give it a nickname "pitbox"
- `-keyalg RSA` = use RSA encryption (standard)
- `-keysize 2048` = make it 2048 bits strong
- `-validity 10000` = valid for 10,000 days (~27 years)
- `-storetype JKS` = Java KeyStore format

### Step 3.3: Answer the Questions

Keytool will ask you questions. Here's what to type:

#### Question 1: Enter keystore password
```
Type a strong password (at least 8 characters)
Example: PitBox2024Secure!

⚠️ WRITE THIS DOWN IMMEDIATELY!
```

#### Question 2: Re-enter new password
```
Type the SAME password again
```

#### Question 3: What is your first and last name?
```
Type: PitBox Development Team

(or your actual name - doesn't matter much)
```

#### Question 4: What is the name of your organizational unit?
```
Type: Development

(or just press Enter to skip)
```

#### Question 5: What is the name of your organization?
```
Type: PitBox

(or your company name, or press Enter)
```

#### Question 6: What is the name of your City or Locality?
```
Type: Your City Name

(or press Enter to skip)
```

#### Question 7: What is the name of your State or Province?
```
Type: Your State

(or press Enter to skip)
```

#### Question 8: What is the two-letter country code?
```
Type: US

(or your country code: UK, CA, AU, etc.)
```

#### Question 9: Is this correct?
```
Type: yes

(or press Enter)
```

#### Question 10: Enter key password
```
Just press ENTER

This will use the same password as your keystore password
```

### Step 3.4: Done!

You should see:
```
Generating 2,048 bit RSA key pair and self-signed certificate...
[Storing pitbox-release.keystore]
```

✅ **Success! Your keystore is created!**

## Step 4: Verify Your Keystore Was Created

Check that the file exists:

**Mac/Linux:**
```bash
ls -la ~/Documents/pitbox-release.keystore
```

**Windows:**
```bash
dir %USERPROFILE%\Documents\pitbox-release.keystore
```

You should see the file listed with a size (usually around 2-3 KB).

## Step 5: Write Down Your Information

**CRITICAL:** Write this down RIGHT NOW before you forget:

```
===========================================
PITBOX KEYSTORE INFORMATION
⚠️ KEEP THIS SAFE - YOU'LL NEVER GET IT BACK!
===========================================

File Location: ~/Documents/pitbox-release.keystore

Keystore Password: _________________________

Key Alias: pitbox

Key Password: _________________________
(same as keystore password if you pressed ENTER)

Date Created: [Today's Date]

===========================================
```

## Step 6: Backup Your Keystore

**IMMEDIATELY** back up this file to multiple places:

1. **USB Drive:** Copy to a USB stick
2. **Cloud Storage:** Upload to Google Drive/Dropbox/OneDrive
3. **Password Manager:** Save passwords in 1Password/LastPass/Bitwarden
4. **Email:** Email the file to yourself (less secure but better than nothing)

**Why this is critical:**
- If you lose this file, you can NEVER update your app on Google Play
- Google will think updates are from a different developer
- You'll have to create a new app listing and lose all your users

## Step 7: Upload to Capawesome

Now go back to the Capawesome form and fill it out:

| Field | What to Type |
|-------|--------------|
| **Name** | `pitbox-production` |
| **Platform** | `Android` (already selected) |
| **Type** | Change to `Production` |
| **Keystore File** | Click "Choose File" → select `pitbox-release.keystore` |
| **Keystore Password** | Your password from Step 3.3 |
| **Key Alias** | `pitbox` |
| **Key Password** | Same as keystore password |

Click **Save** or **Upload**.

## Troubleshooting

### "keytool: command not found" (after installing Java)

Close and reopen your Terminal/Command Prompt completely, then try again.

### "keytool error: java.lang.Exception: Key pair not generated"

You might have pressed Ctrl+C by accident. Just run the command again.

### "Invalid keystore format"

You might have specified the wrong storetype. Try this command instead:
```bash
keytool -genkey -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000
```
(removed `-storetype JKS`)

### Forgot where you saved the keystore

Search for it:

**Mac:**
```bash
find ~ -name "pitbox-release.keystore"
```

**Windows:**
```bash
dir /s %USERPROFILE%\pitbox-release.keystore
```

### Want to see information about your keystore

```bash
keytool -list -v -keystore ~/Documents/pitbox-release.keystore
```

(It will ask for your password)

## Quick Reference Card

Save this for later:

```bash
# Check keytool version
keytool -version

# Create keystore (one command)
cd ~/Documents && keytool -genkey -v -keystore pitbox-release.keystore -alias pitbox -keyalg RSA -keysize 2048 -validity 10000 -storetype JKS

# View keystore info
keytool -list -v -keystore ~/Documents/pitbox-release.keystore

# Find keystore file
# Mac/Linux:
find ~ -name "pitbox-release.keystore"
# Windows:
dir /s %USERPROFILE%\pitbox-release.keystore
```

---

**Need more help?** Come back and let me know where you got stuck!
