import React, { useState } from 'react';
import { Share2, Facebook, Instagram, Twitter, Link as LinkIcon, Check, MessageCircle, Send } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

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

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  imageUrl?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  text,
  url,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);
  const fullText = `${title} - ${text}`;
  const encodedFullText = encodeURIComponent(fullText);

  const handleNativeShare = async () => {
    if (!Capacitor.isNativePlatform() && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch {
      }
    } else {
      setIsOpen(true);
    }
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=PitBox,Racing`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToThreads = () => {
    const threadsUrl = `https://www.threads.net/intent/post?text=${encodedFullText}%20${encodedUrl}`;
    window.open(threadsUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodedFullText}%20${encodedUrl}`;
    window.open(waUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    window.open(tgUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToInstagram = () => {
    alert(
      'To share on Instagram:\n\n1. Copy the link below\n2. Open Instagram\n3. Create a new post or story\n4. Use the "Link" sticker in stories or add to your bio\n\nInstagram does not support direct web sharing.'
    );
    setIsOpen(false);
  };

  const shareToTikTok = () => {
    alert(
      'To share on TikTok:\n\n1. Copy the link below\n2. Open TikTok\n3. Create a new video or add to your bio\n\nTikTok does not support direct web sharing.'
    );
    setIsOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const platforms = [
    { name: 'Facebook', icon: Facebook, action: shareToFacebook, color: 'bg-blue-600' },
    { name: 'Twitter/X', icon: Twitter, action: shareToTwitter, color: 'bg-gray-900' },
    { name: 'Threads', icon: MessageCircle, action: shareToThreads, color: 'bg-gray-800' },
    { name: 'WhatsApp', icon: WhatsAppIcon, action: shareToWhatsApp, color: 'bg-green-500' },
    { name: 'Telegram', icon: Send, action: shareToTelegram, color: 'bg-sky-500' },
    { name: 'Instagram', icon: Instagram, action: shareToInstagram, color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500' },
    { name: 'TikTok', icon: TikTokIcon, action: shareToTikTok, color: 'bg-black' },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold/90 transition-colors font-medium"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[400px] overflow-y-auto">
            <div className="p-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.name}
                    onClick={platform.action}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{platform.name}</span>
                  </button>
                );
              })}

              <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
