# Google Play Console - Stripe-Only Payment Guide

## Overview
PitBox uses **Stripe-only payment processing** and does NOT use Google Play Billing. This is fully compliant with Google Play's policies for productivity and community apps.

---

## ✅ Why This Works

### Google Play Policy Compliance
PitBox qualifies for alternative payment processing because:
- ✅ Primary purpose is productivity (racing setup management)
- ✅ Includes community features and marketplace
- ✅ Physical goods marketplace (Swap Meet) exempt from Play Billing
- ✅ Subscriptions provide cross-platform service access
- ✅ Not a game or primarily entertainment-focused

### Google's Payment Policy:
Google Play Billing is **required** for:
- Digital goods consumed within the app (game items, extra features)
- Apps whose primary purpose is entertainment

Google Play Billing is **optional** for:
- Productivity and business apps
- SaaS subscriptions accessed across platforms
- Physical goods and services
- Content platforms with multiplatform access

---

## 📋 Google Play Console Setup

### 1. **NO In-App Products Required**
- Do NOT create any in-app products
- Do NOT set up subscriptions in Play Console
- Do NOT complete "Monetization" setup
- Skip "Set up a merchant account"

### 2. **NO Financial Information Required**
- Do NOT complete "Payments profile"
- Do NOT set up banking information
- Only needed if Google processes payments for you
- Since we use Stripe, this is NOT required

### 3. **NO Tax Information Required**
- Google tax forms only needed if they pay you
- Your tax obligations are through Stripe
- Stripe handles sales tax collection
- You report Stripe income on your business taxes

---

## 📝 Store Listing Requirements

### App Category
```
Primary: Productivity
Secondary: Social
```

### Short Description (80 characters max)
```
Racing setup sheets, tools, community & parts marketplace. Free community!
```

### Full Description
```
PitBox is the complete racing app for dirt track and sprint car racers. Manage your setups, connect with racers, and access professional tools.

FREE FOREVER:
→ Racing Community - Connect with racers worldwide
→ Swap Meet - Buy and sell racing parts
→ Racing Tools - Calculators and utilities
→ Track Locations - Find tracks near you
→ Events & Challenges - Join racing events

PREMIUM SETUP ACCESS:
Unlock unlimited setup storage with a subscription at pitbox.app:
→ Save unlimited setup sheets
→ Cloud sync across all devices
→ Setup comparison tools
→ Advanced templates
→ End-to-end encryption (Premium tier)

PROFESSIONAL TOOLS INCLUDED:
✓ Spring rate calculator
✓ Gear ratio calculator
✓ Weight distribution calculator
✓ Stagger calculator
✓ Tire pressure management
✓ Shock inventory tracking
✓ Motor maintenance logs
✓ Track notebook with lap times

COMMUNITY FEATURES:
✓ Share setups and racing tips
✓ Post photos and videos
✓ Direct messaging with racers
✓ Find racing buddies by location
✓ Join racing groups and teams

SWAP MEET MARKETPLACE:
✓ Buy and sell racing parts
✓ Search by location
✓ Message sellers directly
✓ Save favorite listings

SUBSCRIPTION DETAILS:
Subscriptions are managed at pitbox.app. We use Stripe for secure payment processing. Cancel anytime from your account settings.

WHY PITBOX?
→ Built by racers, for racers
→ Works offline at the track
→ Secure cloud backup
→ Active racing community
→ Regular updates and new features

Join thousands of racers using PitBox to improve their racing program!

Website: https://pitbox.app
Support: pitboxcom@gmail.com
```

### Content Rating
```
ESRB: Everyone 12+
Reason: User-generated content, in-app purchases (mention subscriptions)

Content Questionnaire:
- Violence: None
- Sexual Content: None
- Language: Mild (user content)
- Controlled Substances: None
- Gambling: None
- In-app purchases: Yes (external subscriptions)
```

---

## 🎯 App Content Declaration

### Privacy Policy
**REQUIRED** - Must include URL to your privacy policy
```
https://pitbox.app/privacy
```

### Terms of Service
**REQUIRED** for apps with user accounts
```
https://pitbox.app/terms
```

### Data Safety Section

**Data Collected:**
```
Account Information:
- Email address (required)
- Name/username (required)
- Profile photo (optional)
- Location (optional, for location-based features)

User Content:
- Racing setup data
- Posts and comments
- Messages
- Marketplace listings

Usage Data:
- App interactions
- Crash logs
- Performance data
```

