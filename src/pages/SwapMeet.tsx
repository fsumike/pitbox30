import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronDown, Camera, DollarSign, Clock, Share2, Heart, Lock, Users, Loader2, Phone, Mail, X, Settings, Shield, Check, ExternalLink, Bookmark, BookmarkCheck, Plus, AlertCircle, Trash2, ShoppingBag, Clock as Click, Flag, Target, Navigation, ChevronLeft, ChevronRight, Sparkles, Tag, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SignInPrompt from '../components/SignInPrompt';
import CreateListingModal from '../components/CreateListingModal';
import { useListings, Listing } from '../hooks/useListings';
import { useChat } from '../contexts/ChatContext';
import ChatButton from '../components/ChatButton';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import SwapMeetNavBar from '../components/SwapMeetNavBar';
import { useLocation } from '../hooks/useLocation';

interface ContactModalProps {
  listing: Listing;
  onClose: () => void;
}

function ContactModal({ listing, onClose }: ContactModalProps) {
  const { startChat } = useChat();

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        className="bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-brand-gold/30 rounded-2xl shadow-2xl shadow-brand-gold/20 w-full max-w-md"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full text-gray-700 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Seller</h2>
            <p className="text-gray-700">
              {listing.title}
            </p>
          </div>

          <div className="space-y-4">
            {listing.contact_phone && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-100/60 border border-green-400/50">
                <div className="w-10 h-10 rounded-full bg-green-600/20 border border-green-400/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.contact_phone}</p>
                </div>
              </div>
            )}

            {listing.contact_email && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-100/60 border border-blue-400/50">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.contact_email}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-300">
              <ChatButton
                recipientId={listing.user_id}
                onStartChat={(id) => {
                  startChat(id);
                  onClose();
                }}
                className="w-full justify-center py-3"
              />
            </div>

            {listing.preferred_contact && (
              <div className="text-sm text-gray-700 text-center">
                <p>Preferred contact method: <span className="text-brand-gold font-semibold">{listing.preferred_contact}</span></p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SwapMeet() {
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [likeAnimation, setLikeAnimation] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'mine' | 'saved'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [condition, setCondition] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [distanceEnabled, setDistanceEnabled] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [manualZipCode, setManualZipCode] = useState('');
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const { user } = useAuth();
  const location = useLocation({ enableGeocoding: false, autoFetch: false });
  const navigate = useNavigate();
  const { getListings, toggleLike, toggleSave, deleteListing, hasMore } = useListings();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 24;

  const categories = [
    'All Categories',
    'Race Cars',
    'Engines & Parts',
    'Trailers & Transport',
    'Tools & Equipment',
    'Safety Gear',
    'Tires & Wheels',
    'Electronics',
    'Memorabilia',
    'Other'
  ];

  const vehicleTypes = [
    { value: 'all', label: 'All Vehicle Types' },
    { value: '410', label: '410 Sprint' },
    { value: '360', label: '360 Sprint' },
    { value: '600', label: '600 Micro' },
    { value: 'latemodel', label: 'Late Model' },
    { value: 'modified', label: 'Modified' },
    { value: 'mini', label: 'Mini Sprint' },
    { value: 'midget', label: 'Midget' }
  ];

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'parts', label: 'For Parts' }
  ];

  useEffect(() => {
    setCurrentPage(0);
    loadListings(0);
  }, [activeTab, selectedCategory, selectedVehicleType, sortBy, condition, priceRange, distanceEnabled, selectedDistance, location.latitude, location.longitude]);

  useEffect(() => {
    if (currentPage > 0) {
      loadListings(currentPage);
    }
  }, [currentPage]);

  const loadListings = async (page: number = 0) => {
    setLoading(true);
    try {
      const filters: any = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm,
        tab: activeTab,
        vehicleType: selectedVehicleType !== 'all' ? selectedVehicleType : undefined,
        page,
        limit: itemsPerPage
      };

      if (distanceEnabled && selectedDistance && location.latitude && location.longitude) {
        filters.distance = selectedDistance;
        filters.latitude = location.latitude;
        filters.longitude = location.longitude;
      }

      let data = await getListings(filters);

      // Apply client-side filters
      if (condition !== 'all') {
        data = data.filter(listing => listing.condition === condition);
      }

      if (priceRange.min) {
        data = data.filter(listing => listing.price >= parseFloat(priceRange.min));
      }

      if (priceRange.max) {
        data = data.filter(listing => listing.price <= parseFloat(priceRange.max));
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          data.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          data.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          data.sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case 'recent':
        default:
          // Already sorted by created_at DESC from backend
          break;
      }

      if (page === 0) {
        setListings(data);
      } else {
        setListings(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadListings();
  };

  const handleAuthRequired = () => {
    setShowSignInPrompt(true);
  };

  const handleCreateListing = () => {
    if (!user) {
      handleAuthRequired();
    } else {
      setShowCreateModal(true);
    }
  };

  const handleSignIn = () => {
    setShowSignInPrompt(false);
    navigate('/', { replace: true });
  };

  const handleListingSuccess = () => {
    loadListings();
  };

  const handleLikeClick = async (listingId: string) => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    setLikeAnimation(listingId);

    try {
      const success = await toggleLike(listingId);
      if (success) {
        setTimeout(() => {
          setLikeAnimation(null);
          // Update the listing in the state
          setListings(prev => prev.map(listing => {
            if (listing.id === listingId) {
              const isLiked = listing.liked_by_user;
              return {
                ...listing,
                likes: isLiked ? listing.likes - 1 : listing.likes + 1,
                liked_by_user: !isLiked
              };
            }
            return listing;
          }));
        }, 300);
      } else {
        setLikeAnimation(null);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setLikeAnimation(null);
    }
  };

  const handleSaveClick = async (listingId: string) => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    const success = toggleSave(listingId);
    if (success) {
      // Update the listing in the state
      setListings(prev => prev.map(listing => {
        if (listing.id === listingId) {
          return {
            ...listing,
            saved: !listing.saved
          };
        }
        return listing;
      }));
    }
  };

  const handleShare = async (listing: Listing) => {
    const shareUrl = `${window.location.origin}/swap-meet/${listing.id}`;
    const shareText = `Check out this ${listing.title} on PIT-BOX.COM!`;
    
    try {
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: 'PIT-BOX.COM Listing',
          text: shareText,
          url: shareUrl
        });
        setShareSuccess(listing.id);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(listing.id);
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          return;
        }
        
        if (err.name === 'SecurityError' || !navigator.share) {
          try {
            await navigator.clipboard.writeText(shareUrl);
            setShareSuccess(listing.id);
          } catch (clipboardErr) {
            console.error('Error copying to clipboard:', clipboardErr);
          }
        }
      }
    }
    
    if (shareSuccess) {
      setTimeout(() => setShareSuccess(null), 2000);
    }
  };

  const handleContactClick = (listing: Listing) => {
    if (!user) {
      handleAuthRequired();
      return;
    }
    setSelectedListing(listing);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;

    setDeleting(true);
    try {
      const success = await deleteListing(listingId);
      if (success) {
        // Remove the listing from the state
        setListings(prev => prev.filter(listing => listing.id !== listingId));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM d, yyyy');
      }
    } catch (error) {
      return 'some time ago';
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0 relative">
      {/* Liquid glass orbs */}
      <div className="liquid-orb liquid-orb-gold w-72 h-72 -top-24 -left-24 fixed z-0 opacity-40" />
      <div className="liquid-orb liquid-orb-amber w-56 h-56 bottom-32 -right-16 fixed z-0 opacity-40" style={{ animationDelay: '-6s' }} />

      {/* Dark Carbon Fiber Background - Light Mode uses dark theme, Dark Mode goes even darker */}
      <div className="fixed inset-0 -z-10 dark:hidden" style={{
        background: `
          repeating-linear-gradient(45deg, #1A1A1A 0px, #151515 1px, #1A1A1A 2px, #121212 3px),
          repeating-linear-gradient(-45deg, #1A1A1A 0px, #181818 1px, #1A1A1A 2px, #131313 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Even Darker Carbon Fiber Background for Dark Mode */}
      <div className="fixed inset-0 -z-10 hidden dark:block" style={{
        background: `
          repeating-linear-gradient(45deg, #000000 0px, #050505 1px, #000000 2px, #030303 3px),
          repeating-linear-gradient(-45deg, #000000 0px, #020202 1px, #000000 2px, #010101 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Carbon Fiber Diagonal Weave Overlay */}
      <div className="fixed inset-0 -z-10 dark:opacity-100 opacity-100" style={{
        background: `
          repeating-linear-gradient(45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.03) 3px, rgba(255, 255, 255, 0.03) 6px),
          repeating-linear-gradient(-45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 6px)
        `,
        backgroundSize: '12px 12px',
      }}></div>

      {/* Hero Section */}
      <div className="liquid-glass-hero p-8 shadow-2xl shadow-brand-gold/20 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2 text-brand-gold">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome to
                </h2>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Swap Meet
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium flex items-center justify-center md:justify-start gap-2">
                <Tag className="w-5 h-5 text-brand-gold" />
                Where buyers and sellers connect
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-brand-gold/30 to-amber-600/30 rounded-full blur-3xl animate-pulse" />
            <Sparkles className="w-8 h-8 text-brand-gold absolute -top-2 -right-2 animate-pulse z-20" />
            <img
              src="/android-icon-512-512.png"
              alt="PIT-BOX.COM Swap Meet"
              className="w-56 h-56 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.6)] transform hover:scale-105 transition-transform duration-300 relative z-10"
            />
          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <button
            onClick={() => navigate('/home')}
            className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-10 h-10 text-brand-gold mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="text-lg font-bold mb-2">Setup Management</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Access our professional-grade setup tools to fine-tune your racing machine for peak performance
            </p>
            <div className="flex items-center justify-center gap-1 mt-4 text-brand-gold font-semibold">
              <Click className="w-4 h-4" />
              <span>Click to access</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/community')}
            className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300"
          >
            <Users className="w-10 h-10 text-brand-gold mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="text-lg font-bold mb-2">Racing Community</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Connect with fellow racers, share experiences, and stay updated with the latest racing insights
            </p>
            <div className="flex items-center justify-center gap-1 mt-4 text-brand-gold font-semibold">
              <Click className="w-4 h-4" />
              <span>Click to join</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/affiliates')}
            className="liquid-glass-card text-center transform hover:scale-105 transition-all duration-300"
          >
            <Shield className="w-10 h-10 text-brand-gold mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="text-lg font-bold mb-2">Partner Network</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Explore our trusted network of racing partners, suppliers, and industry experts
            </p>
            <div className="flex items-center justify-center gap-1 mt-4 text-brand-gold font-semibold">
              <Click className="w-4 h-4" />
              <span>Click to explore</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="liquid-glass p-6 shadow-xl relative z-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-2 border-gray-200 dark:border-white/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value.toLowerCase().replace(/ /g, '-'))}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 appearance-none transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase().replace(/ /g, '-')}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-white/10 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/50 appearance-none transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-amber-600 hover:from-amber-600 hover:to-brand-gold text-black font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50"
          >
            <Settings className="w-5 h-5" />
            {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 glass-panel space-y-4 bg-white/80 dark:bg-gray-800/50"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Advanced Filters</h3>

            {/* Distance Filter Section */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Distance Filter</h4>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distanceEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setDistanceEnabled(enabled);
                      if (enabled && !location.latitude) {
                        setShowLocationPrompt(true);
                      } else if (!enabled) {
                        setSelectedDistance(null);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {distanceEnabled && (
                <div className="space-y-4">
                  {/* Location Status */}
                  {location.latitude ? (
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {location.isManual
                          ? location.address
                          : location.city && location.state
                          ? `${location.city}, ${location.state}`
                          : 'Location detected'}
                      </span>
                      <button
                        onClick={() => {
                          location.clearLocation();
                          setDistanceEnabled(false);
                          setSelectedDistance(null);
                        }}
                        className="ml-auto p-1 hover:bg-green-200 dark:hover:bg-green-800 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowLocationPrompt(true);
                            location.getLocation();
                          }}
                          disabled={location.loading}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {location.loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Detecting...
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4" />
                              Use My Location
                            </>
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-2 text-gray-500">Or</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter ZIP Code"
                          value={manualZipCode}
                          onChange={(e) => setManualZipCode(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          maxLength={5}
                        />
                        <button
                          onClick={async () => {
                            if (manualZipCode.length === 5) {
                              await location.setManualLocation(manualZipCode);
                            }
                          }}
                          disabled={manualZipCode.length !== 5}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Distance Range Selection */}
                  {location.latitude && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Show items within:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[25, 50, 100, 200, 500].map(distance => (
                          <button
                            key={distance}
                            onClick={() => {
                              setSelectedDistance(distance);
                              if (!distanceEnabled) {
                                setDistanceEnabled(true);
                              }
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              selectedDistance === distance
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {distance} miles
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setSelectedDistance(null);
                            setDistanceEnabled(false);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedDistance === null && !distanceEnabled
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          All
                        </button>
                      </div>
                    </div>
                  )}

                  {location.error && (
                    <div className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{location.error}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Your location is only used to filter listings and is not stored. This helps you find parts near you.</span>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Vehicle Type</label>
                <div className="relative">
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {vehicleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Condition</label>
                <div className="relative">
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {conditions.map(cond => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedVehicleType('all');
                  setCondition('all');
                  setPriceRange({ min: '', max: '' });
                  setDistanceEnabled(false);
                  setSelectedDistance(null);
                  location.clearLocation();
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Feed Tabs - Desktop */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700 hidden md:block">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'all'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Browse All</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'favorites'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'mine'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>My Listings</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'saved'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span>Saved</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post Button - Desktop */}
      <div className="flex justify-end md:block">
        <button 
          onClick={handleCreateListing}
          className="btn-primary flex items-center gap-2"
        >
          {user ? (
            <>
              <Camera className="w-5 h-5" />
              Post Listing
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Sign In to Post
            </>
          )}
        </button>
      </div>

      {/* Listings Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {loading ? 'Loading Listings...' : `${listings.length} Listings Available`}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {activeTab === 'all' && 'No Listings Found'}
              {activeTab === 'favorites' && 'No Favorite Listings'}
              {activeTab === 'mine' && 'You Haven\'t Posted Any Listings'}
              {activeTab === 'saved' && 'No Saved Listings'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'all' && (searchTerm || selectedCategory !== 'all') 
                ? 'Try adjusting your search or filters.'
                : activeTab === 'all' 
                ? 'Be the first to post a listing!'
                : activeTab === 'favorites'
                ? 'Like listings to add them to your favorites.'
                : activeTab === 'mine'
                ? 'Create your first listing to sell your items.'
                : 'Save listings to view them later.'}
            </p>
            {(activeTab === 'all' || activeTab === 'mine') && (
              <button
                onClick={handleCreateListing}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Listing
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Active Distance Filter Indicator */}
            {distanceEnabled && selectedDistance && location.latitude && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-300 dark:border-blue-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Showing {listings.length} {listings.length === 1 ? 'item' : 'items'} within {selectedDistance} miles
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {location.isManual ? location.address : location.city && location.state ? `${location.city}, ${location.state}` : 'Your location'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDistanceEnabled(false);
                    setSelectedDistance(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-900 dark:text-blue-100 font-medium transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {listings.map((listing) => (
                <motion.div
                  key={listing.id}
                  className="glass-panel rounded-2xl overflow-hidden group transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-brand-gold/20 hover:border-brand-gold/40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0].url}
                        alt={listing.title}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black/80 dark:to-gray-900/80 flex items-center justify-center">
                        <Package className="w-16 h-16 text-brand-gold/30" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(listing.id);
                        }}
                        className={`p-2 bg-gray-200/90 dark:bg-black/60 backdrop-blur-md rounded-full hover:bg-gray-300 dark:hover:bg-black/80 transition-all duration-300 border border-gray-400 dark:border-white/20 ${
                          likeAnimation === listing.id ? 'scale-150' : ''
                        }`}
                        title={listing.liked_by_user ? 'Unlike' : 'Like'}
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                            listing.liked_by_user ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveClick(listing.id);
                        }}
                        className="p-2 bg-gray-200/90 dark:bg-black/60 backdrop-blur-md rounded-full hover:bg-gray-300 dark:hover:bg-black/80 transition-all duration-300 border border-gray-400 dark:border-white/20"
                        title={listing.saved ? 'Unsave' : 'Save'}
                      >
                        {listing.saved ? (
                          <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                        ) : (
                          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                    </div>
                    {user?.id === listing.user_id && (
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(listing.id);
                          }}
                          className="p-2 bg-gray-200/90 dark:bg-black/60 backdrop-blur-md rounded-full hover:bg-red-600/80 hover:text-white transition-all duration-300 border border-gray-400 dark:border-white/20 text-gray-600 dark:text-gray-300"
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                      <h3 className="text-sm sm:text-xl font-bold line-clamp-2 text-white">{listing.title}</h3>
                      <p className="text-base sm:text-xl font-black text-brand-gold flex items-center whitespace-nowrap drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                        {listing.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-brand-gold" />
                        <span className="text-xs sm:text-sm truncate">{listing.location}</span>
                      </div>
                      {listing.distance_miles !== undefined && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-600/30 border border-blue-300 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 text-xs font-semibold whitespace-nowrap">
                          {listing.distance_miles} mi
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(listing.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${listing.liked_by_user ? 'text-red-500 fill-current' : ''}`} />
                          <span>{listing.likes || 0}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(listing);
                          }}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative group"
                          title="Share listing"
                        >
                          {shareSuccess === listing.id ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          ) : (
                            <>
                              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="sr-only">Share</span>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Share listing
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <button
                      onClick={() => handleContactClick(listing)}
                      className="w-full mt-3 sm:mt-4 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      {user ? (
                        'Contact Seller'
                      ) : (
                        <>
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate">Sign In to Contact</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === listing.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-xs w-full">
                        <h4 className="font-bold mb-2">Delete Listing?</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(null);
                            }}
                            className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteListing(listing.id);
                            }}
                            className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"
                            disabled={deleting}
                          >
                            {deleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More / Pagination */}
          {hasMore && listings.length > 0 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Load More Listings
                  </>
                )}
              </button>
            </div>
          )}

          {/* Page Info */}
          {listings.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {listings.length} listings
              {hasMore && ' · More available'}
            </div>
          )}
        </>
        )}
      </div>

      {/* Mobile Navigation Bar */}
      <SwapMeetNavBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateListing={handleCreateListing}
      />

      {/* Sponsored Affiliates */}
      <div className="glass-panel p-8 shadow-2xl shadow-brand-gold/20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Flag className="w-7 h-7 text-brand-gold drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold bg-clip-text text-transparent drop-shadow-lg">
              Sponsored Affiliates
            </h2>
            <Flag className="w-7 h-7 text-brand-gold drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Proud to partner with premier California racing venues
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Silver Dollar Speedway */}
          <a
            href="https://www.silverdollarspeedway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-2xl hover:shadow-brand-gold/30 transition-all duration-300 group relative overflow-hidden transform hover:scale-105 hover:border-brand-gold/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 to-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold to-amber-600 text-black text-xs font-bold shadow-lg shadow-brand-gold/30">
                  SPONSORED
                </div>
              </div>

              <div className="mb-6 bg-white/5 rounded-lg p-4 border border-white/10">
                <img
                  src="https://cdn.myracepass.com/v1/siteresources/35514/v1/img/logo.png"
                  alt="Silver Dollar Speedway"
                  className="w-full h-auto object-contain max-h-24 mx-auto"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <Target className="w-4 h-4 text-brand-gold" />
                <span className="font-semibold">Chico, California</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-sm leading-relaxed">
                Home of the legendary Gold Cup Race of Champions and exciting sprint car racing.
                One of California's premier dirt racing facilities.
              </p>

              <div className="flex items-center justify-center gap-2 text-brand-gold font-bold group-hover:gap-3 transition-all">
                <span>Visit Website</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </a>

          {/* Thunderbowl Raceway */}
          <a
            href="https://www.thunderbowlraceway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-2xl hover:shadow-brand-gold/30 transition-all duration-300 group relative overflow-hidden transform hover:scale-105 hover:border-brand-gold/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 to-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold to-amber-600 text-black text-xs font-bold shadow-lg shadow-brand-gold/30">
                  SPONSORED
                </div>
              </div>

              <div className="mb-6 bg-white/5 rounded-lg p-4 border border-white/10">
                <img
                  src="https://www.thunderbowlraceway.com/wp-content/uploads/2020/01/Logo.png"
                  alt="Thunderbowl Raceway"
                  className="w-full h-auto object-contain max-h-24 mx-auto"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <Target className="w-4 h-4 text-brand-gold" />
                <span className="font-semibold">Tulare, California</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-sm leading-relaxed">
                Home of exciting sprint car racing featuring NARC 410 Sprint Cars and the annual Trophy Cup.
                One of California's premier dirt racing venues.
              </p>

              <div className="flex items-center justify-center gap-2 text-brand-gold font-bold group-hover:gap-3 transition-all">
                <span>Visit Website</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </a>

          {/* Marysville Raceway */}
          <a
            href="https://www.marysvilleraceway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-2xl hover:shadow-brand-gold/30 transition-all duration-300 group relative overflow-hidden transform hover:scale-105 hover:border-brand-gold/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 to-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-brand-gold to-amber-600 text-black text-xs font-bold shadow-lg shadow-brand-gold/30">
                  SPONSORED
                </div>
              </div>

              <div className="mb-6 bg-white/5 rounded-lg p-4 border border-white/10">
                <img
                  src="https://cdn.myracepass.com/v1/siteresources/58778/v1/img/logo.png"
                  alt="Marysville Raceway"
                  className="w-full h-auto object-contain max-h-24 mx-auto"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                <Target className="w-4 h-4 text-brand-gold" />
                <span className="font-semibold">Marysville, California</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 text-center text-sm leading-relaxed">
                Known as the "Action Track of the West," featuring competitive sprint car racing on a quarter-mile clay oval.
                A California racing tradition.
              </p>

              <div className="flex items-center justify-center gap-2 text-brand-gold font-bold group-hover:gap-3 transition-all">
                <span>Visit Website</span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Advertisement Spaces */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 shadow-xl hover:shadow-purple-500/20 transition-all hover:border-purple-500/30">
          <h3 className="text-xl font-bold mb-2">Premium Advertising Space</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Reach thousands of potential customers with premium placement.
          </p>
          <button
            onClick={() => user ? navigate('/partner-with-us') : handleAuthRequired()}
            className="btn-primary flex items-center gap-2"
          >
            {user ? (
              <>
                <ExternalLink className="w-5 h-5" />
                Learn More
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Sign In to Learn More
              </>
            )}
          </button>
        </div>

        <div className="glass-panel p-6 shadow-xl hover:shadow-green-500/20 transition-all hover:border-green-500/30">
          <h3 className="text-xl font-bold mb-2">Featured Listing Spots</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Get more visibility for your listings with featured placement.
          </p>
          <button
            onClick={() => user ? navigate('/partner-with-us') : handleAuthRequired()}
            className="btn-primary flex items-center gap-2"
          >
            {user ? (
              <>
                <Target className="w-5 h-5" />
                Promote Listing
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Sign In to Promote
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sign In Prompt Modal */}
      <SignInPrompt 
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        onSignIn={handleSignIn}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleListingSuccess}
      />

      {/* Contact Modal */}
      {selectedListing && (
        <ContactModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}

export default SwapMeet;