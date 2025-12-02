/*
  # Add Promo Code to Profiles

  1. Changes
    - Add promo_code column to profiles table
    - Add has_premium column to profiles table to track premium access
  
  2. Security
    - No changes to existing RLS policies
*/

-- Add promo_code and has_premium columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS promo_code text,
ADD COLUMN IF NOT EXISTS has_premium boolean DEFAULT false;