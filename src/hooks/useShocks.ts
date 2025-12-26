import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Shock {
  id: string;
  user_id: string;
  serial_number: string;
  dyno_photo_url: string | null;
  notes: string | null;
  last_refurbished: string | null;
  created_at: string;
  updated_at: string;
}

export interface SetupShock {
  id: string;
  setup_id: string;
  shock_id: string;
  position: 'LF' | 'RF' | 'LR' | 'RR';
  created_at: string;
  shock?: Shock;
}

export function useShocks() {
  const { user } = useAuth();
  const [shocks, setShocks] = useState<Shock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchShocks();
    }
  }, [user]);

  const fetchShocks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shocks')
        .select('*')
        .order('serial_number', { ascending: true });

      if (error) throw error;

      // Generate signed URLs for all shocks with photos
      const shocksWithSignedUrls = await Promise.all(
        (data || []).map(async (shock) => {
          if (shock.dyno_photo_url) {
            try {
              // Extract the path from the URL or use as-is if it's already a path
              const path = shock.dyno_photo_url.includes('/dyno-sheets/')
                ? shock.dyno_photo_url.split('/dyno-sheets/')[1]
                : shock.dyno_photo_url;

              // Generate a signed URL that's valid for 1 hour
              const { data: signedUrlData, error: signedError } = await supabase.storage
                .from('dyno-sheets')
                .createSignedUrl(path, 3600);

              if (signedError) {
                console.error('Error generating signed URL:', signedError);
                return shock;
              }

              return {
                ...shock,
                dyno_photo_url: signedUrlData.signedUrl
              };
            } catch (err) {
              console.error('Error processing shock photo:', err);
              return shock;
            }
          }
          return shock;
        })
      );

      setShocks(shocksWithSignedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shocks');
    } finally {
      setLoading(false);
    }
  };

  const addShock = async (
    serial_number: string,
    dyno_photo?: File,
    notes?: string,
    last_refurbished?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      let dyno_photo_url = null;

      if (dyno_photo) {
        const fileExt = dyno_photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${serial_number}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('dyno-sheets')
          .upload(fileName, dyno_photo, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('Upload successful:', uploadData);

        // Store just the path, not the full URL
        dyno_photo_url = fileName;
        console.log('Stored file path:', dyno_photo_url);
      }

      const { data, error } = await supabase
        .from('shocks')
        .insert({
          user_id: user.id,
          serial_number,
          dyno_photo_url,
          notes: notes || null,
          last_refurbished: last_refurbished || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Shock added to database:', data);
      setShocks((prev) => [...prev, data]);

      // Refresh the list to ensure URLs are correct
      await fetchShocks();

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add shock');
    }
  };

  const updateShock = async (
    id: string,
    updates: {
      serial_number?: string;
      notes?: string;
      last_refurbished?: string;
      dyno_photo?: File | null;
    }
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const shock = shocks.find((s) => s.id === id);
      if (!shock) throw new Error('Shock not found');

      let dyno_photo_url = shock.dyno_photo_url;

      if (updates.dyno_photo === null && shock.dyno_photo_url) {
        const oldPath = shock.dyno_photo_url.split('/dyno-sheets/')[1];
        if (oldPath) {
          await supabase.storage.from('dyno-sheets').remove([oldPath]);
        }
        dyno_photo_url = null;
      } else if (updates.dyno_photo instanceof File) {
        if (shock.dyno_photo_url) {
          const oldPath = shock.dyno_photo_url.includes('/dyno-sheets/')
            ? shock.dyno_photo_url.split('/dyno-sheets/')[1]
            : shock.dyno_photo_url;
          if (oldPath) {
            await supabase.storage.from('dyno-sheets').remove([oldPath]);
          }
        }

        const fileExt = updates.dyno_photo.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${shock.serial_number}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('dyno-sheets')
          .upload(fileName, updates.dyno_photo, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('Upload successful:', uploadData);

        // Store just the path, not the full URL
        dyno_photo_url = fileName;
        console.log('Stored file path:', dyno_photo_url);
      }

      const { data, error } = await supabase
        .from('shocks')
        .update({
          serial_number: updates.serial_number,
          notes: updates.notes,
          last_refurbished: updates.last_refurbished,
          dyno_photo_url,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log('Shock updated in database:', data);
      setShocks((prev) => prev.map((s) => (s.id === id ? data : s)));

      // Refresh the list to ensure URLs are correct
      await fetchShocks();

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update shock');
    }
  };

  const deleteShock = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const shock = shocks.find((s) => s.id === id);
      if (!shock) throw new Error('Shock not found');

      if (shock.dyno_photo_url) {
        const path = shock.dyno_photo_url.includes('/dyno-sheets/')
          ? shock.dyno_photo_url.split('/dyno-sheets/')[1]
          : shock.dyno_photo_url;
        if (path) {
          await supabase.storage.from('dyno-sheets').remove([path]);
        }
      }

      const { error } = await supabase.from('shocks').delete().eq('id', id);

      if (error) throw error;

      setShocks((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete shock');
    }
  };

  const getShocksBySetup = async (setupId: string): Promise<SetupShock[]> => {
    try {
      const { data, error } = await supabase
        .from('setup_shocks')
        .select('*, shock:shocks(*)')
        .eq('setup_id', setupId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch setup shocks');
    }
  };

  const saveSetupShocks = async (
    setupId: string,
    shockAssignments: { position: 'LF' | 'RF' | 'LR' | 'RR'; shock_id: string }[]
  ) => {
    try {
      await supabase.from('setup_shocks').delete().eq('setup_id', setupId);

      if (shockAssignments.length > 0) {
        const { error } = await supabase.from('setup_shocks').insert(
          shockAssignments.map((assignment) => ({
            setup_id: setupId,
            shock_id: assignment.shock_id,
            position: assignment.position,
          }))
        );

        if (error) throw error;
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save setup shocks');
    }
  };

  const getShockBySerialNumber = (serialNumber: string): Shock | undefined => {
    return shocks.find(
      (s) => s.serial_number.toLowerCase() === serialNumber.toLowerCase()
    );
  };

  const getSignedUrlForShock = async (shock: Shock): Promise<string | null> => {
    if (!shock.dyno_photo_url) return null;

    try {
      const path = shock.dyno_photo_url.includes('/dyno-sheets/')
        ? shock.dyno_photo_url.split('/dyno-sheets/')[1]
        : shock.dyno_photo_url;

      const { data, error } = await supabase.storage
        .from('dyno-sheets')
        .createSignedUrl(path, 3600);

      if (error) {
        console.error('Error generating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error getting signed URL:', err);
      return null;
    }
  };

  return {
    shocks,
    loading,
    error,
    addShock,
    updateShock,
    deleteShock,
    getShocksBySetup,
    saveSetupShocks,
    getShockBySerialNumber,
    getSignedUrlForShock,
    refreshShocks: fetchShocks,
  };
}
