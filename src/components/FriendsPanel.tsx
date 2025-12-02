import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, UserCheck, X, Search, 
  MessageSquare, ChevronDown, ChevronUp, User,
  Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from '../hooks/useFriends';
import { useChat } from '../contexts/ChatContext';
import { useNavVisibility } from '../contexts/NavVisibilityContext';
import type { Profile } from '../types';

interface FriendsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function FriendsPanel({ isOpen, onClose }: FriendsPanelProps) {
  const { user } = useAuth();
  const { startChat } = useChat();
  const { setShowNav } = useNavVisibility();
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
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Keep navigation visible
      setShowNav(true);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
    };
  }, [isOpen, setShowNav]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  // Touch event handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartY || !touchEndY) return;
    
    const swipeDistance = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    if (swipeDistance > minSwipeDistance) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-start justify-center"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="fixed top-[5vh] w-full sm:w-[480px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ position: 'relative', zIndex: 99999 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Friends & Connections</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
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
        <div className="p-4 overflow-y-auto flex-1">
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
                    <div key={friend.id} className="flex items-center gap-3">
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
                        onClick={() => {
                          startChat(friend.id);
                          onClose();
                        }}
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
                    <div key={request.id} className="flex items-center gap-3">
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
                          className="p-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestResponse(request.id, false)}
                          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
                    <div key={friend.id} className="flex items-center gap-3">
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
    </div>
  );
}

export default FriendsPanel;