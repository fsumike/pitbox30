import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Post, PostBookmark, Profile, PostReaction, PostComment } from '../types';

export function usePosts() {
  const { user, connectionError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [commentReactions, setCommentReactions] = useState<Record<string, boolean>>({});

  interface LoadPostsOptions {
    filter?: 'all' | 'friends' | 'mine' | 'bookmarks' | 'trending';
    mediaType?: 'all' | 'image' | 'video' | 'text';
    searchTerm?: string;
    page?: number;
    pageSize?: number;
  }

  useEffect(() => {
    if (user && !connectionError) {
      loadBookmarks();
    }
  }, [user]);

  const loadPosts = async (options: LoadPostsOptions = {}) => {
    if (!user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('posts')
        .select(`
          id,
          user_id,
          content,
          image_url,
          video_url,
          location,
          latitude,
          longitude,
          visibility,
          created_at,
          updated_at,
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
          post_comments (
            id,
            content,
            user_id,
            created_at,
            parent_comment_id,
            reply_count,
            reaction_count,
            profiles (
              id,
              username,
              avatar_url,
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      const { page = 1, pageSize = 10 } = options;

      const { filter = 'all', mediaType = 'all', searchTerm } = options;

      // Apply media type filter
      if (mediaType === 'image') {
        query = query.not('image_url', 'is', null).is('video_url', null);
      } else if (mediaType === 'video') {
        query = query.not('video_url', 'is', null).is('image_url', null);
      } else if (mediaType === 'text') {
        query = query.is('image_url', null).is('video_url', null);
      }

      // Apply search term filter
      if (searchTerm) {
        query = query.or(`content.ilike.%${searchTerm}%,profiles.username.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%`);
      }

      // Apply visibility filter based on the selected feed
      if (filter === 'trending') {
        // For trending, order by engagement (likes + comments) in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        query = query.gte('created_at', sevenDaysAgo.toISOString())
          .or(`visibility.eq.public,and(user_id.eq.${user.id})`)
          .order('created_at', { ascending: false }); // We'll sort by engagement in the frontend
      } else if (filter === 'friends') {
        // Get user's friends
        const friendIds = await getFriendIds();
        
        // Get posts from friends or public posts from the user
        if (friendIds && friendIds.length > 0) {
          query = query.or(
            `and(user_id.in.(${friendIds}),visibility.in.(public,friends)),and(user_id.eq.${user.id})`
          );
        } else {
          // If no friends, just show user's own posts
          query = query.eq('user_id', user.id);
        } 
      } else if (filter === 'mine') {
        // Only show user's own posts
        query = query.eq('user_id', user.id);
      } else if (filter === 'bookmarks') {
        // Get bookmarked posts
        if (bookmarks.length > 0) {
          query = query.in('id', bookmarks);
        } else {
          // If no bookmarks, return empty array
          setPosts([]);
          setLoading(false);
          return [];
        }
      } else {
        // For 'all', show public posts and friends' posts
        const friendIds = await getFriendIds();
        if (friendIds && friendIds.length > 0) {
          query = query.or(
            `visibility.eq.public,and(user_id.eq.${user.id}),and(visibility.eq.friends,user_id.in.(${friendIds}))`
          );
        } else {
          query = query.or(`visibility.eq.public,and(user_id.eq.${user.id})`);
        }
      } 

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform the data to include bookmarked status
      const transformedData = (data || []).map(post => ({
        ...post,
        post_reactions: post.post_likes, // Map post_likes to post_reactions for consistency
        bookmarked: bookmarks.includes(post.id)
      }));

      // Sort trending posts by engagement
      if (filter === 'trending') {
        transformedData.sort((a, b) => {
          const aEngagement = (a.post_likes?.length || 0) + (a.post_comments?.length || 0);
          const bEngagement = (b.post_likes?.length || 0) + (b.post_comments?.length || 0);
          return bEngagement - aEngagement;
        });
      }

      if (page === 1) {
        setPosts(transformedData);
      } else {
        setPosts(prev => [...prev, ...transformedData]);
      }
      return transformedData;
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFriendIds = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data: friendships, error } = await supabase
        .from('friendships')
        .select('user_id1, user_id2')
        .or(`user_id1.eq.${user.id},user_id2.eq.${user.id}`);

      if (!friendships || friendships.length === 0) return null;
      
      const friendIds = friendships.map(friendship => 
        friendship.user_id1 === user.id ? friendship.user_id2 : friendship.user_id1
      );
      if (error) throw error;
      return friendIds.join(',');
    } catch (err) {
      console.error('Error getting friend IDs:', err);
      return null;
    }
  };

  const loadBookmarks = async () => {
    if (!user) return;
    
    try {
      // First try to load from localStorage for faster access
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
      if (savedBookmarks) {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarks(parsedBookmarks);
      }
      
      // Then load from database to ensure we have the latest data
      const { data, error } = await supabase
        .from('post_bookmarks')
        .select('post_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        const bookmarkIds = data.map(bookmark => bookmark.post_id);
        setBookmarks(bookmarkIds);
        
        // Update localStorage
        localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(bookmarkIds));
      }
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const toggleBookmark = async (postId: string) => {
    if (!user) return false;
    const isBookmarked = bookmarks.includes(postId);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('post_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
          
        if (error) throw error;
        
        // Update local state
        const updatedBookmarks = bookmarks.filter(id => id !== postId);
        setBookmarks(updatedBookmarks);
        
        // Update localStorage
        localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
        
        // Update posts state
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, bookmarked: false } : post
        ));
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('post_bookmarks')
          .insert({
            user_id: user.id,
            post_id: postId
          });
          
        if (error) throw error;
        
        // Update local state
        const updatedBookmarks = [...bookmarks, postId];
        setBookmarks(updatedBookmarks);
        
        // Update localStorage
        localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
        
        // Update posts state
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, bookmarked: true } : post
        ));
      }
      
      return true;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      return false;
    }
  };

  const toggleReaction = async (postId: string, reactionType: string) => {
    if (!user) return false;

    try {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (existingLike && existingLike.length > 0) {
        // Remove existing like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Add new like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
          
        // Create notification for the post owner
        const { data: post } = await supabase
          .from('posts')
          .select('user_id')
          .eq('id', postId)
          .single();
          
        if (post && post.user_id !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: post.user_id,
              type: 'like',
              content: `${user.user_metadata.full_name || user.email} liked your post`,
              related_user_id: user.id,
              post_id: postId
            });
        }
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const hasLike = post.post_reactions?.some(reaction => reaction.user_id === user.id);
          const updatedReactions = hasLike
            ? post.post_reactions?.filter(reaction => reaction.user_id !== user.id) || []
            : [...(post.post_reactions || []), { user_id: user.id, id: Date.now().toString() }];
          
          return {
            ...post,
            post_reactions: updatedReactions
          };
        }
        return post;
      }));

      return true;
    } catch (err) {
      console.error('Error toggling reaction:', err);
      return false;
    }
  };

  const addComment = async (postId: string, content: string, parentCommentId?: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { data: comment, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        })
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url,
            full_name
          )
        `)
        .single();

      if (error) throw error;
      
      // Create notification for the post owner
      // This part needs to be updated to use the new `status` column
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();
        
      if (post && post.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user_id,
            type: 'comment',
            content: `${user.user_metadata.full_name || user.email} commented on your post`,
            related_user_id: user.id,
            post_id: postId
          });
      }
      
      // Check for mentions in the comment
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex);
      
      if (mentions) {
        for (const mention of mentions) {
          const username = mention.substring(1); // Remove the @ symbol
          
          // Find the user by username
          const { data: mentionedUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();
            
          if (mentionedUser && mentionedUser.id !== user.id) {
            // Create notification for the mentioned user
            await supabase
              .from('notifications')
              .insert({
                user_id: mentionedUser.id,
                type: 'mention',
                content: `${user.user_metadata.full_name || user.email} mentioned you in a comment`,
                related_user_id: user.id,
                post_id: postId
              });
          }
        }
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            post_comments: [...(post.post_comments || []), comment]
          };
        }
        return post;
      }));

      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      return false;
    }
  };

  const updatePost = async (postId: string, updatedData: Partial<Post>) => {
    if (!user) {
      setError('You must be signed in to update posts');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Ensure the user owns the post
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (fetchError || existingPost?.user_id !== user.id) {
        throw new Error('You can only update your own posts');
      }

      const { error } = await supabase
        .from('posts')
        .update(updatedData)
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, ...updatedData } : post
      ));

      return true;
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    try {
      // Get the post to check if it has media
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('image_url, video_url, user_id')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;

      // Verify the user owns the post
      if (post.user_id !== user.id) {
        throw new Error('You can only delete your own posts');
      }

      // Delete any images from storage
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

      // Delete any videos from storage
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

      // Delete the post from the database
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw deleteError;

      // Update local state
      setPosts(prev => prev.filter(post => post.id !== postId));

      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      return false;
    }
  };

  const toggleCommentReaction = async (commentId: string) => {
    if (!user) return false;

    try {
      const { data: existingReaction } = await supabase
        .from('comment_reactions')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingReaction) {
        await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        setCommentReactions(prev => ({ ...prev, [commentId]: false }));
      } else {
        await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: user.id,
            reaction_type: 'like'
          });

        setCommentReactions(prev => ({ ...prev, [commentId]: true }));
      }

      setPosts(prev => prev.map(post => ({
        ...post,
        post_comments: post.post_comments?.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                reaction_count: (comment.reaction_count || 0) + (existingReaction ? -1 : 1)
              }
            : comment
        )
      })));

      return true;
    } catch (err) {
      console.error('Error toggling comment reaction:', err);
      return false;
    }
  };

  const trackPostView = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('post_views')
        .insert({
          post_id: postId,
          user_id: user.id,
          viewed_at: new Date().toISOString()
        });
    } catch (err) {
      console.error('Error tracking post view:', err);
    }
  }, [user]);

  const incrementShareCount = async (postId: string) => {
    try {
      await supabase
        .from('posts')
        .update({ share_count: supabase.raw('share_count + 1') })
        .eq('id', postId);

      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, share_count: (post.share_count || 0) + 1 }
          : post
      ));
    } catch (err) {
      console.error('Error incrementing share count:', err);
    }
  };

  const editPost = async (postId: string, content: string, imageUrl?: string, videoUrl?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          content,
          image_url: imageUrl,
          video_url: videoUrl,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPosts(prev => prev.map(post =>
        post.id === postId
          ? {
              ...post,
              content,
              image_url: imageUrl,
              video_url: videoUrl,
              is_edited: true,
              edited_at: new Date().toISOString()
            }
          : post
      ));

      return true;
    } catch (err) {
      console.error('Error editing post:', err);
      return false;
    }
  };

  return {
    posts,
    loading,
    error,
    loadPosts,
    toggleReaction,
    addComment,
    updatePost,
    deletePost,
    toggleBookmark,
    bookmarks,
    toggleCommentReaction,
    commentReactions,
    trackPostView,
    incrementShareCount,
    editPost
  };
}