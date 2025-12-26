# 🔐 PitBox Test Account Documentation

**For Apple App Store & Google Play Store Review Teams**

---

## 📱 Test Account Credentials

### Primary Test Account
```
Email: reviewer@pitbox-test.com
Password: PitBox2024Review!
```

### Secondary Test Account (For Social Features Testing)
```
Email: reviewer2@pitbox-test.com
Password: PitBox2024Review!
```

---

## 🎯 What to Test

### 1. **Authentication & Onboarding**
- ✅ Sign in with provided credentials
- ✅ Complete welcome flow (if prompted)
- ✅ Access all app sections without restrictions

### 2. **Racing Community Features**
- ✅ View community feed at `/community`
- ✅ Like and comment on posts
- ✅ Create a new post (text, image, or video)
- ✅ Follow other users
- ✅ View user profiles

### 3. **Setup Sheet Management**
- ✅ Navigate to any car class (e.g., Sprint 410, Late Model)
- ✅ Fill out a complete setup sheet
- ✅ Save setup to library
- ✅ View saved setups at `/saved-setups`
- ✅ Edit or delete saved setups
- ✅ Share setups with the community

### 4. **Professional Tools**
- ✅ Access tools page at `/tools`
- ✅ Use calculators: Gear, Fuel, Spring, Stagger, Weight
- ✅ Track motor health and maintenance
- ✅ Manage tire inventory
- ✅ Record track notebook entries
- ✅ Monitor shock inventory

### 5. **Swap Meet Marketplace**
- ✅ Browse listings at `/swap-meet`
- ✅ Search and filter equipment
- ✅ View listing details
- ✅ Contact sellers (test account has inbox access)
- ✅ Create a test listing (optional)

### 6. **Location Features**
- ✅ View track locations map
- ✅ Grant location permissions when prompted
- ✅ See nearby tracks (if applicable)

### 7. **Offline Functionality**
- ✅ Disconnect from internet
- ✅ View previously loaded content
- ✅ Fill out setup sheets offline
- ✅ Reconnect to sync changes

---

## 💳 In-App Purchase Testing

### Apple App Store Reviewers
- **Test Account is Pre-Configured**: Premium features are unlocked for testing
- **Sandbox Testing**: If you need to test the purchase flow:
  1. Use Apple's sandbox test account
  2. Product IDs are listed in `APP_STORE_PRODUCT_IDS.md`
  3. No actual charges will occur in sandbox mode

### Google Play Store Reviewers
- **Test Account is Pre-Configured**: Premium features are unlocked for testing
- **Test Purchases**: Use Google Play's testing tracks
  1. Product IDs: `premium_monthly`, `premium_yearly`
  2. Test cards will not be charged
  3. Premium features include: unlimited setups, advanced tools, ad-free experience

### Premium Features to Test
- ✅ Unlimited setup saves (free users limited to 5)
- ✅ Advanced motor health analytics
- ✅ Shock inventory management
- ✅ Priority support access
- ✅ No advertisements

---

## 🌐 Network & API Usage

### Third-Party Services
- **Supabase**: Backend database and authentication
- **Stripe**: Payment processing (web only)
- **Apple/Google In-App Purchase**: Native payment processing
- **Leaflet Maps**: Interactive track location maps
- **EmailJS**: Contact form submissions

### Permissions Required
- 📍 **Location**: Optional - for nearby track discovery
- 📷 **Camera**: Optional - for adding photos to posts and setups
- 🔔 **Notifications**: Optional - for community updates and reminders
- 💾 **Storage**: For caching offline data

### Data Collection
- User profiles (name, email, car number, racing class)
- Setup sheet data (suspension settings, track conditions)
- Community posts and interactions
- Motor maintenance logs
- **No sensitive personal data** is collected beyond email

---

## 🚀 Quick Start Guide for Reviewers

### 5-Minute Test Flow
1. **Sign In** with `reviewer@pitbox-test.com`
2. **Navigate** to Racing Community → View posts and interactions
3. **Create Setup** → Go to Sprint 410 → Fill in a setup sheet → Save it
4. **Use Tools** → Open Tools → Try the Gear Calculator
5. **Browse Marketplace** → Go to Swap Meet → View listings
6. **Check Profile** → View your profile with saved setups

### Deep Test Flow (15-20 minutes)
1. Complete all steps in "Quick Start"
2. Test offline mode by disabling network
3. Create a community post with an image
4. Follow another user and view their profile
5. Test all available calculators and tools
6. Grant location permissions and view track map
7. Edit and delete a saved setup
8. Test social features: like, comment, share

---

## 📝 Special Notes for Reviewers

### Age Rating
- **Rated 4+** (iOS) / **Everyone** (Android)
- No objectionable content
- Community posts are user-generated but monitored
- Report feature available for inappropriate content

### Device Compatibility
- **iOS**: Requires iOS 13.0 or later
- **Android**: Requires Android 5.0 (API 21) or later
- **Optimized for**: iPhone 12 and newer, modern Android devices

### Known Limitations
- Location features require GPS-enabled device
- Some tools require internet connectivity
- Camera features require device with camera
- Maps require network connection (cached for offline)

### Support Contact
- **Email**: support@pitboxapp.com
- **Response Time**: Within 24 hours during review period

---

## 🔒 Privacy & Security

### Data Protection
- All data encrypted in transit (HTTPS/TLS)
- Passwords hashed with bcrypt
- User data stored securely in Supabase
- GDPR and CCPA compliant
- Users can delete their account and all data at any time

### Privacy Policy
- Available at: https://yourdomain.com/privacy
- Includes data collection practices
- Third-party service disclosures
- User rights and opt-out options

### Terms of Service
- Available at: https://yourdomain.com/terms
- Clear usage guidelines
- Community standards
- Refund policy for subscriptions

---

## ✅ Pre-Launch Checklist Completed

- ✅ Version 3.0.0 ready for submission
- ✅ All features tested and functional
- ✅ Payment integration verified (Apple IAP + Google Billing)
- ✅ Privacy policy and terms of service published
- ✅ Test accounts configured with full access
- ✅ App icons and assets finalized
- ✅ Offline functionality implemented
- ✅ Performance optimized for production
- ✅ Security best practices followed
- ✅ Age-appropriate content guidelines followed

---

## 📞 Review Team Contact

If you encounter any issues during review:

1. **Technical Issues**: support@pitboxapp.com
2. **Account Problems**: Use the credentials above or request new test accounts
3. **Feature Questions**: Refer to in-app help or contact support
4. **Payment Testing**: Test accounts have premium access pre-enabled

**Thank you for reviewing PitBox! We're excited to bring this professional racing tool to the App Store and Google Play Store.**

---

*Last Updated: 2025-11-17*
*App Version: 3.0.0*
*Review Ready: YES ✅*
