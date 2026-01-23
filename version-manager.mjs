#!/usr/bin/env node

/**
 * PitBox Version Manager
 *
 * Comprehensive version management utility for iOS and Android builds
 * Handles version syncing across package.json, iOS, and Android
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = __dirname;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('');
  log('═'.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('═'.repeat(60), 'cyan');
  console.log('');
}

// Read version from package.json
function getPackageVersion() {
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

// Read build configuration
function getCapawesomeConfig() {
  const configPath = join(rootDir, 'capawesome.config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  return {
    iosVersion: config.build.platforms.ios.version,
    iosBuildNumber: config.build.platforms.ios.buildNumber,
    androidVersion: config.build.platforms.android.version,
    androidVersionCode: config.build.platforms.android.versionCode,
  };
}

// Display current version status
function showStatus() {
  header('Current Version Status');

  const packageVersion = getPackageVersion();
  const capawesome = getCapawesomeConfig();

  log('📦 Package Version', 'blue');
  log(`   ${packageVersion}`, 'green');
  console.log('');

  log('🍎 iOS', 'blue');
  log(`   Version: ${capawesome.iosVersion}`, 'green');
  log(`   Build:   ${capawesome.iosBuildNumber}`, 'green');
  console.log('');

  log('🤖 Android', 'blue');
  log(`   Version: ${capawesome.androidVersion}`, 'green');
  log(`   Code:    ${capawesome.androidVersionCode}`, 'green');
  console.log('');

  // Check for mismatches
  const allVersions = [
    packageVersion,
    capawesome.iosVersion,
    capawesome.androidVersion,
  ];
  const uniqueVersions = [...new Set(allVersions)];

  if (uniqueVersions.length > 1) {
    log('⚠️  WARNING: Version mismatch detected!', 'yellow');
    log('   Run: npm run version:set -- <version>', 'yellow');
    console.log('');
  } else {
    log('✅ All versions are in sync', 'green');
    console.log('');
  }
}

// Validate version format
function isValidVersion(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

// Bump version using Capver
function bumpVersion(type) {
  if (!['major', 'minor', 'patch'].includes(type)) {
    log('❌ Invalid bump type. Use: major, minor, or patch', 'red');
    process.exit(1);
  }

  header(`Bumping ${type.toUpperCase()} Version`);

  try {
    log(`🔄 Running capver bump ${type}...`, 'blue');
    execSync(`npx @capawesome/capver bump ${type}`, { stdio: 'inherit' });

    console.log('');
    log('✅ Version bumped successfully!', 'green');
    console.log('');

    showStatus();
  } catch (error) {
    log('❌ Failed to bump version', 'red');
    process.exit(1);
  }
}

// Set specific version
function setVersion(version) {
  if (!isValidVersion(version)) {
    log('❌ Invalid version format. Use: X.Y.Z (e.g., 1.2.0)', 'red');
    process.exit(1);
  }

  header(`Setting Version to ${version}`);

  try {
    log(`🔄 Running capver set ${version}...`, 'blue');
    execSync(`npx @capawesome/capver set ${version}`, { stdio: 'inherit' });

    console.log('');
    log('✅ Version set successfully!', 'green');
    console.log('');

    showStatus();
  } catch (error) {
    log('❌ Failed to set version', 'red');
    process.exit(1);
  }
}

// Increment build number only
function incrementBuild() {
  header('Incrementing Build Number');

  try {
    const configPath = join(rootDir, 'capawesome.config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));

    const oldBuild = config.build.platforms.ios.buildNumber;
    const newBuild = (parseInt(oldBuild) + 1).toString();

    log(`📱 iOS Build:     ${oldBuild} → ${newBuild}`, 'blue');
    log(`🤖 Android Code:  ${oldBuild} → ${newBuild}`, 'blue');
    console.log('');

    // Update config
    config.build.platforms.ios.buildNumber = newBuild;
    config.build.platforms.android.versionCode = parseInt(newBuild);

    writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

    log('✅ Build number incremented successfully!', 'green');
    console.log('');

    showStatus();
  } catch (error) {
    log('❌ Failed to increment build number', 'red');
    console.error(error);
    process.exit(1);
  }
}

// Show help
function showHelp() {
  header('PitBox Version Manager');

  log('Usage:', 'bright');
  console.log('  node version-manager.mjs <command> [options]');
  console.log('');

  log('Commands:', 'bright');
  console.log('  status                Show current version status');
  console.log('  bump <type>           Bump version (major|minor|patch)');
  console.log('  set <version>         Set specific version (e.g., 1.2.0)');
  console.log('  increment-build       Increment build number only');
  console.log('  help                  Show this help message');
  console.log('');

  log('Examples:', 'bright');
  console.log('  node version-manager.mjs status');
  console.log('  node version-manager.mjs bump minor');
  console.log('  node version-manager.mjs set 1.2.0');
  console.log('  node version-manager.mjs increment-build');
  console.log('');

  log('Quick npm scripts:', 'bright');
  console.log('  npm run version:get              # Show current version');
  console.log('  npm run version:bump:patch       # 1.1.0 → 1.1.1');
  console.log('  npm run version:bump:minor       # 1.1.0 → 1.2.0');
  console.log('  npm run version:bump:major       # 1.1.0 → 2.0.0');
  console.log('  npm run increment-build          # Increment build only');
  console.log('');
}

// Main execution
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'status':
    showStatus();
    break;

  case 'bump':
    if (!arg) {
      log('❌ Please specify bump type: major, minor, or patch', 'red');
      process.exit(1);
    }
    bumpVersion(arg);
    break;

  case 'set':
    if (!arg) {
      log('❌ Please specify version (e.g., 1.2.0)', 'red');
      process.exit(1);
    }
    setVersion(arg);
    break;

  case 'increment-build':
    incrementBuild();
    break;

  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;

  default:
    showStatus();
    console.log('');
    log('💡 Run with --help for more commands', 'cyan');
    console.log('');
    break;
}
