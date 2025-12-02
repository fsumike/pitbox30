import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSplashProps {
  onComplete: () => void;
  videoSrc?: string;
}

function VideoSplash({ onComplete, videoSrc = '/splash_animation.mp4' }: VideoSplashProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setIsPlaying(false);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    const handleError = () => {
      console.warn('Video failed to load, showing fallback');
      setShowFallback(true);
      setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }, 2000);
    };

    const handleCanPlay = () => {
      video.play().catch((err) => {
        console.warn('Video autoplay failed:', err);
        setShowFallback(true);
        setTimeout(() => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }, 2000);
      });
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsPlaying(false);
      setTimeout(() => {
        onComplete();
      }, 100);
    }
  };

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-brand-black flex items-center justify-center"
          style={{ isolation: 'isolate' }}
        >
          {showFallback ? (
            <div className="flex flex-col items-center justify-center">
              <img
                src="/android-icon-512-512.png"
                alt="PIT-BOX"
                className="w-64 h-64 object-contain animate-pulse"
              />
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                preload="auto"
              />

              <button
                onClick={handleSkip}
                className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Skip
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideoSplash;
