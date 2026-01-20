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

    // Safety timeout - ensure app always loads even if video completely fails
    const safetyTimeout = setTimeout(() => {
      if (!hasCompletedRef.current) {
        console.warn('Video splash safety timeout triggered');
        hasCompletedRef.current = true;
        onComplete();
      }
    }, 5000); // 5 second max wait

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
      }, 1500); // Reduced to 1.5 seconds
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
        }, 1500); // Reduced to 1.5 seconds
      });
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      clearTimeout(safetyTimeout);
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
          onClick={handleSkip}
        >
          {showFallback ? (
            <div className="flex flex-col items-center justify-center" onClick={handleSkip}>
              <img
                src="/android-icon-512-512.png"
                alt="PIT-BOX"
                className="w-64 h-64 object-contain animate-pulse"
              />
              <p className="text-white/60 mt-4 text-sm">Tap anywhere to continue</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted
                preload="auto"
              />

              <button
                onClick={handleSkip}
                className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium transition-all duration-300 hover:scale-105 z-10"
              >
                Skip
              </button>

              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm">
                Tap anywhere to skip
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VideoSplash;
