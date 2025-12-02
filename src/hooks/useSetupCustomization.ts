import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useRetry } from './useRetry';

export interface FieldGroup {
  title: string;
  fields: string[];
  expanded: boolean;
  visibleFields: Record<string, boolean>;
  bgColor?: string;
}

export function useSetupCustomization(carType: string) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCustomization, setSavedCustomization] = useState<FieldGroup[] | null>(null);
  const { executeWithRetry } = useRetry();

  // Load user's saved customization when component mounts
  useEffect(() => {
    if (user) {
      loadCustomization();
    }
  }, [user, carType]);

  const loadCustomization = async () => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Execute database operations with retry logic and network error handling
      const result = await executeWithRetry(async () => {
        try {
          // First verify Supabase connection with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          const { data: healthCheck, error: healthCheckError } = await supabase
            .from('setup_customizations')
            .select('count')
            .limit(1)
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);

          if (healthCheckError) {
            throw new Error('Database connection failed: ' + healthCheckError.message);
          }

          const { data, error } = await supabase
            .from('setup_customizations')
            .select('*')
            .eq('user_id', user.id)
            .eq('car_type', carType)
            .maybeSingle()
            .abortSignal(controller.signal);

          if (error) {
            if (error.code === 'PGRST301') {
              throw new Error('Database connection failed: Invalid credentials');
            } else if (error.code === 'PGRST302') {
              throw new Error('Database connection failed: Insufficient permissions');
            } else {
              throw new Error(`Database error: ${error.message}`);
            }
          }

          return data;
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
          }
          // Handle network errors specifically
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection.');
          }
          throw err;
        }
      });
      
      if (result?.customization) {
        setSavedCustomization(result.customization as FieldGroup[]);
        return result.customization as FieldGroup[];
      }
      
      return null;
    } catch (err) {
      console.error('Error loading customization:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load customization settings';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveCustomization = async (customization: FieldGroup[]) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await executeWithRetry(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

          const { error: healthCheckError } = await supabase
            .from('setup_customizations')
            .select('count')
            .limit(1)
            .abortSignal(controller.signal);

          if (healthCheckError) {
            throw new Error('Database connection failed: ' + healthCheckError.message);
          }

          // Use upsert with proper conflict resolution
          const { error: upsertError } = await supabase
            .from('setup_customizations')
            .upsert(
              {
                user_id: user.id,
                car_type: carType,
                customization: customization,
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
            if (upsertError.code === 'PGRST301') {
              throw new Error('Database connection failed: Invalid credentials');
            } else if (upsertError.code === 'PGRST302') {
              throw new Error('Database connection failed: Insufficient permissions');
            } else {
              throw new Error(`Database error: ${upsertError.message}`);
            }
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
      
      // Update the local state with the saved customization
      setSavedCustomization(customization);
      return true;
    } catch (err) {
      console.error('Error saving customization:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save customization settings';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetCustomization = async () => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await executeWithRetry(async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

          const { error: healthCheckError } = await supabase
            .from('setup_customizations')
            .select('count')
            .limit(1)
            .abortSignal(controller.signal);

          if (healthCheckError) {
            throw new Error('Database connection failed: ' + healthCheckError.message);
          }

          const { error } = await supabase
            .from('setup_customizations')
            .delete()
            .eq('user_id', user.id)
            .eq('car_type', carType)
            .abortSignal(controller.signal);
          
          clearTimeout(timeoutId);

          if (error) {
            if (error.code === 'PGRST301') {
              throw new Error('Database connection failed: Invalid credentials');
            } else if (error.code === 'PGRST302') {
              throw new Error('Database connection failed: Insufficient permissions');
            } else {
              throw new Error(`Database error: ${error.message}`);
            }
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
      
      // Clear the local state
      setSavedCustomization(null);
      return true;
    } catch (err) {
      console.error('Error resetting customization:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset customization settings';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    savedCustomization,
    loading,
    error,
    loadCustomization,
    saveCustomization,
    resetCustomization
  };
}