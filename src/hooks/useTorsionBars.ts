import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface TorsionBar {
  id?: string;
  user_id?: string;
  diameter: number;
  length: number;
  rate: number;
  location: 'LF' | 'RF' | 'LR' | 'RR';
  brand?: string;
  notes?: string;
  in_car: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useTorsionBars() {
  const { user } = useAuth();
  const [bars, setBars] = useState<TorsionBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTorsionBars();
    } else {
      setBars([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTorsionBars = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('torsion_bars')
        .select('*')
        .eq('user_id', user.id)
        .order('location', { ascending: true });

      if (error) throw error;
      setBars(data || []);
    } catch (err) {
      console.error('Error loading torsion bars:', err);
      setError('Failed to load torsion bars');
    } finally {
      setLoading(false);
    }
  };

  const saveTorsionBar = async (barData: TorsionBar): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to save torsion bars');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, username: user.email }]);

        if (createProfileError) throw createProfileError;
      }

      const { error } = await supabase
        .from('torsion_bars')
        .insert([{
          user_id: user.id,
          diameter: barData.diameter,
          length: barData.length,
          rate: barData.rate,
          location: barData.location,
          brand: barData.brand || '',
          notes: barData.notes || '',
          in_car: barData.in_car
        }]);

      if (error) throw error;

      await fetchTorsionBars();
      return true;
    } catch (err) {
      setError('Failed to save torsion bar');
      console.error('Error saving torsion bar:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTorsionBar = async (barId: string, updates: Partial<TorsionBar>): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to update torsion bars');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('torsion_bars')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', barId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchTorsionBars();
      return true;
    } catch (err) {
      setError('Failed to update torsion bar');
      console.error('Error updating torsion bar:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTorsionBar = async (barId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to delete torsion bars');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('torsion_bars')
        .delete()
        .eq('id', barId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchTorsionBars();
      return true;
    } catch (err) {
      setError('Failed to delete torsion bar');
      console.error('Error deleting torsion bar:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bars,
    loading,
    error,
    saveTorsionBar,
    updateTorsionBar,
    deleteTorsionBar,
    refreshBars: fetchTorsionBars
  };
}
