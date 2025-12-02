import { getPaymentProvider, isMobileApp } from './payment-router';
import { appleIAP } from './apple-iap';
import { googleBilling } from './google-billing';
import { supabase } from '../supabase';

export interface PaymentService {
  initialize(): Promise<void>;
  purchase(planId: string): Promise<void>;
  restorePurchases(): Promise<void>;
  checkSubscriptionStatus(): Promise<boolean>;
}

class UnifiedPaymentService implements PaymentService {
  async initialize(): Promise<void> {
    if (!isMobileApp()) {
      return;
    }

    const provider = getPaymentProvider();

    try {
      if (provider === 'apple') {
        await appleIAP.initialize();
      } else if (provider === 'google') {
        await googleBilling.initialize();
      }
    } catch (error) {
      console.error('Failed to initialize payment service:', error);
    }
  }

  async purchase(planId: string): Promise<void> {
    const provider = getPaymentProvider();

    if (provider === 'stripe') {
      throw new Error('Use Stripe checkout for web purchases');
    }

    if (provider === 'apple') {
      await appleIAP.purchase(planId);
    } else if (provider === 'google') {
      await googleBilling.purchase(planId);
    }
  }

  async restorePurchases(): Promise<void> {
    const provider = getPaymentProvider();

    if (provider === 'stripe') {
      return;
    }

    if (provider === 'apple') {
      await appleIAP.restorePurchases();
    } else if (provider === 'google') {
      await googleBilling.restorePurchases();
    }
  }

  async checkSubscriptionStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      const { data, error } = await supabase
        .rpc('check_premium_status', { user_id_param: user.id });

      if (error) {
        console.error('Error checking subscription status:', error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async getActiveSubscription() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .rpc('get_active_subscription', { user_id_param: user.id });

      if (error) {
        console.error('Error getting active subscription:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting active subscription:', error);
      return null;
    }
  }
}

export const paymentService = new UnifiedPaymentService();
