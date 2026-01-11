import { supabase } from '../supabase';
import { getProductIdForPlan } from './payment-router';
import { Capacitor } from '@capacitor/core';

interface AppleIAPProduct {
  productIdentifier: string;
  price: string;
  currency: string;
  title: string;
  description: string;
}

interface AppleIAPPurchase {
  transactionId: string;
  productId: string;
  transactionDate: string;
  transactionReceipt: string;
}

export class AppleIAPService {
  private products: AppleIAPProduct[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      throw new Error('Apple In-App Purchase is only available on iOS');
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
          id: 'com.pitbox.app.setupsheets.basic.monthly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'com.pitbox.app.setupsheets.basic.quarterly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'com.pitbox.app.setupsheets.basic.yearly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'com.pitbox.app.setupsheets.premium.monthly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'com.pitbox.app.setupsheets.premium.quarterly',
          type: store.PAID_SUBSCRIPTION
        },
        {
          id: 'com.pitbox.app.setupsheets.premium.yearly',
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
        const mappedProduct: AppleIAPProduct = {
          productIdentifier: product.id,
          price: product.price,
          currency: product.currency,
          title: product.title,
          description: product.description
        };

        const index = this.products.findIndex(p => p.productIdentifier === product.id);
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
      console.error('Failed to initialize Apple IAP:', error);
      throw new Error('Apple In-App Purchase is not available on this platform');
    }
  }

  async getProducts(): Promise<AppleIAPProduct[]> {
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

      const transactionId = receipt.id || receipt.transaction?.transactionIdentifier;
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
          subscription_id: transactionId,
          payment_provider: 'apple',
          apple_transaction_id: transactionId,
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
        console.error('Failed to save Apple IAP subscription:', error);
        throw error;
      }

      } catch (error) {
      console.error('Error handling Apple IAP verification:', error);
      throw error;
    }
  }
}

export const appleIAP = new AppleIAPService();
