import React from 'react';
import { Instagram, Facebook, Twitter, ExternalLink, Users, Heart, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function SocialMedia() {
  const ThreadsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.186 3.077c-2.324 0-4.248.625-5.566 1.808-.87.781-1.475 1.798-1.784 3.013l-.073.289 2.945.587.074-.235c.152-.481.425-.899.811-1.243.714-.637 1.857-1.022 3.406-1.022 1.523 0 2.628.373 3.287.943.33.286.575.62.73 1.002.08.198.136.411.169.637-.488-.062-.986-.095-1.493-.095-2.98 0-5.346.847-6.844 2.092-1.464 1.214-2.265 2.963-2.265 4.908 0 1.902.734 3.428 2.067 4.378 1.287.916 2.963 1.352 4.752 1.352 1.853 0 3.501-.431 4.808-1.255 1.353-.853 2.305-2.096 2.771-3.612.187-.61.288-1.264.288-1.954v-.737c0-2.166-.536-3.904-1.643-5.155-1.176-1.328-2.994-2.002-5.44-2.002zm-.213 7.765c1.404 0 2.559.227 3.426.659-.104.735-.413 1.395-.922 1.964-.768.858-1.966 1.295-3.567 1.295-1.178 0-2.119-.252-2.786-.717-.632-.44-.946-1.052-.946-1.872 0-1.023.444-1.814 1.325-2.374.823-.522 1.988-.8 3.47-.8z"/>
    </svg>
  );

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

  const socialAccounts = [
    {
      name: 'TikTok',
      handle: '@pitbox2025',
      url: 'https://www.tiktok.com/@pitbox2025',
      icon: TikTokIcon,
      color: 'from-cyan-400 to-pink-500',
      description: 'Watch quick racing tips, track highlights, and entertaining content.',
      active: true,
    },
    {
      name: 'Instagram',
      handle: '@pitbox25',
      url: 'https://www.instagram.com/pitbox25',
      icon: Instagram,
      color: 'from-purple-600 to-pink-600',
      description: 'Follow us for daily racing news, technical advice, and behind-the-scenes track action.',
      active: true,
    },
    {
      name: 'Facebook',
      handle: '@pitbox25',
      url: 'https://www.facebook.com/pitbox25',
      icon: Facebook,
      color: 'from-blue-600 to-blue-700',
      description: 'Join the discussion for racing news, event coverage, and exclusive content.',
      active: true,
    },
    {
      name: 'Threads',
      handle: '@pitbox25',
      url: 'https://www.threads.net/@pitbox25',
      icon: ThreadsIcon,
      color: 'from-gray-900 to-black',
      description: 'Quick updates, racing conversations, and community discussions.',
      active: true,
    },
    {
      name: 'X (Twitter)',
      handle: '@PitBox2025',
      url: 'https://x.com/PitBox2025',
      icon: XIcon,
      color: 'from-gray-800 to-gray-950',
      description: 'Real-time racing updates, breaking news, and community engagement.',
      active: true,
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/android-icon-192-192.png"
              alt="PIT-BOX.COM"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <Users className="w-10 h-10 text-brand-gold" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Connect With Us
            </h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Stay connected with the PIT-BOX.COM community across social media.
            Get the latest updates, racing tips, and exclusive content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {socialAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <div
                key={account.name}
                className={`glass-panel p-6 ${
                  account.active
                    ? 'hover:shadow-xl transition-all duration-300 cursor-pointer'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${account.color} flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{account.name}</h3>
                      {!account.active && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-brand-gold font-medium mb-3">{account.handle}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {account.description}
                    </p>
                    {account.active ? (
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-dark dark:hover:text-brand-gold-light font-medium group"
                      >
                        <span>Follow Us</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        We'll be launching here soon!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel p-8">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Why Follow Us?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of racers who rely on our social channels for insider knowledge and community connection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Updates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stay on top of the latest racing news, tech updates, and platform features.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Access</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow racers, share experiences, and learn from the best.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Content</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get access to behind-the-scenes content and exclusive tips from pro racers.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Our In-App Racing Community</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Connect with fellow racers in our private community hub. Share racing stories, get advice, and stay connected - all within the PIT-BOX app!
          </p>
          <Link
            to="/community"
            className="btn-primary inline-flex items-center gap-2 mb-4"
          >
            <Users className="w-5 h-5" />
            <span>Visit Racing Community</span>
            <Sparkles className="w-4 h-4" />
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A private space for racers to connect, share experiences, and build relationships!
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/5 to-brand-gold-dark/5 text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Reach out to us on Instagram for support, feedback, or just to say hi!
        </p>
        <a
          href="https://www.instagram.com/pitbox25"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Instagram className="w-5 h-5" />
          Message Us on Instagram
        </a>
      </div>
    </div>
  );
}

export default SocialMedia;
