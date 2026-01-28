import { supabase } from '../supabase';

export interface PaymentService {
  initialize(): Promise<void>;
  checkSubscriptionStatus(): Promise<boolean>;
  getActiveSubscription(): Promise<any>;
}

class StripePaymentService implements PaymentService {
  async initialize(): Promise<void> {
    return;
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

export const paymentService = new StripePaymentService();