**Data Usage:**
```
All data is used to:
- Provide app functionality
- Sync across devices
- Enable community features
- Improve app performance

Data is NOT:
- Sold to third parties
- Used for advertising
- Shared without consent
```

**Data Security:**
```
- All data transmitted over HTTPS
- Stored in secure Supabase database
- Premium tier includes end-to-end encryption
- No payment data stored (Stripe handles all payments)
```

---

## 💳 Handling Payment Questions

### In App Content Policy Declaration:

**Question: "Does your app sell digital goods?"**
```
Answer: No

Explanation: PitBox subscriptions provide access to cloud storage
and productivity features, not consumable digital content.
Similar to Dropbox, Evernote, or other productivity SaaS apps.
```

**Question: "Does your app use Google Play's billing system?"**
```
Answer: No

Explanation: Subscriptions are processed on our website via Stripe.
This is compliant with Play policies for productivity apps and
multiplatform services.
```

**Question: "Where are purchases made?"**
```
Answer: External website (pitbox.app)

Explanation: Users create accounts and subscribe on our website.
The app provides a "Manage Subscription" link to the website.
```

---

## 🎨 Store Listing Assets

### App Icon (512x512)
- Clean, professional racing themed
- No text (icon only)
- Follows Material Design guidelines

### Feature Graphic (1024x500)
**Text overlay ideas:**
```
"Racing Setup Sheets, Tools & Community"
"Free Forever - Premium Features Available"
"Built by Racers, for Racers"
```

### Screenshots (Required: Minimum 2, Maximum 8)
**Recommended 6 screenshots:**
1. Community feed with posts
2. Racing setup sheet interface
3. Swap Meet marketplace
4. Racing tools (calculator)
5. Track locations map
6. Premium features showcase

**Format:**
- Phone: 16:9 aspect ratio
- Tablet: 16:10 aspect ratio (optional but recommended)

### Video (Optional but Highly Recommended)
- 30-60 seconds
- Show free features
- Brief premium mention
- Upload to YouTube, link in Play Console

---

## 🎪 App Review Process

### Pre-Launch Report
Google automatically tests your app on real devices:
- Check for crashes
- Review for policy violations
- Test on different Android versions

**Action Required:**
- Review the report
- Fix any critical issues
- Optional: Ignore minor warnings if app works correctly

### Review Timeline
- **Automated Review**: A few hours
- **Manual Review**: 1-7 days (if flagged)
- **Average Time**: 1-3 days total

---

## 🚨 If Flagged for Payment Policy

### Most Common Flag:
```
"App may be required to use Google Play's billing system"
```

### Your Response:
```
Subject: Payment Policy Clarification for PitBox

Hello Google Play Review Team,

Thank you for reviewing PitBox. I'd like to clarify our payment model:

APP TYPE:
PitBox is a productivity and community app for professional racing.
The primary functions are:
1. Racing setup sheet management (productivity tool)
2. Community features (social platform)
3. Physical goods marketplace (exempt from billing requirements)
4. Professional racing calculators and tools

SUBSCRIPTION MODEL:
PitBox subscriptions are managed on our website (pitbox.app) via Stripe.
This is similar to how apps like Dropbox, Evernote, and Slack handle
subscriptions for multiplatform productivity services.

FEATURES:
- FREE: Community, marketplace, all tools (90% of features)
- PAID: Cloud storage for setup sheets only (10% of features)

COMPLIANCE:
We believe this complies with Google Play's payment policies because:
1. Primary purpose is productivity, not entertainment
2. Subscription provides multiplatform service access (web + mobile)
3. Not selling consumable digital content
4. Similar to other productivity/SaaS apps on Play Store

The app clearly states that subscriptions are managed on our website.
Users can create accounts, subscribe, and manage subscriptions at pitbox.app.

Please let us know if you need any additional information.

Thank you,
[Your Name]
PitBox Developer
```

### Appeal Options:
1. **Policy Support**: Use "Contact Support" in Play Console
2. **Developer Forums**: Post in Google Play support forums
3. **Email**: appealsreview-android@google.com (for rejections)

---

## 📱 In-App Requirements

### What Your App MUST Have:

1. **Clear Subscription Information**
   ```
   Show pricing and features (informational only)
   State: "Subscriptions managed at pitbox.app"
   ```

