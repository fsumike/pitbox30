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
      NSCameraUsageDescription: 'PitBox needs camera access to capture dyno sheets, track conditions, and share race day moments with the racing community.',
      NSPhotoLibraryUsageDescription: 'PitBox needs photo library access to save and share your racing photos and setup sheets.',
      NSPhotoLibraryAddUsageDescription: 'PitBox saves photos to your library so you can keep your racing memories.',
      NSLocationWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and automatically tag your setups with track information.',
      NSLocationAlwaysUsageDescription: 'PitBox uses your location to automatically detect when you arrive at a track and help you find racing events near you.',
      NSLocationAlwaysAndWhenInUseUsageDescription: 'PitBox uses your location to find nearby tracks and auto-tag your setups with track data.',
      NSMicrophoneUsageDescription: 'PitBox uses the microphone to record voice notes about your setup and race conditions.',
      NSBluetoothAlwaysUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.',
      NSBluetoothPeripheralUsageDescription: 'PitBox uses Bluetooth to connect to racing sensors and track data equipment.'
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

