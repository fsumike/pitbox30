import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Check, Loader2, AlertCircle, CheckCircle, Star, Shield, Zap, Clock, Database, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePromoCode } from '../hooks/usePromoCode';
import { PremiumCongratsModal } from '../components/PremiumCongratsModal';

function Upgrade() {
  const navigate = useNavigate();
  const { user, refreshPremiumStatus, hasPremium } = useAuth();
  const { validatePromoCode, applyPromoCode, loading, error } = usePromoCode();
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoUsed, setPromoUsed] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    setPromoValid(validatePromoCode(code));
    
    // Reset the used flag when the code changes
    setPromoUsed(false);
    
    // If the code is valid, check if it's already been used
    if (validatePromoCode(code)) {
      checkPromoCodeUsed(code);
    }
  };
  
  const checkPromoCodeUsed = async (code: string) => {
    try {
      // Normalize the code: lowercase everything, then capitalize first letter
      const normalizedCode = code.toLowerCase();
      const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
      
      // Check if any user has already used this promo code
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('promo_code', capitalizedCode)
        .limit(1);
        
      if (error) throw error;
      
      // If data exists, the promo code has already been used
      const isUsed = data && data.length > 0;
      setPromoUsed(isUsed);
      
      if (isUsed) {
        setPromoValid(false);
      }
      
      return isUsed;
    } catch (err) {
      console.error('Error checking if promo code is used:', err);
      return false;
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoValid || promoUsed) return;

    const success = await applyPromoCode(promoCode);
    if (success) {
      await refreshPremiumStatus();
      setShowCongratsModal(true);
      setPromoCode('');
      setPromoValid(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-brand-gold/20 mb-4">
            <Gift className="w-12 h-12 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Upgrade to Premium</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock all features and get the most out of PIT-BOX.COM with our premium subscription.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {hasPremium && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-brand-gold/20 to-yellow-600/20 border-2 border-brand-gold text-gray-800 dark:text-gray-200 flex items-center gap-2 max-w-md mx-auto">
            <Star className="w-5 h-5 flex-shrink-0 text-brand-gold fill-brand-gold" />
            <span className="font-semibold">You have Premium Access!</span>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="max-w-md mx-auto mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand-gold" />
            Enter Promo Code
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have a promo code, enter it below to get premium access.
          </p>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={promoCode}
                onChange={handlePromoCodeChange}
                className={`w-full p-3 rounded-lg border ${
                  promoValid === true && !promoUsed
                    ? 'border-green-500' 
                    : promoValid === false || promoUsed
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your promo code"
              />
              {promoValid === true && !promoUsed && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            
            {promoValid === false && promoCode && !promoUsed && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Invalid promo code.
              </p>
            )}
            
            {promoUsed && (
              <p className="text-sm text-red-600 dark:text-red-400">
                This promo code has already been used.
              </p>
            )}
            
            <button
              onClick={handleApplyPromoCode}
              disabled={!promoValid || promoUsed || loading || hasPremium}
              className="w-full py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Applying...
                </>
              ) : hasPremium ? (
                <>
                  <Check className="w-5 h-5" />
                  Premium Active
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Apply Promo Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Star className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Unlimited Setups</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save and manage unlimited setup configurations for all your racing vehicles.
            </p>
          </div>
          
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Database className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get detailed performance analytics and insights to optimize your racing strategy.
            </p>
          </div>
          
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Settings className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Tools</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access specialized setup tools and calculators for professional-level tuning.
            </p>
          </div>
          
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Shield className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Priority Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get priority customer support and assistance from our racing experts.
            </p>
          </div>
          
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Zap className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Early Access</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to try new features and updates before they're released.
            </p>
          </div>
          
          <div className="glass-panel p-6 text-center transform hover:scale-105 transition-all duration-300">
            <Clock className="w-8 h-8 text-brand-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Historical Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access and analyze your historical racing data for long-term improvement.
            </p>
          </div>
        </div>
      </div>

      <PremiumCongratsModal
        isOpen={showCongratsModal}
        onClose={() => setShowCongratsModal(false)}
      />
    </div>
  );
}

export default Upgrade;