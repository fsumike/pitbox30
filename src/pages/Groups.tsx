import React, { useState, useEffect } from 'react';
import { Users, Plus, Lock, Globe, MessageCircle, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description: string;
  group_type: 'team' | 'car_class' | 'track' | 'general';
  avatar_url: string | null;
  is_private: boolean;
  member_count: number;
  created_at: string;
  is_member?: boolean;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'my_groups'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user, filter]);

  const loadGroups = async () => {
    try {
      const { data: allGroups, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('member_count', { ascending: false });

      if (groupsError) throw groupsError;

      if (user && allGroups) {
        const { data: memberships } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        const memberGroupIds = new Set(memberships?.map(m => m.group_id) || []);

        const groupsWithMembership = allGroups.map(group => ({
          ...group,
          is_member: memberGroupIds.has(group.id)
        }));

        setGroups(groupsWithMembership);
        setMyGroups(groupsWithMembership.filter(g => g.is_member));
      } else {
        setGroups(allGroups || []);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id
        });

      if (error) throw error;
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;
      loadGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'team': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'car_class': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'track': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredGroups = (filter === 'my_groups' ? myGroups : groups).filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-brand-gold animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-brand-gold" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
            </div>
            <button
              onClick={() => navigate('/create-group')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-gold hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setFilter('my_groups')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'my_groups'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              My Groups
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {filter === 'my_groups' ? 'No Groups Yet' : 'No Groups Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'my_groups'
                ? 'Join a group to connect with fellow racers'
                : 'Be the first to create a racing group!'}
            </p>
            <button
              onClick={() => navigate('/create-group')}
              className="px-6 py-3 bg-brand-gold hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              Create Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                <div className="relative h-32 bg-gradient-to-br from-brand-gold to-amber-600">
                  {group.avatar_url && (
                    <img
                      src={group.avatar_url}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {group.is_private ? (
                      <div className="p-2 bg-gray-900/50 rounded-full backdrop-blur-sm">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-900/50 rounded-full backdrop-blur-sm">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {group.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGroupTypeColor(group.group_type)}`}>
                      {group.group_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {group.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {group.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Users className="w-4 h-4" />
                    {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                  </div>

                  {group.is_member ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/group/${group.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Open Chat
                      </button>
                      <button
                        onClick={() => leaveGroup(group.id)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
                      >
                        Leave
                      </button>
                    </div>
                  ) : group.is_private ? (
                    <button
                      disabled
                      className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Private Group
                    </button>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Join Group
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
