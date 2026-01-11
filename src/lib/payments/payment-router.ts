import { Capacitor } from '@capacitor/core';

export type PaymentProvider = 'stripe' | 'apple' | 'google';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'basic' | 'premium';
  price: number;
  interval: 'month' | 'quarter' | 'year';
  features: string[];
  stripeProductId?: string;
  appleSku?: string;
  googleSku?: string;
}

export function getPaymentProvider(): PaymentProvider {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    return 'apple';
  }

  if (platform === 'android') {
    return 'google';
  }

  return 'stripe';
}

export function isMobileApp(): boolean {
  return Capacitor.isNativePlatform();
}

export function isWebPlatform(): boolean {
  return !Capacitor.isNativePlatform();
}

export function getPlatformName(): string {
  const provider = getPaymentProvider();
  switch (provider) {
    case 'apple':
      return 'App Store';
    case 'google':
      return 'Google Play';
    case 'stripe':
      return 'Web';
    default:
      return 'Unknown';
  }
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
    stripeProductId: 'price_1RRU4fANikXpQi11v5yoYilZ',
    appleSku: 'com.pitbox.app.setupsheets.basic.monthly',
    googleSku: 'basic_monthly'
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
    stripeProductId: 'price_1RRU4fANikXpQi11xJ5EG1vx',
    appleSku: 'com.pitbox.app.setupsheets.basic.quarterly',
    googleSku: 'basic_quarterly'
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
    stripeProductId: 'price_1RRU4fANikXpQi11GZmyUEwK',
    appleSku: 'com.pitbox.app.setupsheets.basic.yearly',
    googleSku: 'basic_yearly'
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
    stripeProductId: 'price_1RRU7iANikXpQi11N4km6XFf',
    appleSku: 'com.pitbox.app.setupsheets.premium.monthly',
    googleSku: 'premium_monthly'
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
    stripeProductId: 'price_1RRUhCANikXpQi11RVy5KKbK',
    appleSku: 'com.pitbox.app.setupsheets.premium.quarterly',
    googleSku: 'premium_quarterly'
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
    stripeProductId: 'price_1RRUhCANikXpQi11Ya6mzjHl',
    appleSku: 'com.pitbox.app.setupsheets.premium.yearly',
    googleSku: 'premium_yearly'
  }
];

export function getProductIdForPlan(planId: string): string {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error(`Plan ${planId} not found`);
  }

  const provider = getPaymentProvider();

  switch (provider) {
    case 'stripe':
      return plan.stripeProductId || planId;
    case 'apple':
      return plan.appleSku || planId;
    case 'google':
      return plan.googleSku || planId;
    default:
      return planId;
  }
}
