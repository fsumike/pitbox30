import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Motor {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  motor_type?: string;
  engine_class?: string;
  expected_life_laps: number;
  refresh_threshold: number;
  total_laps: number;
  effective_laps: number;
  notes?: string;
  last_serviced?: string;
  created_at: string;
  updated_at: string;
}

export interface MotorEvent {
  id: string;
  motor_id: string;
  date: string;
  event_type: 'race' | 'practice' | 'maintenance';
  laps: number;
  average_rpm?: number;
  max_rpm?: number;
  notes?: string;
  track_name?: string;
  created_at: string;
}

export function useMotorHealth() {
  const { user } = useAuth();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMotors();
    } else {
      setMotors([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMotors = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('motors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMotors(data || []);
    } catch (err) {
      console.error('Error loading motors:', err);
      setError('Failed to load motors');
    } finally {
      setLoading(false);
    }
  };

  const saveMotor = async (motorData: Partial<Motor>): Promise<Motor | null> => {
    if (!user) {
      setError('You must be signed in to save motor data');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure the user has a profile
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

      const { data, error } = await supabase
        .from('motors')
        .insert([{
          user_id: user.id,
          name: motorData.name || 'Unnamed Motor',
          description: motorData.description || '',
          motor_type: motorData.motor_type || '',
          engine_class: motorData.engine_class || '',
          expected_life_laps: motorData.expected_life_laps || 750,
          refresh_threshold: motorData.refresh_threshold || 80,
          total_laps: motorData.total_laps || 0,
          effective_laps: motorData.effective_laps || 0,
          notes: motorData.notes || '',
          last_serviced: motorData.last_serviced || null
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchMotors();
      return data;
    } catch (err) {
      setError('Failed to save motor');
      console.error('Error saving motor:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addMotorEvent = async (eventData: Omit<MotorEvent, 'id' | 'created_at'>): Promise<MotorEvent | null> => {
    if (!user) {
      setError('You must be signed in to add motor events');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('motor_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      // Update the motor's total laps
      if (eventData.laps > 0) {
        // First get the current lap counts
        const { data: motor, error: fetchError } = await supabase
          .from('motors')
          .select('total_laps, effective_laps')
          .eq('id', eventData.motor_id)
          .single();

        if (fetchError) {
          console.error('Error fetching motor data:', fetchError);
        } else if (motor) {
          // Update with the incremented values
          const { error: updateError } = await supabase
            .from('motors')
            .update({
              total_laps: (motor.total_laps || 0) + eventData.laps,
              effective_laps: (motor.effective_laps || 0) + eventData.laps,
              updated_at: new Date().toISOString()
            })
            .eq('id', eventData.motor_id);

          if (updateError) {
            console.error('Error updating motor laps:', updateError);
          }
        }
      }

      await fetchMotors();
      return data;
    } catch (err) {
      setError('Failed to add motor event');
      console.error('Error adding motor event:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadMotors = async (): Promise<Motor[]> => {
    if (!user) {
      setError('You must be signed in to load motors');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('motors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError('Failed to load motors');
      console.error('Error loading motors:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const loadMotorEvents = async (motorId: string): Promise<MotorEvent[]> => {
    if (!user) {
      setError('You must be signed in to load motor events');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('motor_events')
        .select('*')
        .eq('motor_id', motorId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      setError('Failed to load motor events');
      console.error('Error loading motor events:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearSeasonData = async (): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to clear season data');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get all motor IDs for this user
      const { data: motors, error: motorsQueryError } = await supabase
        .from('motors')
        .select('id')
        .eq('user_id', user.id);

      if (motorsQueryError) throw motorsQueryError;

      const motorIds = motors?.map(motor => motor.id) || [];

      // Delete all motor events for this season
      const { error: eventsError } = await supabase
        .from('motor_events')
        .delete()
        .in('motor_id', motorIds);

      if (eventsError) throw eventsError;

      // Reset motor lap counts to zero instead of deleting motors
      const { error: motorsError } = await supabase
        .from('motors')
        .update({
          total_laps: 0,
          effective_laps: 0,
          last_serviced: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (motorsError) throw motorsError;

      return true;
    } catch (err) {
      setError('Failed to clear season data');
      console.error('Error clearing season data:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMotor = async (motorId: string, updates: Partial<Motor>): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to update motor data');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('motors')
        .update(updates)
        .eq('id', motorId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError('Failed to update motor');
      console.error('Error updating motor:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMotor = async (motorId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to delete motor');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('motors')
        .delete()
        .eq('id', motorId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError('Failed to delete motor');
      console.error('Error deleting motor:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    motors,
    saveMotor,
    addMotorEvent: addMotorEvent,
    loadMotors,
    loadMotorEvents,
    clearSeasonData,
    updateMotor,
    deleteMotor,
    loading,
    error,
    refreshMotors: fetchMotors
  };
}