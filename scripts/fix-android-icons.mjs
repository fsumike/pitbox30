#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceIconsPath = path.join(projectRoot, 'public');
const androidResPath = path.join(projectRoot, 'android/app/src/main/res');

const androidIconMappings = [
  // mipmap-mdpi (48x48)
  { source: 'android-icon-48-48.png', dest: 'mipmap-mdpi/ic_launcher.png', size: '48x48' },
  { source: 'android-icon-48-48.png', dest: 'mipmap-mdpi/ic_launcher_round.png', size: '48x48' },
  { source: 'android-icon-48-48.png', dest: 'mipmap-mdpi/ic_launcher_foreground.png', size: '48x48' },

  // mipmap-hdpi (72x72)
  { source: 'android-icon-72-72.png', dest: 'mipmap-hdpi/ic_launcher.png', size: '72x72' },
  { source: 'android-icon-72-72.png', dest: 'mipmap-hdpi/ic_launcher_round.png', size: '72x72' },
  { source: 'android-icon-72-72.png', dest: 'mipmap-hdpi/ic_launcher_foreground.png', size: '72x72' },

  // mipmap-xhdpi (96x96)
  { source: 'android-icon-96-96.png', dest: 'mipmap-xhdpi/ic_launcher.png', size: '96x96' },
  { source: 'android-icon-96-96.png', dest: 'mipmap-xhdpi/ic_launcher_round.png', size: '96x96' },
  { source: 'android-icon-96-96.png', dest: 'mipmap-xhdpi/ic_launcher_foreground.png', size: '96x96' },

  // mipmap-xxhdpi (144x144)
  { source: 'android-icon-144-144.png', dest: 'mipmap-xxhdpi/ic_launcher.png', size: '144x144' },
  { source: 'android-icon-144-144.png', dest: 'mipmap-xxhdpi/ic_launcher_round.png', size: '144x144' },
  { source: 'android-icon-144-144.png', dest: 'mipmap-xxhdpi/ic_launcher_foreground.png', size: '144x144' },

  // mipmap-xxxhdpi (192x192)
  { source: 'android-icon-192-192.png', dest: 'mipmap-xxxhdpi/ic_launcher.png', size: '192x192' },
  { source: 'android-icon-192-192.png', dest: 'mipmap-xxxhdpi/ic_launcher_round.png', size: '192x192' },
  { source: 'android-icon-192-192.png', dest: 'mipmap-xxxhdpi/ic_launcher_foreground.png', size: '192x192' },
];

const mipmapFolders = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
];

async function ensureMipmapFolders() {
  console.log('📁 Ensuring mipmap folders exist...\n');

  for (const folder of mipmapFolders) {
    const folderPath = path.join(androidResPath, folder);
    try {
      await fs.mkdir(folderPath, { recursive: true });
      console.log(`  ✅ ${folder}`);
    } catch (error) {
      console.log(`  ⚠️  Could not create ${folder}: ${error.message}`);
    }
  }
  console.log('');
}

async function setupAndroidIcons() {
  console.log('🤖 Setting up Android App Icons for PitBox...\n');

  try {
    // Check if Android project exists
    const androidProjectExists = await fs.access(androidResPath).then(() => true).catch(() => false);

    if (!androidProjectExists) {
      console.log('⚠️  Android project not found!');
      console.log('Run "npm run build" first to generate the Android project.\n');
      return false;
    }

    console.log('📂 Found Android project at:', androidResPath);

    // Ensure mipmap folders exist
    await ensureMipmapFolders();

    console.log('📦 Copying icon files...\n');

    // Copy icon files
    let copiedCount = 0;
    for (const icon of androidIconMappings) {
      const sourcePath = path.join(sourceIconsPath, icon.source);
      const destPath = path.join(androidResPath, icon.dest);

      try {
        await fs.copyFile(sourcePath, destPath);
        console.log(`  ✅ ${icon.source} → ${icon.dest} (${icon.size})`);
        copiedCount++;
      } catch (error) {
        console.log(`  ⚠️  Could not copy ${icon.source}: ${error.message}`);
      }
    }

    console.log(`\n📝 Copied ${copiedCount}/${androidIconMappings.length} icon files`);

    // Create ic_launcher_background.xml for adaptive icons
    await createAdaptiveIconBackground();

    console.log('🎉 Android App Icons configured successfully!\n');
    console.log('📋 Next Steps:');
    console.log('  1. Open Android Studio: npm run cap:open:android');
    console.log('  2. Navigate to app/res/mipmap folders');
    console.log('  3. Verify all ic_launcher icons are present');
    console.log('  4. Build → Generate Signed Bundle/APK');
    console.log('  5. Upload to Google Play Console\n');
    console.log('💡 Tip: Your custom PitBox icon will now appear on all Android devices!');

    return true;

  } catch (error) {
    console.error('❌ Error setting up Android icons:', error.message);
    return false;
  }
}

async function createAdaptiveIconBackground() {
  const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M0,0h108v108h-108z" />
</vector>`;

  const folders = ['drawable', 'drawable-v24'];

  for (const folder of folders) {
    const folderPath = path.join(androidResPath, folder);
    try {
      await fs.mkdir(folderPath, { recursive: true });
      const xmlPath = path.join(folderPath, 'ic_launcher_background.xml');
      await fs.writeFile(xmlPath, backgroundXml);
      console.log(`  ✅ Created ic_launcher_background.xml in ${folder}`);
    } catch (error) {
      // Silent fail - not critical
    }
  }
}

async function verifyIconFormat() {
  console.log('🔍 Verifying Android icon format...');

  const requiredIcons = [
    'android-icon-48-48.png',
    'android-icon-72-72.png',
    'android-icon-96-96.png',
    'android-icon-144-144.png',
    'android-icon-192-192.png',
  ];

  let allPresent = true;
  for (const iconFile of requiredIcons) {
    const iconPath = path.join(sourceIconsPath, iconFile);
    try {
      await fs.access(iconPath);
      console.log(`  ✅ ${iconFile}`);
    } catch {
      console.log(`  ❌ ${iconFile} - MISSING`);
      allPresent = false;
    }
  }

  if (allPresent) {
    console.log('\n  ✅ All required Android icons found!\n');
  } else {
    console.log('\n  ⚠️  Some icons are missing. Generate them using:');
    console.log('     • https://icon.kitchen');
    console.log('     • https://romannurik.github.io/AndroidAssetStudio/\n');
  }

  return allPresent;
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     PitBox Android App Icon Setup             ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  await verifyIconFormat();
  const success = await setupAndroidIcons();

  if (!success) {
    console.log('\n❌ Setup failed. Make sure to:');
    console.log('   1. Run "npm run build" first');
    console.log('   2. Ensure Android project exists at android/');
    console.log('   3. Have icon files in public/ folder\n');
  }
}

main().catch(console.error);
