import React, { useState, useEffect } from 'react';
import { Timer, Plus, Trash2, TrendingDown, Trophy, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTrackDetection } from '../hooks/useTrackDetection';

interface LapTime {
  id: string;
  lap_time: number;
  lap_number: number;
  session_type: string;
  position?: number;
  notes?: string;
  recorded_at: string;
}

interface LapTimeTrackerProps {
  setupId?: string;
}

export const LapTimeTracker: React.FC<LapTimeTrackerProps> = ({ setupId }) => {
  const { currentTrack } = useTrackDetection();
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [newLapTime, setNewLapTime] = useState('');
  const [sessionType, setSessionType] = useState('practice');
  const [position, setPosition] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      loadLapTimes();
    }
  }, [currentTrack]);

  const loadLapTimes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentTrack) return;

      const query = supabase
        .from('lap_times')
        .select('*')
        .eq('user_id', user.id)
        .eq('track_id', currentTrack.id)
        .order('recorded_at', { ascending: false });

      if (setupId) {
        query.eq('setup_id', setupId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLapTimes(data || []);
    } catch (error) {
      console.error('Error loading lap times:', error);
    }
  };

  const addLapTime = async () => {
    if (!newLapTime || !currentTrack) return;

    try {
      setIsAdding(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const timeInSeconds = parseFloat(newLapTime);
      if (isNaN(timeInSeconds)) {
        alert('Please enter a valid time');
        return;
      }

      const { error } = await supabase.from('lap_times').insert({
        user_id: user.id,
        track_id: currentTrack.id,
        setup_id: setupId || null,
        lap_time: timeInSeconds,
        lap_number: lapTimes.length + 1,
        session_type: sessionType,
        position: position ? parseInt(position) : null,
        notes: notes || null,
      });

      if (error) throw error;

      setNewLapTime('');
      setPosition('');
      setNotes('');
      await loadLapTimes();
    } catch (error) {
      console.error('Error adding lap time:', error);
      alert('Failed to add lap time');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteLapTime = async (id: string) => {
    if (!confirm('Delete this lap time?')) return;

    try {
      const { error } = await supabase
        .from('lap_times')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadLapTimes();
    } catch (error) {
      console.error('Error deleting lap time:', error);
    }
  };

  const formatLapTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  const getBestLap = () => {
    if (lapTimes.length === 0) return null;
    return lapTimes.reduce((best, current) =>
      current.lap_time < best.lap_time ? current : best
    );
  };

  const getAverageLap = () => {
    if (lapTimes.length === 0) return 0;
    const total = lapTimes.reduce((sum, lap) => sum + lap.lap_time, 0);
    return total / lapTimes.length;
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'bg-blue-100 text-blue-800';
      case 'qualifying':
        return 'bg-purple-100 text-purple-800';
      case 'heat':
        return 'bg-orange-100 text-orange-800';
      case 'feature':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const bestLap = getBestLap();
  const avgLap = getAverageLap();

  if (!currentTrack) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Visit a track to start tracking lap times</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Timer className="w-6 h-6" />
          Lap Times - {currentTrack.name}
        </h3>
      </div>

      {lapTimes.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Best Lap</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {bestLap ? formatLapTime(bestLap.lap_time) : '--'}
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Average</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {avgLap > 0 ? formatLapTime(avgLap) : '--'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Total Laps</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{lapTimes.length}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Add Lap Time</h4>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Lap Time (seconds)
            </label>
            <input
              type="number"
              step="0.001"
              value={newLapTime}
              onChange={(e) => setNewLapTime(e.target.value)}
              placeholder="14.523"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="practice">Practice</option>
              <option value="qualifying">Qualifying</option>
              <option value="heat">Heat Race</option>
              <option value="feature">Feature</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Position (optional)
            </label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Car felt tight"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={addLapTime}
          disabled={isAdding || !newLapTime}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Lap Time
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 mb-3">Lap History</h4>

        {lapTimes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No lap times recorded yet</p>
        ) : (
          lapTimes.map((lap, index) => (
            <div
              key={lap.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                lap.id === bestLap?.id ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-8">#{lapTimes.length - index}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatLapTime(lap.lap_time)}
                    </span>
                    {lap.id === bestLap?.id && (
                      <Trophy className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getSessionColor(lap.session_type)}`}>
                      {lap.session_type}
                    </span>
                    {lap.position && (
                      <span className="text-xs text-gray-600">
                        P{lap.position}
                      </span>
                    )}
                  </div>
                  {lap.notes && (
                    <p className="text-xs text-gray-600 mt-1">{lap.notes}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteLapTime(lap.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
