import React, { useEffect } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

interface InstagramFeedProps {
  username: string;
  limit?: number;
}

function InstagramFeed({ username, limit = 6 }: InstagramFeedProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Latest from Instagram</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">@{username}</p>
          </div>
        </div>
        <a
          href={`https://www.instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
        >
          <span>Follow</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="glass-panel p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto">
            <Instagram className="w-10 h-10 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-2">Follow Us on Instagram</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get daily racing news, track updates, technical tips, and behind-the-scenes action from the racing world!
            </p>
            <a
              href={`https://www.instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow @{username}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {[...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-500 pt-4">
            Visit our Instagram profile to see all our posts and stories
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-start gap-3 p-4 glass-panel">
          <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
            <Instagram className="w-4 h-4 text-brand-gold" />
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Racing News & Tips</h5>
            <p>Track updates, racing techniques, and technical advice</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 glass-panel">
          <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
            <Instagram className="w-4 h-4 text-brand-gold" />
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Behind the Scenes</h5>
            <p>Exclusive race day coverage and pit area access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstagramFeed;
