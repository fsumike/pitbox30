import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image, Search, X, Loader2 } from 'lucide-react';

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  buttonClassName?: string;
}

interface GifResult {
  id: string;
  images: {
    fixed_height_small: {
      url: string;
    };
  };
}

function GifPicker({ onGifSelect, buttonClassName = '' }: GifPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);

  const GIPHY_API_KEY = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh';

  useEffect(() => {
    if (showPicker) {
      loadTrendingGifs();
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

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        searchGifs();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (showPicker) {
      loadTrendingGifs();
    }
  }, [searchTerm]);

  const loadTrendingGifs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (err) {
      console.error('Error loading trending GIFs:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchGifs = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (err) {
      console.error('Error searching GIFs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    onGifSelect(gifUrl);
    setShowPicker(false);
    setSearchTerm('');
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
        aria-label="Add GIF"
      >
        <Image className="w-5 h-5" />
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
                touchAction: 'pan-y'
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >

              {/* Header with centered X button - Mobile Friendly */}
              <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-center text-gray-900 dark:text-white mb-3 sm:mb-4 pr-12">
                  Choose a GIF
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
                  aria-label="Close GIF picker"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-700 dark:text-gray-200" />
                </button>

                {/* Search Bar - Mobile Optimized */}
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search GIFs..."
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-colors touch-manipulation"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>

              {/* Scrollable GIF Grid - Touch Optimized */}
              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                {loading ? (
                  <div className="flex justify-center items-center py-16 sm:py-20">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {gifs.map((gif) => (
                      <button
                        type="button"
                        key={gif.id}
                        onClick={() => handleGifSelect(gif.images.fixed_height_small.url)}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          handleGifSelect(gif.images.fixed_height_small.url);
                        }}
                        className="aspect-square rounded-lg sm:rounded-xl overflow-hidden hover:opacity-80 hover:scale-105 transition-all active:scale-95 shadow-md hover:shadow-xl touch-manipulation"
                        style={{ minHeight: '120px' }}
                      >
                        <img
                          src={gif.images.fixed_height_small.url}
                          alt="GIF"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
                {!loading && gifs.length === 0 && (
                  <div className="text-center py-16 sm:py-20 text-gray-500 dark:text-gray-400 text-base sm:text-lg">
                    No GIFs found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                Powered by GIPHY
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export default GifPicker;
