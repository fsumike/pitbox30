import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, MapPin, Heart, MessageSquare, Share2, MoreVertical, Send, Check, Bookmark, BookmarkCheck, TrendingUp, Zap, Play, Pause, Volume2, VolumeX, Maximize2, Eye, Repeat, X, Image as ImageIcon, Smile, Loader2, Edit2, Reply, ChevronDown, ChevronUp, Film, Users, Bell, MessageCircle, Sparkles, Flag } from 'lucide-react';
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
    <div ref={contentRef} className="min-h-screen pb-20 overflow-y-auto relative">
      {/* Liquid glass orbs for ambient effect */}
      <div className="liquid-orb liquid-orb-gold w-80 h-80 -top-32 -left-32 fixed z-0 opacity-30" />
      <div className="liquid-orb liquid-orb-amber w-64 h-64 bottom-40 -right-24 fixed z-0 opacity-30" style={{ animationDelay: '-7s' }} />

      {/* Dark Carbon Fiber Background - Light Mode uses dark theme, Dark Mode goes even darker */}
      <div className="fixed inset-0 -z-10 dark:hidden" style={{
        background: `
          repeating-linear-gradient(45deg, #1A1A1A 0px, #151515 1px, #1A1A1A 2px, #121212 3px),
          repeating-linear-gradient(-45deg, #1A1A1A 0px, #181818 1px, #1A1A1A 2px, #131313 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Even Darker Carbon Fiber Background for Dark Mode */}
      <div className="fixed inset-0 -z-10 hidden dark:block" style={{
        background: `
          repeating-linear-gradient(45deg, #000000 0px, #050505 1px, #000000 2px, #030303 3px),
          repeating-linear-gradient(-45deg, #000000 0px, #020202 1px, #000000 2px, #010101 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Carbon Fiber Diagonal Weave Overlay */}
      <div className="fixed inset-0 -z-10 dark:opacity-100 opacity-100" style={{
        background: `
          repeating-linear-gradient(45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.03) 3px, rgba(255, 255, 255, 0.03) 6px),
          repeating-linear-gradient(-45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 6px)
        `,
        backgroundSize: '12px 12px',
      }}></div>

      <div className="sticky top-0 z-50 liquid-glass border-b border-white/10 shadow-2xl !rounded-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/android-icon-192-192.png"
                  alt="PIT-BOX.COM"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                />
                <Sparkles className="w-4 h-4 text-brand-gold absolute -top-1 -right-1 animate-pulse" />
              </div>
              <Flag className="w-6 h-6 sm:w-7 sm:h-7 text-brand-gold flex-shrink-0 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-clip-text text-transparent drop-shadow-lg">
                Pit Community
              </h1>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
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
          className="w-full mb-4 p-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl flex items-center justify-center gap-3 group hover:shadow-purple-500/50 transition-all duration-300 border-2 border-white/20"
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          <Film className="w-7 h-7 text-white drop-shadow-lg" />
          <span className="font-black text-xl text-white drop-shadow-lg">Watch Racing Reels</span>
          <Play className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
        </motion.button>

        <motion.button
          onClick={() => setShowCreatePost(true)}
          className="w-full mb-6 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl flex items-center gap-4 group hover:shadow-brand-gold/30 transition-all duration-300 border-2 border-brand-gold/30 hover:border-brand-gold/60"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold via-amber-500 to-amber-600 flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-brand-gold/30">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="You" className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-white" />
            )}
          </div>
          <span className="flex-1 text-left text-gray-400 group-hover:text-brand-gold transition-colors font-medium text-lg">
            Share your racing story...
          </span>
          <Sparkles className="w-6 h-6 text-brand-gold drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
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
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-white/10 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-brand-gold/20 transition-all duration-300 rounded-2xl overflow-hidden">
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
                          <p className="font-bold text-white group-hover:text-brand-gold transition-colors">
                            {post.profiles?.full_name || post.profiles?.username}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
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
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-300 hover:text-brand-gold" />
                        </button>
                        {showPostMenu === post.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl shadow-brand-gold/10 border-2 border-white/20 overflow-hidden z-10"
                          >
                            {user?.id === post.user_id && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingPost(post);
                                    setShowCreatePost(true);
                                    setShowPostMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-white hover:bg-brand-gold/20 transition-colors flex items-center gap-2 font-medium"
                                >
                                  <Edit2 className="w-4 h-4 text-brand-gold" />
                                  Edit Post
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(post.id);
                                    setShowPostMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-900/30 transition-colors font-medium"
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
                              className="w-full px-4 py-3 text-left text-white hover:bg-brand-gold/20 transition-colors flex items-center gap-2 font-medium"
                            >
                              {bookmarks.includes(post.id) ? (
                                <>
                                  <BookmarkCheck className="w-4 h-4 text-brand-gold" />
                                  Unsave
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-4 h-4 text-brand-gold" />
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
                        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-100">
                          {renderTextWithLinks(post.content)}
                        </p>
                        {post.is_edited && (
                          <span className="text-xs text-gray-500 italic">
                            Edited
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Media - Multiple Images */}
                  {post.image_urls && post.image_urls.length > 0 ? (
                    <div className={`grid gap-1 ${
                      post.image_urls.length === 1 ? 'grid-cols-1' :
                      post.image_urls.length === 2 ? 'grid-cols-2' :
                      post.image_urls.length === 3 ? 'grid-cols-3' :
                      'grid-cols-2'
                    }`}>
                      {post.image_urls.slice(0, 4).map((imageUrl, index) => (
                        <div
                          key={index}
                          className={`relative group cursor-pointer overflow-hidden ${
                            post.image_urls.length === 3 && index === 0 ? 'col-span-3' :
                            post.image_urls.length === 4 && index >= 2 ? 'col-span-1' : ''
                          }`}
                          onClick={() => setLightboxImage(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-cover max-h-[600px]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : post.image_url && (
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
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
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
                          <span className="font-semibold text-sm text-gray-300">
                            {post.post_reactions?.length || 0}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                          className="flex items-center gap-2 group"
                          whileTap={{ scale: 0.9 }}
                        >
                          <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-brand-gold transition-colors" />
                          <span className="font-semibold text-sm text-gray-300">
                            {post.post_comments?.length || 0}
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 group"
                          whileTap={{ scale: 0.9 }}
                        >
                          {shareSuccess === post.id ? (
                            <Check className="w-6 h-6 text-green-400" />
                          ) : (
                            <Share2 className="w-6 h-6 text-gray-400 group-hover:text-brand-gold transition-colors" />
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
                          className="border-t border-white/10 pt-6 space-y-4 relative"
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
                                <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/40 border border-brand-gold/30 px-3 py-2 rounded-lg">
                                  <Reply className="w-3 h-3 text-brand-gold" />
                                  Replying to @{replyingTo.username}
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="ml-auto text-red-400 hover:text-red-300"
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
                                    className="max-w-xs rounded-xl border-2 border-brand-gold/30"
                                    style={{ maxHeight: '150px' }}
                                  />
                                  <button
                                    onClick={() => setSelectedGif(prev => ({ ...prev, [post.id]: null }))}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
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
                                className="w-full px-4 py-3 rounded-full bg-black/40 text-white placeholder-gray-400 border-2 border-white/10 focus:border-brand-gold transition-all"
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
                                    <div className="bg-black/30 border border-white/10 rounded-2xl px-4 py-3">
                                      <p
                                        className="font-semibold text-sm mb-1 cursor-pointer hover:underline text-white hover:text-brand-gold"
                                        onClick={() => navigate(`/user/${comment.profiles?.id}`)}
                                      >
                                        {comment.profiles?.full_name || comment.profiles?.username}
                                      </p>
                                      <div className="text-sm text-gray-200">{renderCommentContent(comment.content)}</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 ml-4">
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
                                          <div className="bg-black/30 border border-white/10 rounded-2xl px-3 py-2">
                                            <p
                                              className="font-semibold text-xs mb-1 cursor-pointer hover:underline text-white hover:text-brand-gold"
                                              onClick={() => navigate(`/user/${reply.profiles?.id}`)}
                                            >
                                              {reply.profiles?.full_name || reply.profiles?.username}
                                            </p>
                                            <div className="text-xs text-gray-200">{renderCommentContent(reply.content)}</div>
                                          </div>
                                          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 ml-3">
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
          <div className="text-center py-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-gold via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-brand-gold/50 ring-4 ring-brand-gold/30"
            >
              <Flag className="w-12 h-12 text-white drop-shadow-lg" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 text-white">No posts yet</h3>
            <p className="text-gray-400 mb-8 text-lg">
              Be the first to share something amazing!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-gradient-to-r from-brand-gold to-amber-600 text-black font-bold px-8 py-4 rounded-xl hover:from-amber-600 hover:to-brand-gold transition-all duration-300 shadow-xl shadow-brand-gold/30 hover:shadow-2xl hover:shadow-brand-gold/50 transform hover:scale-105"
            >
              Create First Post
            </button>
          </div>
        )}

        {hasMore && posts.length > 0 && (
          <div ref={observerTarget} className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            <Flag className="w-8 h-8 mx-auto mb-2 text-brand-gold/50" />
            <p className="font-medium">You've reached the end</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Delete Post?</h3>
            <p className="mb-8 text-gray-300 text-lg">
              This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-gray-700/50 text-white border border-white/20 rounded-xl font-semibold hover:bg-gray-600/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-colors shadow-lg shadow-red-500/30"
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
