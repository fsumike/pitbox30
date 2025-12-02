import React, { useState } from 'react';
import { Share2, Facebook, Instagram, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

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
  imageUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const handleNativeShare = async () => {
    if (!Capacitor.isNativePlatform() && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (error) {
        }
    } else {
      setIsOpen(true);
    }
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const shareToInstagram = () => {
    alert(
      'To share on Instagram:\n\n1. Take a screenshot of this page\n2. Open Instagram\n3. Create a new post or story\n4. Upload the screenshot\n\nInstagram does not support direct sharing from websites.'
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

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-2">
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Facebook className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="font-medium text-gray-900">Facebook</span>
              </button>

              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                  <Twitter className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <span className="font-medium text-gray-900">Twitter</span>
              </button>

              <button
                onClick={shareToInstagram}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-900">Instagram</span>
              </button>

              <div className="my-2 border-t border-gray-200"></div>

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <LinkIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">
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
