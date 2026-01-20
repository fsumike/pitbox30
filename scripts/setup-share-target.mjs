#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const androidManifestPath = path.join(projectRoot, 'android/app/src/main/AndroidManifest.xml');
const iosInfoPlistPath = path.join(projectRoot, 'ios/App/App/Info.plist');

async function setupAndroidShareTarget() {
  console.log('📱 Setting up Android Share Target...');

  try {
    const manifestExists = await fs.access(androidManifestPath).then(() => true).catch(() => false);

    if (!manifestExists) {
      console.log('⚠️  Android project not found. Run "npm run build" first to generate Android project.');
      return false;
    }

    let manifestContent = await fs.readFile(androidManifestPath, 'utf-8');

    const shareIntentFilter = `
            <!-- Share Target Intent Filter -->
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
                <data android:mimeType="image/*" />
                <data android:mimeType="video/*" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.SEND_MULTIPLE" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="image/*" />
            </intent-filter>`;

    if (manifestContent.includes('android.intent.action.SEND')) {
      console.log('✅ Android Share Target already configured');
      return true;
    }

    manifestContent = manifestContent.replace(
      /<activity([^>]*?)android:name="\.MainActivity"([^>]*?)>/,
      (match) => {
        return match + shareIntentFilter;
      }
    );

    await fs.writeFile(androidManifestPath, manifestContent, 'utf-8');
    console.log('✅ Android Share Target configured successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error setting up Android:', error.message);
    return false;
  }
}

async function setupiOSShareTarget() {
  console.log('🍎 Setting up iOS Share Target...');

  try {
    const plistExists = await fs.access(iosInfoPlistPath).then(() => true).catch(() => false);

    if (!plistExists) {
      console.log('⚠️  iOS project not found. Run "npm run build" first to generate iOS project.');
      return false;
    }

    let plistContent = await fs.readFile(iosInfoPlistPath, 'utf-8');

    const shareExtension = `
	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLName</key>
			<string>com.pitbox.app</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>pitbox</string>
			</array>
		</dict>
	</array>
	<key>NSUserActivityTypes</key>
	<array>
		<string>com.pitbox.app.share</string>
	</array>`;

    if (plistContent.includes('CFBundleURLTypes')) {
      console.log('✅ iOS Share Target already configured');
      return true;
    }

    plistContent = plistContent.replace(
      /<\/dict>\s*<\/plist>/,
      shareExtension + '\n</dict>\n</plist>'
    );

    await fs.writeFile(iosInfoPlistPath, plistContent, 'utf-8');
    console.log('✅ iOS Share Target configured successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error setting up iOS:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up Social Media Share Target for PitBox\n');

  const androidSuccess = await setupAndroidShareTarget();
  const iosSuccess = await setupiOSShareTarget();

  console.log('\n📋 Summary:');
  console.log(`  Android: ${androidSuccess ? '✅ Configured' : '⚠️  Needs setup'}`);
  console.log(`  iOS: ${iosSuccess ? '✅ Configured' : '⚠️  Needs setup'}`);

  if (androidSuccess || iosSuccess) {
    console.log('\n🎉 Setup complete! Now you can:');
    console.log('  1. Rebuild your native projects: npm run build');
    console.log('  2. Open in Android Studio: npm run cap:open:android');
    console.log('  3. Open in Xcode: npm run cap:open:ios');
    console.log('\n📱 Users will now see "PitBox" when they tap Share on social media!');
  } else {
    console.log('\n⚠️  Please run "npm run build" first to generate native projects.');
  }
}

main().catch(console.error);
