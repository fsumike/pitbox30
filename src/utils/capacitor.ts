import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Network } from '@capacitor/network';
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';

// Check if running on a native platform
export const isNative = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isWeb = () => Capacitor.getPlatform() === 'web';

// Camera utilities
export const takePicture = async () => {
  if (!isNative) return null;
  
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    
    return image.dataUrl;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
};

export const selectPicture = async () => {
  if (!isNative) return null;
  
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    
    return image.dataUrl;
  } catch (error) {
    console.error('Error selecting picture:', error);
    return null;
  }
};

// Geolocation utilities
export const getCurrentPosition = async (): Promise<Position | null> => {
  if (!isNative) return null;
  
  try {
    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });
  } catch (error) {
    console.error('Error getting current position:', error);
    return null;
  }
};

// Network utilities
export const checkNetworkStatus = async () => {
  if (!isNative) return { connected: navigator.onLine, connectionType: 'unknown' };
  
  try {
    return await Network.getStatus();
  } catch (error) {
    console.error('Error checking network status:', error);
    return { connected: navigator.onLine, connectionType: 'unknown' };
  }
};

// Push notification utilities
export const initPushNotifications = async () => {
  if (!isNative) return false;
  
  try {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      // Register with FCM/APNS
      await PushNotifications.register();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
};

// Storage utilities
export const setStorageItem = async (key: string, value: string) => {
  if (!isNative) {
    localStorage.setItem(key, value);
    return;
  }
  
  try {
    // Use localStorage as fallback since @capacitor/storage is deprecated
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting storage item:', error);
    // Fallback to localStorage
    localStorage.setItem(key, value);
  }
};

export const getStorageItem = async (key: string): Promise<string | null> => {
  if (!isNative) {
    return localStorage.getItem(key);
  }
  
  try {
    // Use localStorage as fallback since @capacitor/storage is deprecated
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting storage item:', error);
    // Fallback to localStorage
    return localStorage.getItem(key);
  }
};

export const removeStorageItem = async (key: string) => {
  if (!isNative) {
    localStorage.removeItem(key);
    return;
  }
  
  try {
    // Use localStorage as fallback since @capacitor/storage is deprecated
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing storage item:', error);
    // Fallback to localStorage
    localStorage.removeItem(key);
  }
};

// App utilities
export const addAppListener = (eventName: string, listener: any) => {
  if (!isNative) return;
  
  try {
    return App.addListener(eventName, listener);
  } catch (error) {
    console.error(`Error adding ${eventName} listener:`, error);
  }
};

export const exitApp = () => {
  if (!isNative) return;
  
  try {
    App.exitApp();
  } catch (error) {
    console.error('Error exiting app:', error);
  }
};