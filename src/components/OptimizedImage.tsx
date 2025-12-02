import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Create low-quality placeholder (blur)
    const img = new Image();

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    // Load the image
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800/50 ${className}`}
        style={{ width, height }}
      >
        <p className="text-gray-400 text-sm">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm ${className}`}
          style={{ width, height }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
}

export default OptimizedImage;
