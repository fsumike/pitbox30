# PitBox App - Environment Variables Setup

This document explains how to set up the required environment variables for the PitBox app to work properly.

## Required Environment Variables

The PitBox app requires several API keys and configuration values to function. These are stored in a `.env` file at the root of your project.

### Current Configuration

Your `.env` file should contain the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pbfdzlkdlxbwijwwysaf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZmR6bGtkbHhid2lqd3d5c2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjMzNjIsImV4cCI6MjA1NjAzOTM2Mn0.HNGtEg5Tc5iAILr33HDMzbqKaV3tvpgoVr4Dv85wjEk

# EmailJS Configuration (for contact forms)
VITE_EMAILJS_PUBLIC_KEY=41ZVjmp2kn24dU3nE
VITE_EMAILJS_PRIVATE_KEY=XLCeBz-M-IoUh2cU5ocMi
VITE_EMAILJS_SERVICE_ID=service_yvxvxvx
VITE_EMAILJS_TEMPLATE_ID=template_0hy099u

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51ROucJANikXpQi11dY1AGALASRix6sA4OXhfQgH626swoKEHVJ7dxuYNeePbjDEAPIBmVvHzJMXDnrKfdYI2Jzg001pM5WBrc
```

## What Each Variable Does

### Supabase Variables

**VITE_SUPABASE_URL**
- Your Supabase project URL
- Used to connect to your database and authentication backend
- Format: `https://[project-id].supabase.co`

**VITE_SUPABASE_ANON_KEY**
- Public anonymous key for Supabase
- Safe to use in client-side code
- Provides limited access controlled by Row Level Security (RLS)

### EmailJS Variables

**VITE_EMAILJS_PUBLIC_KEY**
- Public key for EmailJS service
- Used for contact form submissions

**VITE_EMAILJS_PRIVATE_KEY**
- Private key for EmailJS (despite the name, this is included in frontend code)

**VITE_EMAILJS_SERVICE_ID**
- Your EmailJS service identifier

**VITE_EMAILJS_TEMPLATE_ID**
- Template ID for email formatting

### Stripe Variables

**VITE_STRIPE_PUBLISHABLE_KEY**
- Stripe publishable key (safe for client-side use)
- Used to process payments
- Currently configured for LIVE mode (pk_live_...)

## Important Notes

### Security Considerations

1. **Never commit `.env` to version control**
   - The `.env` file is already in `.gitignore`
   - This prevents accidentally exposing your keys

2. **Regenerate keys if exposed**
   - If you accidentally push keys to GitHub, regenerate them immediately
   - Update your `.env` file with new keys

3. **Stripe Keys**
   - You have a LIVE Stripe key configured
   - For testing, consider using TEST keys: `pk_test_...`
   - Switch to LIVE keys only when ready for production

### For Android/iOS Builds

Environment variables are automatically bundled into your app during the build process:

1. Make sure `.env` exists in your project root
2. Run `npm run build` - this reads the `.env` file
3. Run `npx cap sync android` or `npx cap sync ios`
4. The variables are now available in your native app

### How to Get Your Own Keys

If you need to set up your own services:

#### Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy your Project URL and anon/public key
5. Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

#### EmailJS
1. Go to https://www.emailjs.com
2. Create an account
3. Add an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Go to Account → General
6. Copy your Public Key and Private Key
7. Update the EmailJS variables

#### Stripe
1. Go to https://stripe.com
2. Create an account
3. Complete your business information
4. Go to Developers → API Keys
5. Copy your Publishable Key
6. Update `VITE_STRIPE_PUBLISHABLE_KEY`
7. **Important:** Use test keys (pk_test_...) for development

## Troubleshooting

### App won't connect to database

**Problem:** "Error connecting to Supabase" or authentication fails

**Solution:**
1. Verify `VITE_SUPABASE_URL` is correct
2. Check that `VITE_SUPABASE_ANON_KEY` hasn't expired
3. Rebuild the app: `npm run build && npx cap sync android`

### Contact form not working

**Problem:** Contact form submissions fail

**Solution:**
1. Verify all EmailJS variables are correct
2. Check EmailJS dashboard for quota limits
3. Ensure email template ID matches

### Payments not processing

**Problem:** Stripe checkout fails

**Solution:**
1. Verify Stripe key is correct (should start with `pk_live_` or `pk_test_`)
2. Check Stripe dashboard for any issues
3. Ensure you're not blocked by a firewall
4. For testing, use Stripe test cards: https://stripe.com/docs/testing

## Environment Variables Checklist

Before building for production, verify:

- [ ] `.env` file exists in project root
- [ ] All required variables are present
- [ ] Supabase URL and key are correct
- [ ] EmailJS keys are valid
- [ ] Stripe key is correct (LIVE key for production)
- [ ] `.env` is in `.gitignore`
- [ ] You've run `npm run build` after any changes
- [ ] You've run `npx cap sync android` after build

## Advanced: Multiple Environments

If you want separate dev/staging/production environments:

### Option 1: Multiple .env files

Create:
- `.env.development`
- `.env.staging`
- `.env.production`

Use them:
```bash
# Development
npm run dev

# Production build
npm run build
```

### Option 2: Environment-specific builds

Modify `package.json` scripts:
```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production"
  }
}
```

---

**Remember:** After any changes to `.env`, you must rebuild your app and sync with Capacitor for changes to take effect in your Android/iOS builds.
