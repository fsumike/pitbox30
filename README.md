# PIT-BOX Mobile App

This repository contains the code for the PIT-BOX mobile application, built with React, Vite, and Capacitor.

## Features

- Cross-platform mobile app for iOS and Android
- Built on top of the existing PWA codebase
- Native device features integration (camera, geolocation, push notifications)
- Offline support
- Native UI components and transitions

## Prerequisites

- Node.js 18+
- npm or yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- Capacitor CLI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```

## Building for Mobile

### Initial Setup

```bash
# Initialize Capacitor
npm run cap:init

# Add platforms
npm run cap:add:android
npm run cap:add:ios
```

### Building and Running

```bash
# Build the web app and sync with native projects
npm run build:mobile

# Open in Android Studio
npm run cap:open:android

# Open in Xcode
npm run cap:open:ios
```

## Project Structure

- `/src` - React application source code
- `/android` - Android project (after running `cap add android`)
- `/ios` - iOS project (after running `cap add ios`)
- `/dist` - Built web application

## Native Features

The app uses various Capacitor plugins to access native device features:

- Camera - For taking photos and selecting from gallery
- Geolocation - For location-based features
- Push Notifications - For user engagement
- Storage - For persistent data storage
- Network - For network status monitoring
- Status Bar & Splash Screen - For native UI integration

## Deployment

### Android

1. Open the project in Android Studio
2. Build the APK or App Bundle
3. Sign the package with your keystore
4. Upload to Google Play Console

### iOS

1. Open the project in Xcode
2. Configure signing with your Apple Developer account
3. Archive the app
4. Upload to App Store Connect

## Troubleshooting

- If you encounter issues with native plugins, ensure you've run `npm run cap:sync` after installing new dependencies
- For iOS build issues, check your provisioning profiles and certificates
- For Android build issues, ensure your Android SDK is properly configured

## License

[License information]