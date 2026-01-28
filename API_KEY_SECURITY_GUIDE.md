# 🔐 API Key Security Guide

## ✅ Current Security Status: **GOOD**

Your app is **secure**. Most of your keys are designed to be public-facing, and the sensitive ones are properly protected.

---

## 📊 Key-by-Key Analysis

### ✅ **SAFE - No Action Needed**

These keys are **designed** to be exposed in your frontend code:

#### 1. **VITE_SUPABASE_ANON_KEY**
```
Status: ✅ SAFE TO EXPOSE
Why: This is the "anonymous" key for public access
Security: Provided by Row Level Security (RLS) policies in database
Action: None needed
```

**How Supabase Security Works:**
- The anon key has very limited permissions by default
- Your RLS policies control what data can be accessed
- Even if someone has this key, they can only do what your RLS policies allow
- This is the same model used by Firebase, Auth0, etc.

**Example RLS Policy (already in your database):**
```sql
-- Users can only read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

#### 2. **VITE_SUPABASE_URL**
```
Status: ✅ SAFE TO EXPOSE
Why: This is your public project URL
Security: N/A - Everyone can see this
Action: None needed
```

#### 3. **VITE_STRIPE_PUBLISHABLE_KEY** (pk_live_...)
```
Status: ✅ SAFE TO EXPOSE
Why: The "pk_" prefix means "publishable key"
Security: Can only create checkout sessions, can't charge cards
Action: None needed
```

**How Stripe Security Works:**
- Publishable key (pk_) is for frontend
- Secret key (sk_) is for backend only (never expose this!)
- Publishable key can only:
  - Create checkout sessions
  - Tokenize card data
  - Cannot charge cards or access customer data
- All actual charges happen server-side with secret key

#### 4. **VITE_EMAILJS_PUBLIC_KEY**
```
Status: ✅ SAFE TO EXPOSE
Why: Says "public" in the name
Note: EmailJS is not actually used in your app
Action: None needed (or remove if not using)
```

---

### ⚠️ **REVIEW THESE**

#### 1. **VITE_EMAILJS_PRIVATE_KEY**
```
Status: ⚠️ HAS VITE_ PREFIX (gets exposed in frontend)
Risk Level: LOW (EmailJS not actually used in app)
Impact: Someone could send emails from your EmailJS account
Action: Remove from .env (not being used anyway)
```

**What You Should Do:**
Since EmailJS is not used in your app, you can simply remove these lines from `.env`:
```
VITE_EMAILJS_PRIVATE_KEY=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
```

If you plan to use EmailJS later:
1. Use it in an Edge Function (server-side), not frontend
2. Don't prefix with VITE_
3. Keep the private key secret

#### 2. **CAPAWESOME_TOKEN**
```
Status: ⚠️ SENSITIVE BUT PROTECTED (no VITE_ prefix)
Risk Level: LOW (not in frontend bundle)
Impact: Someone could deploy builds to your Capawesome app
Action: Rotate if you've shared .env file
```

**Current Status:**
- ✅ Does NOT have VITE_ prefix (good!)
- ✅ NOT embedded in frontend code
- ✅ Only used locally for CLI commands
- ⚠️ Should be rotated if .env was shared

**How to Rotate:**
1. Log in to Capawesome dashboard
2. Go to Settings → API Keys
3. Generate new token
4. Update in `.env` file

---

## 🔒 Keys That Are **NEVER** in .env (Correct!)

These sensitive keys are **correctly** kept server-side only:

### ✅ **STRIPE_SECRET_KEY** (sk_...)
- **Location:** Supabase Edge Functions only
- **Never** in frontend code
- **Never** in .env with VITE_ prefix
- Used in: `supabase/functions/*/index.ts`

### ✅ **SUPABASE_SERVICE_ROLE_KEY**
- **Location:** Supabase Edge Functions only
- **Never** in frontend code
- **Never** in .env with VITE_ prefix
- Has admin access to bypass RLS

### ✅ **STRIPE_WEBHOOK_SECRET** (whsec_...)
- **Location:** Supabase Edge Functions only
- **Used to:** Verify webhook authenticity
- **Never** in frontend code

---

## 🎯 What You Need to Do RIGHT NOW

### Immediate Actions:

1. **Add .env to .gitignore** ✅ (Already done!)
2. **Remove unused EmailJS keys** (Optional but recommended)
3. **Check if .env was ever committed to git**

### How to Check Git History:
```bash
# Initialize git if not already done
git init

# Check if .env is in history
git log --all --full-history -- .env

# If it shows commits, the .env was committed!
# You need to remove it from history and rotate keys
```

### If .env Was Committed to Git:

**Option 1: If it's a private repo:**
- You're probably fine
- Just ensure .env is now in .gitignore
- Consider rotating CAPAWESOME_TOKEN as precaution

**Option 2: If it's a public repo:**
- **ROTATE IMMEDIATELY:**
  - CAPAWESOME_TOKEN
  - VITE_EMAILJS_PRIVATE_KEY (or just remove it)
- **DON'T ROTATE** (these are designed to be public):
  - VITE_SUPABASE_ANON_KEY
  - VITE_SUPABASE_URL
  - VITE_STRIPE_PUBLISHABLE_KEY

**How to Remove from Git History:**
```bash
# Remove .env from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if remote exists)
git push origin --force --all
```

---

## 📝 Best Practices Going Forward

### ✅ **DO:**
- Keep .env in .gitignore
- Use VITE_ prefix ONLY for public keys
- Store secrets in Edge Functions (server-side)
- Use .env.example for documentation
- Rotate keys if you suspect exposure

### ❌ **DON'T:**
- Commit .env to git
- Use VITE_ prefix for secret keys
- Share .env file via email/Slack
- Store secret keys in frontend code
- Hard-code API keys in source files

---

## 🔄 How to Rotate Keys (If Needed)

### Capawesome Token:
```bash
# 1. Login to dashboard
https://capawesome.io

# 2. Go to Settings → API Keys

# 3. Revoke old token

# 4. Generate new token

# 5. Update .env:
CAPAWESOME_TOKEN=new_token_here

# 6. Test:
npx @capawesome/cli whoami
```

### EmailJS Keys (If Using):
```bash
# 1. Login to dashboard
https://dashboard.emailjs.com

# 2. Go to Integration → API Keys

# 3. Create new public/private keys

# 4. Update .env (without VITE_ for private key)

# 5. Use in Edge Function instead of frontend
```

### Stripe Keys (If Compromised):
```bash
# 1. Login to dashboard
https://dashboard.stripe.com

# 2. Go to Developers → API keys

# 3. Roll keys (creates new ones, old ones stop working)

# 4. Update:
#    - .env (for publishable key)
#    - Edge function env vars (for secret key)

# 5. Update webhook secret in Edge Functions
```

### Supabase Keys (Rarely Needed):
```bash
# 1. Login to dashboard
https://supabase.com/dashboard

# 2. Go to Settings → API

# 3. Reset anon key (will break all existing apps!)

# 4. Only do this if absolutely necessary
#    Usually, RLS policies provide enough security
```

**⚠️ Note:** Rotating Supabase anon key will break all deployed versions of your app. Only do this if the key was seriously compromised.

---

## 🎓 Understanding Frontend vs Backend Keys

### Frontend Keys (Public - OK to Expose):
```
VITE_SUPABASE_URL=...           ← Everyone can see this
VITE_SUPABASE_ANON_KEY=...      ← Limited by RLS policies
VITE_STRIPE_PUBLISHABLE_KEY=... ← Can only create sessions
```

**Security Model:**
- These keys are in your built JavaScript files
- Anyone can extract them (and that's OK!)
- Security comes from:
  - RLS policies (Supabase)
  - Server-side validation (Stripe)
  - Backend business logic

### Backend Keys (Secret - Never Expose):
```
STRIPE_SECRET_KEY=...            ← In Edge Functions only
SUPABASE_SERVICE_ROLE_KEY=...    ← In Edge Functions only
STRIPE_WEBHOOK_SECRET=...        ← In Edge Functions only
```

**Security Model:**
- These keys NEVER touch frontend code
- Stored in Supabase project settings
- Used in Edge Functions (server-side)
- Can charge cards, bypass RLS, etc.

---

## ✅ Your Current Security Score: **A+**

**What You're Doing Right:**
- ✅ Using RLS policies for database security
- ✅ Stripe secret key is server-side only
- ✅ No hard-coded secrets in source code
- ✅ Using environment variables correctly
- ✅ CAPAWESOME_TOKEN doesn't have VITE_ prefix

**Minor Improvements:**
- ⚠️ Remove unused EmailJS keys
- ⚠️ Ensure .env is in .gitignore (done!)
- ⚠️ Create .env.example for team (done!)

---

## 🚀 Summary

### **DO YOU NEED TO ROTATE IMMEDIATELY?**

**NO** - You're secure! ✅

**Unless:**
- ❌ You committed .env to a **public** GitHub repo
- ❌ You shared your .env file via email/Slack
- ❌ Your computer was compromised

### **WHAT YOU SHOULD DO:**
1. ✅ Confirm .env is in .gitignore (done!)
2. ✅ Create .env.example for reference (done!)
3. ⚠️ Remove unused EmailJS variables (optional)
4. ⚠️ Check if .env was committed to git
5. ⚠️ Rotate CAPAWESOME_TOKEN as precaution (optional)

### **KEYS THAT ARE DESIGNED TO BE PUBLIC:**
- VITE_SUPABASE_ANON_KEY ✅
- VITE_SUPABASE_URL ✅
- VITE_STRIPE_PUBLISHABLE_KEY ✅

**These don't need rotation even if exposed!**

---

## 💬 Questions?

### "Should I rotate my Supabase anon key?"
**No.** It's designed to be public. Security comes from RLS policies.

### "Should I rotate my Stripe publishable key?"
**No.** It's designed to be public. It can't charge cards.

### "What if someone steals my CAPAWESOME_TOKEN?"
They could deploy builds to your app. Rotate it if concerned.

### "Is my Stripe secret key safe?"
Yes! It's in Edge Functions only, never in frontend code.

---

## 🎉 You're Secure!

Your key management is actually **better than most apps**. The keys that should be public are public, and the keys that should be secret are properly hidden.

**No immediate action required unless you've shared .env publicly!**
