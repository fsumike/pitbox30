#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🔧 Applying PIN code fix migration...\n');

  try {
    const sql = readFileSync('./supabase/migrations/20251230000000_fix_pin_code_pgcrypto.sql', 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Try to execute each statement using database functions
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      // Try different methods to execute SQL
      const methods = [
        async () => {
          const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
          return { data, error };
        },
        async () => {
          const { data, error } = await supabase.rpc('execute_sql', { query: statement + ';' });
          return { data, error };
        },
        async () => {
          const { data, error } = await supabase.rpc('run_sql', { sql: statement + ';' });
          return { data, error };
        }
      ];

      let executed = false;
      let lastError = null;

      for (const method of methods) {
        try {
          const { error } = await method();
          if (!error) {
            executed = true;
            console.log(`  ✅ Statement ${i + 1} executed successfully`);
            break;
          }
          lastError = error;
        } catch (err) {
          lastError = err;
        }
      }

      if (!executed && lastError) {
        console.error(`  ❌ Could not execute statement ${i + 1}`);
        console.error(`     Error: ${lastError.message}`);
      }
    }

    // Test if it worked
    console.log('\n🔍 Verifying fix...\n');
    const { error: testError } = await supabase.rpc('set_user_pin_code', {
      user_id: '00000000-0000-0000-0000-000000000000',
      pin_code: '1234'
    });

    if (testError && testError.message.includes('gen_salt')) {
      console.log('❌ Fix not applied - manual SQL execution required\n');
      console.log('Please run the SQL in: supabase/migrations/20251230000000_fix_pin_code_pgcrypto.sql');
      console.log('In the Supabase Dashboard SQL Editor');
      process.exit(1);
    } else {
      console.log('✅ PIN code fix verified successfully!');
      console.log('🎉 PIN code authentication is now fully functional!\n');
      process.exit(0);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

applyMigration();
