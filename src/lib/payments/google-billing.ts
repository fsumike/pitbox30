import { supabase } from '../supabase';
import { getProductIdForPlan } from './payment-router';
import { Capacitor } from '@capacitor/core';

interface GoogleProduct {
  productId: string;
  type: string;
  price: string;
  title: string;
  description: string;
  currency: string;
}

interface GooglePurchase {
  orderId: string;
  purchaseToken: string;
  productId: string;
  purchaseTime: number;
  purchaseState: number;
}

export class GoogleBillingService {
  private products: GoogleProduct[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      throw new Error('Google Play Billing is only available on Android');
    }

    try {
      const cordovaIAP = (window as any).CdvPurchase;
      if (!cordovaIAP) {
        throw new Error('Cordova Purchase plugin not available');
      }

      const store = cordovaIAP.store;

      store.verbosity = store.INFO;

      store.register([
        {
          id: 'basic_monthly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'basic_quarterly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'basic_yearly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'premium_monthly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'premium_quarterly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'premium_yearly',
          type: store.PAID_SUBSCRIPTION
        }
      ]);

      store.when('product').approved((product: any) => {
        product.finish();
      });

      store.when('product').verified((receipt: any) => {
        this.handlePurchaseVerification(receipt);
      });

      store.when('product').updated((product: any) => {
        const mappedProduct: GoogleProduct = {
          productId: product.id,
          type: product.type,
          price: product.price,
          title: product.title,
          description: product.description,
          currency: product.currency
        };

        const index = this.products.findIndex(p => p.productId === product.id);
        if (index >= 0) {
          this.products[index] = mappedProduct;
        } else {
          this.products.push(mappedProduct);
        }
      });

      await store.ready();
      store.refresh();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Billing:', error);
      throw new Error('Google Play Billing is not available on this platform');
    }
  }

  async getProducts(): Promise<GoogleProduct[]> {
    await this.initialize();
    return this.products;
  }

  async purchase(planId: string): Promise<void> {
    await this.initialize();

    const productId = getProductIdForPlan(planId);
    const cordovaIAP = (window as any).CdvPurchase;
    const store = cordovaIAP.store;

    const product = store.get(productId);

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (!product.canPurchase) {
      throw new Error(`Product ${productId} cannot be purchased`);
    }

    store.order(productId);
  }

  async restorePurchases(): Promise<void> {
    await this.initialize();

    const cordovaIAP = (window as any).CdvPurchase;
    const store = cordovaIAP.store;

    store.refresh();
  }

  private async handlePurchaseVerification(receipt: any): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const purchaseToken = receipt.transaction?.purchaseToken || receipt.id;
      const productId = receipt.productId;

      let tier = 'basic';
      if (productId.includes('premium')) {
        tier = 'premium';
      }

      const expiresDate = receipt.expiryDate ? new Date(receipt.expiryDate) : null;

      let periodEnd = expiresDate;
      if (!periodEnd) {
        if (productId.includes('yearly')) {
          periodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        } else if (productId.includes('quarterly')) {
          periodEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        } else {
          periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_id: purchaseToken,
          payment_provider: 'google',
          google_purchase_token: purchaseToken,
          status: 'active',
          tier: tier,
          current_period_end: periodEnd,
          expires_date: expiresDate,
          original_transaction_date: receipt.purchaseDate ? new Date(receipt.purchaseDate) : new Date(),
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to save Google Play subscription:', error);
        throw error;
      }

      } catch (error) {
      console.error('Error handling Google Play verification:', error);
      throw error;
    }
  }
}

export const googleBilling = new GoogleBillingService();
