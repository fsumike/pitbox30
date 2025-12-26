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
  console.log('🚀 Custom Fields Migration Tool\n');
  console.log('📍 Project URL:', supabaseUrl);
  console.log('');

  try {
    // Test connection and check structure
    console.log('📋 Checking database connection...');
    const { data: testSetup, error: testError } = await supabase
      .from('setups')
      .select('id, car_type, custom_fields')
      .limit(1)
      .maybeSingle();

    if (testError && !testError.message.includes('custom_fields')) {
      console.error('❌ Database connection error:', testError.message);
      process.exit(1);
    }

    // If we can select custom_fields, it exists
    if (!testError) {
      console.log('✅ Database connected successfully');
      console.log('✅ custom_fields column already exists!');
      console.log('✅ Migration already applied - feature is ready to use!\n');

      // Count setups with custom_fields
      const { count } = await supabase
        .from('setups')
        .select('*', { count: 'exact', head: true })
        .not('custom_fields', 'eq', '{}');

      console.log(`📊 ${count || 0} setup(s) currently have custom fields.\n`);
      process.exit(0);
    }

    // Column doesn't exist - need to add it
    console.log('⚠️  custom_fields column not found - migration needed\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('MIGRATION REQUIRED\n');
    console.log('The anon key cannot modify table structure.');
    console.log('Please run this SQL in Supabase Dashboard:\n');
    console.log('1. Go to: ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', ''));
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Click "New query"');
    console.log('4. Paste and run this SQL:\n');

    const migrationSQL = `-- Add custom_fields to setups table
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

-- Add documentation
COMMENT ON COLUMN setups.custom_fields IS 'User-defined custom fields stored as JSONB: {"section": [{"id": "uuid", "name": "Field", "value": "123", "comment": ""}]}';`;

    console.log(migrationSQL);
    console.log('\n5. Click the "Run" button');
    console.log('6. Verify success message\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('After migration, you will have:');
    console.log('  ✅ Add custom fields to any setup sheet section');
    console.log('  ✅ Custom fields saved with each setup');
    console.log('  ✅ Delete custom fields individually');
    console.log('  ✅ Backward compatible (existing setups unaffected)\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
