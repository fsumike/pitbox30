import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'post_race' | 'shop' | 'pre_race';
}

interface ChecklistData {
  post_race: ChecklistItem[];
  shop: ChecklistItem[];
  pre_race: ChecklistItem[];
}

export function useMaintenanceChecklists() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChecklist = async (vehicleType: string): Promise<ChecklistData | null> => {
    if (!user) {
      setError('You must be signed in to access checklists');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('maintenance_checklists')
        .select('*')
        .eq('user_id', user.id)
        .eq('vehicle_type', vehicleType)
        .maybeSingle();

      if (fetchError) throw fetchError;

      return data?.checklist_data || null;
    } catch (err) {
      console.error('Error loading checklist:', err);
      // Don't set error for missing checklist - this is expected for new users
      if (err.code !== 'PGRST116') {
        setError('Failed to load checklist');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDefaultChecklist = async (vehicleType: string): Promise<ChecklistData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('default_checklists')
        .select('*')
        .eq('vehicle_type', vehicleType)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        return data.checklist_data;
      }

      // If not found in database, return a basic default structure
      return {
        post_race: [
          {
            id: crypto.randomUUID(),
            text: 'Check tire wear and damage',
            completed: false,
            category: 'post_race'
          },
          {
            id: crypto.randomUUID(),
            text: 'Inspect suspension components',
            completed: false,
            category: 'post_race'
          },
          {
            id: crypto.randomUUID(),
            text: 'Check engine oil level',
            completed: false,
            category: 'post_race'
          }
        ],
        shop: [
          {
            id: crypto.randomUUID(),
            text: 'Clean and inspect chassis',
            completed: false,
            category: 'shop'
          },
          {
            id: crypto.randomUUID(),
            text: 'Service engine if needed',
            completed: false,
            category: 'shop'
          },
          {
            id: crypto.randomUUID(),
            text: 'Check and adjust setup',
            completed: false,
            category: 'shop'
          }
        ],
        pre_race: [
          {
            id: crypto.randomUUID(),
            text: 'Check tire pressures',
            completed: false,
            category: 'pre_race'
          },
          {
            id: crypto.randomUUID(),
            text: 'Verify safety equipment',
            completed: false,
            category: 'pre_race'
          },
          {
            id: crypto.randomUUID(),
            text: 'Final setup adjustments',
            completed: false,
            category: 'pre_race'
          }
        ]
      };
    } catch (err) {
      console.error('Error loading default checklist:', err);
      setError('Failed to load default checklist');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveChecklist = async (vehicleType: string, checklistData: ChecklistData): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to save checklists');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: upsertError } = await supabase
        .from('maintenance_checklists')
        .upsert(
          {
            user_id: user.id,
            vehicle_type: vehicleType,
            checklist_data: checklistData,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,vehicle_type',
            ignoreDuplicates: false
          }
        );

      if (upsertError) throw upsertError;

      return true;
    } catch (err: any) {
      console.error('Error saving checklist:', err);
      setError(err?.message || 'Failed to save checklist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteChecklist = async (vehicleType: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to delete checklists');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('maintenance_checklists')
        .delete()
        .eq('user_id', user.id)
        .eq('vehicle_type', vehicleType);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error('Error deleting checklist:', err);
      setError('Failed to delete checklist');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restoreDefaultChecklist = async (vehicleType: string): Promise<ChecklistData | null> => {
    try {
      // Delete existing custom checklist
      await deleteChecklist(vehicleType);
      
      // Return default checklist
      return await getDefaultChecklist(vehicleType);
    } catch (err) {
      console.error('Error restoring default checklist:', err);
      setError('Failed to restore default checklist');
      return null;
    }
  };

  return {
    getChecklist,
    getDefaultChecklist,
    saveChecklist,
    deleteChecklist,
    restoreDefaultChecklist,
    loading,
    error
  };
}