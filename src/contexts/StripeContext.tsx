import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Get the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceMonthly: number;
  priceYearly: number;
  priceQuarterly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  stripePriceIdQuarterly: string;
}

interface StripeContextType {
  createCheckoutSession: (priceId: string) => Promise<string | null>;
  createPortalSession: () => Promise<string | null>;
  subscriptionStatus: 'none' | 'basic' | 'premium' | 'loading';
  subscriptionPeriodEnd: Date | null;
  isLoading: boolean;
  error: string | null;
  tiers: SubscriptionTier[];
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const tiers: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Basic Setup Access',
    description: 'Stores and protects your setups with secure cloud storage',
    features: [
      'Unlimited setup saves',
      'Secure cloud storage',
      'Access on all your devices',
      'Basic setup templates',
      'Community access'
    ],
    priceMonthly: 9.99,
    priceYearly: 99.99,
    priceQuarterly: 24.99,
    stripePriceIdMonthly: 'price_1RRU4fANikXpQi11v5yoYilZ',
    stripePriceIdYearly: 'price_1RRU4fANikXpQi11GZmyUEwK',
    stripePriceIdQuarterly: 'price_1RRU4fANikXpQi11xJ5EG1vx'
  },
  {
    id: 'premium',
    name: 'Encrypted Setup Access',
    description: 'Highest industry standards with end-to-end encryption and advanced features',
    features: [
      'All Basic features',
      'End-to-end encryption',
      'Maximum data privacy',
      'Advanced setup templates',
      'Priority support',
      'Early access to new features'
    ],
    priceMonthly: 12.99,
    priceYearly: 134.99,
    priceQuarterly: 34.99,
    stripePriceIdMonthly: 'price_1RRU7iANikXpQi11N4km6XFf',
    stripePriceIdYearly: 'price_1RRUhCANikXpQi11Ya6mzjHl',
    stripePriceIdQuarterly: 'price_1RRUhCANikXpQi11RVy5KKbK'
  }
];

// Retry configuration
const RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  retries = RETRY_COUNT,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithExponentialBackoff(operation, retries - 1, delay * 2);
  }
}

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'basic' | 'premium' | 'loading'>('loading');
  const [subscriptionPeriodEnd, setSubscriptionPeriodEnd] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    } else {
      setSubscriptionStatus('none');
      setSubscriptionPeriodEnd(null);
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // First check if user has premium access via promo code
      const { data: profile, error: profileError } = await retryWithExponentialBackoff(() =>
        supabase
          .from('profiles')
          .select('has_premium')
          .eq('id', user.id)
          .single()
      );

      if (profileError) throw profileError;

      if (profile?.has_premium) {
        setSubscriptionStatus('premium');
        setSubscriptionPeriodEnd(null);
        setIsLoading(false);
        return;
      }

      // Check subscription from ANY payment provider using our new universal function
      const { data: activeSubData, error: activeSubError } = await retryWithExponentialBackoff(() =>
        supabase.rpc('get_active_subscription', { user_id_param: user.id })
      );

      if (activeSubError) {
        console.error('Error fetching active subscription:', activeSubError);
      }

      if (activeSubData && activeSubData.length > 0) {
        const subscription = activeSubData[0];

        setSubscriptionStatus(subscription.tier === 'yearly' ? 'premium' : subscription.tier || 'basic');

        const periodEnd = subscription.expires_date || subscription.current_period_end;
        setSubscriptionPeriodEnd(periodEnd ? new Date(periodEnd) : null);
      } else {
        // Fallback: try checking via Stripe edge function for backward compatibility
        try {
          const { data, error: subscriptionError } = await retryWithExponentialBackoff(() =>
            supabase.functions.invoke('check-subscription', {
              body: { userId: user.id }
            })
          );

          if (subscriptionError) throw subscriptionError;

          if (data?.subscription) {
            const { status, tier, current_period_end } = data.subscription;

            if (status === 'active' || status === 'trialing') {
              setSubscriptionStatus(tier || 'basic');
              setSubscriptionPeriodEnd(current_period_end ? new Date(current_period_end * 1000) : null);
            } else {
              setSubscriptionStatus('none');
              setSubscriptionPeriodEnd(null);
            }
          } else {
            setSubscriptionStatus('none');
            setSubscriptionPeriodEnd(null);
          }
        } catch (err) {
          console.error('Error checking Stripe subscription:', err);
          setSubscriptionStatus('none');
          setSubscriptionPeriodEnd(null);
        }
      }
    } catch (err) {
      console.error('Error checking subscription status:', err);
      // Don't set error state for subscription check failures
      // Just default to no subscription and let user proceed
      setSubscriptionStatus('none');
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async (priceId: string): Promise<string | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await retryWithExponentialBackoff(() =>
        supabase.functions.invoke('create-checkout-session', {
          body: { 
            priceId,
            userId: user.id,
            customerEmail: user.email
          }
        })
      );

      if (error) throw error;
      return data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      // Don't set persistent error state - just return null
      // The subscription page will handle this gracefully
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createPortalSession = async (): Promise<string | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await retryWithExponentialBackoff(() =>
        supabase.functions.invoke('create-portal-session', {
          body: { userId: user.id }
        })
      );

      if (error) throw error;
      return data.url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      // Don't set error state - just log it and return null
      // The calling component will handle the failure gracefully
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StripeContext.Provider
      value={{
        createCheckoutSession,
        createPortalSession,
        subscriptionStatus,
        subscriptionPeriodEnd,
        isLoading,
        error,
        tiers
      }}
    >
      {children}
    </StripeContext.Provider>
  );
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}