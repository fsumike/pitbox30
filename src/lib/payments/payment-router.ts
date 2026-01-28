import { Capacitor } from '@capacitor/core';

export type PaymentProvider = 'stripe';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'basic' | 'premium';
  price: number;
  interval: 'month' | 'quarter' | 'year';
  features: string[];
  stripeProductId?: string;
}

export function getPaymentProvider(): PaymentProvider {
  return 'stripe';
}

export function isMobileApp(): boolean {
  return Capacitor.isNativePlatform();
}

export function isWebPlatform(): boolean {
  return !Capacitor.isNativePlatform();
}

export function getPlatformName(): string {
  return 'Stripe';
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic_monthly',
    name: 'Basic Setup Access - Monthly',
    tier: 'basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Save unlimited racing setups',
      'Access setups on all devices',
      'Basic setup sheet templates',
      'Setup comparison tools',
      'Plus: FREE Community, Swap Meet & All Tools'
    ],
    stripeProductId: 'price_1RRU4fANikXpQi11v5yoYilZ'
  },
  {
    id: 'basic_quarterly',
    name: 'Basic Setup Access - Quarterly',
    tier: 'basic',
    price: 24.99,
    interval: 'quarter',
    features: [
      'Save unlimited racing setups',
      'Access setups on all devices',
      'Basic setup sheet templates',
      'Setup comparison tools',
      'Plus: FREE Community, Swap Meet & All Tools',
      'Save $5 vs monthly'
    ],
    stripeProductId: 'price_1RRU4fANikXpQi11xJ5EG1vx'
  },
  {
    id: 'basic_yearly',
    name: 'Basic Setup Access - Yearly',
    tier: 'basic',
    price: 99.99,
    interval: 'year',
    features: [
      'Save unlimited racing setups',
      'Access setups on all devices',
      'Basic setup sheet templates',
      'Setup comparison tools',
      'Plus: FREE Community, Swap Meet & All Tools',
      'Save $20 vs monthly'
    ],
    stripeProductId: 'price_1RRU4fANikXpQi11GZmyUEwK'
  },
  {
    id: 'premium_monthly',
    name: 'Encrypted Setup Access - Monthly',
    tier: 'premium',
    price: 12.99,
    interval: 'month',
    features: [
      'All Basic setup features',
      'End-to-end setup encryption',
      'Advanced setup templates',
      'Priority support',
      'Early access to new features',
      'Plus: FREE Community, Swap Meet & All Tools'
    ],
    stripeProductId: 'price_1RRU7iANikXpQi11N4km6XFf'
  },
  {
    id: 'premium_quarterly',
    name: 'Encrypted Setup Access - Quarterly',
    tier: 'premium',
    price: 34.99,
    interval: 'quarter',
    features: [
      'All Basic setup features',
      'End-to-end setup encryption',
      'Advanced setup templates',
      'Priority support',
      'Early access to new features',
      'Plus: FREE Community, Swap Meet & All Tools',
      'Save $4 vs monthly'
    ],
    stripeProductId: 'price_1RRUhCANikXpQi11RVy5KKbK'
  },
  {
    id: 'premium_yearly',
    name: 'Encrypted Setup Access - Yearly',
    tier: 'premium',
    price: 134.99,
    interval: 'year',
    features: [
      'All Basic setup features',
      'End-to-end setup encryption',
      'Advanced setup templates',
      'Priority support',
      'Early access to new features',
      'Plus: FREE Community, Swap Meet & All Tools',
      'Save $21 vs monthly'
    ],
    stripeProductId: 'price_1RRUhCANikXpQi11Ya6mzjHl'
  }
];

export function getProductIdForPlan(planId: string): string {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Plan ${planId} not found`);
  }

  return plan.stripeProductId || planId;
}
