import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Verify the session if needed
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // You could verify the session with Stripe here if needed
      }
    
    // Countdown to redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="glass-panel p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Thank you for subscribing to PitBox Premium. Your account has been upgraded and you now have access to all premium features.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-brand-gold mb-6">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Redirecting to home page in {countdown} seconds...</span>
        </div>
        
        <button
          onClick={() => navigate('/home')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          Go to Home Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}