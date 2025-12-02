import React from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link2, Check } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  compact?: boolean;
}

function SocialShareButtons({
  url,
  title,
  description = '',
  hashtags = ['PitBox', 'Racing', 'SetupSheet'],
  compact = false
}: SocialShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagString = hashtags.map(tag => tag.replace('#', '')).join(',');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
      color: 'hover:bg-gray-800',
    },
    {
      name: 'Threads',
      icon: MessageCircle,
      url: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-gray-900',
    },
  ];

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="btn-secondary flex items-center gap-2"
          aria-label="Share"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        {showMenu && !navigator.share && (
          <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[200px]">
            <div className="space-y-1">
              {shareLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${platform.color} hover:text-white`}
                    onClick={() => setShowMenu(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </a>
                );
              })}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-brand-gold hover:text-white w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Share:</span>

      {shareLinks.map((platform) => {
        const Icon = platform.icon;
        return (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 ${platform.color} hover:text-white hover:scale-110`}
            aria-label={`Share on ${platform.name}`}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}

      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg transition-all duration-200 ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-brand-gold hover:text-white hover:scale-110'
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
      </button>

      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-brand-gold hover:text-white hover:scale-110"
          aria-label="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default SocialShareButtons;
