import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music, MoreVertical, Volume2, VolumeX, Play, Pause, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoReel {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  duration: number;
  hashtags: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  is_liked?: boolean;
}

export default function VideoReelsPlayer() {
  const [reels, setReels] = useState<VideoReel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([index, video]) => {
      if (video) {
        if (parseInt(index) === currentIndex && playing) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex, playing]);

  const loadReels = async () => {
    try {
      const { data, error } = await supabase
        .from('video_reels')
        .select(`
          *,
          profiles!video_reels_user_id_fkey (username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (user) {
        const reelIds = data.map(r => r.id);
        const { data: likes } = await supabase
          .from('video_reel_likes')
          .select('reel_id')
          .eq('user_id', user.id)
          .in('reel_id', reelIds);

        const likedIds = new Set(likes?.map(l => l.reel_id) || []);

        setReels(data.map(reel => ({
          ...reel,
          is_liked: likedIds.has(reel.id)
        })));
      } else {
        setReels(data || []);
      }
    } catch (error) {
      console.error('Error loading reels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < reels.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  const handleLike = async (reelId: string) => {
    if (!user) return;

    const reel = reels.find(r => r.id === reelId);
    if (!reel) return;

    try {
      if (reel.is_liked) {
        await supabase
          .from('video_reel_likes')
          .delete()
          .eq('reel_id', reelId)
          .eq('user_id', user.id);

        await supabase.rpc('decrement_reel_likes', { reel_id: reelId });
      } else {
        await supabase
          .from('video_reel_likes')
          .insert({ reel_id: reelId, user_id: user.id });

        await supabase.rpc('increment_reel_likes', { reel_id: reelId });
      }

      setReels(reels.map(r =>
        r.id === reelId
          ? {
              ...r,
              is_liked: !r.is_liked,
              like_count: r.like_count + (r.is_liked ? -1 : 1)
            }
          : r
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = async (reel: VideoReel) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: reel.title || 'Check out this racing video!',
          text: reel.description || '',
          url: window.location.href
        });

        await supabase.rpc('increment_reel_shares', { reel_id: reel.id });
      }
    } catch (error) {
      }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading reels...</div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center px-6">
          <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold mb-2">No Reels Yet</h2>
          <p className="text-gray-400">Be the first to post a racing reel!</p>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <video
            ref={el => videoRefs.current[currentIndex] = el}
            src={currentReel.video_url}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            playsInline
            muted={muted}
            onClick={() => setPlaying(!playing)}
          />

          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-6">
                <Play className="w-16 h-16 text-white" fill="white" />
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="bg-black/30 p-2 rounded-full backdrop-blur-sm"
              >
                {muted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-end justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => navigate(`/profile/${currentReel.user_id}`)}
                    className="flex items-center gap-2"
                  >
                    {currentReel.profiles?.avatar_url ? (
                      <img
                        src={currentReel.profiles.avatar_url}
                        alt={currentReel.profiles.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <span className="text-white font-semibold">
                      {currentReel.profiles?.username || 'Unknown'}
                    </span>
                  </button>
                </div>

                {currentReel.title && (
                  <h3 className="text-white font-bold text-lg mb-1">
                    {currentReel.title}
                  </h3>
                )}

                {currentReel.description && (
                  <p className="text-white/90 text-sm mb-2 line-clamp-2">
                    {currentReel.description}
                  </p>
                )}

                {currentReel.hashtags && currentReel.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentReel.hashtags.map((tag, i) => (
                      <span key={i} className="text-blue-400 text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={() => handleLike(currentReel.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className={`p-3 rounded-full ${currentReel.is_liked ? 'bg-red-500' : 'bg-black/30 backdrop-blur-sm'}`}>
                    <Heart
                      className={`w-7 h-7 ${currentReel.is_liked ? 'text-white fill-white' : 'text-white'}`}
                    />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {currentReel.like_count}
                  </span>
                </button>

                <button
                  onClick={() => setShowComments(true)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {currentReel.comment_count}
                  </span>
                </button>

                <button
                  onClick={() => handleShare(currentReel)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm">
                    <Share2 className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    {currentReel.share_count}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            {reels.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-2 h-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
