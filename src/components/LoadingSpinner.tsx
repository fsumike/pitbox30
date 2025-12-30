import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

function LoadingSpinner({ size = 'md', message, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} absolute inset-0 border-4 border-brand-gold/20 rounded-full`} />
        <div className={`${sizeClasses[size]} absolute inset-0 border-4 border-transparent border-t-brand-gold rounded-full animate-spin`} />
        <div className={`${sizeClasses[size]} absolute inset-0 border-4 border-transparent border-t-brand-gold-light rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
      </div>
      {message && (
        <p className="text-gray-600 dark:text-gray-400 animate-pulse mt-8">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/20 dark:bg-brand-black/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;