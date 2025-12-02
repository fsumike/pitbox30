import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, CheckCircle, AlertCircle, Loader2, Smartphone, Globe } from 'lucide-react';
import { useStripe } from '../contexts/StripeContext';
import { format } from 'date-fns';
import { isMobileApp, getPlatformName } from '../lib/payments/payment-router';

export default function SubscriptionStatus() {
  const { subscriptionStatus, subscriptionPeriodEnd, createPortalSession, isLoading, error } = useStripe();
  const navigate = useNavigate();
  const [portalLoading, setPortalLoading] = useState(false);

  const isNativeMobile = isMobileApp();
  const platformName = getPlatformName();

  const handleManageSubscription = async () => {
    if (subscriptionStatus === 'none') {
      navigate('/subscription');
      return;
    }

    if (isNativeMobile) {
      alert(`To manage your ${platformName} subscription, please open your device settings:\n\niOS: Settings > Your Name > Subscriptions\nAndroid: Play Store > Menu > Subscriptions`);
      return;
    }

    setPortalLoading(true);
    const url = await createPortalSession();
    if (url) {
      window.location.href = url;
    } else {
      // If portal session fails (no Stripe customer), redirect to subscription page
      navigate('/subscription');
    }
    setPortalLoading(false);
  };
  
  if (isLoading) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-gold mr-3" />
        <span>Loading subscription status...</span>
      </div>
    );
  }
  
  // Don't show error state in subscription status component
  // Let the user try to manage their subscription regardless
  
  if (subscriptionStatus === 'none') {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-gray-400" />
          <div>
            <h3 className="font-semibold">No Active Subscription</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to access premium features
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/subscription')}
          className="btn-primary w-full"
        >
          View Plans
        </button>
      </div>
    );
  }
  
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="font-semibold">
            {subscriptionStatus === 'premium' ? 'Encrypted Setup Access' : 'Basic Setup Access'}
          </h3>
          {subscriptionPeriodEnd && (
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Renews {format(subscriptionPeriodEnd, 'MMM d, yyyy')}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleManageSubscription}
        disabled={portalLoading}
        className="btn-secondary w-full flex items-center justify-center gap-2"
      >
        {portalLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          'Manage Subscription'
        )}
      </button>
    </div>
  );
}