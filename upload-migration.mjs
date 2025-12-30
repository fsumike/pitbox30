import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Need: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadMigration() {
  console.log('📦 Loading migration file...');

  try {
    const sql = readFileSync('./APPLY_THIS_MIGRATION.sql', 'utf-8');

    console.log('🚀 Applying migration to Supabase...');
    console.log('');

    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);
    console.log('');

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.length < 50) {
        console.log(`   [${i + 1}/${statements.length}] ${statement.substring(0, 50)}...`);
      } else {
        console.log(`   [${i + 1}/${statements.length}] Executing...`);
      }

      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
        console.error('');
        console.error('⚠️  MIGRATION FAILED');
        console.error('');
        console.error('Please run the SQL manually in Supabase SQL Editor:');
        console.error('1. Go to: https://supabase.com/dashboard/project/_/sql');
        console.error('2. Copy contents of APPLY_THIS_MIGRATION.sql');
        console.error('3. Paste and run');
        process.exit(1);
      }
    }

    console.log('');
    console.log('✅ Migration applied successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit /my-advertisements in your app');
    console.log('2. Create your first advertisement');
    console.log('3. View it on the home page');
    console.log('');

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('');
    console.error('⚠️  Could not run migration automatically.');
    console.error('');
    console.error('Please run manually in Supabase SQL Editor:');
    console.error('1. Go to: https://supabase.com/dashboard/project/_/sql');
    console.error('2. Copy contents of APPLY_THIS_MIGRATION.sql');
    console.error('3. Paste and run');
    process.exit(1);
  }
}

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  Location-Based Advertising Migration Tool');
console.log('═══════════════════════════════════════════════════════');
console.log('');

uploadMigration();
