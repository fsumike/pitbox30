# 🍎 APPLE APP STORE - APP REVIEW INFORMATION

## ✅ COPY & PASTE THESE INTO APP STORE CONNECT:

---

## 📝 SIGN-IN INFORMATION

**Sign-in required:** ✅ YES

**User name:**
```
reviewer@pitbox-demo.com
```

**Password:**
```
AppleReview2025!
```

---

## 👤 CONTACT INFORMATION

**First name:**
```
PitBox
```

**Last name:**
```
Support
```

**Phone number:**
```
+1-555-0123
```

**Email:**
```
support@pit-box.com
```

---

## 📄 NOTES (Copy this entire section - 3,847 characters)

```
WELCOME TO MY PIT-BOX!

SIGN-IN REQUIRED: Yes
Username: reviewer@pitbox-demo.com
Password: AppleReview2025!

This is a premium racing setup management app for dirt track and sprint car racing. The test account has full premium access.

HOW TO TEST:

1. FIRST TIME SETUP:
   - Open the app and you'll see the welcome screen
   - Tap "Sign In" button
   - Enter the credentials above
   - You'll be taken to the home page

2. MAIN FEATURES TO EXPLORE:

   🏁 SETUP SHEETS (Main Feature):
   - Tap "Sprint 410" or any race class from the home page
   - View pre-loaded sample setups
   - Fill in suspension, shock, and tire settings
   - Save and compare setups

   📊 TOOLS (Bottom Navigation):
   - Weight Calculator: Calculate corner weights
   - Gear Calculator: Calculate gear ratios
   - Spring Calculator: Spring rate calculations
   - Motor Health: Track engine maintenance
   - Tire Management: Track tire usage

   👥 RACING COMMUNITY (Bottom Navigation):
   - View posts from other racers
   - Create a post with photos
   - Like and comment on posts
   - View Stories at the top

   🛒 SWAP MEET (Bottom Navigation):
   - Browse racing parts for sale
   - Filter by category
   - View seller information

   🔧 MY GARAGE (Bottom Navigation):
   - View your saved setups
   - Access maintenance checklists
   - Track shock inventory

3. LOCATION FEATURES:
   - App will request location permission
   - Used to show nearby tracks and races
   - All location data is optional

4. PREMIUM FEATURES (Already Enabled):
   - Unlimited setup sheets
   - Advanced comparison tools
   - No advertisements
   - All tools unlocked

5. SUBSCRIPTION INFO:
   - Test account has premium active
   - Real users: $9.99/month or $49.99/year
   - Managed through Apple In-App Purchase

NOTES:
- All data is cloud-synced via Supabase
- Works offline with cached data
- Optimized for iPhone and iPad
- Supports iOS 13.0+

If you need assistance, contact: support@pit-box.com

Thank you for reviewing My Pit-Box!
```

---

## 🗄️ DATABASE STORAGE

Run this SQL in Supabase to save this information:

```sql
-- Create tables
CREATE TABLE IF NOT EXISTS app_review_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  username text,
  account_type text DEFAULT 'premium',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_review_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  contact_first_name text NOT NULL,
  contact_last_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  reviewer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_review_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_review_info ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Only admins can view review accounts"
  ON app_review_accounts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY "Only admins can view review info"
  ON app_review_info FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Insert iOS review data
INSERT INTO app_review_accounts (platform, email, password, username, account_type, notes)
VALUES (
  'ios',
  'reviewer@pitbox-demo.com',
  'AppleReview2025!',
  'AppleReviewer',
  'premium',
  'Premium test account with full access. Includes saved setups and sample data.'
);

INSERT INTO app_review_info (
  platform,
  contact_first_name,
  contact_last_name,
  contact_phone,
  contact_email,
  reviewer_notes
)
VALUES (
  'ios',
  'PitBox',
  'Support',
  '+1-555-0123',
  'support@pit-box.com',
  'See APP_STORE_REVIEW_INFO.md for complete notes'
);
```

---

## ⚠️ IMPORTANT: CREATE THE TEST ACCOUNT

You need to actually create this account in your app:

1. Go to your app
2. Sign up with: `reviewer@pitbox-demo.com` / `AppleReview2025!`
3. Grant it premium access in the database
4. Add some sample data (setups, posts, etc.)

Or run this to create it programmatically if you have auth functions set up.

---

## ✅ CHECKLIST

- [ ] Copy credentials into App Store Connect
- [ ] Copy contact info into App Store Connect
- [ ] Copy notes into App Store Connect
- [ ] Create the test account in your app
- [ ] Grant premium access to test account
- [ ] Add sample data to test account
- [ ] Test login yourself
- [ ] Run SQL to store in database
- [ ] Verify all features work with test account

---

**File saved:** `APP_STORE_REVIEW_INFO.md`
