import React from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link2, Check, Send, Video, Instagram } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  compact?: boolean;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
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
  const fullText = `${title}${description ? ' - ' + description : ''}`;
  const encodedFullText = encodeURIComponent(fullText);

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

  const handleInstagramShare = () => {
    alert(
      'To share on Instagram:\n\n1. Copy the link (use the copy button)\n2. Open Instagram\n3. Create a new post or story\n4. Paste the link in your bio or use "Link" sticker in stories\n\nInstagram does not support direct web sharing.'
    );
  };

  const handleTikTokShare = () => {
    alert(
      'To share on TikTok:\n\n1. Copy the link (use the copy button)\n2. Open TikTok\n3. Create a new video\n4. Add the link to your bio or mention it in your video\n\nTikTok does not support direct web sharing.'
    );
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: 'hover:bg-blue-600',
      bgColor: 'bg-blue-600',
    },
    {
      name: 'Twitter/X',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
      color: 'hover:bg-gray-800',
      bgColor: 'bg-gray-800',
    },
    {
      name: 'Threads',
      icon: MessageCircle,
      url: `https://www.threads.net/intent/post?text=${encodedFullText}%20${encodedUrl}`,
      color: 'hover:bg-gray-900',
      bgColor: 'bg-gray-900',
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      url: `https://wa.me/?text=${encodedFullText}%20${encodedUrl}`,
      color: 'hover:bg-green-500',
      bgColor: 'bg-green-500',
    },
    {
      name: 'Telegram',
      icon: Send,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500',
      bgColor: 'bg-sky-500',
    },
  ];

  const manualSharePlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      action: handleInstagramShare,
      color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400',
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      action: handleTikTokShare,
      color: 'hover:bg-black',
      bgColor: 'bg-black',
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
          <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50 min-w-[220px] max-h-[400px] overflow-y-auto">
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
              {manualSharePlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={() => {
                      platform.action();
                      setShowMenu(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full ${platform.color} hover:text-white`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                );
              })}
              <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
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
    <div className="space-y-3">
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
              title={platform.name}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}

        {manualSharePlatforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={platform.action}
              className={`p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 ${platform.color} hover:text-white hover:scale-110`}
              aria-label={`Share on ${platform.name}`}
              title={platform.name}
            >
              <Icon className="w-5 h-5" />
            </button>
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
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>

        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="p-2 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-brand-gold hover:text-white hover:scale-110"
            aria-label="Share"
            title="More Options"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SocialShareButtons;
