/*
  # Add Custom Fields to Setup Sheets

  1. Changes
    - Add `custom_fields` JSONB column to `setups` table
    - Store custom fields per section with structure:
      {
        "suspension": [{ "id": "uuid", "name": "Field Name", "value": "123" }],
        "engine": [{ "id": "uuid", "name": "Custom Field", "value": "456" }],
        ...
      }
  
  2. Security
    - No RLS changes needed (inherits existing policies)
*/

-- Add custom_fields column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'setups' AND column_name = 'custom_fields'
  ) THEN
    ALTER TABLE setups ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_setups_custom_fields ON setups USING gin(custom_fields);
