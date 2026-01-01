import React, { useState } from 'react';
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
          />

          {/* Centered Full Screen Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ height: '90vh', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header with centered X button */}
              <div className="relative p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-xl sm:text-2xl text-center text-gray-900 dark:text-white">
                  Choose an Emoji
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker(false);
                  }}
                  className="absolute top-4 right-4 p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors touch-manipulation"
                  aria-label="Close emoji picker"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-200" />
                </button>
              </div>

              {/* Emoji Picker Container - Fills remaining space */}
              <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
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
        </>,
        document.body
      )}
    </>
  );
}

export default EmojiPicker;