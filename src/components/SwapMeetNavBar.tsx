import React from 'react';
import { ShoppingBag, Heart, Bookmark, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwapMeetNavBarProps {
  activeTab: 'all' | 'favorites' | 'mine' | 'saved';
  onTabChange: (tab: 'all' | 'favorites' | 'mine' | 'saved') => void;
  onCreateListing: () => void;
}

function SwapMeetNavBar({ activeTab, onTabChange, onCreateListing }: SwapMeetNavBarProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom md:hidden"
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
          <Search className="w-6 h-6" />
          <span className="text-xs mt-1">Browse</span>
        </button>
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'favorites' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Favorites</span>
        </button>
        <button
          onClick={onCreateListing}
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center -mt-6 shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </button>
        <button
          onClick={() => onTabChange('mine')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'mine' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-1">My Listings</span>
        </button>
        <button
          onClick={() => onTabChange('saved')}
          className={`flex flex-col items-center justify-center w-full h-full ${
            activeTab === 'saved' ? 'text-brand-gold' : 'text-gray-500'
          }`}
        >
          <Bookmark className="w-6 h-6" />
          <span className="text-xs mt-1">Saved</span>
        </button>
      </div>
    </motion.div>
  );
}

export default SwapMeetNavBar;