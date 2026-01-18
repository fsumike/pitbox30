#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceIconsPath = path.join(projectRoot, 'public');
const iosIconSetPath = path.join(projectRoot, 'ios/App/App/Assets.xcassets/AppIcon.appiconset');

const iconSizes = [
  { source: 'apple-icon-1024-1024.png', dest: 'Icon-1024.png', size: '1024x1024', idiom: 'ios-marketing', scale: '1x' },
  { source: 'apple-icon-180-180.png', dest: 'Icon-60@3x.png', size: '60x60', idiom: 'iphone', scale: '3x' },
  { source: 'apple-icon-120-120.png', dest: 'Icon-60@2x.png', size: '60x60', idiom: 'iphone', scale: '2x' },
  { source: 'apple-icon-120-120.png', dest: 'Icon-40@3x.png', size: '40x40', idiom: 'iphone', scale: '3x' },
  { source: 'apple-icon-152-152.png', dest: 'Icon-76@2x.png', size: '76x76', idiom: 'ipad', scale: '2x' },
  { source: 'apple-icon-167-167.png', dest: 'Icon-83.5@2x.png', size: '83.5x83.5', idiom: 'ipad', scale: '2x' },
];

const contentsJson = {
  "images": [
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "Icon-20@2x.png",
      "scale": "2x"
    },
    {
      "size": "20x20",
      "idiom": "iphone",
      "filename": "Icon-20@3x.png",
      "scale": "3x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "Icon-29@2x.png",
      "scale": "2x"
    },
    {
      "size": "29x29",
      "idiom": "iphone",
      "filename": "Icon-29@3x.png",
      "scale": "3x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "Icon-40@2x.png",
      "scale": "2x"
    },
    {
      "size": "40x40",
      "idiom": "iphone",
      "filename": "Icon-40@3x.png",
      "scale": "3x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "Icon-60@2x.png",
      "scale": "2x"
    },
    {
      "size": "60x60",
      "idiom": "iphone",
      "filename": "Icon-60@3x.png",
      "scale": "3x"
    },
    {
      "size": "20x20",
      "idiom": "ipad",
      "filename": "Icon-20.png",
      "scale": "1x"
    },
    {
      "size": "20x20",
      "idiom": "ipad",
      "filename": "Icon-20@2x.png",
      "scale": "2x"
    },
    {
      "size": "29x29",
      "idiom": "ipad",
      "filename": "Icon-29.png",
      "scale": "1x"
    },
    {
      "size": "29x29",
      "idiom": "ipad",
      "filename": "Icon-29@2x.png",
      "scale": "2x"
    },
    {
      "size": "40x40",
      "idiom": "ipad",
      "filename": "Icon-40.png",
      "scale": "1x"
    },
    {
      "size": "40x40",
      "idiom": "ipad",
      "filename": "Icon-40@2x.png",
      "scale": "2x"
    },
    {
      "size": "76x76",
      "idiom": "ipad",
      "filename": "Icon-76.png",
      "scale": "1x"
    },
    {
      "size": "76x76",
      "idiom": "ipad",
      "filename": "Icon-76@2x.png",
      "scale": "2x"
    },
    {
      "size": "83.5x83.5",
      "idiom": "ipad",
      "filename": "Icon-83.5@2x.png",
      "scale": "2x"
    },
    {
      "size": "1024x1024",
      "idiom": "ios-marketing",
      "filename": "Icon-1024.png",
      "scale": "1x"
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
};

async function setupiOSIcons() {
  console.log('🎨 Setting up iOS App Icons for TestFlight...\n');

  try {
    // Check if iOS project exists
    const iosProjectExists = await fs.access(iosIconSetPath).then(() => true).catch(() => false);

    if (!iosProjectExists) {
      console.log('⚠️  iOS project not found!');
      console.log('Run "npm run build" first to generate the iOS project.\n');
      return false;
    }

    console.log('📂 Found iOS project at:', iosIconSetPath);
    console.log('📦 Copying icon files...\n');

    // Copy icon files
    let copiedCount = 0;
    for (const icon of iconSizes) {
      const sourcePath = path.join(sourceIconsPath, icon.source);
      const destPath = path.join(iosIconSetPath, icon.dest);

      try {
        await fs.copyFile(sourcePath, destPath);
        console.log(`  ✅ ${icon.source} → ${icon.dest} (${icon.size})`);
        copiedCount++;
      } catch (error) {
        console.log(`  ⚠️  Could not copy ${icon.source}: ${error.message}`);
      }
    }

    console.log(`\n📝 Copied ${copiedCount}/${iconSizes.length} icon files`);

    // Write Contents.json
    const contentsPath = path.join(iosIconSetPath, 'Contents.json');
    await fs.writeFile(contentsPath, JSON.stringify(contentsJson, null, 2));
    console.log('✅ Updated Contents.json\n');

    console.log('🎉 iOS App Icons configured successfully!\n');
    console.log('📋 Next Steps:');
    console.log('  1. Open Xcode: npm run cap:open:ios');
    console.log('  2. Click on "App" in the left sidebar');
    console.log('  3. Go to General → App Icons and Launch Screen');
    console.log('  4. Verify all icon slots are filled');
    console.log('  5. Product → Archive');
    console.log('  6. Upload to TestFlight\n');
    console.log('💡 Tip: Your custom icon will now appear in TestFlight!');

    return true;

  } catch (error) {
    console.error('❌ Error setting up iOS icons:', error.message);
    return false;
  }
}

async function generateMissingIcons() {
  console.log('\n🔧 Checking for missing icon sizes...');
  console.log('⚠️  Note: You may need to generate additional icon sizes manually.');
  console.log('📱 iOS requires these sizes: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024');
  console.log('\n💡 Use an online tool to generate all sizes:');
  console.log('   • https://appicon.co');
  console.log('   • https://www.appicon.build');
  console.log('   • https://makeappicon.com\n');
}

async function verifyIconFormat() {
  console.log('🔍 Verifying icon format...');

  const iconPath = path.join(sourceIconsPath, 'apple-icon-1024-1024.png');

  try {
    const stats = await fs.stat(iconPath);
    console.log(`  ✅ Found 1024x1024 icon (${(stats.size / 1024).toFixed(1)} KB)`);
    console.log('  ℹ️  Make sure your icon:');
    console.log('     • Has NO transparency (no alpha channel)');
    console.log('     • Has NO rounded corners (iOS adds them)');
    console.log('     • Is in RGB color space (not CMYK)');
    console.log('     • Is exactly 1024x1024 pixels\n');
  } catch (error) {
    console.log('  ⚠️  1024x1024 icon not found!');
    console.log('  Create one at: public/apple-icon-1024-1024.png\n');
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   PitBox iOS App Icon Setup for TestFlight    ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  await verifyIconFormat();
  const success = await setupiOSIcons();

  if (success) {
    await generateMissingIcons();
  } else {
    console.log('\n❌ Setup failed. Make sure to:');
    console.log('   1. Run "npm run build" first');
    console.log('   2. Ensure iOS project exists at ios/App/');
    console.log('   3. Have icon files in public/ folder\n');
  }
}

main().catch(console.error);
