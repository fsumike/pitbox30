import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useStripe } from '../contexts/StripeContext';

interface SubscriptionGateProps {
  children: React.ReactNode;
  requiredTier?: 'basic' | 'premium';
}

export default function SubscriptionGate({ children, requiredTier = 'basic' }: SubscriptionGateProps) {
  const { subscriptionStatus, isLoading, error } = useStripe();
  const navigate = useNavigate();
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-gold mr-3" />
        <span>Checking subscription...</span>
      </div>
    );
  }
  
  // Don't block access on error - treat as no subscription
  // This prevents users from getting locked out due to transient errors
  
  // Check if user has required subscription
  const hasAccess = 
    (requiredTier === 'basic' && (subscriptionStatus === 'basic' || subscriptionStatus === 'premium')) ||
    (requiredTier === 'premium' && subscriptionStatus === 'premium');
  
  if (!hasAccess) {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-brand-gold" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Subscription Required</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {requiredTier === 'premium' 
            ? 'This feature requires an Encrypted Setup Access subscription.'
            : 'This feature requires a subscription.'}
        </p>
        <button
          onClick={() => navigate('/subscription')}
          className="btn-primary"
        >
          View Subscription Plans
        </button>
      </div>
    );
  }
  
  // User has access, render children
  return <>{children}</>;
}