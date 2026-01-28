import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

interface BiometricResult {
  available: boolean;
  biometricType?: 'face' | 'fingerprint' | 'iris' | 'none';
  error?: string;
}

export const useBiometricAuth = () => {
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('none');

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    if (!Capacitor.isNativePlatform()) {
      setBiometricAvailable(false);
      return;
    }

    try {
      const info = await Device.getInfo();

      if (info.platform === 'ios') {
        setBiometricAvailable(true);
        setBiometricType('face');
      } else if (info.platform === 'android') {
        setBiometricAvailable(true);
        setBiometricType('fingerprint');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setBiometricAvailable(false);
    }
  };

  const authenticateWithBiometric = async (): Promise<BiometricResult> => {
    if (!Capacitor.isNativePlatform()) {
      return {
        available: false,
        error: 'Biometric authentication only available on native platforms',
      };
    }

    try {
      const info = await Device.getInfo();
      const { value: storedCredentials } = await Preferences.get({ key: 'biometric_credentials' });

      if (!storedCredentials) {
        return {
          available: false,
          error: 'No stored credentials found. Please log in with email/password first.',
        };
      }

      if (info.platform === 'ios' || info.platform === 'android') {
        return {
          available: false,
          error: 'Biometric authentication requires @capacitor-community/biometric-auth plugin. Please install and configure the plugin for production use.',
        };
      }

      return {
        available: false,
        error: 'Unsupported platform',
      };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  };

  const saveBiometricCredentials = async (email: string, token: string) => {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      const credentials = {
        email,
        token,
        timestamp: new Date().toISOString(),
      };

      await Preferences.set({
        key: 'biometric_credentials',
        value: JSON.stringify(credentials),
      });
      return true;
    } catch (error) {
      console.error('Error saving biometric credentials:', error);
      return false;
    }
  };

  const getBiometricCredentials = async () => {
    const { value: stored } = await Preferences.get({ key: 'biometric_credentials' });
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const removeBiometricCredentials = async () => {
    await Preferences.remove({ key: 'biometric_credentials' });
  };

  const getBiometricLabel = () => {
    if (!biometricAvailable) return 'Biometric Auth';

    switch (biometricType) {
      case 'face':
        return 'Face ID';
      case 'fingerprint':
        return 'Fingerprint';
      case 'iris':
        return 'Iris Scan';
      default:
        return 'Biometric Auth';
    }
  };

  return {
    biometricAvailable,
    biometricType,
    authenticateWithBiometric,
    saveBiometricCredentials,
    getBiometricCredentials,
    removeBiometricCredentials,
    getBiometricLabel,
  };
};
