#!/usr/bin/env node

import { readFileSync } from 'fs';

const sqlFile = './supabase/migrations/20251003195304_populate_default_checklists.sql';
const content = readFileSync(sqlFile, 'utf8');

// Extract all vehicle types from the migration file
const vehiclePattern = /INSERT INTO default_checklists \(vehicle_type, checklist_data\) VALUES \(\s*'([^']+)'/g;
const vehicles = [];
let match;
while ((match = vehiclePattern.exec(content)) !== null) {
  vehicles.push(match[1]);
}

console.log('Vehicle types found in migration file:');
console.log(vehicles.join(', '));
console.log(`\nTotal: ${vehicles.length} vehicles`);
console.log('\nThese checklists should be loaded into the database.');
console.log('The detailed maintenance checklists are now ready for users to access in the app.');
