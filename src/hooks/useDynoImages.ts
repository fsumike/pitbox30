import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { DynoImage } from '../lib/supabase';

export function useDynoImages() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDynoImage = async (
    type: 'motor' | 'shock',
    imageData: string,
    setupId?: string
  ): Promise<DynoImage | null> => {
    if (!user) {
      setError('You must be signed in to save dyno images');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // First, ensure the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username: user.email }]);

        if (createProfileError) throw createProfileError;
      }

      // Save the dyno image
      const { data, error } = await supabase
        .from('dyno_images')
        .insert([
          {
            user_id: user.id,
            setup_id: setupId || null,
            type,
            url: imageData
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError('Failed to save dyno image');
      console.error('Error saving dyno image:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadDynoImages = async (type: 'motor' | 'shock'): Promise<DynoImage[]> => {
    if (!user) {
      setError('You must be signed in to load dyno images');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('dyno_images')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError('Failed to load dyno images');
      console.error('Error loading dyno images:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const deleteDynoImage = async (imageId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to delete dyno images');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('dyno_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', user.id); // Ensure user can only delete their own images

      if (error) throw error;
      return true;
    } catch (err) {
      setError('Failed to delete dyno image');
      console.error('Error deleting dyno image:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveDynoImage,
    loadDynoImages,
    deleteDynoImage,
    loading,
    error
  };
}