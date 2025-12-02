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
      <div className="glass-panel p-6 bg-gradient-to-br from-brand-gold/10 via-orange-50/50 to-brand-gold-dark/10 dark:from-brand-gold/5 dark:via-gray-900/50 dark:to-brand-gold-dark/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-brand-gold animate-pulse" />
              <h3 className="text-2xl font-bold">Join Our Pit Community</h3>
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

          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
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

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/social"
              className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-dark font-medium group"
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
