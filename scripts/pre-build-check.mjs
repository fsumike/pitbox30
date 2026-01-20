#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 Pre-Build Validation Check\n');

let hasErrors = false;
const warnings = [];

const capawesomeConfig = JSON.parse(readFileSync(join(process.cwd(), 'capawesome.config.json'), 'utf-8'));
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

let capacitorAppId = 'com.pitbox.app';
try {
  const capacitorConfigContent = readFileSync(join(process.cwd(), 'capacitor.config.ts'), 'utf-8');
  const appIdMatch = capacitorConfigContent.match(/appId:\s*['"]([^'"]+)['"]/);
  if (appIdMatch) capacitorAppId = appIdMatch[1];
} catch (e) {
  console.log('   ⚠️  Could not read capacitor.config.ts');
}

console.log('📱 iOS Configuration:');
console.log(`   Version: ${capawesomeConfig.build.platforms.ios.version}`);
console.log(`   Build Number: ${capawesomeConfig.build.platforms.ios.buildNumber}`);
console.log(`   Bundle ID: ${capawesomeConfig.publish.ios.bundleId}`);

console.log('\n📋 Required Privacy Descriptions:');
const requiredKeys = [
  'NSPhotoLibraryUsageDescription',
  'NSPhotoLibraryAddUsageDescription',
  'NSCameraUsageDescription',
  'NSMicrophoneUsageDescription',
  'NSLocationWhenInUseUsageDescription',
  'NSLocationAlwaysAndWhenInUseUsageDescription',
  'NSLocationAlwaysUsageDescription',
  'ITSAppUsesNonExemptEncryption'
];

const infoPlist = capawesomeConfig.build.platforms.ios.infoPlist;
for (const key of requiredKeys) {
  if (infoPlist[key] !== undefined) {
    console.log(`   ✅ ${key}`);
  } else {
    console.log(`   ❌ ${key} - MISSING!`);
    hasErrors = true;
  }
}

console.log('\n🔗 Version Consistency:');
if (packageJson.version !== capawesomeConfig.build.platforms.ios.version) {
  warnings.push(`Version mismatch: package.json (${packageJson.version}) vs capawesome.config.json (${capawesomeConfig.build.platforms.ios.version})`);
  console.log(`   ⚠️  package.json: ${packageJson.version}`);
  console.log(`   ⚠️  capawesome: ${capawesomeConfig.build.platforms.ios.version}`);
} else {
  console.log(`   ✅ Version: ${packageJson.version}`);
}

console.log('\n📦 App Identifiers:');
if (capacitorAppId !== capawesomeConfig.publish.ios.bundleId) {
  console.log(`   ❌ Mismatch detected!`);
  console.log(`      capacitor.config.ts: ${capacitorAppId}`);
  console.log(`      capawesome.config.json: ${capawesomeConfig.publish.ios.bundleId}`);
  hasErrors = true;
} else {
  console.log(`   ✅ Bundle ID: ${capawesomeConfig.publish.ios.bundleId}`);
}

console.log('\n🎯 Store Destination:');
console.log(`   Destination ID: ${capawesomeConfig.publish.ios.destinationId}`);
console.log(`   TestFlight: ${capawesomeConfig.publish.ios.destinations.find(d => d.type === 'testflight')?.enabled ? '✅' : '❌'}`);
console.log(`   App Store: ${capawesomeConfig.publish.ios.destinations.find(d => d.type === 'app-store')?.enabled ? '✅' : '❌'}`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ${w}`));
}

if (hasErrors) {
  console.log('\n❌ Build validation FAILED! Fix errors above before building.\n');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Ready to build.\n');
  console.log('Next steps:');
  console.log('   1. npm run build:ci:ios');
  console.log('   2. npx @capawesome/cli apps:builds:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios\n');
}
