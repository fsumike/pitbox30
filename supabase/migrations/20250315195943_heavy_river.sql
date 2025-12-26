/*
  # Add contact information to listings

  1. Changes
    - Add contact information fields to listings table
    - Add contact preferences
  
  2. Security
    - No changes to existing RLS policies
*/

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS preferred_contact text CHECK (preferred_contact IN ('phone', 'email'));