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
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
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
          />

          {/* Centered Full Screen Modal - Like Facebook */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div
              className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Header with centered X button */}
              <div className="relative p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="font-bold text-xl sm:text-2xl text-center text-gray-900 dark:text-white mb-4">
                  Choose a GIF
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker(false);
                  }}
                  className="absolute top-4 right-4 p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors touch-manipulation"
                  aria-label="Close GIF picker"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-200" />
                </button>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search GIFs..."
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl text-base sm:text-lg bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable GIF Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {gifs.map((gif) => (
                      <button
                        type="button"
                        key={gif.id}
                        onClick={() => handleGifSelect(gif.images.fixed_height_small.url)}
                        className="aspect-square rounded-xl overflow-hidden hover:opacity-80 hover:scale-105 transition-all active:scale-95 shadow-md hover:shadow-xl"
                      >
                        <img
                          src={gif.images.fixed_height_small.url}
                          alt="GIF"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
                {!loading && gifs.length === 0 && (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-lg">
                    No GIFs found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 text-sm text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
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
