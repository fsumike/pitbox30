import { Capacitor } from '@capacitor/core';

export const isNativeMobile = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isDesktopWeb = (): boolean => {
  return !Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios' || platform === 'android') {
    return platform;
  }
  return 'web';
};
