import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pitbox.app',
  appName: 'PitBox',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'pitbox.app',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
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

