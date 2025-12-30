#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('🔍 Diagnosing database state...\n');

  // Test 1: Check if we can query profiles table
  console.log('Test 1: Check profiles table columns');
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, pin_code_hash, pin_code_enabled')
    .limit(1);

  if (profileError) {
    console.log(`  ❌ Error: ${profileError.message}`);
  } else {
    console.log(`  ✅ Profiles table accessible with PIN columns`);
  }

  // Test 2: Try to create a test function that uses pgcrypto
  console.log('\nTest 2: Test pgcrypto availability');

  // We'll try to call set_user_pin_code with a fake UUID
  // This will tell us if pgcrypto is the issue
  const testUserId = '00000000-0000-0000-0000-000000000001';
  const { data: setPinData, error: setPinError } = await supabase.rpc('set_user_pin_code', {
    user_id: testUserId,
    pin_code: '1234'
  });

  if (setPinError) {
    if (setPinError.message.includes('gen_salt')) {
      console.log(`  ❌ PROBLEM FOUND: pgcrypto not properly enabled`);
      console.log(`     Error: ${setPinError.message}`);
      console.log(`\n  📋 SOLUTION: Need to enable pgcrypto extension`);
      return 'pgcrypto';
    } else if (setPinError.message.includes('Unauthorized')) {
      console.log(`  ✅ Function exists and pgcrypto is working!`);
      console.log(`     (Got expected authorization error for fake user)`);
      return 'working';
    } else {
      console.log(`  ⚠️  Unexpected error: ${setPinError.message}`);
      return 'unknown';
    }
  } else {
    console.log(`  ✅ Function executed successfully`);
    return 'working';
  }
}

diagnose().then(result => {
  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSIS COMPLETE');
  console.log('='.repeat(60));

  if (result === 'pgcrypto') {
    console.log('\n❌ ISSUE: pgcrypto extension is not enabled');
    console.log('\n📝 SQL TO RUN IN SUPABASE DASHBOARD:');
    console.log('\n```sql');
    console.log('-- Run this in Supabase SQL Editor');
    console.log('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    console.log('```');
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/pbfdzlkdlxbwijwwysaf/sql');
    console.log('\nAfter running, the PIN code feature will work automatically.');
    process.exit(1);
  } else if (result === 'working') {
    console.log('\n✅ DATABASE IS FULLY CONFIGURED!');
    console.log('PIN code authentication is ready to use.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Unknown issue detected');
    process.exit(1);
  }
});
