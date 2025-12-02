import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  listing_id: string;
  reviewer_id: string;
  seller_id: string;
  rating: number;
  review_text: string;
  response_text: string | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface SellerReviewsProps {
  sellerId: string;
  listingId?: string;
  showAddReview?: boolean;
}

export default function SellerReviews({ sellerId, listingId, showAddReview = false }: SellerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sellerStats, setSellerStats] = useState<{
    rating: number;
    totalSales: number;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
    loadSellerStats();
  }, [sellerId]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('listing_reviews')
        .select(`
          *,
          profiles:reviewer_id (username, avatar_url)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('seller_rating, total_sales')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      setSellerStats({
        rating: data.seller_rating || 0,
        totalSales: data.total_sales || 0
      });
    } catch (error) {
      console.error('Error loading seller stats:', error);
    }
  };

  const submitReview = async () => {
    if (!user || !listingId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('listing_reviews')
        .insert({
          listing_id: listingId,
          reviewer_id: user.id,
          seller_id: sellerId,
          rating,
          review_text: reviewText
        });

      if (error) throw error;

      setShowReviewModal(false);
      setRating(5);
      setReviewText('');
      loadReviews();
      loadSellerStats();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sellerStats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {sellerStats.rating.toFixed(1)}
                </div>
                {renderStars(Math.round(sellerStats.rating), 'lg')}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sellerStats.totalSales}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Sales
              </p>
            </div>
          </div>

          {showAddReview && user && user.id !== sellerId && listingId && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet</p>
            {showAddReview && user && user.id !== sellerId && (
              <p className="text-sm mt-2">Be the first to review this seller!</p>
            )}
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {review.profiles?.avatar_url ? (
                      <img
                        src={review.profiles.avatar_url}
                        alt={review.profiles.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {review.profiles?.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.profiles?.username || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.review_text && (
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {review.review_text}
                </p>
              )}

              {review.response_text && (
                <div className="mt-3 pl-4 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Seller Response:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.response_text}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Write a Review
                  </h2>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this seller..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={submitting || !reviewText.trim()}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
