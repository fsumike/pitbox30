#!/usr/bin/env node
/**
 * Load all remaining vehicle maintenance checklists into Supabase
 * Run with: node load-remaining-checklists.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the migration file
const sqlContent = readFileSync('./supabase/migrations/20251003195304_populate_default_checklists.sql', 'utf8');

// Extract all INSERT statements using regex
const insertPattern = /INSERT INTO default_checklists \(vehicle_type, checklist_data\) VALUES \(\s*'([^']+)',\s*'(\{[\s\S]*?\})'::jsonb\s*\);/g;
const vehicles = [];

let match;
while ((match = insertPattern.exec(sqlContent)) !== null) {
  const vehicleType = match[1];
  const jsonData = match[2];

  try {
    const checklistData = JSON.parse(jsonData);
    vehicles.push({ type: vehicleType, data: checklistData });
  } catch (err) {
    console.error(`Failed to parse ${vehicleType}:`, err.message);
  }
}

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   Loading Detailed Maintenance Checklists       ║');
console.log('╚══════════════════════════════════════════════════╝\n');
console.log(`Found ${vehicles.length} vehicles to load\n`);

async function loadAllVehicles() {
  let successCount = 0;
  let errorCount = 0;

  for (const vehicle of vehicles) {
    try {
      const { error } = await supabase
        .from('default_checklists')
        .upsert({
          vehicle_type: vehicle.type,
          checklist_data: vehicle.data
        }, { onConflict: 'vehicle_type' });

      if (error) {
        console.error(`✗ ${vehicle.type.padEnd(20)} - Error: ${error.message}`);
        errorCount++;
      } else {
        const postCount = vehicle.data.post_race?.length || 0;
        const shopCount = vehicle.data.shop?.length || 0;
        const preCount = vehicle.data.pre_race?.length || 0;
        const total = postCount + shopCount + preCount;

        console.log(`✓ ${vehicle.type.padEnd(20)} - ${total} items (${postCount} post-race, ${shopCount} shop, ${preCount} pre-race)`);
        successCount++;
      }
    } catch (err) {
      console.error(`✗ ${vehicle.type.padEnd(20)} - Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '═'.repeat(54));
  console.log(`COMPLETE: ${successCount}/${vehicles.length} vehicles loaded`);
  if (errorCount > 0) {
    console.log(`Errors: ${errorCount}`);
  }
  console.log('═'.repeat(54) + '\n');

  // Verify final count
  const { count, error } = await supabase
    .from('default_checklists')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Could not verify count:', error.message);
  } else {
    console.log(`✓ Database now contains ${count} vehicle checklists\n`);
  }
}

loadAllVehicles()
  .then(() => {
    console.log('✓ All done!\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
  });
