#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, 'capawesome.config.json');

console.log('🔢 Incrementing iOS Build Number...\n');

try {
  const configContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent);

  const currentBuild = parseInt(config.build.platforms.ios.buildNumber);
  const newBuild = currentBuild + 1;

  config.build.platforms.ios.buildNumber = newBuild.toString();

  config.build.platforms.ios.buildCommand = config.build.platforms.ios.buildCommand.replace(
    /CFBundleVersion \d+/,
    `CFBundleVersion ${newBuild}`
  );

  // Update infoPlist values
  if (config.build.platforms.ios.infoPlist) {
    config.build.platforms.ios.infoPlist.CFBundleVersion = newBuild.toString();
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

  console.log(`✅ Build number updated!`);
  console.log(`   Old: ${currentBuild}`);
  console.log(`   New: ${newBuild}`);
  console.log(`\n📝 capawesome.config.json has been updated.`);
  console.log(`\n🚀 Now run: npm run capawesome:build:ios`);

} catch (error) {
  console.error('❌ Error updating build number:', error.message);
  process.exit(1);
}
