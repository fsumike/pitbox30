import React from 'react';
import { X, Trophy, Star, Sparkles, Check } from 'lucide-react';

interface PremiumCongratsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumCongratsModal({ isOpen, onClose }: PremiumCongratsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl animate-scaleIn overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-brand-gold to-yellow-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 animate-ping">
              <div className="w-24 h-24 rounded-full bg-brand-gold/30"></div>
            </div>
            <div className="relative bg-gradient-to-br from-brand-gold to-yellow-600 rounded-full p-6 shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="absolute -bottom-1 -left-1 animate-bounce delay-150">
              <Sparkles className="w-6 h-6 text-brand-gold" />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-brand-gold via-yellow-600 to-brand-gold bg-clip-text text-transparent animate-shimmer">
            Congratulations!
          </h2>

          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            You Now Have Premium Access!
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
            Welcome to the world's most advanced racing setup management platform ever created.
          </p>

          <div className="space-y-3 mb-8 text-left bg-white dark:bg-gray-800 rounded-xl p-6 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Unlimited Setup Storage</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Save every configuration you need</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Advanced Racing Tools</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional-grade calculators & analytics</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Priority Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help from racing experts</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-brand-gold to-yellow-600 hover:from-yellow-600 hover:to-brand-gold text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start Using Premium Features
          </button>
        </div>
      </div>
    </div>
  );
}
