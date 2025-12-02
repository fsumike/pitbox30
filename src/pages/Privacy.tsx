import React from 'react';
import { Shield, Lock, Eye, Database, Users, FileText, Mail, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-400">Last Updated: November 15, 2025</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          At PIT-BOX.COM, your privacy is our priority. This policy explains how we collect, use, protect, and share your personal information.
        </p>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-gold" />
          Quick Overview
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">We DO:</h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
              <li>✅ Encrypt all your data</li>
              <li>✅ Let you control your privacy</li>
              <li>✅ Allow you to delete your data</li>
              <li>✅ Protect your information</li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">We DON'T:</h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
              <li>❌ Sell your data to anyone</li>
              <li>❌ Share without permission</li>
              <li>❌ Track you across the web</li>
              <li>❌ Use your data for ads</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-gold" />
              Account Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
              <li>Email address (for sign-in and communication)</li>
              <li>Name and username (optional, for your profile)</li>
              <li>Password (encrypted with bcrypt, we cannot see it)</li>
              <li>Profile photo (optional)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-gold" />
              Racing Data
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              To provide our setup tracking features, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
              <li>Setup sheets (shocks, springs, tire pressures, etc.)</li>
              <li>Lap times and performance data</li>
              <li>Track locations and conditions</li>
              <li>Motor maintenance records</li>
              <li>Photos and videos you upload</li>
              <li>Posts, comments, and social interactions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Automatic Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              We automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
              <li>Device type and operating system</li>
              <li>IP address (for security)</li>
              <li>Location data (only when you use track detection)</li>
              <li>Usage analytics (which features you use)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>

        <div className="space-y-4">
          <div className="p-4 border-l-4 border-brand-gold bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-2">To Provide Our Services</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Store your setups, track your performance, enable social features, sync across devices
            </p>
          </div>
          <div className="p-4 border-l-4 border-brand-gold bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-2">To Improve Your Experience</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Personalize recommendations, fix bugs, add features you request
            </p>
          </div>
          <div className="p-4 border-l-4 border-brand-gold bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-2">To Communicate With You</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Send account updates, respond to support requests, notify about new features (you can opt out)
            </p>
          </div>
          <div className="p-4 border-l-4 border-brand-gold bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold mb-2">To Keep Everything Secure</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Detect fraud, prevent abuse, enforce our terms, protect user data
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          3. How We Protect Your Data
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">🔒 Encryption in Transit</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All data sent between your device and our servers uses HTTPS/TLS 1.3 encryption
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">🔐 Encryption at Rest</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All data stored in our database is encrypted with AES-256 encryption
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">🛡️ Password Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Passwords are hashed with bcrypt. We never store or see your actual password
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">🔑 Row Level Security</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Database policies ensure only you can access your private data
            </p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Security Disclaimer
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                While we implement industry-standard security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security. You are responsible for keeping your password secure and not sharing your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Eye className="w-6 h-6 text-brand-gold" />
          4. Who We Share Your Data With
        </h2>

        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>We DO NOT sell your data to anyone.</strong> We only share data with:
          </p>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Service Providers</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Supabase</strong> - Database, authentication, file storage</li>
              <li>• <strong>Stripe</strong> - Payment processing (for subscriptions)</li>
              <li>• <strong>EmailJS</strong> - Contact form email delivery</li>
              <li>• <strong>Google Maps</strong> - Location and mapping features</li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              All third parties are contractually required to protect your data and use it only for providing their services to us.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Other Users (When You Choose)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Public posts are visible to all users</li>
              <li>• Shared setups are visible to people you share with</li>
              <li>• Your profile information (if set to public)</li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              You control what you share. Setups are private by default.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Legal Requirements</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We may disclose your information if required by law, court order, or to protect rights, property, or safety.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>

        <div className="space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Access Your Data
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Request a copy of all data we have about you
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Correct Your Data
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Update or correct any inaccurate information in your profile
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Delete Your Data
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Request deletion of your account and all associated data. We'll delete everything within 45 days (except transaction records kept for legal compliance).
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Export Your Data
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Download all your setups, posts, and data in a portable format
            </p>
          </div>
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              ✅ Opt Out of Communications
            </h3>
            <p className="text-sm text-green-800 dark:text-green-200">
              Unsubscribe from marketing emails (you'll still get important account updates)
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>To exercise these rights:</strong> Go to <Link to="/contact" className="underline">Contact</Link> and select "Privacy Question" or "Data Deletion Request"
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Active Accounts:</strong> We keep your data as long as your account is active.
          </p>
          <p>
            <strong>Deleted Accounts:</strong> After you request deletion, we remove all your data within 45 days. This gives you time to recover your account if you change your mind.
          </p>
          <p>
            <strong>Legal Requirements:</strong> Some data must be kept for legal reasons:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Transaction records (Stripe payments): 7 years</li>
            <li>Audit logs (for security): 30 days</li>
          </ul>
          <p>
            <strong>Backups:</strong> Deleted data may remain in backups for up to 90 days before being permanently removed.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">7. Children's Privacy</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Minimum Age:</strong> You must be at least 13 years old to use PIT-BOX.
          </p>
          <p>
            <strong>GDPR Compliance:</strong> Users under 16 in the EU may require parental consent.
          </p>
          <p>
            If we discover that we've collected data from a child under 13 without parental consent, we'll delete it immediately.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">8. International Users</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            PIT-BOX is operated from the United States. If you're accessing from outside the US, your data may be transferred to and stored in the US.
          </p>
          <p>
            <strong>EU Users:</strong> We comply with GDPR requirements including your rights to access, correct, and delete your data.
          </p>
          <p>
            <strong>California Users:</strong> See our <a href="#ccpa" className="text-brand-gold hover:underline">CCPA section</a> below for your specific rights.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8" id="ccpa">
        <h2 className="text-2xl font-bold mb-4">9. California Privacy Rights (CCPA)</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>If you're a California resident, you have additional rights:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Right to know what personal information we collect and how we use it</li>
            <li>Right to delete your personal information</li>
            <li>Right to opt out of sale of personal information (we don't sell your data)</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, contact us at <a href="mailto:pitboxcom@gmail.com" className="text-brand-gold hover:underline">pitboxcom@gmail.com</a>
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">10. Cookies & Tracking</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>We use minimal cookies for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Authentication:</strong> Keep you signed in</li>
            <li><strong>Preferences:</strong> Remember your settings (dark mode, etc.)</li>
            <li><strong>Security:</strong> Prevent fraud and abuse</li>
          </ul>
          <p className="mt-3">
            <strong>We DO NOT use:</strong> Advertising cookies, cross-site tracking, or third-party analytics beyond basic usage statistics.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>
            We may update this Privacy Policy from time to time. If we make significant changes, we'll notify you by:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Email notification to your account email</li>
            <li>In-app notification</li>
            <li>Updating the "Last Updated" date at the top</li>
          </ul>
          <p className="mt-3">
            Continued use of PIT-BOX after changes means you accept the updated policy.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Mail className="w-6 h-6 text-brand-gold" />
          Contact Us About Privacy
        </h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Questions about this Privacy Policy? Contact us:</p>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <p><strong>Email:</strong> <a href="mailto:pitboxcom@gmail.com" className="text-brand-gold hover:underline">pitboxcom@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+12792450737" className="text-brand-gold hover:underline">(279) 245-0737</a></p>
            <p><strong>Mail:</strong><br />
              Michael Glover DBA PIT-BOX.COM<br />
              8 Densmore Way<br />
              Folsom, CA 95630<br />
              United States
            </p>
          </div>
          <p className="text-sm">
            For data deletion requests, visit our <Link to="/contact" className="text-brand-gold hover:underline">Contact page</Link> and select "Data Deletion Request"
          </p>
        </div>
      </div>

      <div className="text-center py-8">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Privacy;
