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

export const isPlatform = (platformName: 'capacitor' | 'ios' | 'android' | 'web'): boolean => {
  if (platformName === 'capacitor') {
    return Capacitor.isNativePlatform();
  }
  return Capacitor.getPlatform() === platformName;
};
