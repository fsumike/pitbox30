/*
  # Add missing columns to listings table
  
  ## Problem
  The listings table is missing columns that the application code requires:
  - condition: Item condition status
  - is_negotiable: Whether price is negotiable
  
  This causes listing creation to fail with error: "Could not find the 'condition' column of 'listings' in the schema cache"
  
  ## Solution
  Add the missing columns with appropriate types and defaults.
  
  ## Changes
  - Add condition text column with valid values
  - Add is_negotiable boolean column with DEFAULT false
  - Create indexes for efficient querying
*/

-- Add condition column to listings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'condition'
  ) THEN
    ALTER TABLE listings ADD COLUMN condition text
    CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'parts'));
  END IF;
END $$;

-- Add is_negotiable column to listings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'is_negotiable'
  ) THEN
    ALTER TABLE listings ADD COLUMN is_negotiable boolean DEFAULT false;
  END IF;
END $$;

-- Create index for efficient querying by condition
CREATE INDEX IF NOT EXISTS listings_condition_idx ON listings(condition) WHERE condition IS NOT NULL;

-- Create index for efficient querying of negotiable listings
CREATE INDEX IF NOT EXISTS listings_is_negotiable_idx ON listings(is_negotiable) WHERE is_negotiable = true;
