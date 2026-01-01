import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile, X } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
  theme?: Theme;
}

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

              {/* Emoji Picker Container - Fills remaining space with touch support */}
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
                    searchPlaceHolder="Search emoji..."
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