2. **External Link to Website**
   ```
   Button: "Manage Subscription" or "View Plans"
   Opens: External browser to pitbox.app
   NOT: In-app webview for payment
   ```

3. **No Play Billing Code**
   ```
   Do NOT include:
   - Google Play Billing Library
   - com.android.billingclient dependency
   - Any Play billing code or imports
   ```

4. **Transparent Communication**
   ```
   Users must understand:
   - Where to subscribe (website)
   - How to manage subscription (website)
   - What's free vs. paid
   ```

---

## ✅ Pre-Submission Checklist

- [ ] App description mentions external subscriptions
- [ ] No in-app products created in Play Console
- [ ] No Play Billing code in app
- [ ] "Manage Subscription" opens external browser
- [ ] Privacy Policy URL added
- [ ] Terms of Service URL added
- [ ] Data Safety section completed
- [ ] Content rating completed
- [ ] Store listing has all required assets
- [ ] App tested on multiple Android versions
- [ ] No crashes in Pre-Launch Report

---

## 🎯 Content Policy Compliance

### User-Generated Content
Since PitBox includes community features:
- [ ] Implement reporting system for inappropriate content
- [ ] Include moderation capabilities
- [ ] Terms of Service prohibit illegal content
- [ ] Block/report functionality for users

### Spam and Placement
- [ ] No misleading claims in description
- [ ] Keywords relevant to app function
- [ ] No keyword stuffing
- [ ] Screenshots show actual app features

### Data and Privacy
- [ ] Privacy policy covers all data collection
- [ ] Users can delete their account
- [ ] Clear data usage explanations
- [ ] Complies with GDPR/CCPA where applicable

---

## 🚀 Launch Strategy

### Phased Rollout (Recommended)
```
Day 1: 10% rollout
Day 3: 25% rollout
Day 7: 50% rollout
Day 14: 100% rollout
```

**Why?**
- Catch crashes early
- Get user feedback
- Fix issues before full launch
- Lower risk

### Open Testing Track (Optional)
- Get early users
- Test payment flow
- Gather feedback
- Build reviews before production

---

## 💰 Your Tax Responsibilities

Since you're using Stripe (not Google Play):

### What You DO Need:
✅ Business tax ID (EIN or SSN)
✅ Report Stripe income on tax returns
✅ Track expenses for deductions
✅ Pay quarterly estimated taxes (if applicable)
✅ Stripe handles sales tax collection (if enabled)

### What You DON'T Need:
❌ Google Play tax forms
❌ Google merchant account
❌ Banking info in Play Console
❌ W-9 for Google

### Stripe Will Provide:
- 1099-K (if you process $20,000+ and 200+ transactions)
- Sales tax reports
- Transaction history for accounting

**Consult a tax professional for your specific situation**

---

## 📞 Support Resources

### Google Play Console Help:
- [Payment Policy](https://support.google.com/googleplay/android-developer/answer/9858738)
- [Alternative Payment Methods](https://support.google.com/googleplay/android-developer/answer/140504)
- [Policy FAQ](https://support.google.com/googleplay/android-developer/topic/9857752)

### Contact Options:
- **Play Console**: Help → Contact Support
- **Developer Forums**: [Google Play Community](https://www.googleplaycommunity.com/)
- **Twitter**: @GooglePlayDev

---

## ✨ You're All Set!

Your app is configured for Stripe-only payments. You do NOT need to:
- ❌ Set up merchant account in Play Console
- ❌ Fill out Google tax forms
- ❌ Create in-app products
- ❌ Add Google Play Billing Library
- ❌ Pay Google's 15-30% commission

You only need:
- ✅ Google Play Developer account ($25 one-time fee)
- ✅ Clear app description mentioning external subscriptions
- ✅ "Manage Subscription" link to your website
- ✅ Your Stripe account for payment processing
- ✅ Privacy policy and terms of service

**Good luck with your launch!**

---

## 🎉 After Approval

### Monitor Your Listing:
- Respond to user reviews
- Track crash reports
- Monitor Pre-Launch Reports for updates
- Update app regularly

### Marketing:
- Share Play Store link on website
- Social media announcement
- Email existing users
- Racing community forums

### Maintenance:
- Update to latest Android SDK
- Fix bugs promptly
- Add new features based on feedback
- Keep privacy policy updated

**Welcome to Google Play!**
