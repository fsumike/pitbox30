/*
  # Remove Customization Functionality

  1. Changes
    - Safely drop setup_customizations table if it exists
    - Safely drop related trigger if it exists
  
  2. Security
    - No changes to security policies
*/

-- Safely drop setup_customizations table if it exists
DO $$
BEGIN
  -- Check if table exists before attempting to drop
  IF EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'setup_customizations'
  ) THEN
    -- Drop the table
    DROP TABLE public.setup_customizations CASCADE;
  END IF;
END $$;