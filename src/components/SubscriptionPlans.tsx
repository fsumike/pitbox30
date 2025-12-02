import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Zap, Clock, Database, Settings, Loader2, AlertCircle, Smartphone, Globe } from 'lucide-react';
import { useStripe, tiers } from '../contexts/StripeContext';
import { useAuth } from '../contexts/AuthContext';
import { getPaymentProvider, isMobileApp, getPlatformName, SUBSCRIPTION_PLANS } from '../lib/payments/payment-router';
import { paymentService } from '../lib/payments/payment-service';

interface PricingOptionProps {
  title: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}

function PricingOption({ title, price, isSelected, onClick }: PricingOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all ${
        isSelected 
          ? 'border-brand-gold bg-brand-gold/10' 
          : 'border-gray-200 dark:border-gray-700 hover:border-brand-gold/50'
      }`}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-lg font-bold">${price}</div>
    </button>
  );
}

export default function SubscriptionPlans() {
  const { createCheckoutSession, subscriptionStatus, isLoading, error } = useStripe();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly' | 'quarterly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [mobileError, setMobileError] = useState<string>('');

  const paymentProvider = getPaymentProvider();
  const platformName = getPlatformName();
  const isNativeMobile = isMobileApp();

  useEffect(() => {
    if (isNativeMobile) {
      paymentService.initialize().catch(err => {
        console.error('Failed to initialize payment service:', err);
        setMobileError('Payment system initialization failed. Please try again.');
      });
    }
  }, [isNativeMobile]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    setCheckoutLoading(true);
    setMobileError('');

    try {
      if (isNativeMobile) {
        const planId = `${selectedTier}_${selectedInterval}`;
        await paymentService.purchase(planId);
      } else {
        const tier = tiers.find(t => t.id === selectedTier);
        if (!tier) {
          console.error('Invalid tier selected');
          setCheckoutLoading(false);
          return;
        }

        let priceId;
        if (selectedInterval === 'monthly') {
          priceId = tier.stripePriceIdMonthly;
        } else if (selectedInterval === 'yearly') {
          priceId = tier.stripePriceIdYearly;
        } else {
          priceId = tier.stripePriceIdQuarterly;
        }

        const url = await createCheckoutSession(priceId);
        if (url) {
          window.location.href = url;
        }
      }
    } catch (err: any) {
      setMobileError(err?.message || 'Payment failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (!isNativeMobile) return;

    setCheckoutLoading(true);
    setMobileError('');

    try {
      await paymentService.restorePurchases();
      const isPremium = await paymentService.checkSubscriptionStatus();

      if (isPremium) {
        alert('Purchases restored successfully!');
        window.location.reload();
      } else {
        setMobileError('No previous purchases found.');
      }
    } catch (err: any) {
      setMobileError(err?.message || 'Failed to restore purchases.');
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  // If user already has a subscription, show different content
  if (subscriptionStatus === 'basic' || subscriptionStatus === 'premium') {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're Subscribed!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You currently have the {subscriptionStatus === 'premium' ? 'Encrypted' : 'Basic'} Setup Access plan.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="btn-primary"
        >
          Manage Subscription
        </button>
      </div>
    );
  }
  
  return (
    <div className="glass-panel p-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        {isNativeMobile ? (
          <Smartphone className="w-6 h-6 text-brand-gold" />
        ) : (
          <Globe className="w-6 h-6 text-brand-gold" />
        )}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Paying via {platformName}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Subscription Plan</h2>

      {(error || mobileError) && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {mobileError || error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {tiers.map((tier) => (
          <div 
            key={tier.id}
            className={`glass-panel p-6 cursor-pointer transition-all ${
              selectedTier === tier.id 
                ? 'ring-2 ring-brand-gold' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedTier(tier.id as 'basic' | 'premium')}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tier.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full ${
                selectedTier === tier.id
                  ? 'bg-brand-gold'
                  : 'bg-gray-200 dark:bg-gray-700'
              } flex items-center justify-center`}>
                {selectedTier === tier.id && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-2xl font-bold text-center">
              ${selectedInterval === 'monthly' 
                ? tier.priceMonthly 
                : selectedInterval === 'yearly'
                ? tier.priceYearly
                : tier.priceQuarterly}
              <span className="text-sm font-normal text-gray-500">
                /{selectedInterval === 'yearly' ? 'year' : selectedInterval === 'quarterly' ? '3 months' : 'month'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Billing Interval</h3>
        <div className="grid grid-cols-3 gap-4">
          <PricingOption
            title="Monthly"
            price={tiers.find(t => t.id === selectedTier)?.priceMonthly || 0}
            isSelected={selectedInterval === 'monthly'}
            onClick={() => setSelectedInterval('monthly')}
          />
          <PricingOption
            title="Quarterly"
            price={tiers.find(t => t.id === selectedTier)?.priceQuarterly || 0}
            isSelected={selectedInterval === 'quarterly'}
            onClick={() => setSelectedInterval('quarterly')}
          />
          <PricingOption
            title="Yearly"
            price={tiers.find(t => t.id === selectedTier)?.priceYearly || 0}
            isSelected={selectedInterval === 'yearly'}
            onClick={() => setSelectedInterval('yearly')}
          />
        </div>
        {selectedInterval === 'yearly' && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Save up to 17% with annual billing!
          </p>
        )}
      </div>
      
      <button
        onClick={handleSubscribe}
        disabled={isLoading || checkoutLoading}
        className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
      >
        {checkoutLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Subscribe Now
          </>
        )}
      </button>

      {isNativeMobile && (
        <button
          onClick={handleRestorePurchases}
          disabled={isLoading || checkoutLoading}
          className="w-full mt-3 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-brand-gold transition-colors"
        >
          Restore Purchases
        </button>
      )}

      <p className="text-sm text-center text-gray-500 mt-4">
        {isNativeMobile ? (
          <>Secure payment processed by {platformName}. Cancel anytime.</>
        ) : (
          <>Secure payment processed by Stripe. Cancel anytime.</>
        )}
      </p>
    </div>
  );
}