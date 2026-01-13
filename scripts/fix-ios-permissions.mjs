#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const INFO_PLIST_PATH = join(process.cwd(), 'ios', 'App', 'App', 'Info.plist');

const REQUIRED_PERMISSIONS = {
  NSPhotoLibraryUsageDescription: 'PitBox needs photo library access to save and share your racing photos and setup sheets.',
  NSPhotoLibraryAddUsageDescription: 'PitBox saves photos to your library so you can keep your racing memories.',
  NSCameraUsageDescription: 'PitBox needs camera access to capture dyno sheets, track conditions, and share race day moments with the racing community.',
  NSLocationWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and automatically tag your setups with track information.',
  NSLocationAlwaysUsageDescription: 'PitBox uses your location to automatically detect when you arrive at a track and help you find racing events near you.',
  NSLocationAlwaysAndWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and auto-tag your setups with track data.',
  NSMicrophoneUsageDescription: 'PitBox uses the microphone to record voice notes about your setup and race conditions.',
  NSMotionUsageDescription: 'PitBox uses motion data to analyze your driving performance and track session metrics.',
  NSContactsUsageDescription: 'PitBox needs access to your contacts to help you find and connect with other racers you know.',
  NSCalendarsUsageDescription: 'PitBox needs access to your calendar to add race events, track days, and maintenance reminders.',
  NSRemindersUsageDescription: 'PitBox needs access to reminders to help you stay on top of vehicle maintenance and race prep.',
  NSBluetoothAlwaysUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.',
  NSBluetoothPeripheralUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.',
  NSLocalNetworkUsageDescription: 'PitBox uses the local network to sync data with other devices and racing equipment.',
  NSFaceIDUsageDescription: 'PitBox uses Face ID to securely protect your racing data and account information.',
  NSSiriUsageDescription: 'PitBox uses Siri to let you access your racing data and setups with voice commands.',
  NSSpeechRecognitionUsageDescription: 'PitBox uses speech recognition to let you add voice notes and dictate setup information hands-free.',
  NSAppleMusicUsageDescription: 'PitBox needs access to your media library to let you add music to your racing videos.',
  NSHealthShareUsageDescription: 'PitBox uses health data to track your physical performance during racing sessions.',
  NSHealthUpdateUsageDescription: 'PitBox saves your racing activity data to Apple Health for comprehensive fitness tracking.',
  NSHomeKitUsageDescription: 'PitBox can integrate with your smart garage and workshop equipment.',
  NFCReaderUsageDescription: 'PitBox uses NFC to read data from racing equipment tags and sensors.',
};

function fixIosPermissions() {
  if (!existsSync(INFO_PLIST_PATH)) {
    console.log('Info.plist not found. Run "npx cap add ios" first.');
    return;
  }

  let content = readFileSync(INFO_PLIST_PATH, 'utf-8');
  let modified = false;

  for (const [key, value] of Object.entries(REQUIRED_PERMISSIONS)) {
    if (!content.includes(`<key>${key}</key>`)) {
      const insertPoint = content.lastIndexOf('</dict>');
      const permissionEntry = `\t<key>${key}</key>\n\t<string>${value}</string>\n`;
      content = content.slice(0, insertPoint) + permissionEntry + content.slice(insertPoint);
      modified = true;
      console.log(`Added: ${key}`);
    }
  }

  if (!content.includes('<key>ITSAppUsesNonExemptEncryption</key>')) {
    const insertPoint = content.lastIndexOf('</dict>');
    content = content.slice(0, insertPoint) + '\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>\n' + content.slice(insertPoint);
    modified = true;
    console.log('Added: ITSAppUsesNonExemptEncryption');
  }

  if (modified) {
    writeFileSync(INFO_PLIST_PATH, content);
    console.log('Info.plist updated with required permissions.');
  } else {
    console.log('All required permissions already present in Info.plist.');
  }
}

fixIosPermissions();
