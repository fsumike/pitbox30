import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Clock, MapPin, Heart, MessageSquare, Share2, ThumbsUp, Laugh, Angry, Salad as Sad, MoreVertical, Send, AlertCircle, Loader2, ArrowLeft, Check, Flag, ExternalLink, Bookmark, BookmarkCheck, Repeat, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';
import type { Post, PostComment } from '../types';
import ReactPlayer from 'react-player';
import EmojiPicker from '../components/EmojiPicker';
import GifPicker from '../components/GifPicker';
import CreatePostModal from '../components/CreatePostModal';
import GoogleMapComponent from '../components/GoogleMapComponent';
import SocialShareButtons from '../components/SocialShareButtons';
import { motion } from 'framer-motion';

function PostView() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string, username: string } | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPost();
    checkIfBookmarked();
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            full_name,
            location
          ),
          post_likes (
            id,
            user_id
          ),
          post_comments (
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
              id,
              username,
              avatar_url,
              full_name
            )
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      setPost(data);
      
      // Map post_likes to post_reactions for consistency
      if (data) {
        setPost(prev => prev ? { ...prev, post_reactions: data.post_likes } : prev);
      }
      
      // Subscribe to real-time updates for this post
      subscribeToPostUpdates(postId);
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPostUpdates = (postId: string) => {
    const subscription = supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          loadPost();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        (payload) => {
          loadPost();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const checkIfBookmarked = () => {
    if (!user || !postId) return;
    
    try {
      // Check if post is bookmarked in localStorage
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        setBookmarked(bookmarks.includes(postId));
      }
    } catch (err) {
      console.error('Error checking bookmarks:', err);
    }
  };

  const toggleBookmark = () => {
    if (!user || !postId) return;
    
    try {
      // Get current bookmarks
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
      let bookmarks: string[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      
      // Toggle bookmark
      if (bookmarked) {
        bookmarks = bookmarks.filter(id => id !== postId);
      } else {
        bookmarks.push(postId);
      }
      
      // Save updated bookmarks
      localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(bookmarks));
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!user || !post) return;

    try {
      const { data: existingReaction } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id);

      if (existingReaction && existingReaction.length > 0) {
        // Remove existing like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
      } else {
        // Add new like
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
      }

      // Update the UI immediately
      setPost(prev => {
        if (!prev) return prev;
        
        const hasReaction = prev.post_reactions?.some(reaction => reaction.user_id === user.id);
        const updatedReactions = hasReaction
          ? prev.post_reactions?.filter(reaction => reaction.user_id !== user.id) || []
          : [...(prev.post_reactions || []), { user_id: user.id }];
        
        return {
          ...prev,
          post_reactions: updatedReactions
        };
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = async () => {
    if (!user || !post || (!newComment.trim() && !selectedGif)) return;

    setCommenting(true);
    try {
      let commentContent = newComment.trim();

      if (selectedGif) {
        commentContent = commentContent ? `${commentContent} [GIF]${selectedGif}[/GIF]` : `[GIF]${selectedGif}[/GIF]`;
      }

      if (replyingTo && commentContent) {
        commentContent = `@${replyingTo.username} ${commentContent}`;
      }

      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: commentContent,
          reply_to_comment_id: replyingTo?.commentId || null
        });

      if (error) throw error;

      setNewComment('');
      setSelectedGif(null);
      setReplyingTo(null);
      loadPost();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setCommenting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/community/post/${post?.id}`;
    const shareText = `Check out this post from ${post?.profiles?.username || 'a racer'} on PitBox.App!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'PitBox.App Post',
          text: shareText,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing post:', err);
      }
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post) return;
    
    setDeleting(true);
    try {
      // Check if user is the post owner
      if (user.id !== post.user_id) {
        throw new Error('You can only delete your own posts');
      }
      
      // Delete any images or videos from storage
      if (post.image_url) {
        try {
          const url = new URL(post.image_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(pathParts.indexOf('posts') + 1).join('/');
          
          if (filePath) {
            await supabase.storage
              .from('posts')
              .remove([filePath]);
          }
        } catch (storageErr) {
          }
      }
      
      if (post.video_url) {
        try {
          const url = new URL(post.video_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(pathParts.indexOf('videos') + 1).join('/');
          
          if (filePath) {
            await supabase.storage
              .from('videos')
              .remove([filePath]);
          }
        } catch (storageErr) {
          }
      }
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
        
      if (error) throw error;
      
      navigate('/community');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReportPost = () => {
    // In a real app, this would send a report to administrators
    alert('Thank you for your report. Our team will review this post.');
    setShowReportModal(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    // Assuming CreatePostModal can be reused for editing
    // You'd need to pass the post data to it and handle the update logic there
  };
  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
  };

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
  };

  const renderCommentContent = (content: string) => {
    const gifRegex = /\[GIF\](.*?)\[\/GIF\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = gifRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        );
      }
      parts.push(
        <img
          key={match.index}
          src={match[1]}
          alt="GIF"
          className="max-w-full rounded-lg mt-2"
          style={{ maxHeight: '200px' }}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={lastIndex}>{content.slice(lastIndex)}</span>
      );
    }

    return parts.length > 0 ? parts : content;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  const formatCommentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, 'MMM d, yyyy h:mm a');
      }
    } catch (error) {
      return 'some time ago';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="glass-panel p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/community')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Pit Community
        </button>
      </div>
    );
  }

  // Log for debugging
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/community')}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-gold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Community
      </button>

      <motion.div 
        className="glass-panel overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Post Header */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/user/${post.profiles?.id}`)}
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-brand-gold" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg hover:underline">
                  {post.profiles?.full_name || post.profiles?.username}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.created_at)}
                  {post.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      {post.location}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowPostMenu(!showPostMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showPostMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {user?.id === post.user_id && (
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowPostMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Delete Post
                      </button>
                    )}
                    {user?.id === post.user_id && (
                      <button
                        onClick={() => {
                          handleEditPost(post);
                          setShowPostMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Edit Post
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowReportModal(true);
                        setShowPostMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Report Post
                    </button>
                    <button
                      onClick={() => {
                        window.open(`/community/post/${post.id}`, '_blank');
                        setShowPostMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in New Tab
                    </button>
                    <button
                      onClick={() => {
                        toggleBookmark();
                        setShowPostMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      {bookmarked ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          Unsave Post
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          Save Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <p className="text-lg mb-6 whitespace-pre-wrap">{post.content}</p>

          {/* Post Image */}
          {post.image_url && (
            <div className="w-full mb-6 flex justify-center">
              <img
                src={post.image_url}
                alt="Post content"
                className="max-w-full h-auto rounded-lg"
                style={{
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}
          
          {/* Post Video */}
          {post.video_url && (
            <div className="w-full rounded-lg mb-6 overflow-hidden">
              <div className="relative pt-[56.25%]">
                <ReactPlayer
                  url={post.video_url}
                  width="100%"
                  height="100%"
                  controls
                  className="absolute top-0 left-0"
                />
              </div>
            </div>
          )}
          
          {/* Post Location Map */}
          {post.latitude && post.longitude && (
            <div className="w-full h-[300px] rounded-lg mb-6 overflow-hidden">
              <GoogleMapComponent
                center={{lat: post.latitude, lng: post.longitude}}
                markers={[{
                  position: {lat: post.latitude, lng: post.longitude},
                  title: post.location || 'Post Location',
                  isSelected: true
                }]}
                height="100%"
                zoom={14}
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 border-t border-b border-gray-200 dark:border-gray-700 py-4">
            {/* Diverse Reactions */}
            <button
              onClick={() => handleReaction('like')}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  post.post_reactions?.some(reaction => reaction.user_id === user?.id)
                    ? 'fill-current text-red-500'
                    : ''
                }`}
              />
              <span className="font-medium">{post.post_reactions?.length || 0}</span>
            </button>
            <button 
              onClick={() => commentInputRef.current?.focus()}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-colors"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="font-medium">{post.post_comments?.length || 0}</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-colors"
            >
              {shareSuccess ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <Share2 className="w-6 h-6" />
              )}
              <span className="font-medium">
                {shareSuccess ? 'Copied!' : 'Share'}
              </span>
            </button>
            <button
              onClick={toggleBookmark}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-colors ml-auto"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-6 h-6 fill-current text-brand-gold" />
              ) : (
                <Bookmark className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Social Share */}
          <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-gray-700">
            <SocialShareButtons
              url={`${window.location.origin}/community/post/${post.id}`}
              title={post.content.substring(0, 100)}
              description={`Check out this post from ${post.profiles?.username || 'Pit Community'}`}
              hashtags={['PitBox', 'Racing', 'PitCommunity']}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6">
          <h3 className="font-semibold mb-4">
            {post.post_comments?.length || 0} Comments
          </h3>

          {/* New Comment Input */}
          <div className="mb-6">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-brand-gold" />
                )}
              </div>
              <div className="flex-1">
                {selectedGif && (
                  <div className="mb-2 relative inline-block">
                    <img
                      src={selectedGif}
                      alt="Selected GIF"
                      className="max-w-xs rounded-lg"
                      style={{ maxHeight: '150px' }}
                    />
                    <button
                      onClick={() => setSelectedGif(null)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Write a comment..."}
                    className="w-full pr-24 py-2 px-4 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (newComment.trim() || selectedGif)) {
                        handleComment();
                      }
                    }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <GifPicker onGifSelect={handleGifSelect} />
                    <EmojiPicker
                      onEmojiSelect={handleEmojiSelect}
                      theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                    />
                    <button
                      onClick={handleComment}
                      disabled={(!newComment.trim() && !selectedGif) || commenting}
                      className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-full transition-colors disabled:opacity-50"
                    >
                      {commenting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reply indicator */}
          {replyingTo && (
            <div className="flex items-center gap-2 mb-3 ml-12 text-sm text-gray-500 dark:text-gray-400">
              <Repeat className="w-4 h-4" />
              <span>Replying to @{replyingTo.username}</span>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-brand-gold hover:underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.post_comments?.map((comment: PostComment) => (
              <motion.div 
                key={comment.id} 
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/user/${comment.profiles?.id}`)}
                >
                  {comment.profiles?.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-brand-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p
                      className="font-semibold hover:underline cursor-pointer"
                      onClick={() => navigate(`/user/${comment.profiles?.id}`)}
                    >
                      {comment.profiles?.full_name || comment.profiles?.username}
                    </p>
                    <div>{renderCommentContent(comment.content)}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">
                    <span>{formatCommentDate(comment.created_at)}</span>
                    <button 
                      className="hover:text-brand-gold"
                      onClick={() => {
                        setReplyingTo({
                          commentId: comment.id,
                          username: comment.profiles?.username || 'user'
                        });
                        setNewComment('');
                        setTimeout(() => {
                          commentInputRef.current?.focus();
                        }, 100);
                      }}
                    >
                      Reply
                    </button>
                    <button className="hover:text-brand-gold">
                      Like
                    </button>
                    {/* Reactions (non-functional placeholder) */}
                    <button className="hover:text-brand-gold">
                      <Smile className="w-4 h-4" />
                      React
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Post</h3>
            <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Report Post</h3>
            <p className="mb-4">Why are you reporting this post?</p>
            <div className="space-y-2 mb-6">
              {['Inappropriate content', 'Spam', 'Harassment', 'False information', 'Other'].map(reason => (
                <button
                  key={reason}
                  onClick={handleReportPost}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {reason}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      <CreatePostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost || undefined}
      />
    </div>
  );
}

export default PostView;