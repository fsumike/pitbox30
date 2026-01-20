import React, { useState, useEffect } from 'react';
import { X, Instagram, Facebook, Twitter, Youtube, Share2, AlertCircle, Loader2, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { SharedContent } from '../hooks/useShareTarget';
import EmojiPicker from './EmojiPicker';

interface ShareTargetHandlerProps {
  sharedContent: SharedContent;
  onClose: () => void;
  onSuccess?: () => void;
}

const getSourceIcon = (source: SharedContent['source']) => {
  switch (source) {
    case 'instagram':
      return <Instagram className="w-5 h-5" />;
    case 'facebook':
      return <Facebook className="w-5 h-5" />;
    case 'twitter':
      return <Twitter className="w-5 h-5" />;
    case 'youtube':
      return <Youtube className="w-5 h-5" />;
    default:
      return <Share2 className="w-5 h-5" />;
  }
};

const getSourceLabel = (source: SharedContent['source']) => {
  switch (source) {
    case 'instagram':
      return 'Instagram';
    case 'facebook':
      return 'Facebook';
    case 'tiktok':
      return 'TikTok';
    case 'twitter':
      return 'Twitter/X';
    case 'youtube':
      return 'YouTube';
    default:
      return 'External Link';
  }
};

const getSourceColor = (source: SharedContent['source']) => {
  switch (source) {
    case 'instagram':
      return 'from-purple-500 to-pink-500';
    case 'facebook':
      return 'from-blue-500 to-blue-600';
    case 'tiktok':
      return 'from-gray-800 to-pink-500';
    case 'twitter':
      return 'from-blue-400 to-blue-500';
    case 'youtube':
      return 'from-red-500 to-red-600';
    default:
      return 'from-brand-gold to-yellow-500';
  }
};

export default function ShareTargetHandler({ sharedContent, onClose, onSuccess }: ShareTargetHandlerProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    try {
      await Haptics.impact({ style });
    } catch (err) {
      // Silently ignore if not available
    }
  };

  useEffect(() => {
    if (sharedContent.title) {
      setComment(`Check this out! ${sharedContent.title}`);
    } else if (sharedContent.description) {
      setComment(sharedContent.description);
    } else if (sharedContent.text) {
      setComment(sharedContent.text);
    }
  }, [sharedContent]);

  const handleEmojiSelect = (emoji: string) => {
    setComment(prev => prev + emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be signed in to share to Pit Community');
      return;
    }

    if (!comment.trim() && !sharedContent.url) {
      setError('Please add a comment or share a link');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      triggerHaptic(ImpactStyle.Medium);

      let contentText = comment.trim();

      if (sharedContent.url) {
        contentText += `\n\n🔗 ${sharedContent.url}`;
      }

      const postData = {
        user_id: user.id,
        content: contentText,
        shared_from: sharedContent.source || 'other',
        shared_url: sharedContent.url,
        visibility: 'public',
        status: 'published'
      };

      const { error: insertError } = await supabase
        .from('posts')
        .insert(postData);

      if (insertError) throw insertError;

      setSuccess(true);
      triggerHaptic(ImpactStyle.Heavy);

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error sharing to Pit Community:', err);
      setError(err instanceof Error ? err.message : 'Failed to share');
      triggerHaptic(ImpactStyle.Heavy);
    } finally {
      setPosting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          className="bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border-t-4 border-brand-gold"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-800">
            <button
              onClick={() => {
                triggerHaptic(ImpactStyle.Light);
                onClose();
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${getSourceColor(sharedContent.source)} text-white shadow-lg`}>
                {getSourceIcon(sharedContent.source)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Share to Pit Community</h2>
                <p className="text-sm text-gray-400">From {getSourceLabel(sharedContent.source)}</p>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          {sharedContent.url && (
            <div className="mx-6 mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  {sharedContent.title && (
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">
                      {sharedContent.title}
                    </h3>
                  )}
                  {sharedContent.description && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {sharedContent.description}
                    </p>
                  )}
                  <a
                    href={sharedContent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-gold hover:underline break-all line-clamp-1"
                  >
                    {sharedContent.url}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 rounded-lg bg-red-900/30 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-6 mt-4 p-4 rounded-lg bg-green-900/30 text-green-300 flex items-center gap-3"
            >
              <div className="p-2 bg-green-500 rounded-full">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Successfully shared!</p>
                <p className="text-sm text-green-400">Your post is now live in Pit Community</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-white mb-2">
                  Add your thoughts
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts with Pit Community..."
                  className="w-full p-4 rounded-xl resize-none bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all"
                  rows={4}
                />
                <div className="absolute bottom-3 right-3">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} theme="dark" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(ImpactStyle.Light);
                    onClose();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting || (!comment.trim() && !sharedContent.url)}
                  className="flex-1 px-6 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-dark active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2"
                >
                  {posting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Share to Community</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
