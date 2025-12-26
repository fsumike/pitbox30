import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Import Capacitor plugins
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// Import offline cache
import { initOfflineSupport } from './utils/offlineCache';

// Initialize Capacitor plugins
const initCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Set status bar background color
      await StatusBar.setBackgroundColor({ color: '#1A1A1A' });
      
      // Hide the splash screen with a fade animation
      await SplashScreen.hide({
        fadeOutDuration: 500
      });
    } catch (error) {
      console.error('Error initializing Capacitor plugins:', error);
    }
  }
};

// Initialize Capacitor and offline support
initCapacitor();
initOfflineSupport();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);