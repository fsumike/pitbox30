import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Star, Zap, Clock, Database, Settings } from 'lucide-react';
import SubscriptionPlans from '../components/SubscriptionPlans';
import { useStripe } from '../contexts/StripeContext';

export default function Subscription() {
  const navigate = useNavigate();
  const { subscriptionStatus } = useStripe();

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="liquid-orb liquid-orb-gold w-72 h-72 -top-20 -right-20 fixed z-0" />
      <div className="liquid-orb liquid-orb-amber w-56 h-56 bottom-20 -left-20 fixed z-0" style={{ animationDelay: '-6s' }} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors relative z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="liquid-glass-hero p-8 relative z-10">
        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-4 rounded-full bg-brand-gold/20 mb-4 relative">
            <div className="absolute inset-0 bg-amber-400/30 blur-xl rounded-full" />
            <Shield className="w-12 h-12 text-brand-gold relative z-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">PitBox Premium Access</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Subscribe to save and access unlimited racing setup sheets. Everything else is free!
          </p>
        </div>

        {/* What's Free Banner */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">Always Free Features</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 dark:text-gray-300">
              <span className="px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full">✓ Racing Community</span>
              <span className="px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full">✓ Swap Meet Marketplace</span>
              <span className="px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full">✓ All Racing Tools</span>
              <span className="px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full">✓ Track Locations</span>
              <span className="px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full">✓ Events & Challenges</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Subscriptions only required for saving and accessing your racing setup sheets
            </p>
          </div>
        </div>

        <SubscriptionPlans />

        {/* Setup Sheet Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative z-10">
          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Star className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Unlimited Setup Sheets</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save unlimited racing setup sheets for all your vehicles and tracks.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Database className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Multi-Device Sync</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access your setup sheets on phone, tablet, and computer with automatic sync.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Settings className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Setup Comparison</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Compare multiple setups side-by-side to find your winning configuration.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Shield className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Setup Encryption</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Premium tier includes end-to-end encryption for your setup data.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Zap className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Templates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Premium includes professional setup templates for faster data entry.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Clock className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Setup History</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your setup changes over time and see what worked at each track.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}