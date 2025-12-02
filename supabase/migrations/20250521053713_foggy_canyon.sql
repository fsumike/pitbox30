/*
  # Fix Setup Customizations Table

  1. Changes
    - Safely check if table and policies exist before creating
    - Ensure idempotent migration that won't fail if run multiple times
  
  2. Security
    - Maintain existing RLS policies for user data protection
*/

-- Check if table exists before creating
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'setup_customizations'
  ) THEN
    -- Create setup_customizations table
    CREATE TABLE setup_customizations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      car_type text NOT NULL,
      customization jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, car_type)
    );

    -- Enable Row Level Security
    ALTER TABLE setup_customizations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Safely drop existing policies if they exist
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can read own customizations" ON setup_customizations;
  DROP POLICY IF EXISTS "Users can create own customizations" ON setup_customizations;
  DROP POLICY IF EXISTS "Users can update own customizations" ON setup_customizations;
  DROP POLICY IF EXISTS "Users can delete own customizations" ON setup_customizations;
END $$;

-- Create policies
CREATE POLICY "Users can read own customizations"
  ON setup_customizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own customizations"
  ON setup_customizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customizations"
  ON setup_customizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own customizations"
  ON setup_customizations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Safely create trigger if it doesn't exist
DO $$
BEGIN
  -- Drop trigger if it exists
  DROP TRIGGER IF EXISTS update_setup_customizations_updated_at ON setup_customizations;
  
  -- Create trigger
  CREATE TRIGGER update_setup_customizations_updated_at
    BEFORE UPDATE ON setup_customizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
END $$;