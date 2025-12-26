import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Globe, Calendar, MessageSquare, UserPlus, UserCheck, UserX, Loader2, AlertCircle, ArrowLeft, ShoppingBag, FileText, MoreVertical, Shield, Flag, Award, Briefcase, Heart, GraduationCap, Home, Wrench, Car, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useFriends } from '../hooks/useFriends';
import { useChat } from '../contexts/ChatContext';
import { useListings, Listing } from '../hooks/useListings';
import { usePosts } from '../hooks/usePosts';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ReportUserModal from '../components/ReportUserModal';
import type { Profile, Post } from '../types';

function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startChat } = useChat();
  const {
    sendFriendRequest,
    respondToFriendRequest,
    loading: friendsLoading
  } = useFriends();
  const { loading: listingsLoading } = useListings();
  usePosts();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendStatus, setFriendStatus] = useState<'none' | 'friends' | 'pending_sent' | 'pending_received'>('none');
  const [friendRequestId, setFriendRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'for_sale' | 'about'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [areFriends, setAreFriends] = useState(false);

  useEffect(() => {
    if (userId) {
      if (user?.id === userId) {
        navigate('/profile');
        return;
      }
      loadProfile();
      loadFriendStatus();
      loadUserPosts();
      loadUserListings();
      checkIfBlocked();
      trackProfileView();
    }
  }, [userId, user]);

  const trackProfileView = async () => {
    if (!user || !userId || user.id === userId) return;

    try {
      await supabase.rpc('increment_profile_view', {
        profile_id: userId,
        viewer_id: user.id
      });
    } catch (err) {
      console.error('Error tracking profile view:', err);
    }
  };

  const checkIfBlocked = async () => {
    if (!user || !userId) return;

    try {
      const { data } = await supabase
        .from('blocked_users')
        .select('id')
        .or(`and(blocker_id.eq.${user.id},blocked_id.eq.${userId}),and(blocker_id.eq.${userId},blocked_id.eq.${user.id})`)
        .maybeSingle();

      setIsBlocked(!!data);
    } catch (err) {
      console.error('Error checking block status:', err);
    }
  };

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const loadFriendStatus = async () => {
    if (!user || !userId) return;

    try {
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id1.eq.${user.id},user_id2.eq.${userId}),and(user_id1.eq.${userId},user_id2.eq.${user.id})`)
        .maybeSingle();

      if (friendships) {
        setFriendStatus('friends');
        setAreFriends(true);
        return;
      }

      const { data: sentRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', userId)
        .eq('status', 'pending')
        .maybeSingle();

      if (sentRequests) {
        setFriendStatus('pending_sent');
        setFriendRequestId(sentRequests.id);
        return;
      }

      const { data: receivedRequests } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', userId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (receivedRequests) {
        setFriendStatus('pending_received');
        setFriendRequestId(receivedRequests.id);
        return;
      }

      setFriendStatus('none');
      setAreFriends(false);
    } catch (err) {
      console.error('Error checking friend status:', err);
    }
  };

  const loadUserPosts = async () => {
    if (!userId) return;

    setPostsLoading(true);

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url,
            location
          ),
          post_likes (
            id,
            user_id
          ),
          post_comments (count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (user?.id !== userId) {
        if (areFriends) {
          query = query.in('visibility', ['public', 'friends']);
        } else {
          query = query.eq('visibility', 'public');
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (user) {
        const { data: bookmarks } = await supabase
          .from('post_bookmarks')
          .select('post_id')
          .eq('user_id', user.id);

        const bookmarkIds = bookmarks?.map(b => b.post_id) || [];

        const postsWithBookmarks = data?.map(post => ({
          ...post,
          bookmarked: bookmarkIds.includes(post.id)
        })) || [];

        setUserPosts(postsWithBookmarks);
      } else {
        setUserPosts(data || []);
      }
    } catch (err) {
      console.error('Error loading user posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadUserListings = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserListings(data || []);
    } catch (err) {
      console.error('Error loading user listings:', err);
    }
  };

  const handleFriendAction = async () => {
    if (!user || !userId || friendsLoading) return;

    try {
      if (friendStatus === 'none') {
        await sendFriendRequest(userId);
        setFriendStatus('pending_sent');
      } else if (friendStatus === 'pending_received' && friendRequestId) {
        await respondToFriendRequest(friendRequestId, true);
        setFriendStatus('friends');
        setAreFriends(true);
      }
    } catch (err) {
      console.error('Error with friend action:', err);
    }
  };

  const handleBlock = async () => {
    if (!user || !userId || blocking) return;

    const confirmed = confirm(`Are you sure you want to block ${profile?.username}?`);
    if (!confirmed) return;

    setBlocking(true);
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: userId
        });

      if (error) throw error;

      setIsBlocked(true);
      setShowMenu(false);
      navigate(-1);
    } catch (err) {
      console.error('Error blocking user:', err);
    } finally {
      setBlocking(false);
    }
  };

  const shouldShowField = (privacySetting: 'public' | 'friends' | 'private' | undefined) => {
    if (!privacySetting || privacySetting === 'public') return true;
    if (privacySetting === 'friends' && areFriends) return true;
    if (user?.id === userId) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass-panel p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || 'This profile does not exist or has been removed.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="glass-panel p-8 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">User Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This profile is not accessible.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="glass-panel overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-brand-gold/20 to-brand-gold-light/20"></div>

        <div className="relative px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {user && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => startChat(userId!)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>

                <button
                  onClick={handleFriendAction}
                  disabled={friendsLoading || friendStatus === 'friends' || friendStatus === 'pending_sent'}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    friendStatus === 'friends'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : friendStatus === 'pending_sent'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : friendStatus === 'pending_received'
                      ? 'bg-brand-gold text-white hover:bg-brand-gold-dark'
                      : 'bg-brand-gold text-white hover:bg-brand-gold-dark'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {friendStatus === 'friends' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Friends
                    </>
                  ) : friendStatus === 'pending_sent' ? (
                    <>
                      <UserX className="w-4 h-4" />
                      Pending
                    </>
                  ) : friendStatus === 'pending_received' ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Accept Request
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                      <button
                        onClick={() => {
                          setShowReportModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4" />
                        Report User
                      </button>
                      <button
                        onClick={handleBlock}
                        disabled={blocking}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <Shield className="w-4 h-4" />
                        {blocking ? 'Blocking...' : 'Block User'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{profile.full_name || profile.username}</h1>
              {profile.is_verified && (
                <div className="w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center" title="Verified">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>

            {shouldShowField(profile.privacy_racing_info) && (
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-700 dark:text-gray-300">
                {profile.car_number && (
                  <span className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    #{profile.car_number}
                  </span>
                )}
                {profile.primary_racing_class && (
                  <span className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold font-medium">
                    {profile.primary_racing_class}
                  </span>
                )}
                {profile.racing_role && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {profile.racing_role}
                  </span>
                )}
              </div>
            )}

            {profile.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-brand-gold"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
              {profile.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
                </span>
              )}
            </div>

            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="font-bold">{profile.follower_count || 0}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{profile.following_count || 0}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
              </div>
              {profile.profile_views && (
                <div>
                  <span className="font-bold">{profile.profile_views}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Views</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 -mx-6 px-6">
            <div className="flex gap-1 -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === 'posts'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Posts
                </div>
              </button>
              <button
                onClick={() => setActiveTab('for_sale')}
                className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === 'for_sale'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  For Sale ({userListings.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  About
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
              ) : userPosts.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <div key={post.id} className="glass-panel p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{profile.full_name || profile.username}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                      {post.image_url && (
                        <img src={post.image_url} alt="Post" className="w-full rounded-lg mb-4" />
                      )}
                      <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
                        <button className="flex items-center gap-2 hover:text-brand-gold transition-colors">
                          <Heart className="w-5 h-5" />
                          <span>{post.post_likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-brand-gold transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.post_comments?.length || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'for_sale' && (
            <motion.div
              key="for_sale"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {listingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
              ) : userListings.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No items for sale</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userListings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => navigate(`/swap-meet`)}
                      className="glass-panel overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      {listing.images?.[0] && (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                        <p className="text-2xl font-bold text-brand-gold mb-2">
                          ${listing.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {listing.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {listing.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {shouldShowField(profile.privacy_racing_info) && (profile.years_racing_since || profile.home_tracks?.length || profile.current_team) && (
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-brand-gold" />
                    Racing Career
                  </h3>
                  <div className="space-y-3">
                    {profile.years_racing_since && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Racing Since</p>
                        <p className="font-medium">{profile.years_racing_since} ({new Date().getFullYear() - profile.years_racing_since} years)</p>
                      </div>
                    )}
                    {profile.current_team && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Team</p>
                        <p className="font-medium">{profile.current_team}</p>
                      </div>
                    )}
                    {profile.home_tracks && profile.home_tracks.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Home Tracks</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.home_tracks.map((track, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                              {track}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {shouldShowField(profile.privacy_career_info) && (profile.championships?.length || profile.notable_wins) && (
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-gold" />
                    Achievements
                  </h3>
                  <div className="space-y-3">
                    {profile.championships && profile.championships.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Championships</p>
                        {profile.championships.map((champ, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-brand-gold/10 mb-2">
                            <p className="font-medium">{champ.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{champ.year}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {profile.notable_wins && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Notable Wins</p>
                        <p className="mt-1">{profile.notable_wins}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {shouldShowField(profile.privacy_personal_info) && (profile.hometown || profile.day_job || profile.education) && (
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-gold" />
                    Personal Info
                  </h3>
                  <div className="space-y-3">
                    {profile.hometown && (
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span>From {profile.hometown}</span>
                      </div>
                    )}
                    {profile.day_job && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{profile.day_job}</span>
                      </div>
                    )}
                    {profile.education && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{profile.education}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {shouldShowField(profile.privacy_racing_info) && (profile.mechanical_skills?.length || profile.racing_interests?.length) && (
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-brand-gold" />
                    Skills & Interests
                  </h3>
                  <div className="space-y-4">
                    {profile.mechanical_skills && profile.mechanical_skills.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mechanical Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.mechanical_skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.racing_interests && profile.racing_interests.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Racing Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.racing_interests.map((interest, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showReportModal && profile && (
        <ReportUserModal
          reportedUser={profile}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

export default UserProfile;
