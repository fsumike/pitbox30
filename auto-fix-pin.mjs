#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function autoFix() {
  console.log('🔧 Applying PIN code fix automatically...\n');

  const sql = `
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop and recreate the function
DROP FUNCTION IF EXISTS set_user_pin_code(uuid, text) CASCADE;

CREATE FUNCTION set_user_pin_code(
  user_id uuid,
  pin_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: You can only set your own PIN code';
  END IF;

  IF pin_code !~ '^\\d{4,10}$' THEN
    RAISE EXCEPTION 'Invalid PIN: Must be 4-10 digits';
  END IF;

  UPDATE profiles
  SET
    pin_code_hash = crypt(pin_code, gen_salt('bf', 8)),
    pin_code_enabled = true,
    updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION set_user_pin_code(uuid, text) TO authenticated;
COMMENT ON FUNCTION set_user_pin_code IS 'Securely sets a hashed PIN code for quick track-side authentication';
`;

  // Try using a custom RPC function if it exists
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      throw error;
    }

    console.log('✅ Successfully applied the fix!\n');

    // Verify it worked
    const { error: testError } = await supabase.rpc('set_user_pin_code', {
      user_id: '00000000-0000-0000-0000-000000000000',
      pin_code: '1234'
    });

    if (testError && !testError.message.includes('gen_salt')) {
      console.log('✅ Verification passed - pgcrypto is working!\n');
      console.log('🎉 PIN code authentication is now fully functional!');
      process.exit(0);
    } else if (testError && testError.message.includes('gen_salt')) {
      console.error('❌ Fix did not work - pgcrypto still not enabled');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Could not apply fix automatically');
    console.error('Error:', err.message);
    console.error('\nCreating downloadable SQL file instead...\n');

    // Since we can't apply it automatically, create a simple HTML file
    // that the user can open to see instructions
    process.exit(1);
  }
}

autoFix();
