import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile, X, Flag } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
  theme?: Theme;
}

const RACING_EMOJIS = [
  { emoji: '🏁', name: 'Checkered Flag' },
  { emoji: '🏎️', name: 'Race Car' },
  { emoji: '🏆', name: 'Trophy' },
  { emoji: '🥇', name: '1st Place' },
  { emoji: '🥈', name: '2nd Place' },
  { emoji: '🥉', name: '3rd Place' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '💨', name: 'Dash' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🎯', name: 'Target' },
  { emoji: '🚀', name: 'Rocket' },
  { emoji: '💪', name: 'Muscle' },
  { emoji: '👊', name: 'Fist Bump' },
  { emoji: '🔧', name: 'Wrench' },
  { emoji: '🛠️', name: 'Tools' },
  { emoji: '⚙️', name: 'Gear' },
  { emoji: '🏴', name: 'Black Flag' },
  { emoji: '🚩', name: 'Red Flag' },
  { emoji: '🟢', name: 'Green Flag' },
  { emoji: '🟡', name: 'Yellow Flag' },
  { emoji: '⚫', name: 'Black' },
  { emoji: '⚪', name: 'White' },
  { emoji: '🔴', name: 'Red' },
  { emoji: '💯', name: '100' },
  { emoji: '🎪', name: 'Circus (Track)' },
  { emoji: '🌪️', name: 'Tornado (Dirt)' },
  { emoji: '💥', name: 'Explosion' },
  { emoji: '⏱️', name: 'Stopwatch' },
  { emoji: '🎬', name: 'Race Start' },
  { emoji: '🌟', name: 'Star' },
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '👑', name: 'Crown' },
  { emoji: '🎉', name: 'Party' },
  { emoji: '🍾', name: 'Champagne' },
  { emoji: '🎊', name: 'Confetti' },
  { emoji: '😎', name: 'Cool' },
  { emoji: '🤘', name: 'Rock On' },
  { emoji: '👍', name: 'Thumbs Up' },
  { emoji: '👎', name: 'Thumbs Down' },
  { emoji: '💰', name: 'Money' },
];

function EmojiPicker({ onEmojiSelect, buttonClassName = '', theme = 'light' }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (showPicker) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setShowPicker(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPicker(!showPicker);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${buttonClassName}`}
        aria-label="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showPicker && createPortal(
        <>
          {/* Full Screen Backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPicker(false)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setShowPicker(false);
            }}
          />

          {/* Centered Full Screen Modal - Mobile Optimized */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6">
            <div
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{
                height: '90vh',
                maxHeight: '90vh',
                touchAction: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >

              {/* Header with centered X button - Mobile Friendly */}
              <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-center text-gray-900 dark:text-white pr-12">
                  Choose an Emoji
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker(false);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker(false);
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-3 sm:p-3 md:p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 rounded-full transition-all touch-manipulation"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                  aria-label="Close emoji picker"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700 dark:text-gray-200" />
                </button>
              </div>

              {/* Racing Emojis Section */}
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <Flag className="w-5 h-5 text-brand-gold" />
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                    Racing Emojis
                  </h4>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 sm:gap-2 max-h-32 overflow-y-auto">
                  {RACING_EMOJIS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEmojiSelect(item.emoji);
                        setShowPicker(false);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="text-2xl sm:text-3xl p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors active:scale-95"
                      title={item.name}
                      aria-label={item.name}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Emoji Picker Container - Fills remaining space with touch support */}
              <div
                className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-3 md:p-4"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <div className="w-full h-full">
                  <EmojiPickerReact
                    onEmojiClick={handleEmojiClick}
                    theme={theme}
                    searchPlaceHolder="Search more emojis..."
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default EmojiPicker;