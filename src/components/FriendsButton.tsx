import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface FriendsButtonProps {
  className?: string;
}

function FriendsButton({ className = '' }: FriendsButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadPendingRequests();
      const interval = setInterval(loadPendingRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadPendingRequests = async () => {
    if (!user) return;

    try {
      const { count } = await supabase
        .from('friend_requests')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      setPendingCount(count || 0);
    } catch (err) {
      console.error('Error loading pending requests:', err);
    }
  };

  return (
    <button
      onClick={() => navigate('/friends')}
      className={`relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      title="Friends"
    >
      <Users className="w-5 h-5" />
      <span className="hidden sm:inline font-medium">Friends</span>
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </button>
  );
}

export default FriendsButton;