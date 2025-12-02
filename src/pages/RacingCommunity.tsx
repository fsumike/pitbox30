import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, MapPin, Heart, MessageSquare, Share2, MoreVertical, Send, Check, Bookmark, BookmarkCheck, TrendingUp, Zap, Play, Pause, Volume2, VolumeX, Maximize2, Eye, Repeat, X, Image as ImageIcon, Smile, Loader2, Edit2, Reply, ChevronDown, ChevronUp, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Post, Profile } from '../types';
import CreatePostModal from '../components/CreatePostModal';
import EmojiPicker from '../components/EmojiPicker';
import GifPicker from '../components/GifPicker';
import MessagesButton from '../components/MessagesButton';
import FriendsButton from '../components/FriendsButton';
import SocialPromoBanner from '../components/SocialPromoBanner';
import ReactPlayer from 'react-player';
import { usePosts } from '../hooks/usePosts';
import { format, formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from '../components/NotificationCenter';
import CommunityNavBar from '../components/CommunityNavBar';
import StoriesBar from '../components/StoriesBar';
import VideoReelsPlayer from '../components/VideoReelsPlayer';

function RacingCommunity() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activePost, setActivePost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [selectedGif, setSelectedGif] = useState<Record<string, string | null>>({});
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'friends' | 'mine' | 'bookmarks' | 'trending'>('all');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [likeAnimations, setLikeAnimations] = useState<Set<string>>(new Set());
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video' | 'text'>('all');
  const [replyingTo, setReplyingTo] = useState<{ postId: string; commentId: string; username: string } | null>(null);
  const [showReplies, setShowReplies] = useState<Set<string>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showReels, setShowReels] = useState(false);
  const [isLoadingNewTab, setIsLoadingNewTab] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    posts,
    loading,
    error,
    loadPosts,
    toggleReaction,
    addComment,
    deletePost,
    toggleBookmark,
    bookmarks,
    toggleCommentReaction,
    commentReactions,
    trackPostView,
    incrementShareCount,
    editPost
  } = usePosts();

  useEffect(() => {
    if (user) {
      setIsLoadingNewTab(true);
      setPage(1);
      setHasMore(true);

      loadPosts({ filter: activeTab, mediaType: mediaTypeFilter, page: 1 }).finally(() => {
        setIsLoadingNewTab(false);
        if (contentRef.current) {
          contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }, [user, activeTab, mediaTypeFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isLoadingNewTab) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadPosts({ filter: activeTab, mediaType: mediaTypeFilter, page: nextPage }).then((newPosts) => {
            if (!newPosts || newPosts.length === 0) {
              setHasMore(false);
            }
          });
        }
      },
      { threshold: 0.5, rootMargin: '200px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, activeTab, mediaTypeFilter]);

  useEffect(() => {
    const handlePostView = () => {
      posts.forEach(post => {
        const postElement = document.getElementById(`post-${post.id}`);
        if (postElement) {
          const rect = postElement.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (isVisible) {
            trackPostView(post.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handlePostView);
    return () => window.removeEventListener('scroll', handlePostView);
  }, [posts, trackPostView]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('community_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          loadPosts({ filter: activeTab, mediaType: mediaTypeFilter, page: 1 });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments'
        },
        (payload) => {
          loadPosts({ filter: activeTab, mediaType: mediaTypeFilter, page: 1 });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_likes'
        },
        (payload) => {
          loadPosts({ filter: activeTab, mediaType: mediaTypeFilter, page: 1 });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeTab, mediaTypeFilter]);

  const handleLike = async (postId: string) => {
    setLikeAnimations(prev => new Set(prev).add(postId));
    setTimeout(() => {
      setLikeAnimations(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }, 600);
    await toggleReaction(postId, 'like');
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId] || '';
    const gif = selectedGif[postId];

    if (!text.trim() && !gif) return;

    let content = text.trim();
    if (gif) {
      content = content ? `${content} [GIF]${gif}[/GIF]` : `[GIF]${gif}[/GIF]`;
    }

    const parentCommentId = replyingTo?.postId === postId ? replyingTo.commentId : undefined;
    const success = await addComment(postId, content, parentCommentId);
    if (success) {
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setSelectedGif(prev => ({ ...prev, [postId]: null }));
      setReplyingTo(null);
    }
  };

  const handleShare = async (post: Post) => {
    const shareUrl = `${window.location.origin}/community/post/${post.id}`;
    try {
      await incrementShareCount(post.id);
      if (navigator.share) {
        await navigator.share({
          title: 'Pit Community',
          text: post.content || 'Check out this post!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(post.id);
        setTimeout(() => setShareSuccess(null), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePost(postId);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  const renderCommentContent = (content: string) => {
    const gifRegex = /\[GIF\](.*?)\[\/GIF\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = gifRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        parts.push(
          <span key={lastIndex}>{renderTextWithLinks(textBefore)}</span>
        );
      }
      parts.push(
        <img
          key={match.index}
          src={match[1]}
          alt="GIF"
          className="max-w-full rounded-xl mt-2"
          style={{ maxHeight: '200px' }}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const textAfter = content.slice(lastIndex);
      parts.push(
        <span key={lastIndex}>{renderTextWithLinks(textAfter)}</span>
      );
    }

    return parts.length > 0 ? parts : renderTextWithLinks(content);
  };

  const renderTextWithLinks = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const hashtagRegex = /#(\w+)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = [];
    let lastIndex = 0;
    const combinedMatches: Array<{ index: number; text: string; type: string }> = [];

    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      combinedMatches.push({ index: match.index, text: match[0], type: 'mention' });
    }
    while ((match = hashtagRegex.exec(text)) !== null) {
      combinedMatches.push({ index: match.index, text: match[0], type: 'hashtag' });
    }
    while ((match = urlRegex.exec(text)) !== null) {
      combinedMatches.push({ index: match.index, text: match[0], type: 'url' });
    }

    combinedMatches.sort((a, b) => a.index - b.index);

    combinedMatches.forEach((matched, i) => {
      if (matched.index > lastIndex) {
        parts.push(text.slice(lastIndex, matched.index));
      }

      if (matched.type === 'mention') {
        const username = matched.text.substring(1);
        parts.push(
          <span
            key={`mention-${i}`}
            className="text-brand-gold font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(`/user/${username}`)}
          >
            {matched.text}
          </span>
        );
      } else if (matched.type === 'hashtag') {
        parts.push(
          <span
            key={`hashtag-${i}`}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            {matched.text}
          </span>
        );
      } else if (matched.type === 'url') {
        parts.push(
          <a
            key={`url-${i}`}
            href={matched.text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {matched.text}
          </a>
        );
      }

      lastIndex = matched.index + matched.text.length;
    });

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM d');
      }
    } catch {
      return '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Pit Community</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to connect with racers worldwide
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black pb-20 overflow-y-auto">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <img
                src="/android-icon-192-192.png"
                alt="PIT-BOX.COM"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
              />
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-gold to-amber-600 bg-clip-text text-transparent">
                Pit Community
              </h1>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <NotificationCenter />
              <FriendsButton />
              <MessagesButton />
            </div>
          </div>
        </div>
      </div>

      <CommunityNavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mediaTypeFilter={mediaTypeFilter}
        onMediaTypeFilterChange={setMediaTypeFilter}
      />

      <StoriesBar />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <motion.button
          onClick={() => setShowReels(true)}
          className="w-full mb-4 p-4 glass-panel flex items-center justify-center gap-3 group hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Film className="w-6 h-6" />
          <span className="font-bold text-lg">Watch Racing Reels</span>
          <Play className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={() => setShowCreatePost(true)}
          className="w-full mb-6 p-6 glass-panel flex items-center gap-4 group hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="You" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <span className="flex-1 text-left text-gray-500 dark:text-gray-400 group-hover:text-brand-gold transition-colors">
            Share your racing story...
          </span>
          <Zap className="w-5 h-5 text-brand-gold" />
        </motion.button>

        <SocialPromoBanner variant="inline" dismissible={true} showDelay={5000} />

        {isLoadingNewTab && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          </motion.div>
        )}

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="mb-8"
              >
                <div className="glass-panel hover:shadow-2xl transition-all duration-300 rounded-xl">
                  {/* Post Header */}
                  <div className="p-6 pb-0" id={`post-${post.id}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate(`/user/${post.profiles?.id}`)}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                              {post.profiles?.avatar_url ? (
                                <img
                                  src={post.profiles.avatar_url}
                                  alt={post.profiles.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-brand-gold" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold group-hover:text-brand-gold transition-colors">
                            {post.profiles?.full_name || post.profiles?.username}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(post.created_at)}
                            {post.location && (
                              <>
                                <span>•</span>
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{post.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {showPostMenu === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
                          >
                            {user?.id === post.user_id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setShowCreatePost(true);
                                    setShowPostMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit Post
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(post.id);
                                    setShowPostMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  Delete Post
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                toggleBookmark(post.id);
                                setShowPostMenu(null);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                              {bookmarks.includes(post.id) ? (
                                <>
                                  <BookmarkCheck className="w-4 h-4" />
                                  Unsave
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-4 h-4" />
                                  Save
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {post.content && (
                      <div className="mb-4">
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {renderTextWithLinks(post.content)}
                        </p>
                        {post.is_edited && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                            Edited
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Media */}
                  {post.image_url && (
                    <div className="relative group cursor-pointer overflow-hidden" onClick={() => setLightboxImage(post.image_url!)}>
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="w-full max-h-[600px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  {post.video_url && (
                    <div className="relative bg-black overflow-hidden">
                      <ReactPlayer
                        url={post.video_url}
                        width="100%"
                        height="auto"
                        controls
                        style={{ maxHeight: '600px' }}
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="p-6">
                    {(post.view_count > 0 || post.share_count > 0) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {post.view_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.view_count} {post.view_count === 1 ? 'view' : 'views'}
                          </span>
                        )}
                        {post.share_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {post.share_count} {post.share_count === 1 ? 'share' : 'shares'}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <motion.button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-2 group"
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.div
                            animate={likeAnimations.has(post.id) ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart
                              className={`w-6 h-6 transition-colors ${
                                post.post_reactions?.some(r => r.user_id === user.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600 dark:text-gray-400 group-hover:text-red-500'
                              }`}
                            />
                          </motion.div>
                          <span className="font-semibold text-sm">
                            {post.post_reactions?.length || 0}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                          className="flex items-center gap-2 group"
                          whileTap={{ scale: 0.9 }}
                        >
                          <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-brand-gold transition-colors" />
                          <span className="font-semibold text-sm">
                            {post.post_comments?.length || 0}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 group"
                          whileTap={{ scale: 0.9 }}
                        >
                          {shareSuccess === post.id ? (
                            <Check className="w-6 h-6 text-green-500" />
                          ) : (
                            <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-brand-gold transition-colors" />
                          )}
                        </motion.button>
                      </div>

                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className="group"
                      >
                        {bookmarks.includes(post.id) ? (
                          <BookmarkCheck className="w-6 h-6 text-brand-gold fill-current" />
                        ) : (
                          <Bookmark className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-brand-gold transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {activePost === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4 relative"
                        >
                          {/* Comment Input */}
                          <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {user.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="You" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              {replyingTo?.postId === post.id && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                  <Reply className="w-3 h-3" />
                                  Replying to @{replyingTo.username}
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="ml-auto text-red-500 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              {selectedGif[post.id] && (
                                <div className="relative inline-block">
                                  <img
                                    src={selectedGif[post.id]!}
                                    alt="Selected GIF"
                                    className="max-w-xs rounded-xl"
                                    style={{ maxHeight: '150px' }}
                                  />
                                  <button
                                    onClick={() => setSelectedGif(prev => ({ ...prev, [post.id]: null }))}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                              <input
                                type="text"
                                value={commentText[post.id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                placeholder="Add a comment..."
                                className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-brand-gold transition-all"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <div className="flex items-center gap-2 pl-2">
                                <div className="relative">
                                  <GifPicker onGifSelect={(url) => setSelectedGif(prev => ({ ...prev, [post.id]: url }))} />
                                </div>
                                <div className="relative">
                                  <EmojiPicker
                                    onEmojiSelect={(emoji) => setCommentText(prev => ({ ...prev, [post.id]: (prev[post.id] || '') + emoji }))}
                                    theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                                  />
                                </div>
                                <button
                                  onClick={() => handleComment(post.id)}
                                  disabled={!commentText[post.id]?.trim() && !selectedGif[post.id]}
                                  className="ml-auto px-6 py-2 bg-brand-gold text-white rounded-full font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {post.post_comments?.filter(c => !c.parent_comment_id).map((comment) => (
                              <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-3"
                              >
                                <div className="flex gap-3">
                                  <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/user/${comment.profiles?.id}`)}
                                  >
                                    {comment.profiles?.avatar_url ? (
                                      <img src={comment.profiles.avatar_url} alt={comment.profiles.username} className="w-full h-full object-cover" />
                                    ) : (
                                      <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                                      <p
                                        className="font-semibold text-sm mb-1 cursor-pointer hover:underline"
                                        onClick={() => navigate(`/user/${comment.profiles?.id}`)}
                                      >
                                        {comment.profiles?.full_name || comment.profiles?.username}
                                      </p>
                                      <div className="text-sm">{renderCommentContent(comment.content)}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">
                                      <span>{formatTime(comment.created_at)}</span>
                                      <button
                                        onClick={() => toggleCommentReaction(comment.id)}
                                        className={`flex items-center gap-1 hover:text-brand-gold transition-colors ${
                                          commentReactions[comment.id] ? 'text-brand-gold font-semibold' : ''
                                        }`}
                                      >
                                        <Heart className={`w-3 h-3 ${commentReactions[comment.id] ? 'fill-current' : ''}`} />
                                        {comment.reaction_count > 0 && comment.reaction_count}
                                      </button>
                                      <button
                                        onClick={() => setReplyingTo({ postId: post.id, commentId: comment.id, username: comment.profiles?.username || '' })}
                                        className="hover:text-brand-gold transition-colors flex items-center gap-1"
                                      >
                                        <Reply className="w-3 h-3" />
                                        Reply
                                      </button>
                                      {comment.reply_count > 0 && (
                                        <button
                                          onClick={() => {
                                            const newSet = new Set(showReplies);
                                            if (newSet.has(comment.id)) {
                                              newSet.delete(comment.id);
                                            } else {
                                              newSet.add(comment.id);
                                            }
                                            setShowReplies(newSet);
                                          }}
                                          className="hover:text-brand-gold transition-colors flex items-center gap-1"
                                        >
                                          {showReplies.has(comment.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Nested Replies */}
                                {showReplies.has(comment.id) && (
                                  <div className="ml-12 space-y-3">
                                    {post.post_comments?.filter(r => r.parent_comment_id === comment.id).map((reply) => (
                                      <motion.div
                                        key={reply.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3"
                                      >
                                        <div
                                          className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                                          onClick={() => navigate(`/user/${reply.profiles?.id}`)}
                                        >
                                          {reply.profiles?.avatar_url ? (
                                            <img src={reply.profiles.avatar_url} alt={reply.profiles.username} className="w-full h-full object-cover" />
                                          ) : (
                                            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                                            <p
                                              className="font-semibold text-xs mb-1 cursor-pointer hover:underline"
                                              onClick={() => navigate(`/user/${reply.profiles?.id}`)}
                                            >
                                              {reply.profiles?.full_name || reply.profiles?.username}
                                            </p>
                                            <div className="text-xs">{renderCommentContent(reply.content)}</div>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-3">
                                            <span>{formatTime(reply.created_at)}</span>
                                            <button
                                              onClick={() => toggleCommentReaction(reply.id)}
                                              className={`flex items-center gap-1 hover:text-brand-gold transition-colors ${
                                                commentReactions[reply.id] ? 'text-brand-gold font-semibold' : ''
                                              }`}
                                            >
                                              <Heart className={`w-3 h-3 ${commentReactions[reply.id] ? 'fill-current' : ''}`} />
                                              {reply.reaction_count > 0 && reply.reaction_count}
                                            </button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          {post.post_comments && post.post_comments.length > 3 && (
                            <button
                              onClick={() => navigate(`/community/post/${post.id}`)}
                              className="w-full text-center text-sm text-brand-gold hover:underline py-2"
                            >
                              View all {post.post_comments.length} comments
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to share something amazing!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="btn-primary"
            >
              Create Post
            </button>
          </div>
        )}

        {hasMore && posts.length > 0 && (
          <div ref={observerTarget} className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>You've reached the end</p>
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => {
          setShowCreatePost(false);
          setEditingPost(null);
        }}
        post={editingPost || undefined}
        onSuccess={() => {
          loadPosts({ filter: activeTab, mediaType: mediaTypeFilter });
        }}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Delete Post?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}

      {showReels && (
        <div className="fixed inset-0 z-[9999]">
          <VideoReelsPlayer />
          <button
            onClick={() => setShowReels(false)}
            className="absolute left-4 z-[10000] bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
            style={{ top: 'max(env(safe-area-inset-top, 0px) + 1rem, 1rem)' }}
          >
            Close Reels
          </button>
        </div>
      )}
    </div>
  );
}

export default RacingCommunity;
