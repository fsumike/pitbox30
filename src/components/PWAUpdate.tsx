import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ArrowDownCircle } from 'lucide-react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

function PWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      },
    onRegisterError(error) {
      },
  });

  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [appVersion, setAppVersion] = useState<string | null>(null);

  useEffect(() => {
    // Get app version if on native platform
    const getAppInfo = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const info = await App.getInfo();
          setAppVersion(info.version);
        } catch (err) {
          console.error('Error getting app info:', err);
        }
      }
    };
    
    getAppInfo();

    // Handle PWA install prompt for web
    if (!Capacitor.isNativePlatform()) {
      const handler = (e: Event) => {
        e.preventDefault();
        setIsInstallable(true);
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  // Don't show PWA install prompt on native platforms
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  if (!needRefresh && !isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {needRefresh && (
        <div className="glass-panel p-4 mb-4 animate-slideIn">
          <div className="flex items-center gap-4">
            <ArrowDownCircle className="w-6 h-6 text-brand-gold animate-bounce" />
            <div>
              <p className="font-medium">New version available!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click to update to the latest version
              </p>
            </div>
            <button
              onClick={handleUpdate}
              className="btn-primary py-2 px-4"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {isInstallable && (
        <div className="glass-panel p-4 animate-slideIn">
          <div className="flex items-center gap-4">
            <img 
              src="/android-icon-96-96.png" 
              alt="PIT-BOX.COM" 
              className="w-12 h-12"
            />
            <div>
              <p className="font-medium">Install PIT-BOX.COM</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add to your home screen for quick access
              </p>
            </div>
            <button
              onClick={handleInstall}
              className="btn-primary py-2 px-4"
            >
              Install
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PWAUpdate;