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
            Unlock all features and get the most out of PIT-BOX.COM with our premium subscription plans.
          </p>
        </div>

        <SubscriptionPlans />

        {/* Premium Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 relative z-10">
          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Star className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Unlimited Setups</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save and manage unlimited setup configurations for all your racing vehicles.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Database className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get detailed performance analytics and insights to optimize your racing strategy.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Settings className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access specialized setup tools and calculators for professional-level tuning.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Shield className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Priority Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get priority customer support and assistance from our racing experts.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Zap className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Early Access</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to try new features and updates before they're released.
            </p>
          </div>

          <div className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300">
            <Clock className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Historical Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access and analyze your historical racing data for long-term improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}