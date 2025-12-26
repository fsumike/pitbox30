import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🚀 Race Type Migration Tool\n');
  console.log('📍 Project URL:', supabaseUrl);
  console.log('');

  try {
    // Test connection and check structure
    console.log('📋 Checking database connection...');
    const { data: testSetup, error: testError } = await supabase
      .from('setups')
      .select('id, car_type, race_type')
      .limit(1)
      .maybeSingle();

    if (testError && !testError.message.includes('race_type')) {
      console.error('❌ Database connection error:', testError.message);
      process.exit(1);
    }

    // If we can select race_type, it exists
    if (!testError) {
      console.log('✅ Database connected successfully');
      console.log('✅ race_type column already exists!');
      console.log('✅ Migration already applied - feature is ready to use!\n');

      // Count setups with race_type
      const { count } = await supabase
        .from('setups')
        .select('*', { count: 'exact', head: true })
        .not('race_type', 'is', null);

      console.log(`📊 ${count || 0} setup(s) currently have a race type assigned.\n`);
      process.exit(0);
    }

    // Column doesn't exist - need to add it
    console.log('⚠️  race_type column not found - migration needed\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('MIGRATION REQUIRED\n');
    console.log('The anon key cannot modify table structure.');
    console.log('Please run this SQL in Supabase Dashboard:\n');
    console.log('1. Go to: ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', ''));
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Click "New query"');
    console.log('4. Paste and run this SQL:\n');

    const migrationSQL = `-- Add race_type to setups table
ALTER TABLE setups
ADD COLUMN IF NOT EXISTS race_type text
CHECK (race_type IS NULL OR race_type IN ('hot_laps', 'qualifying', 'heat_race', 'd_main', 'c_main', 'b_main', 'a_main'));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_setups_race_type ON setups(race_type) WHERE race_type IS NOT NULL;

-- Add documentation
COMMENT ON COLUMN setups.race_type IS 'Race session type: hot_laps, qualifying, heat_race, d_main, c_main, b_main, or a_main';`;

    console.log(migrationSQL);
    console.log('\n5. Click the "Run" button');
    console.log('6. Verify success message\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('After migration, you will have:');
    console.log('  ✅ Race type dropdown on all setup sheets');
    console.log('  ✅ Filter by race type in Saved Setups');
    console.log('  ✅ Race type badges on setup cards');
    console.log('  ✅ Backward compatible (existing setups unaffected)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
