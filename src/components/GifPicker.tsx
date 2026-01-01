import React, { useState, useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  const GIPHY_API_KEY = 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      loadTrendingGifs();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${buttonClassName}`}
        aria-label="Add GIF"
      >
        <Image className="w-5 h-5" />
      </button>

      {showPicker && (
        <>
          {/* Backdrop for all screen sizes */}
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPicker(false)}
          />

          {/* Mobile: Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl sm:hidden max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Choose a GIF</h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPicker(false);
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors relative z-[80] touch-manipulation"
                  aria-label="Close GIF picker"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search GIFs..."
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {gifs.map((gif) => (
                    <button
                      type="button"
                      key={gif.id}
                      onClick={() => handleGifSelect(gif.images.fixed_height_small.url)}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity active:scale-95"
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
                <div className="text-center py-12 text-gray-500">
                  No GIFs found
                </div>
              )}
            </div>

            <div className="p-3 text-xs text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              Powered by GIPHY
            </div>
          </div>

          {/* Tablet & Desktop: Centered Modal */}
          <div className="hidden sm:flex fixed inset-0 z-[70] items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[85vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">Choose a GIF</h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPicker(false);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors relative z-[80] touch-manipulation"
                    aria-label="Close GIF picker"
                  >
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search GIFs..."
                    className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="p-3 overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {gifs.map((gif) => (
                      <button
                        type="button"
                        key={gif.id}
                        onClick={() => handleGifSelect(gif.images.fixed_height_small.url)}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity active:scale-95"
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
                  <div className="text-center py-12 text-gray-500">
                    No GIFs found
                  </div>
                )}
              </div>

              <div className="p-3 text-xs text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                Powered by GIPHY
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GifPicker;
