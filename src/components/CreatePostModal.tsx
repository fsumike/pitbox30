import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2, AlertCircle, Loader2, Image as ImageIcon, Check, Film, MapPin, Globe, Users, Lock, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import EmojiPicker from '../components/EmojiPicker';
import ReactPlayer from 'react-player';
import { useLocation } from '../hooks/useLocation';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../utils/imageCompression';
import { takePhoto, selectPhoto, convertPhotoToFile } from '../utils/nativeCamera';
import { Capacitor } from '@capacitor/core';

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
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<{ url: string, file: File } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [isPinned, setIsPinned] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      await Haptics.impact({ style });
    } catch (err) {
      // Haptics not available, silently ignore
    }
  };
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
      if (post.image_url) {
        setImages([post.image_url]);
      }
      setVisibility(post.visibility || 'public');
      setIsPinned(post.is_pinned || false);
      setIncludeLocation(!!post.location);
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, post]);

  const handleNativeCamera = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      setError('Maximum 4 images allowed');
      return;
    }

    if (video) {
      setError('Cannot add images when video is selected. Remove video first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const photo = await takePhoto();
      if (photo) {
        const file = await convertPhotoToFile(photo);
        if (file) {
          const compressed = await compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8
          });
          setImages(prev => [...prev, compressed]);
        }
      }
    } catch (err) {
      console.error('Native camera error:', err);
      setError('Failed to capture photo');
    } finally {
      setUploading(false);
    }
  };

  const handleNativeGallery = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      setError('Maximum 4 images allowed');
      return;
    }

    if (video) {
      setError('Cannot add images when video is selected. Remove video first.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const photo = await selectPhoto();
      if (photo) {
        const file = await convertPhotoToFile(photo);
        if (file) {
          const compressed = await compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8
          });
          setImages(prev => [...prev, compressed]);
        }
      }
    } catch (err) {
      console.error('Native gallery error:', err);
      setError('Failed to select photo');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - images.length;
    if (remainingSlots <= 0) {
      setError('Maximum 4 images allowed');
      return;
    }

    if (video) {
      setError('Cannot add images when video is selected. Remove video first.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setError(null);

    try {
      const compressedImages = await Promise.all(
        filesToProcess.map(file =>
          compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8
          })
        )
      );
      setImages(prev => [...prev, ...compressedImages]);
    } catch (err) {
      console.error('Image compression error:', err);
      setError('Failed to process images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return;
    }

    if (images.length > 0) {
      setError('Cannot add video when images are selected. Remove images first.');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('Video size must be less than 50MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = URL.createObjectURL(file);
      setVideo({ url, file });
    } catch (err) {
      console.error('Error uploading video:', err);
      setError('Failed to upload video');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to post');
      return;
    }

    if (!content.trim() && images.length === 0 && !video) {
      setError('Please write something or add media to post');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const initialPostData: any = {
        user_id: user.id,
        content: content.trim() || (images.length > 0 || video ? ' ' : ''),
        image_url: null,
        image_urls: null,
        video_url: null,
        visibility: visibility,
        is_pinned: isPinned,
        status: 'published',
      };

      // Add location data if enabled
      if (includeLocation && latitude && longitude) {
        initialPostData.location = address || 'Current Location';
        initialPostData.latitude = latitude;
        initialPostData.longitude = longitude;
      }

      // Handle multiple image uploads
      if (images.length > 0) {
        const uploadedUrls: string[] = [];

        for (let i = 0; i < images.length; i++) {
          const imageDataUrl = images[i];

          // Convert base64 to blob
          const response = await fetch(imageDataUrl);
          const blob = await response.blob();

          const uniqueId = `${user.id}-${Date.now()}-${i}`;
          const fileName = `${uniqueId}.jpg`;
          const filePath = `images/${fileName}`;

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, blob, {
              cacheControl: '3600',
              upsert: false,
              contentType: 'image/jpeg'
            });

          if (uploadError) {
            console.error('Storage upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);

          if (!publicUrl) {
            throw new Error('Failed to get public URL for image.');
          }

          uploadedUrls.push(publicUrl);
        }

        // Store array of image URLs
        initialPostData.image_urls = uploadedUrls;
        // Also set first image as primary for backwards compatibility
        initialPostData.image_url = uploadedUrls[0];
        initialPostData.status = 'published';
      }

      // Handle video upload
      if (video) {
        const fileExt = video.file.name.split('.').pop() || 'mp4';
        const uniqueId = `${user.id}-${Date.now()}`;
        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = `videos/raw/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, video.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);

        initialPostData.video_url = publicUrl;
        initialPostData.status = 'processing';
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
    setImages([]);
    setVideo(null);
    setIncludeLocation(false);
    setVisibility('public');
    setIsPinned(false);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    setError(null);
    setLightboxOpen(false);
    setLightboxIndex(0);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    setIsDragging(true);
    triggerHaptic(ImpactStyle.Light);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = touch.clientY - dragStartY.current;
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffset > 100) {
      triggerHaptic(ImpactStyle.Medium);
      onClose();
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <motion.div
        ref={modalRef}
        className="bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          transform: `translateY(${dragOffset}px)`,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle indicator */}
        <div className="w-full flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>

        <div className="relative p-6">
          <button
            onClick={() => {
              triggerHaptic(ImpactStyle.Light);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-700 active:bg-gray-600 rounded-full text-gray-300 touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-white">{isEditing ? 'Edit Post' : 'Create Post'}</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 text-red-300 flex items-center gap-2">
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
                className="w-full p-4 rounded-lg resize-none bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400"
                rows={4}
              />
              <div className="absolute bottom-2 right-2">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  theme="dark"
                />
              </div>
            </div>

            {/* Visibility Options */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(ImpactStyle.Light);
                  setVisibility('public');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full text-sm touch-manipulation ${
                  visibility === 'public'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(ImpactStyle.Light);
                  setVisibility('friends');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full text-sm touch-manipulation ${
                  visibility === 'friends'
                    ? 'bg-blue-900/30 text-blue-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Users className="w-4 h-4" />
                <span>Friends Only</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(ImpactStyle.Light);
                  setVisibility('private');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full text-sm touch-manipulation ${
                  visibility === 'private'
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Lock className="w-4 h-4" />
                <span>Only Me</span>
              </button>
            </div>

            {/* Location Option */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(ImpactStyle.Light);
                  handleLocationToggle();
                }}
                className={`flex items-center gap-2 px-3 py-1.5 min-h-[44px] rounded-full text-sm touch-manipulation ${
                  includeLocation
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-gray-700 text-gray-300'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
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
                <div className="text-sm text-gray-400 flex-1 truncate">
                  {locationLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Getting location...</span>
                    </div>
                  ) : locationError ? (
                    <div className="flex items-center gap-2 text-red-400">
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
            {user && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-brand-gold rounded"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-gray-300">
                  Pin to top of feed (for testing, normally admin only)
                </label>
              </div>
            )}

            {/* Multiple Images Display */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-gold" />
                    Photos ({images.length}/4)
                  </label>
                  <span className="text-xs text-gray-400">Auto-compressed</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square group rounded-xl overflow-hidden border-2 border-gray-700 hover:border-brand-gold transition-all"
                      >
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-110"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                        >
                          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic(ImpactStyle.Medium);
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {images.length < 4 && !video && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(ImpactStyle.Light);
                      fileInputRef.current?.click();
                    }}
                    disabled={uploading}
                    className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-brand-gold transition-colors flex items-center justify-center gap-2 text-gray-400 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        <span>Add More Photos ({4 - images.length} left)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Video Display */}
            {video && (
              <div className="relative rounded-lg overflow-hidden bg-gray-700">
                <div className="relative pt-[56.25%]">
                  <ReactPlayer
                    url={video.url}
                    width="100%"
                    height="100%"
                    controls
                    className="absolute top-0 left-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(ImpactStyle.Medium);
                    removeVideo();
                  }}
                  className="absolute top-2 right-2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-500 text-white rounded-full active:bg-red-600 transition-colors touch-manipulation z-10"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Add Media Buttons */}
            {images.length === 0 && !video && (
              <>
                {Capacitor.isNativePlatform() ? (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(ImpactStyle.Light);
                        handleNativeCamera();
                      }}
                      disabled={uploading}
                      className="p-3 border-2 border-dashed border-gray-600 rounded-lg active:border-brand-gold transition-colors flex flex-col items-center gap-1.5 touch-manipulation disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-400 text-xs">Camera</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(ImpactStyle.Light);
                        handleNativeGallery();
                      }}
                      disabled={uploading}
                      className="p-3 border-2 border-dashed border-gray-600 rounded-lg active:border-brand-gold transition-colors flex flex-col items-center gap-1.5 touch-manipulation disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-400 text-xs">Gallery</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(ImpactStyle.Light);
                        videoInputRef.current?.click();
                      }}
                      disabled={uploading}
                      className="p-3 border-2 border-dashed border-gray-600 rounded-lg active:border-brand-gold transition-colors flex flex-col items-center gap-1.5 touch-manipulation disabled:opacity-50"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {uploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
                      ) : (
                        <>
                          <Film className="w-6 h-6 text-gray-400" />
                          <span className="text-gray-400 text-xs">Video</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(ImpactStyle.Light);
                          fileInputRef.current?.click();
                        }}
                        disabled={uploading}
                        className="w-full p-4 min-h-[88px] border-2 border-dashed border-gray-600 rounded-lg active:border-brand-gold transition-colors flex flex-col items-center gap-2 touch-manipulation disabled:opacity-50"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-gray-400 text-sm">Add Photos (1-4)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(ImpactStyle.Light);
                          videoInputRef.current?.click();
                        }}
                        disabled={uploading}
                        className="w-full p-4 min-h-[88px] border-2 border-dashed border-gray-600 rounded-lg active:border-brand-gold transition-colors flex flex-col items-center gap-2 touch-manipulation disabled:opacity-50"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                        ) : (
                          <>
                            <Film className="w-8 h-8 text-gray-400" />
                            <span className="text-gray-400 text-sm">Add Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(ImpactStyle.Light);
                  onClose();
                }}
                className="px-6 py-2 min-h-[48px] rounded-lg bg-gray-700 active:bg-gray-600 transition-colors text-white font-medium touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={posting || uploading || (!content.trim() && images.length === 0 && !video)}
                onClick={() => {
                  if (!posting && !uploading && (content.trim() || images.length > 0 || video)) {
                    triggerHaptic(ImpactStyle.Medium);
                  }
                }}
                className="px-6 py-2 min-h-[48px] bg-brand-gold text-white rounded-lg active:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
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

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[1300] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === lightboxIndex
                          ? 'bg-brand-gold w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={images[lightboxIndex]}
              alt={`Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreatePostModal;