-- Add promo_code and has_premium columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS promo_code text,
ADD COLUMN IF NOT EXISTS has_premium boolean DEFAULT false;

-- Add unique constraint to promo_code to ensure each code can only be used once
ALTER TABLE profiles
ADD CONSTRAINT unique_promo_code UNIQUE (promo_code);