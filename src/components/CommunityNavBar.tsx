import React from 'react';
import { Home, Users, Compass, Bookmark, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityNavBarProps {
  activeTab: 'all' | 'friends' | 'mine' | 'bookmarks' | 'trending';
  onTabChange: (tab: 'all' | 'friends' | 'mine' | 'bookmarks' | 'trending') => void;
  mediaTypeFilter: 'all' | 'image' | 'video' | 'text';
  onMediaTypeFilterChange: (filter: 'all' | 'image' | 'video' | 'text') => void;
}

function CommunityNavBar({ activeTab, onTabChange }: CommunityNavBarProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('all')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'all' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-xs mt-1">Discover</span>
        </button>
        <button
          onClick={() => onTabChange('trending')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'trending' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs mt-1">Trending</span>
        </button>
        <button
          onClick={() => onTabChange('friends')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'friends' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs mt-1">Friends</span>
        </button>
        <button
          onClick={() => onTabChange('mine')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'mine' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">My Posts</span>
        </button>
        <button
          onClick={() => onTabChange('bookmarks')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'bookmarks' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Bookmark className="w-6 h-6" />
          <span className="text-xs mt-1">Saved</span>
        </button>
      </div>
    </motion.div>
  );
}

export default CommunityNavBar;