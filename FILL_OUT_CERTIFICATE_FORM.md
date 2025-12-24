# How to Fill Out the Capawesome Certificate Form

You're looking at the certificate upload form. Here's exactly what to do:

## FIRST: Create Your Keystore (If You Don't Have One)

You need to create the keystore file on your **local computer** first. Open Terminal (Mac/Linux) or Command Prompt (Windows):

```bash
# Navigate to a safe directory (NOT your project folder)
cd ~/Documents

# Create the keystore
keytool -genkey -v -keystore pitbox-release.keystore \
  -alias pitbox \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype JKS
```

**Answer the prompts:**
- **Keystore password**: Create a strong password (minimum 8 chars) - WRITE THIS DOWN!
- **Re-enter password**: Same password
- **First and last name**: Your name or "PitBox Development"
- **Organizational unit**: "PitBox" or "Development"
- **Organization**: "PitBox" or your company name
- **City**: Your city
- **State**: Your state/province
- **Country code**: US (or your 2-letter country code)
- **Is this correct?**: yes
- **Key password**: Press ENTER to use same as keystore password

**CRITICAL:** Write down these values immediately:
```
File: pitbox-release.keystore
Keystore Password: ___________________________
Key Alias: pitbox
Key Password: _____________________________ (same as keystore)
```

## THEN: Fill Out the Capawesome Form

Now fill out the form with these values:

### 1. Name
```
pitbox-production
```
*This is just a friendly name for Capawesome to identify your certificate*

### 2. Platform
```
Android ✓ (already selected)
```

### 3. Type
**Change this to: `Production` or `Release`**
*Not "Development" - you want a production certificate for the real app store*

### 4. Choose a Keystore File
- Click "Choose a Keystore File"
- Navigate to `~/Documents/pitbox-release.keystore`
- Select the file

### 5. Keystore Password
```
[Enter the password you created above]
```
*The password you entered when creating the keystore*

### 6. Key Alias
```
pitbox
```
*This is the alias you specified in the keytool command*

### 7. Key Password
```
[Same password as Keystore Password]
```
*If you pressed ENTER when asked for key password, it's the same as keystore password*

## Complete Form Example

```
Name:                 pitbox-production
Platform:             Android
Type:                 Production (or Release)
Keystore File:        pitbox-release.keystore
Keystore Password:    YourStrongPassword123!
Key Alias:            pitbox
Key Password:         YourStrongPassword123!
```

## After Uploading

Click **Save** or **Upload**, and Capawesome will:
1. Verify the keystore is valid
2. Store it securely
3. Use it automatically for all release builds

## If You Don't Have Java/Keytool

If the `keytool` command doesn't work on your computer:

**Option 1:** Install Java JDK
- Windows: Download from [Oracle](https://www.oracle.com/java/technologies/downloads/)
- Mac: `brew install openjdk@17`
- Linux: `sudo apt install openjdk-17-jdk`

**Option 2:** Use Android Studio (if installed)
- Build → Generate Signed Bundle/APK
- Create new keystore
- Follow the GUI wizard

**Option 3:** Ask Capawesome to Generate
- Look for "Generate Certificate" button in Capawesome dashboard
- They'll create one for you
- Download and backup the generated certificate

## IMPORTANT: Backup Your Keystore!

After creating the keystore, **immediately** backup:
1. The `pitbox-release.keystore` file
2. The passwords you wrote down

Save to:
- Password manager (1Password, LastPass, Bitwarden)
- Encrypted cloud storage (Google Drive, Dropbox)
- External USB drive

**If you lose this file or passwords, you can NEVER update your app!**

## Need Help?

If you get stuck:
- Check if `keytool` is installed: `keytool -help`
- Check if Java is installed: `java -version`
- Make sure you're in the right directory: `pwd`
- Verify file was created: `ls -la pitbox-release.keystore`

---

**Once uploaded, come back and I'll help you trigger your first production build!**
