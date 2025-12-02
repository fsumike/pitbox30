import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

interface SocialMediaLinksProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const socialLinks = {
  tiktok: 'pitbox2025',
  instagram: 'pitbox25',
  facebook: 'pitbox25',
  threads: 'pitbox25',
  twitter: 'PitBox2025',
};

function SocialMediaLinks({ className = '', showLabels = false, size = 'md' }: SocialMediaLinksProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const iconSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socialLinks.tiktok && (
        <a
          href={`https://www.tiktok.com/${socialLinks.tiktok.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors"
          aria-label="TikTok"
        >
          <svg
            className={iconSize}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
          {showLabels && <span className="ml-2">TikTok</span>}
        </a>
      )}

      {socialLinks.instagram && (
        <a
          href={`https://www.instagram.com/${socialLinks.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors"
          aria-label="Instagram"
        >
          <Instagram className={iconSize} />
          {showLabels && <span className="ml-2">Instagram</span>}
        </a>
      )}

      {socialLinks.facebook && (
        <a
          href={socialLinks.facebook.startsWith('http') ? socialLinks.facebook : `https://www.facebook.com/${socialLinks.facebook}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors"
          aria-label="Facebook"
        >
          <Facebook className={iconSize} />
          {showLabels && <span className="ml-2">Facebook</span>}
        </a>
      )}

      {socialLinks.threads && (
        <a
          href={`https://www.threads.net/@${socialLinks.threads.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors"
          aria-label="Threads"
        >
          <MessageCircle className={iconSize} />
          {showLabels && <span className="ml-2">Threads</span>}
        </a>
      )}

      {socialLinks.twitter && (
        <a
          href={`https://x.com/${socialLinks.twitter.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors"
          aria-label="X (Twitter)"
        >
          <Twitter className={iconSize} />
          {showLabels && <span className="ml-2">X</span>}
        </a>
      )}
    </div>
  );
}

export default SocialMediaLinks;
