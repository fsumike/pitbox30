import React, { useState, useEffect, useRef } from 'react';
import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
  theme?: Theme;
}

function EmojiPicker({ onEmojiSelect, buttonClassName = '', theme = 'light' }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${buttonClassName}`}
        aria-label="Add emoji"
      >
        <Smile className="w-5 h-5" />
      </button>

      {showPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            theme={theme}
            searchPlaceHolder="Search emoji..."
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;