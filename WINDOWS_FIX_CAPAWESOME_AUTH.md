# Fix Capawesome Authentication (Windows)

Since you're on Windows, Capawesome is your ONLY way to upload to App Store. Here's how to fix the authentication:

## Option 1: Try Apple ID Auth Again (With Correct Settings)

1. **Go to Apple ID account page:**
   https://appleid.apple.com/account/manage

2. **Generate NEW App-Specific Password:**
   - Under "Sign-In and Security" → "App-Specific Passwords"
   - Click "+" to generate new one
   - Label it: "Capawesome Upload Dec 2024"
   - **Copy the password immediately** (shown only once)

3. **In Capawesome Dashboard:**
   - Go to: https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/settings
   - Find "iOS Destination" settings
   - Apple ID: mg91648@yahoo.com
   - Password: [paste the NEW app-specific password]
   - Save

4. **Try build again:**
   ```bash
   npm run capawesome:build:ios
   ```

## Option 2: Contact Capawesome Support About API Keys

If the Apple ID method keeps failing, **contact Capawesome support:**

**Email:** support@capawesome.io

**Subject:** "Need API Key Support for iOS App Store Upload (Windows User)"

**Message:**
```
Hi Capawesome Team,

I'm a Windows user trying to upload Build #103 of PitBox (App ID: 8251f381-4aed-4b20-ac20-a3aad250cbb8) to TestFlight.

The Apple ID + App-Specific Password authentication keeps failing. Since I'm on Windows, I don't have access to Mac-only tools like Transporter or Fastlane.

Questions:
1. Is there a way to configure App Store Connect API Key credentials instead of Apple ID?
2. If not in the UI, can this be configured via CLI or config file?
3. When will API key support be added to the dashboard?

This is blocking my app launch. Any help would be greatly appreciated!

Thanks,
[Your name]
```

## Option 3: Workaround - Build Only, Manual Upload Later

For now, you can:
1. Use Capawesome to BUILD the IPA (this works)
2. Download the .ipa file from Capawesome dashboard
3. Store it until you can access a Mac OR wait for Capawesome API key support
4. Upload later when you have access

## The Bottom Line:

On Windows, you **need** Capawesome's authentication to work because you can't use Mac-only Apple tools. If the Apple ID auth won't work and they don't support API keys yet, you'll need to either:
- Wait for Capawesome to add API key support
- Borrow a Mac for a few minutes to upload the IPA
- Use a cloud Mac service like MacStadium or AWS Mac instances (but that's expensive)

Contact their support - they may have a solution for Windows users.
