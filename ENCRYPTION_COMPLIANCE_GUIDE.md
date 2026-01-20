# App Encryption Compliance Guide for PitBox

## Quick Answer: Your App is EXEMPT ✅

Your app uses **standard encryption** provided by Apple's iOS and HTTPS/TLS for API calls. You do NOT need to provide encryption export documentation.

---

## What Encryption Does PitBox Use?

1. **HTTPS/TLS** - For Supabase API calls (standard encryption)
2. **Apple's iOS Encryption** - For local data storage (standard encryption)
3. **No proprietary encryption algorithms**
4. **No custom encryption implementations**

**Result:** You qualify for encryption export exemption!

---

## Step 1: Update Info.plist (iOS Project)

You need to add a key to your iOS project's `Info.plist` file to avoid being asked about encryption on every submission.

### Option A: Manual Edit (When You Have the iOS Project)

1. Open your iOS project in Xcode
2. Navigate to: `ios/App/App/Info.plist`
3. Right-click on the file → **"Open As"** → **"Source Code"**
4. Add this key anywhere inside the `<dict>` tags:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

**Complete Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>

    <!-- Add this line -->
    <key>ITSAppUsesNonExemptEncryption</key>
    <false/>

    <!-- Rest of your Info.plist -->
</dict>
</plist>
```

### Option B: Create a Template File (For Future Builds)

Since you're building remotely with Capawesome, create this template file.

**File:** `ios/App/App/Info.plist` (create if it doesn't exist)

Add the encryption key to the template.

---

## Step 2: Answer in App Store Connect

When submitting your app, you'll be asked: **"Does your app use encryption?"**

### Answer 1: Simple Approach (Recommended)
**"Is your app designed to use cryptography or does it contain or incorporate cryptography?"**
- Answer: **NO**

*Why?* Because you only use standard encryption provided by Apple's OS and HTTPS. This is the simplest and most common answer for apps like yours.

### Answer 2: Detailed Approach (If Required)
If you must answer "Yes":

**"Does your app use encryption?"**
- Answer: **YES**

**"Does your app qualify for any of the exemptions provided in Category 5, Part 2 of the U.S. Export Administration Regulations?"**
- Answer: **YES**

**Select all exemptions:**
- ✅ **(e)(2) - Uses encryption for authentication only**
- ✅ **(d) - Uses standard cryptography in addition to or in place of accessing the encryption within Apple's iOS**

---

## Step 3: What to Tell Apple (If Asked)

If Apple asks for more details, use this explanation:

```
PitBox uses only standard HTTPS/TLS encryption for secure communication
with our backend API (Supabase). We do not implement any proprietary
encryption algorithms or custom cryptography. All encryption used is
provided by Apple's iOS operating system and industry-standard protocols.

The app qualifies for encryption export exemption under Category 5,
Part 2 of the U.S. Export Administration Regulations because:
- We use encryption only for authentication and data transmission
- We use standard cryptography (HTTPS/TLS)
- We do not implement custom encryption algorithms
```

---

## Common Questions

### Q: Do I need an ERN (Encryption Registration Number)?
**A:** No. Your app is exempt.

### Q: Do I need to submit annual self-classification reports?
**A:** No. Your app is exempt.

### Q: What if I add Stripe payments?
**A:** Stripe also uses standard HTTPS/TLS encryption. You're still exempt.

### Q: What if I add push notifications?
**A:** Push notifications use Apple's standard encryption. You're still exempt.

### Q: What if I add in-app purchases?
**A:** In-app purchases use Apple's standard encryption. You're still exempt.

---

## When You WOULD Need Documentation

You would only need to provide encryption documentation if you:

❌ Implement custom encryption algorithms
❌ Use proprietary encryption not accepted by standards bodies
❌ Create your own encryption library
❌ Use military-grade or government-level encryption
❌ Implement end-to-end encryption with custom protocols

**PitBox does NONE of these.** ✅

---

## For Capawesome Cloud Build

If you're using Capawesome to build your iOS app, you can specify this in your build configuration:

**File:** `capawesome.config.json`

```json
{
  "appId": "8251f381-4aed-4b20-ac20-a3aad250cbb8",
  "builds": {
    "ios": {
      "exportOptions": {
        "uploadBitcode": false,
        "uploadSymbols": true,
        "compileBitcode": false
      }
    }
  }
}
```

However, the `Info.plist` setting is more important and handles this automatically.

---

## Testing Your Submission

1. **First Submission:** Apple will ask about encryption
2. **Answer:** Follow Step 2 above
3. **Future Submissions:** If you added the `Info.plist` key, you won't be asked again

---

## Final Checklist

- [ ] Add `ITSAppUsesNonExemptEncryption = false` to Info.plist (when you have iOS project)
- [ ] Know your answer: "No, my app doesn't use encryption" OR "Yes, but it's exempt"
- [ ] Have explanation ready (see Step 3)
- [ ] Don't worry - your app qualifies for exemption!

---

## Summary

**Your app is EXEMPT from encryption export compliance because:**
1. ✅ Uses only standard HTTPS/TLS
2. ✅ Uses Apple's built-in encryption
3. ✅ No proprietary algorithms
4. ✅ No custom cryptography

**You do NOT need to provide any encryption documentation.** Just answer "No" when asked if your app uses encryption, or select the exemptions if you answer "Yes."

---

**Need Help?**

If Apple's review team asks questions about encryption, respond with:
> "PitBox uses only standard HTTPS/TLS encryption for API communication with our backend (Supabase). We do not implement any proprietary or custom encryption algorithms. All encryption is provided by Apple's iOS and industry-standard protocols. We qualify for encryption export exemption."

They'll approve it immediately. ✅
