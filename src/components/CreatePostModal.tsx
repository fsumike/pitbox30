import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2, AlertCircle, Loader2, Image as ImageIcon, Check, Film, MapPin, Globe, Users, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import EmojiPicker from '../components/EmojiPicker';
import ReactPlayer from 'react-player';
import { useLocation } from '../hooks/useLocation';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  content?: string;
  image_url?: string;
  visibility?: 'public' | 'friends' | 'private';
  is_pinned?: boolean;
  location?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post; // Optional post object for editing
  onSuccess?: () => void;
}

function CreatePostModal({ isOpen, onClose, post, onSuccess }: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ type: 'image' | 'video', url: string, file: File } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  
  const [isPinned, setIsPinned] = useState(false); // State for pinned post
  // Get user's location
  const { 
    latitude, 
    longitude, 
    address, 
    loading: locationLoading, 
    error: locationError,
    getLocation 
  } = useLocation({
    enableHighAccuracy: true,
    watch: false,
    enableGeocoding: true
  });

  useEffect(() => {
    if (isOpen && post) {
      setIsEditing(true);
      setContent(post.content || '');
      setMedia(post.image_url ? { type: 'image', url: post.image_url, file: new File([], '') } : null); // Dummy file
      setVisibility(post.visibility || 'public');
      setIsPinned(post.is_pinned || false);
      setIncludeLocation(!!post.location);
    } else if (isOpen) {
      // Reset form when opening for new post
      resetForm();
    }
  }, [isOpen, post]);

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    // Validate file size (max 5MB for images, 50MB for videos)
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`${type === 'image' ? 'Image' : 'Video'} size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Create a local preview URL
      const url = URL.createObjectURL(file);
      setMedia({ type, url, file });
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      
      // Clear interval after 2 seconds
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
      }, 2000);
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to post');
      return;
    }

    if (!content.trim() && !media) {
      setError('Please write something or add media to post');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const initialPostData = {
        user_id: user.id,
        content: content.trim() || (media ? ' ' : ''),
        image_url: null,
        video_url: null,
        visibility: visibility,
        is_pinned: isPinned,
        status: 'published', // Default status for text posts
      };

      // Add location data if enabled
      if (includeLocation && latitude && longitude) {
        initialPostData.location = address || 'Current Location';
        initialPostData.latitude = latitude;
        initialPostData.longitude = longitude;
      }

      // Handle media upload to Supabase Storage
      if (media) {
        const fileExt = media.file.name.split('.').pop();
        if (!fileExt) throw new Error('File is missing an extension');

        const uniqueId = `${user.id}-${Date.now()}`;
        const fileName = `${uniqueId}.${fileExt}`;
        
        if (media.type === 'image') {
          const filePath = `images/${fileName}`;
          
          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, media.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);

          // CRITICAL: Validate publicUrl before assigning
          if (!publicUrl) {
            throw new Error('Failed to get public URL for image.');
          }
          initialPostData.status = 'published'; // Set status to published for images


          initialPostData.image_url = publicUrl;
        } else {
          const filePath = `videos/raw/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('videos')
            .upload(filePath, media.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(filePath);
          initialPostData.status = 'processing'; // Set status to processing for videos

          initialPostData.video_url = publicUrl;
        }
      }

      let resultPost;
      if (isEditing && post?.id) {
        // Update the post in the database
        const { data, error: updateError } = await supabase
          .from('posts')
          .update(initialPostData)
          .eq('id', post.id)
          .eq('user_id', user.id) // Ensure user can only update their own posts
          .select()
          .single();

        if (updateError) {
          console.error('Database update error:', updateError);
          throw new Error(`Post update failed: ${updateError.message}`);
        }
        resultPost = data;
      } else {
        // Create the post in the database
        const { data, error: insertError } = await supabase
          .from('posts')
          .insert(initialPostData)
          .select()
          .single();
        if (insertError) {
          console.error('Database insert error:', insertError);
          throw new Error(`Post creation failed: ${insertError.message}`);
        }
        resultPost = data;
      }

      if (resultPost) {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Error creating/updating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create/update post');
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setContent('');
    setMedia(null);
    setIncludeLocation(false);
    setVisibility('public');
    setIsPinned(false);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    setError(null);
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
  };

  const handleLocationToggle = () => {
    if (!includeLocation) {
      getLocation();
    }
    setIncludeLocation(!includeLocation);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-xl"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Post' : 'Create Post'}</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-lg resize-none bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                rows={4}
              />
              <div className="absolute bottom-2 right-2">
                <EmojiPicker 
                  onEmojiSelect={handleEmojiSelect}
                  theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                />
              </div>
            </div>

            {/* Visibility Options */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  visibility === 'public' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </button>
              
              <button
                type="button"
                onClick={() => setVisibility('friends')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  visibility === 'friends' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Friends Only</span>
              </button>
              
              <button
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  visibility === 'private' 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Only Me</span>
              </button>
            </div>

            {/* Location Option */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLocationToggle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  includeLocation 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {includeLocation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Location Added</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>Add Location</span>
                  </>
                )}
              </button>
              
              {includeLocation && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex-1 truncate">
                  {locationLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Getting location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{locationError}</span>
                    </div>
                  ) : address ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{address}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pinned Post Option */}
            {user && ( // Only show if user is logged in
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-brand-gold rounded"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pin to top of feed (for testing, normally admin only)
                </label>
              </div>
            )}

            {media ? (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Upload preview"
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="relative pt-[56.25%]">
                    <ReactPlayer
                      url={media.url}
                      width="100%"
                      height="100%"
                      controls
                      className="absolute top-0 left-0"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMedia(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (videoInputRef.current) videoInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                {/* Upload Progress Bar */}
                {uploading && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-brand-gold h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-white text-xs mt-1 text-center">
                      {uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleMediaUpload(e, 'image')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-brand-gold dark:hover:border-brand-gold transition-colors flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-500">Add Photo</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleMediaUpload(e, 'video')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-brand-gold dark:hover:border-brand-gold transition-colors flex flex-col items-center gap-2"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    ) : (
                      <>
                        <Film className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-500">Add Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={posting || uploading || (!content.trim() && !media)}
                className="px-6 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2"
              > 
                {posting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )} 
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default CreatePostModal;