import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useRetry } from './useRetry';

export interface CustomFieldTemplate {
  id: string;
  name: string;
}

export function useCustomFieldTemplates(carType: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, CustomFieldTemplate[]>>({});
  const { executeWithRetry } = useRetry();

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user, carType]);

  const loadTemplates = async () => {
    if (!user) return {};

    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const { data, error } = await supabase
            .from('setup_customizations')
            .select('customization')
            .eq('user_id', user.id)
            .eq('car_type', carType)
            .maybeSingle()
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (error) {
            throw new Error(`Database error: ${error.message}`);
          }

          return data;
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
          }
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection.');
          }
          throw err;
        }
      });

      if (result?.customization) {
        const customization = result.customization as any;
        const fieldTemplates = customization.customFieldTemplates || {};
        setTemplates(fieldTemplates);
        return fieldTemplates;
      }

      return {};
    } catch (err) {
      console.error('Error loading custom field templates:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load custom field templates';
      setError(errorMessage);
      return {};
    } finally {
      setLoading(false);
    }
  };

  const saveTemplates = async (newTemplates: Record<string, CustomFieldTemplate[]>) => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      await executeWithRetry(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const { data: existing, error: fetchError } = await supabase
            .from('setup_customizations')
            .select('customization')
            .eq('user_id', user.id)
            .eq('car_type', carType)
            .maybeSingle()
            .abortSignal(controller.signal);

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw new Error('Database connection failed: ' + fetchError.message);
          }

          const currentCustomization = (existing?.customization as any) || {};
          const updatedCustomization = {
            ...currentCustomization,
            customFieldTemplates: newTemplates
          };

          const { error: upsertError } = await supabase
            .from('setup_customizations')
            .upsert(
              {
                user_id: user.id,
                car_type: carType,
                customization: updatedCustomization,
                updated_at: new Date().toISOString()
              },
              {
                onConflict: 'user_id,car_type',
                ignoreDuplicates: false
              }
            )
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (upsertError) {
            throw new Error(`Database error: ${upsertError.message}`);
          }
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
          }
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection.');
          }
          throw err;
        }
      });

      setTemplates(newTemplates);
      return true;
    } catch (err) {
      console.error('Error saving custom field templates:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save custom field templates';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    error,
    loadTemplates,
    saveTemplates
  };
}
