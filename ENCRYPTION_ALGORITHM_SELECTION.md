# App Encryption Algorithm Selection Guide

## Question 2: Which encryption algorithms does your app implement?

Apple is asking you to select from:
- ☐ Encryption algorithms that are proprietary or not accepted as standard by international standard bodies (IEEE, IETF, ITU etc.)
- ☐ Standard encryption algorithms instead of, or in addition to, using or accessing the encryption within Apple's operating system

---

## ✅ CORRECT ANSWER: Select NEITHER Option

**DO NOT CHECK ANY BOXES**

### Why?

Your app **does not implement** any encryption algorithms. Your app only **uses** encryption that is already provided by:

1. **Apple's iOS networking stack** (HTTPS/TLS)
2. **Apple's iOS secure storage** (Keychain, file encryption)
3. **Supabase client library** (which uses the above)

You are **accessing** Apple's encryption, not **implementing** your own.

---

## ❌ Option 1: Proprietary or Non-Standard Encryption

**DO NOT SELECT THIS**

Your app does NOT:
- Implement custom/proprietary encryption algorithms
- Use encryption algorithms not accepted by IEEE, IETF, ITU
- Create its own encryption methods

---

## ❌ Option 2: Standard Encryption Algorithms

**DO NOT SELECT THIS**

This option is for apps that **implement** their own encryption using standard algorithms like:
- AES encryption manually implemented in your code
- RSA encryption manually implemented in your code
- Custom implementation of TLS/SSL
- End-to-end encryption implemented by your app

Your app does **NONE** of these. You only use Apple's built-in implementations.

---

## 🤔 What If Apple Forces Me to Select Something?

If the form won't let you proceed without selecting an option (rare), then:

### Choose: Option 2 (Standard Encryption)

Then provide this explanation:

```
Our app uses only the standard HTTPS/TLS encryption provided by
Apple's iOS URLSession networking framework for secure communication
with our backend API. We do not implement any encryption algorithms
ourselves. We solely rely on and access the encryption capabilities
built into iOS. All cryptographic operations are performed by Apple's
operating system, not by our application code.

Our app qualifies for encryption export exemption under Category 5,
Part 2 (e)(2) of the U.S. Export Administration Regulations as we
only use encryption for authentication and secure data transmission
via standard HTTPS protocols provided by the operating system.
```

---

## 📋 Complete Flow

**Question 1:** "Is your app designed to use cryptography or does it contain or incorporate cryptography?"
→ **Answer:** NO *(preferred)* or YES *(if forced)*

**Question 2:** "Select which encryption algorithms does your app implement:"
→ **Answer:** NEITHER *(leave unchecked)* or Standard Encryption *(if forced)*

**Question 3:** "Does your app qualify for any exemptions?"
→ **Answer:** YES (if you had to answer YES to Q1)
→ **Select:** Category 5, Part 2 exemptions (e)(2)

---

## 🎯 Key Points to Remember

1. **"Implement"** means YOU wrote the encryption code
2. **"Use"** or **"Access"** means you call iOS APIs that handle encryption
3. PitBox **USES** encryption, it does **NOT IMPLEMENT** encryption
4. Think of it like this:
   - ❌ You didn't write encryption code
   - ✅ You call `URLSession` which Apple wrote
   - ✅ Apple's code handles all encryption

---

## 💬 If Apple Asks for Clarification

**Question:** "What encryption does your app use?"

**Response:**
```
PitBox uses the standard HTTPS/TLS encryption provided by Apple's
URLSession framework for all network communication with our Supabase
backend API. We do not implement any encryption algorithms in our
application code. All encryption is handled by iOS system frameworks.

Technical details:
- Network requests: URLSession with HTTPS (iOS native)
- API communication: Supabase JavaScript client (uses URLSession)
- Local storage: iOS Keychain and file system encryption (iOS native)
- No custom cryptographic code in our application

We qualify for encryption export exemption because we only access
encryption provided by Apple's operating system and use standard
HTTPS for authentication and data transmission.
```

---

## ✅ Summary

| Question | Answer |
|----------|--------|
| Does your app use cryptography? | **NO** (preferred) |
| Proprietary encryption? | **NO** (unchecked) |
| Standard encryption algorithms? | **NO** (unchecked) |
| Qualifies for exemption? | **YES** (if asked) |
| Need documentation? | **NO** |

---

## 🚀 You're All Set!

- Leave both checkboxes **UNCHECKED**
- If forced to select, choose **Option 2** and provide the explanation above
- Either way, you qualify for exemption
- No documentation needed

Apple will approve your submission! ✅
