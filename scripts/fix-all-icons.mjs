#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function runScript(scriptName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${scriptName}`);
  console.log('='.repeat(60));

  try {
    const { stdout, stderr } = await execAsync(`node ${path.join(__dirname, scriptName)}`, {
      cwd: projectRoot
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    return true;
  } catch (error) {
    console.error(`Error running ${scriptName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║     🎨 PitBox Icon Setup - iOS & Android                  ║');
  console.log('║                                                            ║');
  console.log('║     This will automatically configure your PitBox         ║');
  console.log('║     branding icons for both platforms                     ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Check if projects exist
  const iosExists = await fs.access(path.join(projectRoot, 'ios/App')).then(() => true).catch(() => false);
  const androidExists = await fs.access(path.join(projectRoot, 'android/app')).then(() => true).catch(() => false);

  if (!iosExists && !androidExists) {
    console.log('❌ No mobile projects found!');
    console.log('\n💡 Run "npm run build" first to generate iOS and Android projects.\n');
    return;
  }

  console.log('📱 Detected Platforms:');
  if (iosExists) console.log('  ✅ iOS project found');
  if (androidExists) console.log('  ✅ Android project found');
  console.log('');

  let iosSuccess = true;
  let androidSuccess = true;

  // Run iOS icon setup
  if (iosExists) {
    iosSuccess = await runScript('fix-ios-icons.mjs');
  } else {
    console.log('\n⚠️  Skipping iOS - project not found');
  }

  // Run Android icon setup
  if (androidExists) {
    androidSuccess = await runScript('fix-android-icons.mjs');
  } else {
    console.log('\n⚠️  Skipping Android - project not found');
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60));

  if (iosExists) {
    console.log(`iOS Icons:     ${iosSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  }

  if (androidExists) {
    console.log(`Android Icons: ${androidSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);
  }

  const allSuccess = (!iosExists || iosSuccess) && (!androidExists || androidSuccess);

  if (allSuccess) {
    console.log('\n🎉 All platform icons configured successfully!\n');
    console.log('📋 Next Steps:\n');

    if (iosExists) {
      console.log('For iOS (TestFlight & App Store):');
      console.log('  1. npm run cap:open:ios');
      console.log('  2. Verify icons in Xcode');
      console.log('  3. Product → Archive');
      console.log('  4. Upload to App Store Connect\n');
    }

    if (androidExists) {
      console.log('For Android (Google Play):');
      console.log('  1. npm run cap:open:android');
      console.log('  2. Verify icons in Android Studio');
      console.log('  3. Build → Generate Signed Bundle/APK');
      console.log('  4. Upload to Google Play Console\n');
    }

    console.log('💡 Your PitBox branding will now appear correctly on all devices!');
  } else {
    console.log('\n⚠️  Some icons failed to configure. Check the logs above.\n');
  }
}

main().catch(console.error);
