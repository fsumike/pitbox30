import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const usePushNotifications = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      initializePushNotifications();
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  const initializePushNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      return;
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', async (token) => {
      setToken(token.value);
      await saveTokenToDatabase(token.value);
      setIsRegistered(true);
    });

    await PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      });
  };

  const saveTokenToDatabase = async (deviceToken: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const platform = Capacitor.getPlatform();
      const deviceInfo = {
        platform: platform,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('push_notification_tokens')
        .upsert({
          user_id: user.id,
          token: deviceToken,
          platform: platform,
          device_info: deviceInfo,
          last_used: new Date().toISOString(),
        }, {
          onConflict: 'token'
        });

      if (error) {
        console.error('Error saving token:', error);
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const getNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    isRegistered,
    token,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
