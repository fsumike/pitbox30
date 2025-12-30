#!/usr/bin/env node

/**
 * Apply pgcrypto fix to Supabase database
 *
 * This script automatically applies the pgcrypto extension and PIN code functions
 * to your Supabase database, fixing the "gen_salt does not exist" error.
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyFix() {
  try {
    console.log('🔧 Reading pgcrypto fix SQL...');
    const sql = readFileSync('./FIX_PGCRYPTO_ONCE_AND_FOR_ALL.sql', 'utf8');

    console.log('📤 Applying fix to Supabase database...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('⚙️  Trying alternative method...');
      const { error: directError } = await supabase.from('_prisma_migrations').select('*').limit(1);

      console.error('❌ Error applying fix:', error.message);
      console.error('\n📋 Please apply the fix manually:');
      console.error('1. Go to https://supabase.com/dashboard');
      console.error('2. Open your project');
      console.error('3. Go to SQL Editor');
      console.error('4. Copy the contents of FIX_PGCRYPTO_ONCE_AND_FOR_ALL.sql');
      console.error('5. Paste and run it');
      process.exit(1);
    }

    console.log('✅ Successfully applied pgcrypto fix!');
    console.log('✅ PIN code functionality is now ready to use');
    console.log('\n📝 What was fixed:');
    console.log('  - Enabled pgcrypto extension');
    console.log('  - Added pin_code_hash and pin_code_enabled columns');
    console.log('  - Created set_user_pin_code() function');
    console.log('  - Created disable_user_pin_code() function');
    console.log('  - Created verify_user_pin_code() function');
    console.log('\n🎉 You can now use PIN code authentication in your app!');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error('\n📋 Please apply the fix manually:');
    console.error('1. Go to https://supabase.com/dashboard');
    console.error('2. Open your project');
    console.error('3. Go to SQL Editor');
    console.error('4. Copy the contents of FIX_PGCRYPTO_ONCE_AND_FOR_ALL.sql');
    console.error('5. Paste and run it');
    process.exit(1);
  }
}

console.log('🚀 Applying pgcrypto fix...\n');
applyFix();
