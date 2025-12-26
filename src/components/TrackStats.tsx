import React from 'react';
import { Trophy, Clock, Gauge, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TrackStatsProps {
  trackId: string;
  userId: string;
}

export function TrackStats({ trackId, userId }: TrackStatsProps) {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadStats();
  }, [trackId, userId]);

  const loadStats = async () => {
    try {
      const { data } = await supabase
        .from('track_stats')
        .select('*')
        .eq('track_id', trackId)
        .eq('user_id', userId)
        .single();

      setStats(data);
    } catch (err) {
      console.error('Error loading track stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="glass-panel p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-brand-gold" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Best Lap</p>
            <p className="text-xl font-bold">
              {stats?.best_lap_time ? `${stats.best_lap_time}s` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4">
        <div className="flex items-center gap-3">
          <Gauge className="w-8 h-8 text-brand-gold" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Speed</p>
            <p className="text-xl font-bold">
              {stats?.average_speed ? `${stats.average_speed} mph` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-brand-gold" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Setup Rating</p>
            <p className="text-xl font-bold">
              {stats?.setup_effectiveness ? `${stats.setup_effectiveness}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}