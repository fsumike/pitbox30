import React, { useEffect, useRef } from 'react';
import { ExternalLink, MapPin, X } from 'lucide-react';
import { useAdvertisements, Advertisement } from '../hooks/useAdvertisements';

interface GeoAdBannerProps {
  adType?: 'banner' | 'sponsored_post' | 'featured_listing' | 'sidebar';
  className?: string;
  showLocation?: boolean;
  dismissible?: boolean;
}

function GeoAdBanner({
  adType = 'banner',
  className = '',
  showLocation = false,
  dismissible = false,
}: GeoAdBannerProps) {
  const { ads, loading, userState, userRegion, recordImpression, recordClick } = useAdvertisements({
    adType,
    limit: 1,
  });
  const [dismissed, setDismissed] = React.useState(false);
  const impressionRecorded = useRef<Set<string>>(new Set());

  const ad = ads[0];

  useEffect(() => {
    if (ad && !impressionRecorded.current.has(ad.id)) {
      recordImpression(ad.id);
      impressionRecorded.current.add(ad.id);
    }
  }, [ad, recordImpression]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-24 ${className}`} />
    );
  }

  if (!ad || dismissed) {
    return null;
  }

  const handleClick = () => {
    recordClick(ad.id);
    window.open(ad.click_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {dismissible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Dismiss ad"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div
        onClick={handleClick}
        className="cursor-pointer group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        {ad.image_url ? (
          <div className="relative">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-auto object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-brand-gold transition-colors">
                    {ad.title}
                  </h3>
                  {ad.description && (
                    <p className="text-sm text-gray-200 line-clamp-2 mt-1">{ad.description}</p>
                  )}
                </div>
                <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-300">
                <span className="px-2 py-0.5 bg-white/20 rounded">Sponsored</span>
                {showLocation && userState && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {userState}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-brand-gold font-medium uppercase tracking-wider">
                  Sponsored
                </span>
                <h3 className="font-bold text-lg text-white mt-1 group-hover:text-brand-gold transition-colors">
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="text-sm text-gray-400 line-clamp-2 mt-2">{ad.description}</p>
                )}
                {showLocation && userState && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>Showing ads for {userState}</span>
                  </div>
                )}
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-brand-gold transition-colors" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GeoAdSidebar({ className = '' }: { className?: string }) {
  return <GeoAdBanner adType="sidebar" className={className} showLocation />;
}

export function GeoAdFeatured({ className = '' }: { className?: string }) {
  const { ads, loading, recordImpression, recordClick } = useAdvertisements({
    adType: 'featured_listing',
    limit: 3,
  });
  const impressionRecorded = useRef<Set<string>>(new Set());

  useEffect(() => {
    ads.forEach((ad) => {
      if (!impressionRecorded.current.has(ad.id)) {
        recordImpression(ad.id);
        impressionRecorded.current.add(ad.id);
      }
    });
  }, [ads, recordImpression]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (ads.length === 0) return null;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Featured Partners</h3>
        <span className="text-xs text-gray-500">Sponsored</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <FeaturedAdCard key={ad.id} ad={ad} onImpression={recordImpression} onClick={recordClick} />
        ))}
      </div>
    </div>
  );
}

function FeaturedAdCard({
  ad,
  onClick,
}: {
  ad: Advertisement;
  onImpression: (id: string) => void;
  onClick: (id: string) => void;
}) {
  const handleClick = () => {
    onClick(ad.id);
    window.open(ad.click_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className="glass-panel overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {ad.image_url && (
        <div className="h-32 overflow-hidden">
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-semibold group-hover:text-brand-gold transition-colors line-clamp-1">
          {ad.title}
        </h4>
        {ad.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {ad.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-brand-gold">
          <span>Learn More</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

export function SponsoredPost({ className = '' }: { className?: string }) {
  return <GeoAdBanner adType="sponsored_post" className={className} dismissible />;
}

export default GeoAdBanner;
