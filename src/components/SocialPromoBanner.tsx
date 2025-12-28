import React, { useState, useEffect } from 'react';
import { X, Instagram, Facebook, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SocialPromoBannerProps {
  variant?: 'floating' | 'inline' | 'sticky';
  dismissible?: boolean;
  showDelay?: number;
}

function SocialPromoBanner({
  variant = 'floating',
  dismissible = true,
  showDelay = 3000
}: SocialPromoBannerProps) {
  const [isVisible, setIsVisible] = useState(variant === 'inline');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (variant === 'inline') {
      setIsVisible(true);
      return;
    }

    const dismissed = localStorage.getItem('socialBannerDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < dayInMs) {
        setIsDismissed(true);
        return;
      }
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [showDelay, variant]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (variant !== 'inline') {
      localStorage.setItem('socialBannerDismissed', Date.now().toString());
    }
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed && variant !== 'inline') return null;

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  );

  const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const socialLinks = [
    {
      name: 'TikTok',
      icon: TikTokIcon,
      handle: '@pitbox2025',
      url: 'https://www.tiktok.com/@pitbox2025',
      gradient: 'from-cyan-400 to-pink-500',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      handle: '@pitbox25',
      url: 'https://www.instagram.com/pitbox25',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      handle: '@pitbox25',
      url: 'https://www.facebook.com/pitbox25',
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Threads',
      icon: MessageCircle,
      handle: '@pitbox25',
      url: 'https://www.threads.net/@pitbox25',
      gradient: 'from-gray-900 to-black',
    },
    {
      name: 'X',
      icon: XIcon,
      handle: '@PitBox2025',
      url: 'https://x.com/PitBox2025',
      gradient: 'from-gray-800 to-gray-950',
    },
  ];

  if (variant === 'inline' && !isDismissed) {
    return (
      <div className="p-6 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden rounded-2xl group">
        {/* Lighter Base Layer for Visible Carbon */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#1c1612] to-[#181410]"></div>

        {/* Enhanced Visible Carbon Fiber Texture */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(0deg, #3a2d1a 0px, #261d10 1px, #3a2d1a 2px, #2e2414 3px),
            repeating-linear-gradient(90deg, #3a2d1a 0px, #2a1f12 1px, #3a2d1a 2px, #322618 3px)
          `,
          backgroundSize: '6px 6px',
          opacity: 0.95,
        }}></div>

        {/* Carbon Fiber Weave Highlights */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(251, 191, 36, 0.08) 2px, rgba(251, 191, 36, 0.08) 4px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(217, 119, 6, 0.06) 2px, rgba(217, 119, 6, 0.06) 4px)
          `,
          backgroundSize: '8px 8px',
          opacity: 0.4,
        }}></div>

        {/* Glossy Carbon Shine Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-20" style={{
          background: `linear-gradient(135deg,
            transparent 0%,
            rgba(251, 191, 36, 0.15) 30%,
            transparent 50%,
            rgba(245, 158, 11, 0.1) 70%,
            transparent 100%
          )`,
        }}></div>

        {/* Golden Racing Stripe - Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.5)',
          }}
        ></div>

        {/* Glowing Gold Border on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
            backgroundSize: '200% 200%',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'shimmer 3s infinite linear',
          }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" style={{
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))'
              }} />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent" style={{
                textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
                filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
              }}>Join Our Pit Community</h3>
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-amber-400 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-gray-200 mb-6 max-w-2xl drop-shadow-lg">
            Follow us on social media for daily racing news, track updates, technical tips, and exclusive content from the racing world.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${social.gradient}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{social.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{social.handle}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-gold transition-colors" />
                </a>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-600/50">
            <Link
              to="/social"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium group drop-shadow-lg"
            >
              <span>View all our social channels</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sticky') {
    return (
      <div
        className={`sticky top-20 z-30 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-r from-brand-gold via-orange-500 to-brand-gold-dark text-white shadow-xl">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <p className="font-medium text-sm md:text-base">
                  Follow us for daily racing tips & exclusive content!
                </p>
              </div>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors ml-2"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-md transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="glass-panel p-6 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border-2 border-brand-gold/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-gold to-orange-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold">Stay Connected!</h4>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Follow us on social media for daily racing news, track updates, and exclusive content!
        </p>

        <div className="space-y-2 mb-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${social.gradient}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{social.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{social.handle}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-gold transition-colors" />
              </a>
            );
          })}
        </div>

        <Link
          to="/social"
          className="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-brand-gold to-orange-500 text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          View All Social Channels
        </Link>
      </div>
    </div>
  );
}

export default SocialPromoBanner;
