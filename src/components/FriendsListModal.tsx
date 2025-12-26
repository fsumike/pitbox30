import React, { useState, useEffect } from 'react';
import { X, Users, Loader2, User, MessageSquare, UserMinus, Search, UserPlus, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import type { Profile, Friendship, FriendRequest } from '../types';

interface FriendsListModalProps {
  onClose: () => void;
  initialTab?: 'friends' | 'requests';
}

export default function FriendsListModal({ onClose, initialTab = 'friends' }: FriendsListModalProps) {
  const { user } = useAuth();
  const { startChat } = useChat();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>(initialTab);
  const [friends, setFriends] = useState<(Friendship & { friend: Profile })[]>([]);
  const [friendRequests, setFriendRequests] = useState<(FriendRequest & { sender: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [removingFriend, setRemovingFriend] = useState<string | null>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFriends();
      loadFriendRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:profiles!friendships_user_id2_fkey(
            id,
            username,
            full_name,
            avatar_url,
            location,
            car_number,
            primary_racing_class
          )
        `)
        .eq('user_id1', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const friendsWithAlternate = await Promise.all(
        (data || []).map(async (friendship) => {
          if (!friendship.friend) {
            const otherId = friendship.user_id1 === user.id ? friendship.user_id2 : friendship.user_id1;
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, username, full_name, avatar_url, location, car_number, primary_racing_class')
              .eq('id', otherId)
              .single();

            return { ...friendship, friend: profile };
          }
          return friendship;
        })
      );

      setFriends(friendsWithAlternate.filter((f) => f.friend) as any);
    } catch (err) {
      console.error('Error loading friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFriendRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            location,
            car_number,
            primary_racing_class
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFriendRequests(data || []);
    } catch (err) {
      console.error('Error loading friend requests:', err);
    }
  };

  const handleRemoveFriend = async (friendshipId: string, friendId: string) => {
    if (!user) return;

    setRemovingFriend(friendId);
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
    } catch (err) {
      console.error('Error removing friend:', err);
    } finally {
      setRemovingFriend(null);
    }
  };

  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    if (!user) return;

    setRespondingTo(requestId);
    try {
      if (accept) {
        const request = friendRequests.find((r) => r.id === requestId);
        if (!request) return;

        const { error: friendshipError } = await supabase
          .from('friendships')
          .insert({
            user_id1: request.sender_id,
            user_id2: user.id
          });

        if (friendshipError) throw friendshipError;
      }

      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
      if (accept) {
        loadFriends();
      }
    } catch (err) {
      console.error('Error responding to friend request:', err);
    } finally {
      setRespondingTo(null);
    }
  };

  const handleViewProfile = (friendId: string) => {
    navigate(`/user/${friendId}`);
    onClose();
  };

  const handleMessage = (friendId: string) => {
    startChat(friendId);
    onClose();
  };

  const filteredFriends = friends.filter((f) =>
    f.friend?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.friend?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-brand-gold" />
            <h2 className="text-2xl font-bold">Friends & Connections</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'friends'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'bg-brand-gold text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Requests ({friendRequests.length})
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'friends' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : activeTab === 'friends' ? (
            filteredFriends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'No friends found' : 'No friends yet'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Start connecting with racers in the community!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredFriends.map((friendship) => (
                    <motion.div
                      key={friendship.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          onClick={() => handleViewProfile(friendship.friend.id!)}
                          className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 cursor-pointer"
                        >
                          {friendship.friend.avatar_url ? (
                            <img
                              src={friendship.friend.avatar_url}
                              alt={friendship.friend.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div
                          onClick={() => handleViewProfile(friendship.friend.id!)}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="font-semibold hover:text-brand-gold transition-colors">
                            {friendship.friend.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{friendship.friend.username || 'unknown'}
                            {friendship.friend.car_number && (
                              <span className="ml-2">#{friendship.friend.car_number}</span>
                            )}
                          </p>
                          {friendship.friend.primary_racing_class && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {friendship.friend.primary_racing_class}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMessage(friendship.friend.id!)}
                          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friendship.id, friendship.friend.id!)}
                          disabled={removingFriend === friendship.friend.id}
                          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Remove friend"
                        >
                          {removingFriend === friendship.friend.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <UserMinus className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          ) : (
            friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No pending friend requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {friendRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          onClick={() => handleViewProfile(request.sender.id!)}
                          className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0 cursor-pointer"
                        >
                          {request.sender.avatar_url ? (
                            <img
                              src={request.sender.avatar_url}
                              alt={request.sender.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div
                          onClick={() => handleViewProfile(request.sender.id!)}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="font-semibold hover:text-brand-gold transition-colors">
                            {request.sender.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{request.sender.username || 'unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRespondToRequest(request.id, true)}
                          disabled={respondingTo === request.id}
                          className="px-4 py-2 rounded-lg bg-brand-gold text-white hover:bg-brand-gold-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                        >
                          {respondingTo === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(request.id, false)}
                          disabled={respondingTo === request.id}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
