/*
  # Add Multi-Platform Payment Support
  
  ## Overview
  This migration adds support for multiple payment providers (Stripe, Apple, Google)
  to enable the same app to accept payments from web (Stripe) and mobile (Apple/Google).
  
  ## Changes
  
  ### 1. User Subscriptions Table Updates
  - Add `payment_provider` column to track which system processed the payment
  - Add `apple_transaction_id` for Apple In-App Purchase receipts
  - Add `google_purchase_token` for Google Play Billing tokens
  - Add `original_transaction_date` for tracking first purchase
  - Add `expires_date` for subscription expiration tracking
  - Rename `subscription_id` to `stripe_subscription_id` for clarity (keep backward compatibility)
  
  ### 2. New Functions
  - `check_premium_status`: Universal function to check if user has active premium from ANY provider
  - `get_active_subscription`: Get user's active subscription details from any provider
  
  ## Security
  - Maintains existing RLS policies
  - All new columns are protected by existing policies
*/

-- Add new columns to user_subscriptions table
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'stripe' CHECK (payment_provider IN ('stripe', 'apple', 'google')),
ADD COLUMN IF NOT EXISTS apple_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS google_purchase_token TEXT,
ADD COLUMN IF NOT EXISTS original_transaction_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS expires_date TIMESTAMPTZ;

-- Add stripe_subscription_id as alias (for clarity, but keep subscription_id for backward compatibility)
-- We'll use subscription_id for stripe subscriptions going forward
COMMENT ON COLUMN user_subscriptions.subscription_id IS 'Stripe subscription ID (for stripe provider) or general subscription identifier';

-- Create indexes for faster lookups by transaction IDs
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_apple_transaction 
ON user_subscriptions(apple_transaction_id) WHERE apple_transaction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_google_token 
ON user_subscriptions(google_purchase_token) WHERE google_purchase_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_provider_status
ON user_subscriptions(payment_provider, status);

-- Create function to check premium status from any provider
CREATE OR REPLACE FUNCTION check_premium_status(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_active_sub BOOLEAN;
BEGIN
  -- Check if user has any active subscription from any provider
  SELECT EXISTS (
    SELECT 1 
    FROM user_subscriptions 
    WHERE user_id = user_id_param 
    AND status = 'active'
    AND (
      -- Stripe: check subscription_id
      (payment_provider = 'stripe' AND subscription_id IS NOT NULL)
      OR
      -- Apple: check apple_transaction_id and expiry
      (payment_provider = 'apple' AND apple_transaction_id IS NOT NULL AND (expires_date IS NULL OR expires_date > NOW()))
      OR
      -- Google: check google_purchase_token and expiry
      (payment_provider = 'google' AND google_purchase_token IS NOT NULL AND (expires_date IS NULL OR expires_date > NOW()))
    )
  ) INTO has_active_sub;
  
  RETURN has_active_sub;
END;
$$;

-- Create function to get user's active subscription details
CREATE OR REPLACE FUNCTION get_active_subscription(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  payment_provider TEXT,
  status TEXT,
  tier TEXT,
  current_period_end TIMESTAMPTZ,
  expires_date TIMESTAMPTZ,
  subscription_id TEXT,
  apple_transaction_id TEXT,
  google_purchase_token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.payment_provider,
    s.status,
    s.tier,
    s.current_period_end,
    s.expires_date,
    s.subscription_id,
    s.apple_transaction_id,
    s.google_purchase_token
  FROM user_subscriptions s
  WHERE s.user_id = user_id_param
  AND s.status = 'active'
  AND (
    (s.payment_provider = 'stripe' AND s.subscription_id IS NOT NULL)
    OR
    (s.payment_provider = 'apple' AND s.apple_transaction_id IS NOT NULL AND (s.expires_date IS NULL OR s.expires_date > NOW()))
    OR
    (s.payment_provider = 'google' AND s.google_purchase_token IS NOT NULL AND (s.expires_date IS NULL OR s.expires_date > NOW()))
  )
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$;