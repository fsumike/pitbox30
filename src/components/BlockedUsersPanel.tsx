import React, { useState, useEffect } from 'react';
import { Shield, Loader2, User, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockedUser } from '../types';

export default function BlockedUsersPanel() {
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBlockedUsers();
    }
  }, [user]);

  const loadBlockedUsers = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select(`
          *,
          blocked_profile:profiles!blocked_users_blocked_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('blocker_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlockedUsers(data || []);
    } catch (err) {
      console.error('Error loading blocked users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockedUserId: string) => {
    if (!user) return;

    setUnblocking(blockedUserId);
    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', blockedUserId);

      if (error) throw error;

      setBlockedUsers((prev) => prev.filter((bu) => bu.blocked_id !== blockedUserId));
    } catch (err) {
      console.error('Error unblocking user:', err);
    } finally {
      setUnblocking(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-brand-gold" />
        <div>
          <h2 className="text-2xl font-bold">Blocked Users</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage users you've blocked
          </p>
        </div>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            You haven't blocked any users
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {blockedUsers.map((blockedUser) => (
              <motion.div
                key={blockedUser.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {blockedUser.blocked_profile?.avatar_url ? (
                      <img
                        src={blockedUser.blocked_profile.avatar_url}
                        alt={blockedUser.blocked_profile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {blockedUser.blocked_profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{blockedUser.blocked_profile?.username || 'unknown'}
                    </p>
                    {blockedUser.reason && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Reason: {blockedUser.reason}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(blockedUser.blocked_id)}
                  disabled={unblocking === blockedUser.blocked_id}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {unblocking === blockedUser.blocked_id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Unblocking...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Unblock
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">About blocking</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Blocked users can't see your posts or profile</li>
              <li>They can't send you messages or friend requests</li>
              <li>You won't see their content in feeds</li>
              <li>Existing friendships will be removed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
