import React, { useState, useEffect } from 'react';
import { CloudRain, ThumbsUp, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTrackDetection } from '../hooks/useTrackDetection';
import { formatDistanceToNow } from 'date-fns';

interface TrackCondition {
  id: string;
  condition: string;
  temperature?: number;
  air_temperature?: number;
  humidity?: number;
  notes?: string;
  reported_at: string;
  helpful_count: number;
  user_id: string;
  profiles?: {
    display_name?: string;
    car_number?: string;
  };
}

export const TrackConditionsReporter: React.FC = () => {
  const { currentTrack } = useTrackDetection();
  const [conditions, setConditions] = useState<TrackCondition[]>([]);
  const [isReporting, setIsReporting] = useState(false);
  const [newCondition, setNewCondition] = useState('tacky');
  const [trackTemp, setTrackTemp] = useState('');
  const [airTemp, setAirTemp] = useState('');
  const [humidity, setHumidity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentTrack) {
      loadConditions();
      const subscription = subscribeToConditions();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [currentTrack]);

  const loadConditions = async () => {
    if (!currentTrack) return;

    try {
      const { data, error } = await supabase
        .from('track_conditions')
        .select(`
          *,
          profiles:user_id (display_name, car_number)
        `)
        .eq('track_id', currentTrack.id)
        .gte('reported_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('reported_at', { ascending: false });

      if (error) throw error;
      setConditions(data || []);
    } catch (error) {
      console.error('Error loading conditions:', error);
    }
  };

  const subscribeToConditions = () => {
    if (!currentTrack) return null;

    return supabase
      .channel(`track_conditions:${currentTrack.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'track_conditions',
          filter: `track_id=eq.${currentTrack.id}`,
        },
        () => {
          loadConditions();
        }
      )
      .subscribe();
  };

  const reportCondition = async () => {
    if (!currentTrack) return;

    try {
      setIsReporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('track_conditions').insert({
        track_id: currentTrack.id,
        user_id: user.id,
        condition: newCondition,
        temperature: trackTemp ? parseFloat(trackTemp) : null,
        air_temperature: airTemp ? parseFloat(airTemp) : null,
        humidity: humidity ? parseFloat(humidity) : null,
        notes: notes || null,
      });

      if (error) throw error;

      setNewCondition('tacky');
      setTrackTemp('');
      setAirTemp('');
      setHumidity('');
      setNotes('');

      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'track_condition_reported',
        title: 'Track Condition Reported',
        body: `You reported ${newCondition} conditions at ${currentTrack.name}`,
        data: { track_id: currentTrack.id },
      });

      await loadConditions();
    } catch (error) {
      console.error('Error reporting condition:', error);
      alert('Failed to report condition');
    } finally {
      setIsReporting(false);
    }
  };

  const markHelpful = async (conditionId: string) => {
    try {
      const condition = conditions.find((c) => c.id === conditionId);
      if (!condition) return;

      const { error } = await supabase
        .from('track_conditions')
        .update({ helpful_count: condition.helpful_count + 1 })
        .eq('id', conditionId);

      if (error) throw error;
      await loadConditions();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'tacky':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'slick':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'muddy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'wet':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'dry':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!currentTrack) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <CloudRain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Visit a track to see and report conditions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CloudRain className="w-6 h-6" />
          Track Conditions
        </h3>
        <span className="text-sm text-gray-500">{currentTrack.name}</span>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Report Current Conditions
        </h4>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Track Surface
            </label>
            <select
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tacky">Tacky (Fast)</option>
              <option value="slick">Slick (Slippery)</option>
              <option value="muddy">Muddy</option>
              <option value="wet">Wet</option>
              <option value="dry">Dry & Dusty</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Track Temp (°F)
              </label>
              <input
                type="number"
                value={trackTemp}
                onChange={(e) => setTrackTemp(e.target.value)}
                placeholder="85"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Air Temp (°F)
              </label>
              <input
                type="number"
                value={airTemp}
                onChange={(e) => setAirTemp(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Humidity (%)
              </label>
              <input
                type="number"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="65"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Track is taking rubber, getting faster..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <button
            onClick={reportCondition}
            disabled={isReporting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            <AlertCircle className="w-4 h-4" />
            {isReporting ? 'Reporting...' : 'Report Conditions'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Recent Reports (Last 24 Hours)</h4>

        {conditions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent condition reports</p>
        ) : (
          conditions.map((condition) => (
            <div key={condition.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(
                        condition.condition
                      )}`}
                    >
                      {condition.condition.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(condition.reported_at), { addSuffix: true })}
                    </span>
                  </div>

                  {condition.profiles && (
                    <p className="text-sm text-gray-700 mb-1">
                      Reported by{' '}
                      <span className="font-medium">
                        {condition.profiles.display_name || 'Racer'}
                        {condition.profiles.car_number && ` #${condition.profiles.car_number}`}
                      </span>
                    </p>
                  )}

                  {(condition.temperature || condition.air_temperature || condition.humidity) && (
                    <div className="flex gap-4 text-xs text-gray-600 mb-2">
                      {condition.temperature && <span>Track: {condition.temperature}°F</span>}
                      {condition.air_temperature && <span>Air: {condition.air_temperature}°F</span>}
                      {condition.humidity && <span>Humidity: {condition.humidity}%</span>}
                    </div>
                  )}

                  {condition.notes && (
                    <p className="text-sm text-gray-700 italic">{condition.notes}</p>
                  )}
                </div>

                <button
                  onClick={() => markHelpful(condition.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{condition.helpful_count}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Help the racing community by sharing current track conditions
      </p>
    </div>
  );
};
