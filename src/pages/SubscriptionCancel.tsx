import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="glass-panel p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-gray-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Subscription Cancelled</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Your subscription process was cancelled. No charges have been made.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/subscription')}
            className="btn-primary flex items-center gap-2"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}