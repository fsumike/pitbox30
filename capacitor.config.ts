import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pitbox.app',
  appName: 'PIT-BOX',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'pitbox.app',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    infoPlistValues: {
      // CAMERA & PHOTOS (REQUIRED BY APPLE)
      NSCameraUsageDescription: 'PitBox needs camera access to capture dyno sheets, track conditions, and share race day moments with the racing community.',
      NSPhotoLibraryUsageDescription: 'PitBox needs photo library access to save and share your racing photos and setup sheets.',
      NSPhotoLibraryAddUsageDescription: 'PitBox saves photos to your library so you can keep your racing memories.',
      // LOCATION (REQUIRED BY APPLE)
      NSLocationWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and automatically tag your setups with track information.',
      NSLocationAlwaysUsageDescription: 'PitBox uses your location to automatically detect when you arrive at a track and help you find racing events near you.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and auto-tag your setups with track data.',
      // MICROPHONE
      NSMicrophoneUsageDescription: 'PitBox uses the microphone to record voice notes about your setup and race conditions.',
      // MOTION & FITNESS
      NSMotionUsageDescription: 'PitBox uses motion data to analyze your driving performance and track session metrics.',
      // CONTACTS
      NSContactsUsageDescription: 'PitBox needs access to your contacts to help you find and connect with other racers you know.',
      // CALENDAR
      NSCalendarsUsageDescription: 'PitBox needs access to your calendar to add race events, track days, and maintenance reminders.',
      // REMINDERS
      NSRemindersUsageDescription: 'PitBox needs access to reminders to help you stay on top of vehicle maintenance and race prep.',
      // BLUETOOTH
      NSBluetoothAlwaysUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.',
      NSBluetoothPeripheralUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.',
      // LOCAL NETWORK
      NSLocalNetworkUsageDescription: 'PitBox uses the local network to sync data with other devices and racing equipment.',
      // FACE ID
      NSFaceIDUsageDescription: 'PitBox uses Face ID to securely protect your racing data and account information.',
      // SIRI
      NSSiriUsageDescription: 'PitBox uses Siri to let you access your racing data and setups with voice commands.',
      // SPEECH RECOGNITION
      NSSpeechRecognitionUsageDescription: 'PitBox uses speech recognition to let you add voice notes and dictate setup information hands-free.',
      // MEDIA LIBRARY
      NSAppleMusicUsageDescription: 'PitBox needs access to your media library to let you add music to your racing videos.',
      // HEALTH
      NSHealthShareUsageDescription: 'PitBox uses health data to track your physical performance during racing sessions.',
      NSHealthUpdateUsageDescription: 'PitBox saves your racing activity data to Apple Health for comprehensive fitness tracking.',
      // HOMEKIT
      NSHomeKitUsageDescription: 'PitBox can integrate with your smart garage and workshop equipment.',
      // NFC
      NFCReaderUsageDescription: 'PitBox uses NFC to read data from racing equipment tags and sensors.'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1A1A1A",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1A1A1A"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    CapawesomeLiveUpdate: {
      appId: '8251f381-4aed-4b20-ac20-a3aad250cbb8',
      enabled: true,
      autoUpdate: true,
      resetOnUpdate: false
    }
  }
};

export default config;

