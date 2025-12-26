import React, { useEffect } from 'react';
import { X, Settings, Users, ShoppingBag, Trophy, Zap, Shield, Database, Globe, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-br from-brand-gold/10 to-brand-gold-dark/10 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close welcome modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="relative w-full max-w-md mx-auto mb-6">
                <img 
                  src="/android-icon-512-512.png" 
                  alt="PIT-BOX.COM Logo" 
                  className="w-full h-auto object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300" 
                />
              </div>
              
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                Welcome to PIT-BOX.COM
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                Where The Winners Go! Your Digital Crew Chief for Racing Excellence
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Main Features Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Setup Management */}
              <motion.div 
                className="glass-panel p-6 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Professional Setup Tools</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Save unlimited racing setups to the cloud. Access your data from anywhere, anytime. 
                  Track chassis adjustments, suspension settings, and engine parameters with professional-grade tools 
                  designed by racers, for racers.
                </p>
              </motion.div>

              {/* Swap Meet */}
              <motion.div 
                className="glass-panel p-6 text-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Swap Meet Marketplace</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Buy, sell, and trade racing equipment with verified community members. 
                  List your products with photos, connect directly with buyers, and grow your racing business 
                  in our trusted marketplace.
                </p>
              </motion.div>

              {/* Racing Community */}
              <motion.div 
                className="glass-panel p-6 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Racing Social Network</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Connect with fellow racers worldwide. Share your victories, learn from champions, 
                  and build lasting friendships in our exclusive racing community. Network with drivers, 
                  crew chiefs, and industry professionals.
                </p>
              </motion.div>
            </div>

            {/* Key Benefits */}
            <div className="bg-gradient-to-br from-brand-gold/5 to-brand-gold-dark/5 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Why Champions Choose PIT-BOX.COM</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Database className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Cloud-Based Setup Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Never lose your setups again. Access your data from any device, anywhere in the world.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure & Reliable</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your proprietary setups are protected with bank-level security and encrypted storage.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Global Racing Network</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Join thousands of racers from sprint cars to late models, all using PIT-BOX.COM.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Real-Time Performance</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Make instant setup adjustments and track changes in real-time during race events.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Proven by Champions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Trusted by winning teams and professional drivers across all racing divisions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-brand-gold flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Built by Racers</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Created by racing enthusiasts who understand what it takes to win on the track.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Racing?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Join the revolution that's changing how champions prepare, compete, and win.
              </p>
              <button
                onClick={onClose}
                className="btn-primary text-lg px-8 py-3 font-semibold"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WelcomeModal;