import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, UserCheck, Search, MessageSquare, 
  User, Loader2, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from '../hooks/useFriends';
import { useChat } from '../contexts/ChatContext';
import type { Profile } from '../types';

function Friends() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startChat } = useChat();
  const { 
    getFriends, 
    getSuggestedFriends, 
    sendFriendRequest,
    getPendingRequests,
    respondToFriendRequest,
    loading: friendsLoading,
    error: friendsError 
  } = useFriends();

  const [friends, setFriends] = useState<Profile[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<Profile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'friends' | 'suggested' | 'requests'>('friends');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [friendsData, suggestedData, requestsData] = await Promise.all([
      getFriends(),
      getSuggestedFriends(5),
      getPendingRequests()
    ]);

    setFriends(friendsData);
    setSuggestedFriends(suggestedData);
    setPendingRequests(requestsData);
  };

  const handleFriendRequest = async (friendId: string) => {
    const success = await sendFriendRequest(friendId);
    if (success) {
      loadData();
    }
  };

  const handleRequestResponse = async (requestId: string, accept: boolean) => {
    const success = await respondToFriendRequest(requestId, accept);
    if (success) {
      loadData();
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <img
            src="/android-icon-192-192.png"
            alt="PIT-BOX.COM"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-3xl font-bold">Friends & Connections</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow racers and build your network
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveSection('friends')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'friends'
                ? 'bg-brand-gold text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveSection('requests')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'requests'
                ? 'bg-brand-gold text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveSection('suggested')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              activeSection === 'suggested'
                ? 'bg-brand-gold text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Suggested
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="glass-panel p-6">
        {friendsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        ) : friendsError ? (
          <div className="flex items-center gap-2 text-red-500 p-4">
            <AlertCircle className="w-5 h-5" />
            <p>{friendsError}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeSection === 'friends' && (
              filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                      {friend.avatar_url ? (
                        <img
                          src={friend.avatar_url}
                          alt={friend.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-brand-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {friend.full_name || friend.username}
                      </p>
                      {friend.location && (
                        <p className="text-sm text-gray-500 truncate">
                          {friend.location}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => startChat(friend.id)}
                      className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-full transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {searchTerm ? 'No friends match your search' : 'No friends yet'}
                </p>
              )
            )}

            {activeSection === 'requests' && (
              pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <div key={request.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                      {request.sender.avatar_url ? (
                        <img
                          src={request.sender.avatar_url}
                          alt={request.sender.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-brand-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {request.sender.full_name || request.sender.username}
                      </p>
                      {request.sender.location && (
                        <p className="text-sm text-gray-500 truncate">
                          {request.sender.location}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestResponse(request.id, true)}
                        className="px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestResponse(request.id, false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No pending friend requests
                </p>
              )
            )}

            {activeSection === 'suggested' && (
              suggestedFriends.length > 0 ? (
                suggestedFriends.map(friend => (
                  <div key={friend.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                      {friend.avatar_url ? (
                        <img
                          src={friend.avatar_url}
                          alt={friend.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-brand-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {friend.full_name || friend.username}
                      </p>
                      {friend.location && (
                        <p className="text-sm text-gray-500 truncate">
                          {friend.location}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleFriendRequest(friend.id)}
                      className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-full transition-colors"
                    >
                      <UserPlus className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No suggested friends at the moment
                </p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;