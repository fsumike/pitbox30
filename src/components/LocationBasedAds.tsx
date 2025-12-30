import React, { useState, useEffect } from 'react';
import { ExternalLink, Phone, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdvertisements } from '../hooks/useAdvertisements';

interface LocationBasedAdsProps {
  maxAds?: number;
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
}

export default function LocationBasedAds({
  maxAds = 5,
  autoRotate = true,
  rotateInterval = 15000,
  className = ''
}: LocationBasedAdsProps) {
  const { advertisements, loading, trackImpression, trackClick } = useAdvertisements(maxAds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (advertisements.length > 0 && currentIndex < advertisements.length) {
      trackImpression(advertisements[currentIndex].id);
    }
  }, [currentIndex, advertisements]);

  useEffect(() => {
    if (!autoRotate || advertisements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [autoRotate, rotateInterval, advertisements.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };

  const handleAdClick = async (url: string | null) => {
    if (!url) return;

    const currentAd = advertisements[currentIndex];
    await trackClick(currentAd.id);

    window.open(url, '_blank');
  };

  if (loading || !isVisible || advertisements.length === 0) {
    return null;
  }

  const currentAd = advertisements[currentIndex];

  return (
    <div className={`relative glass-panel p-4 ${className}`}>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
        aria-label="Close ad"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {currentAd.image_url && (
            <img
              src={currentAd.image_url}
              alt={currentAd.title}
              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-medium">
                {currentAd.reach_type === 'local' ? 'Local' :
                 currentAd.reach_type === 'regional' ? 'Regional' : 'Featured'}
              </span>
              {currentAd.distance_miles !== undefined && currentAd.distance_miles < 500 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {Math.round(currentAd.distance_miles)} mi away
                </span>
              )}
            </div>

            <h3 className="font-bold text-lg mb-1">{currentAd.business_name}</h3>
            <p className="text-sm font-medium text-brand-gold mb-1">{currentAd.title}</p>

            {currentAd.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {currentAd.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {currentAd.website_url && (
            <button
              onClick={() => handleAdClick(currentAd.website_url)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-gold text-white hover:bg-brand-gold-dark transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </button>
          )}

          {currentAd.phone && (
            <a
              href={`tel:${currentAd.phone}`}
              onClick={() => trackClick(currentAd.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-brand-gold text-brand-gold hover:bg-brand-gold/10 transition-colors text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          )}
        </div>

        {advertisements.length > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous ad"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-brand-gold'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next ad"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-center text-gray-400">
        Sponsored
      </div>
    </div>
  );
}
