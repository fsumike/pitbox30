#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configPath = join(__dirname, 'capawesome.config.json');
const packagePath = join(__dirname, 'package.json');

console.log('🔢 Incrementing Build Numbers...\n');

try {
  // Read capawesome.config.json
  const configContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent);

  // Get current build numbers
  const currentIOSBuild = parseInt(config.build.platforms.ios.buildNumber);
  const currentAndroidBuild = parseInt(config.build.platforms.android.versionCode);

  // Increment
  const newIOSBuild = currentIOSBuild + 1;
  const newAndroidBuild = currentAndroidBuild + 1;

  // Get version from package.json
  const packageContent = readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageContent);
  const version = packageJson.version;

  console.log('📱 iOS:');
  console.log(`   Version: ${version}`);
  console.log(`   Build: ${currentIOSBuild} → ${newIOSBuild}`);

  console.log('\n🤖 Android:');
  console.log(`   Version: ${version}`);
  console.log(`   Build: ${currentAndroidBuild} → ${newAndroidBuild}`);

  // Update iOS buildNumber
  config.build.platforms.ios.buildNumber = newIOSBuild.toString();

  // Update iOS version field
  config.build.platforms.ios.version = version;

  // Update iOS buildCommand (both CFBundleVersion and CFBundleShortVersionString)
  config.build.platforms.ios.buildCommand = config.build.platforms.ios.buildCommand
    .replace(/CFBundleVersion \d+'/, `CFBundleVersion ${newIOSBuild}'`)
    .replace(/CFBundleShortVersionString [\d.]+'/, `CFBundleShortVersionString ${version}'`);

  // Update iOS infoPlist
  if (config.build.platforms.ios.infoPlist) {
    config.build.platforms.ios.infoPlist.CFBundleVersion = newIOSBuild.toString();
    config.build.platforms.ios.infoPlist.CFBundleShortVersionString = version;
  }

  // Update Android versionCode
  config.build.platforms.android.versionCode = newAndroidBuild;

  // Update Android version field
  config.build.platforms.android.version = version;

  // Write the updated config
  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

  console.log('\n✅ All version numbers synchronized!');
  console.log('\n📝 Updated files:');
  console.log('   • capawesome.config.json');
  console.log('\n🚀 Ready to build!');
  console.log('   iOS: npm run capawesome:build:ios');
  console.log('   Android: npm run capawesome:build:android');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
