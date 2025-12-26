import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../types';

export function useFriends() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriends = async () => {
    if (!user) return [];

    setLoading(true);
    setError(null);

    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          user_id1,
          user_id2,
          profiles1:profiles!friendships_user_id1_fkey (
            id,
            username,
            full_name,
            avatar_url,
            location
          ),
          profiles2:profiles!friendships_user_id2_fkey (
            id,
            username,
            full_name,
            avatar_url,
            location
          )
        `)
        .or(`user_id1.eq.${user.id},user_id2.eq.${user.id}`);

      if (friendshipsError) throw friendshipsError;

      // Transform the data to get a list of friend profiles
      const friends = friendships.map(friendship => {
        const friend = friendship.user_id1 === user.id
          ? friendship.profiles2
          : friendship.profiles1;
        return friend;
      });

      return friends;
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Failed to load friends');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedFriends = async (limit = 5) => {
    if (!user) return [];

    try {
      // Get current friends
      const friends = await getFriends();
      const friendIds = friends.map(friend => friend.id);

      // Get users who aren't friends yet
      const { data: suggestions, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${[user.id, ...friendIds].join(',')})`)
        .limit(limit);

      if (error) throw error;
      return suggestions;
    } catch (err) {
      console.error('Error loading suggested friends:', err);
      return [];
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    if (!user) {
      setError('You must be signed in to send friend requests');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First check if a request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw checkError;
      }

      // If request exists, handle accordingly
      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          if (existingRequest.sender_id === user.id) {
            setError('You have already sent a friend request to this user');
          } else {
            // Accept the existing request instead of creating a new one
            const { error: updateError } = await supabase
              .from('friend_requests')
              .update({ status: 'accepted' })
              .eq('id', existingRequest.id);

            if (updateError) throw updateError;
            return true;
          }
        } else {
          setError('A friend request between you and this user already exists');
        }
        return false;
      }

      // Check if they're already friends
      const { data: existingFriendship, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id1.eq.${user.id},user_id2.eq.${receiverId}),and(user_id1.eq.${receiverId},user_id2.eq.${user.id})`)
        .single();

      if (friendshipError && friendshipError.code !== 'PGRST116') {
        throw friendshipError;
      }

      if (existingFriendship) {
        setError('You are already friends with this user');
        return false;
      }

      // Create new friend request
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      setError('Failed to send friend request');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const respondToFriendRequest = async (requestId: string, accept: boolean) => {
    if (!user) {
      setError('You must be signed in to respond to friend requests');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({
          status: accept ? 'accepted' : 'declined'
        })
        .eq('id', requestId)
        .eq('receiver_id', user.id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error responding to friend request:', err);
      setError(`Failed to ${accept ? 'accept' : 'decline'} friend request`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPendingRequests = async () => {
    if (!user) return [];

    try {
      const { data: requests, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey (
            id,
            username,
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      return requests;
    } catch (err) {
      console.error('Error loading friend requests:', err);
      return [];
    }
  };

  return {
    getFriends,
    getSuggestedFriends,
    sendFriendRequest,
    respondToFriendRequest,
    getPendingRequests,
    loading,
    error
  };
}