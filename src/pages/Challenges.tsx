import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Clock, Users, ChevronRight, Medal, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { format, formatDistanceToNow, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  challenge_type: 'video' | 'photo' | 'lap_time' | 'other';
  start_date: string;
  end_date: string | null;
  prize_description: string | null;
  entry_count: number;
  is_active: boolean;
  created_at: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  vote_count: number;
  lap_time: number | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
  posts?: {
    content: string;
    media_url: string;
  };
  video_reels?: {
    title: string;
    video_url: string;
    thumbnail_url: string;
  };
}

export default function Challenges() {
  const [challenges, setChallenge] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChallenges();
  }, [filter]);

  useEffect(() => {
    if (selectedChallenge) {
      loadLeaderboard(selectedChallenge.id);
    }
  }, [selectedChallenge]);

  const loadChallenges = async () => {
    try {
      let query = supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'active') {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      const activeChallenges = data?.filter(c => {
        if (!c.end_date) return c.is_active;
        return c.is_active && !isBefore(new Date(c.end_date), new Date());
      }) || [];

      setChallenge(filter === 'active' ? activeChallenges : data || []);

      if (activeChallenges.length > 0 && !selectedChallenge) {
        setSelectedChallenge(activeChallenges[0]);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (challengeId: string) => {
    try {
      const { data, error } = await supabase
        .from('challenge_entries')
        .select(`
          *,
          profiles:user_id (username, avatar_url, is_verified),
          posts:post_id (content, media_url),
          video_reels:reel_id (title, video_url, thumbnail_url)
        `)
        .eq('challenge_id', challengeId)
        .order('vote_count', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-600';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-brand-gold animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-brand-gold" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Challenges</h1>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Challenges
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {challenges.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Active Challenges
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new racing challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Active Challenges
                </h2>
                <div className="space-y-2">
                  {challenges.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => setSelectedChallenge(challenge)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedChallenge?.id === challenge.id
                          ? 'bg-brand-gold text-white'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{challenge.title}</h3>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {challenge.entry_count}
                        </span>
                        {challenge.end_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDistanceToNow(new Date(challenge.end_date))} left
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedChallenge && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{selectedChallenge.title}</h2>
                        <p className="text-lg opacity-90 mb-4">{selectedChallenge.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                            #{selectedChallenge.hashtag}
                          </span>
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                            {selectedChallenge.challenge_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <TrendingUp className="w-12 h-12 opacity-80" />
                    </div>

                    {selectedChallenge.prize_description && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg">
                        <p className="font-semibold mb-1">Prize:</p>
                        <p>{selectedChallenge.prize_description}</p>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span>{selectedChallenge.entry_count} entries</span>
                      {selectedChallenge.end_date && (
                        <span>
                          Ends {formatDistanceToNow(new Date(selectedChallenge.end_date), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Leaderboard
                      </h3>
                      <TrendingUp className="w-6 h-6 text-brand-gold" />
                    </div>

                    {leaderboard.length === 0 ? (
                      <div className="text-center py-12">
                        <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No entries yet. Be the first to enter!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((entry, index) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-center w-12">
                              {getRankIcon(index + 1)}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {entry.profiles?.username || 'Anonymous'}
                                </span>
                                {entry.profiles?.is_verified && (
                                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              {entry.lap_time && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Lap Time: {entry.lap_time}s
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2 text-brand-gold font-bold">
                                <TrendingUp className="w-4 h-4" />
                                {entry.vote_count}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">votes</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
